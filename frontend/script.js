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
            // Stocker les données dans localStorage
            localStorage.setItem("exercisesData", JSON.stringify(exercises));

            // Rediriger vers la nouvelle page
            window.location.href = "exercises.html";
        })
        .catch(error => {
            console.log("Error:", error);
        });
});
