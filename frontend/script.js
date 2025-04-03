const btnShowAll = document.getElementById("showAll")
const change = document.getElementById("change")
btnShowAll.addEventListener("click", function () {
    fetch("http://localhost:5050/workout")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error loading data");
            }
            return response.json();
        })
        .then(exercises => {
            // Stocker les données dans localStorage
            localStorage.setItem("exercisesData", JSON.stringify(exercises));

            // Rediriger vers la nouvelle page
            window.location.href = "exercises.html";
        })
        .catch(error => {
            console.log("Error:", error);
        });
});

const id = document.getElementById('id');

const name = document.getElementById('name');
const category = document.getElementById('category');
const duration = document.getElementById('duration');
const repetitions = document.getElementById('repetitions');
const level = document.getElementById('level');
const description = document.getElementById('description');

const suchen = document.getElementById("datelard")
function loadData() {
    const exerciseId = Number(id.value);

    if (!exerciseId) {
        alert("Bitte eine gültige ID eingeben!");
        return;
    }

    fetch(`http://127.0.0.1:5050/workout/${exerciseId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("Übung nicht gefunden!");
            }
            return res.json();
        })
        .then(data => {
            if (data) {
                name.value = data.name || "";
                category.value = data.category || "";
                duration.value = data.duration || "";
                repetitions.value = data.repetitions || "";
                level.value = data.level || "";
                description.value = data.description || "";
            } else {
                alert("Keine Daten für diese ID gefunden!");
            }
        })
        .catch(error => {
            console.error("Fehler beim Laden der Daten:", error);
            alert("Fehler beim Abrufen der Übung. Stelle sicher, dass die ID existiert.");
        });
}
suchen.addEventListener("click", loadData);

change.addEventListener("click", function changeExercise() {
    fetch(`http://127.0.0.1:5050/workout/${Number(id.value)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: name.value,
            category: category.value,
            duration: duration.value,
            repetitions: repetitions.value,
            level: level.value,
            description: description.value,
        })
    })
        .then(res => res.json())
        .then(data => {

            outputDiv.innerText = JSON.stringify(data)

        })
})
