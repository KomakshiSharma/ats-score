export async function analyzeResume(formData) {

    const response = await fetch(
        "http://localhost:5000/api/analyze",
        {
            method: "POST",
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error("Analysis Failed");
    }

    return await response.json();
}
