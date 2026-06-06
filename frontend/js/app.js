import { analyzeResume } from "./api.js";
import { renderResults } from "./ui.js";

const analyzeBtn =
document.getElementById("analyzeBtn");

const loader =
document.getElementById("loader");

analyzeBtn.addEventListener(
    "click",
    async () => {

        const file =
        document.getElementById("resumeFile")
        .files[0];

        const jd =
        document.getElementById("jobDescription")
        .value;

        if (!file) {
            alert("Upload Resume");
            return;
        }

        if (!jd.trim()) {
            alert("Enter Job Description");
            return;
        }

        const formData = new FormData();

        formData.append("resume", file);
        formData.append("jobDescription", jd);

        try {

            loader.classList.remove("hidden");

            const result =
            await analyzeResume(formData);

            renderResults(result);

        } catch (error) {

            alert(error.message);

        } finally {

            loader.classList.add("hidden");
        }
    }
);
