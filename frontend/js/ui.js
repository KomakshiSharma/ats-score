export function renderResults(data) {

    document.getElementById("resultSection")
        .classList.remove("hidden");

    document.getElementById("score")
        .textContent = `${data.score}%`;

    populateList(
        "matchedSkills",
        data.matched
    );

    populateList(
        "missingSkills",
        data.missing
    );

    populateList(
        "suggestions",
        data.suggestions
    );
}

function populateList(id, items) {

    const list = document.getElementById(id);

    list.innerHTML = "";

    items.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item;

        list.appendChild(li);
    });
}
