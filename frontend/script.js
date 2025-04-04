const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModal = document.querySelector(".close");
const formTitle = document.getElementById("formTitle"); // <legend> element
const form = document.getElementById("editForm");
const idRight = document.getElementById("idRight");
const searchContainer = document.getElementById("SearchDiv");
const addBtn = document.getElementById("addExercise");
const confirmBtn = document.getElementById("datelard");
const beschreibung = document.getElementById("beshreibung");
const circleTimer = document.getElementById("circleTimer")

openModalBtn.onclick = function () {
    modal.style.display = "block";
};


closeModal.onclick = function () {
    modal.style.display = "none";
};


window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};


const btnShowAll = document.getElementById("showAll")
btnShowAll.addEventListener("click", function () {

    // Hide the modal if it's open
    searchContainer.style.display = "block";
    fetch("http://localhost:5050/workout")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error loading data");
            }
            return response.json();
        })
        .then(exercises => {
            // Clear content before displaying
            idRight.innerHTML = "<h2>Exercise List</h2>";

            // Create a display grid
            const grid = document.createElement("div");
            grid.classList.add("exercise-grid"); // CSS class for the grid

            exercises.forEach(exercise => {
                // Create a card for each exercise
                const card = document.createElement("div");
                card.classList.add("exercise-card");

                card.innerHTML = `
                    <img src="${exercise.image || '../images/default.jpg'}" alt="${exercise.name}" class="exercise-image" width="150px" height="auto">
                    <h3>${exercise.name}</h3>
                    <p><strong>ID:</strong> ${exercise.id}</p>
                    <p><strong>Category:</strong> ${exercise.category}</p>
                    <p><strong>Duration:</strong> ${exercise.duration} sec</p>
                    <p><strong>Repetitions:</strong> ${exercise.repetitions}</p>
                    <p><strong>Level:</strong> ${exercise.level}</p>
                    <p class="description">${exercise.description}</p>
                    <div class="card-buttons">
                        <button  class="edit-btn">✏️ Edit</button>

                    </div><br> <br>
                `;
                // Add event listener to the "Edit" button
                const editBtn = card.querySelector(".edit-btn");
                editBtn.addEventListener("click", function () {
                    // When edit button is clicked, open the modal and populate the form
                    modal.style.display = "block";

                    // Populate the form with the exercise data
                    formTitle.textContent = `Edit Exercise: ${exercise.name}`;
                    form.id.value = exercise.id;
                    form.name.value = exercise.name;
                    form.category.value = exercise.category;
                    form.duration.value = exercise.duration;
                    form.repetitions.value = exercise.repetitions;
                    form.level.value = exercise.level;
                    form.description.value = exercise.description;
                    form.image.value = exercise.image;

                    confirmBtn.style.display = "inline-block";
                    addBtn.style.display = "none";
                });

                // Add the exercise to the grid
                grid.appendChild(card);
            });

            // Append the grid inside #idRight
            idRight.appendChild(grid);
        })
        .catch(error => {
            console.log("Error:", error);
            idRight.innerHTML = "<p style='color: red;'>Failed to load exercises.</p>";
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

suchen.addEventListener("click", function changeExercise() {
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

document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById("startButton");
    const outputDiv = document.getElementById("outputDiv");
    const timerDiv = document.getElementById("timer");

    if (!startButton || !outputDiv || !timerDiv) {
        //console.error("One or more required elements are missing from the DOM.");
        return;
    }

    let currentExerciseIndex = 0; // Track the current exercise
    let exercises = []; // To store the exercises fetched from the backend
    let isExerciseInProgress = false; // Flag to check if exercise has already started

    startButton.addEventListener("click", function () {
        beshreibung.style.display = "none"
        circleTimer.style.display = "block"
        if (isExerciseInProgress) {
            console.log("An exercise is already in progress. Please wait until the current one finishes.");

            return; // Prevent starting a new exercise if one is in progress
        }
        fetchExercisesAndStart();
    });

    function fetchExercisesAndStart() {
        fetch("http://localhost:5050/workout/random")
            .then(response => response.json())
            .then(data => {
                exercises = data;
                currentExerciseIndex = 0;         // Reset the index for a new workout
                isExerciseInProgress = true;      // Allow new workout
                startExercise();
            })
            .catch(error => {
                console.error("Error fetching exercises:", error);
            });
    }

    function startExercise() {
        if (currentExerciseIndex < exercises.length) {
            const exercise = exercises[currentExerciseIndex];
            displayExercise(exercise);
            startCountdown(exercise.duration, function () {
                // Once the exercise duration is over, move to the next exercise
                currentExerciseIndex++;
                if (currentExerciseIndex < exercises.length) {
                    startExercise();
                } else {
                    outputDiv.innerHTML = "<h3>Workout complete!</h3>";
                    isExerciseInProgress = false; // Reset the flag when workout is complete
                }
            });
        } else {
            outputDiv.innerHTML = "<h3>Workout complete!</h3>";
            isExerciseInProgress = false; // Reset the flag when workout is complete
        }
    }

    function displayExercise(exercise) {
        outputDiv.innerHTML = `
            <h2>Exercise: ${exercise.name}</h2>
            <p>Description: <br>${exercise.description}</p>
            <p>Goal: <br>${exercise.repetitions} repetitions in ${exercise.duration}s</p>
            <img src="${exercise.image}" width="800px" height="auto"/><br>

        `;
    }
    function startCountdown(duration, callback) {
        const circle = document.querySelector('.progress-ring__circle');
        const text = document.getElementById('circleText');
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        circle.style.strokeDasharray = `${circumference}`;
        circle.style.strokeDashoffset = `${circumference}`;

        let timeLeft = duration;

        function setProgress(percent) {
            const offset = circumference - (percent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }

        setProgress(0);
        text.textContent = timeLeft;

        const interval = setInterval(() => {
            timeLeft--;
            const progress = ((duration - timeLeft) / duration) * 100;
            setProgress(progress);
            text.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(interval);
                setProgress(100);
                text.textContent = "0";
                callback();
            }
        }, 1000);
    }

});


//add exercise
const addExercise = document.getElementById("addExercise");
const showExercise = document.getElementById("newExerciesDiv")
addExercise.addEventListener("click", (event) => {
    event.preventDefault();

    const exercise = {
        name: form.name.value,
        category: form.category.value,
        duration: form.duration.value,
        repetitions: form.repetitions.value,
        level: form.level.value,
        description: form.description.value,

    };

    fetch("http://localhost:5050/workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exercise)
    }).then(res => res.json())
        .then(data => {

            showExercise.innerHTML = `<p style="color: green;">Exercise added successfully!</p>`;
            form.reset();


        })
})
// Search Functionality
const searchBtn = document.getElementById("searchBtn");
const searchName = document.getElementById("searchName");
const searchCategory = document.getElementById("searchCategory");
const searchLevel = document.getElementById("searchLevel");

// search Functionality


searchBtn.addEventListener("click", function searchExercises() {
    // create URLSearchParams object to hold query parameters
    const params = new URLSearchParams({
        name: searchName.value,
        category: searchCategory.value,
        level: searchLevel.value
    });

    // Send GET request to the backend with query parameters
    fetch(`http://localhost:5050/workout/search?${params}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(exercises => {
            // Clear previous content
            idRight.innerHTML = "<h2>Search Results</h2>";

            // create a display grid "showAll"
            const grid = document.createElement("div");
            grid.classList.add("exercise-grid");

            exercises.forEach(exercise => {
                const card = document.createElement("div");
                card.classList.add("exercise-card");
                card.innerHTML = `
                    <img src="${exercise.image}" alt="${exercise.name}" class="exercise-image" width="150px" height="auto">
                    <h3>${exercise.name}</h3>
                    <p><strong>ID:</strong> ${exercise.id}</p>
                    <p><strong>Category:</strong> ${exercise.category}</p>
                    <p><strong>Duration:</strong> ${exercise.duration} sec</p>
                    <p><strong>Repetitions:</strong> ${exercise.repetitions}</p>
                    <p><strong>Level:</strong> ${exercise.level}</p>
                    <p class="description">${exercise.description}</p>
                `;
                grid.appendChild(card);
            });

            idRight.appendChild(grid);
        })
        .catch(error => {
            console.error("Search failed:", error);
            idRight.innerHTML = "<p style='color: red;'>Search failed. Check the console for details.</p>";
        });
})



openModalBtn.addEventListener("click", () => {
    modal.style.display = "block";
    form.reset();


    addBtn.style.display = "inline-block";
    confirmBtn.style.display = "none";
    formTitle.textContent = "Add New Exercise";
    id.value = "";
});


