

const express = require("express");
const cors = require("cors");

const atsRoute = require("./routes/atsRoute");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.send("ATS Backend Running Successfully 🚀");
});

app.use("/api", atsRoute);

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
