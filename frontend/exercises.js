document.addEventListener("DOMContentLoaded", function () {
    const outputDiv = document.getElementById("outputDiv");


    const exercises = JSON.parse(localStorage.getItem("exercisesData"));



    let listHtml = "<ul>";
    exercises.forEach(exercise => {
        listHtml += `
            <li>
                <img src="${exercise.image}" class="imgexercises" width="250" height="auto"/><br>
                <strong>Nom:</strong> ${exercise.name}<br>
                <strong>Catégorie:</strong> ${exercise.category}<br>
                <strong>Durée:</strong> ${exercise.duration} min<br>
                <strong>Répétitions:</strong> ${exercise.repetitions}<br>
                <strong>Niveau:</strong> ${exercise.level}<br>
                <strong>Description:</strong> ${exercise.description}<br>
                <br>
            </li>`;
    });
    listHtml += "</ul>";

    outputDiv.innerHTML = listHtml;
});
