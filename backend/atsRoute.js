// routes/atsRoute.js

const express = require("express");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");

const router = express.Router();

/* Upload Configuration */
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

/* Test Route */
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "ATS Route Working"
    });
});

/* Analyze Resume */
router.post(
    "/analyze",
    upload.single("resume"),
    (req, res) => {

        try {

            console.log("File:", req.file);
            console.log("JD:", req.body.jobDescription);

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: "Resume file is required"
                });
            }

            const resumePath = req.file.path;
            const jobDescription = req.body.jobDescription || "";

            const pythonScript = path.join(
                __dirname,
                "..",
                "python",
                "main.py"
            );

            const python = spawn("python3", [
                pythonScript,
                resumePath,
                jobDescription
            ]);

            let result = "";
            let error = "";

            python.stdout.on("data", (data) => {
                result += data.toString();
            });

            python.stderr.on("data", (data) => {
                console.error("PYTHON ERROR:", data.toString());
                error += data.toString();
            });

            python.on("close", (code) => {

                console.log("Python Output:", result);

                if (code !== 0) {
                    return res.status(500).json({
                        success: false,
                        error
                    });
                }

                try {

                    const response =
                        JSON.parse(result);

                    return res.json(response);

                } catch (err) {

                    return res.status(500).json({
                        success: false,
                        error: "Invalid JSON from Python",
                        details: err.message
                    });
                }
            });

        } catch (err) {

            console.error(err);

            return res.status(500).json({
                success: false,
                error: err.message
            });
        }
    }
);

module.exports = router;
