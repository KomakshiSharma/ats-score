const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload Folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// API Route
app.post(
    "/api/analyze",
    upload.single("resume"),
    (req, res) => {

        try {

            const resumePath = req.file.path;

            const jobDescription =
                req.body.jobDescription;

            const pythonProcess = spawn(
                "python",
                [
                    "./python/main.py",
                    resumePath,
                    jobDescription
                ]
            );

            let result = "";

            let error = "";

            pythonProcess.stdout.on(
                "data",
                (data) => {
                    result += data.toString();
                }
            );

            pythonProcess.stderr.on(
                "data",
                (data) => {
                    error += data.toString();
                }
            );

            pythonProcess.on(
                "close",
                (code) => {

                    if (code !== 0) {

                        return res.status(500).json({
                            success: false,
                            error
                        });
                    }

                    try {

                        const jsonResult =
                            JSON.parse(result);

                        res.json(jsonResult);

                    } catch (parseError) {

                        res.status(500).json({
                            success: false,
                            error:
                                "Invalid Python Response"
                        });
                    }
                }
            );

        } catch (err) {

            res.status(500).json({
                success: false,
                error: err.message
            });
        }
    }
);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});
