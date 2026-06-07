


const express = require("express");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );
    }
});

const upload = multer({ storage });

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Route Working"
    });
});

router.post(
    "/analyze",
    upload.single("resume"),
    (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    error: "Resume file required"
                });
            }

            const resumePath = req.file.path;

            const jobDescription =
                req.body.jobDescription || "";

            const pythonScript = path.join(
                __dirname,
                "..",
                "python",
                "main.py"
            );

            const python = spawn(
                "python3",
                [
                    pythonScript,
                    resumePath,
                    jobDescription
                ]
            );

            let output = "";
            let error = "";

            python.stdout.on(
                "data",
                (data) => {
                    output += data.toString();
                }
            );

            python.stderr.on(
                "data",
                (data) => {
                    console.error(
                        data.toString()
                    );

                    error += data.toString();
                }
            );

            python.on(
                "close",
                (code) => {

                    if (code !== 0) {

                        return res.status(500).json({
                            success: false,
                            error
                        });
                    }

                    try {

                        const result =
                            JSON.parse(output);

                        res.json(result);

                    } catch (err) {

                        console.error(output);

                        res.status(500).json({
                            error:
                                "Invalid JSON from Python"
                        });
                    }
                }
            );

        } catch (err) {

            console.error(err);

            res.status(500).json({
                error: err.message
            });
        }
    }
);

module.exports = router;
