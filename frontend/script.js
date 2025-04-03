const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModal = document.querySelector(".close");
const formTitle = document.getElementById("formTitle"); // <legend> element
const form = document.getElementById("editForm");
const idRight = document.getElementById("idRight");

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
                    <img src="${exercise.image}" alt="${exercise.name}" class="exercise-image" width="150px" height="auto">
                    <h3>${exercise.name}</h3>
                    <p><strong>Category:</strong> ${exercise.category}</p>
                    <p><strong>Duration:</strong> ${exercise.duration} sec</p>
                    <p><strong>Repetitions:</strong> ${exercise.repetitions}</p>
                    <p><strong>Level:</strong> ${exercise.level}</p>
                    <p class="description">${exercise.description}</p>
                    <div class="card-buttons">
                        <button class="edit-btn">✏️ Edit</button>
                        
                    </div><br> <br>
                `;
                // Add event listener to the "Edit" button
                const editBtn = card.querySelector(".edit-btn");
                editBtn.addEventListener("click", function () {
                    // When edit button is clicked, open the modal and populate the form
                    modal.style.display = "block";

                    // Populate the form with the exercise data
                    formTitle.textContent = `Edit Exercise: ${exercise.name}`;
                    form.name.value = exercise.name;
                    form.category.value = exercise.category;
                    form.duration.value = exercise.duration;
                    form.repetitions.value = exercise.repetitions;
                    form.level.value = exercise.level;
                    form.description.value = exercise.description;
                    form.image.value = exercise.image;

                    // Optionally store the exercise ID for updating
                    form.setAttribute("data-exercise-id", exercise.id);
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

