const { error } = require("console");
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));
app.use(cors()); // Enable CORS
function readFile() {
    try {
        if (!fs.existsSync("exercises.json")) {
            return [];
        }
        const data = fs.readFileSync("exercises.json", "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading file:", error);
        return [];
    }
}

function writeFile(data) {
    try {
        fs.writeFileSync("exercises.json", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing file:", error);
        throw error;
    }
}


function loadAllExercises() {
    return readFile()
}


function getRandomExercises(array, count) {
    let result = [];
    let taken = new Set(); // avoid duplicates

    while (result.length < count && result.length < array.length) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * array.length);
        } while (taken.has(randomIndex)); // Ensure that the same item is not taken multiple times.

        taken.add(randomIndex);
        result.push(array[randomIndex]);
    }

    return result;
}
//Route to collect all the exercises

app.get("/workout", (req, res) => {
    try {
        const allExercises = loadAllExercises();
        res.json(allExercises);

    } catch (err) {
        res.status(500).json({ Error: `Internal Server Error: ${err}` })
    }
})

//Route to collect 5 random exercises
app.get("/workout/random", (req, res) => {
    try {
        const allExercises = loadAllExercises();
        const randomExercises = getRandomExercises(allExercises, 5);
        res.json(randomExercises);

    } catch (err) {
        res.status(500).json({ Error: `Internal Server Error: ${err}` })
    }
})


// CREATE
app.post("/workout/", (req, res) => {
    try {
        if (!req.is("application/json")) {
            return res.status(400).json({ error: "Invalid Content-Type, expected application/json" });
        }

        const exercises = readFile();
        const { name, category, duration, repetitions, level, description } = req.body;

        if (!name || !category || !duration || !repetitions || !level || !description) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newExercise = {
            id: exercises.length + 1,
            name,
            category,
            duration,
            repetitions,
            level,
            description,
        };

        exercises.push(newExercise);
        writeFile(exercises);
        res.status(201).json(newExercise);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// EDIT
app.put("/workout/:id", (req, res) => {
    try {
        const id = req.params.id;
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID muss ein Zahl sein!" });
        }
        id = Number(id);
        const exercices = readFile();
        const userExercice = exercices.find(exercice => exercice.id === id);
        if (!userExercice) {
            return res.status(404).json({ error: "Exercice nicht gefunden!" });
        }
        const newName = req.body.name;
        if (newName) {
            return res.status(404).json({ error: "Name kann nicht leer sein!" });
        }
        const newDescription = req.body.description;
        if (newDescription) {
            return res.status(404).json({ error: "Description kann nicht leer sein!" });
        }
        userExercice.name = newName;
        userExercice.description = newDescription;
        writeFile(exercices);
        res.json(userExercice);
    } catch (err) {
        res.status(500).json({ error: "Internal Server error!" });
    }
});



//add new Exercise
app.post("/workout", (req, res) => {
    try {
        const exercises = readFile();
        const { name, category, duration, repetitions, level, description } = req.body

        const nameTaken = exercises.find((tier) => exercice.name == name);
        if (nameTaken) {
            return res.status(400).json({ error: "diesre Exercise exist schon" });
        }
        const newExercise = {
            id: tiere.length + 1, // besser (komplexere Logik) -> tiere.length > 0 ? Math.max(...tiere.map(a => a.id)) + 1 : 1;
            name: name,
            category: category,
            duration: duration,
            repetitions: repetitions,
            level: level,
            description: description
        }
        exercises.push(newExercise)
        writeFile(exercises)
        res.status(201).json(newExercise)
    } catch (err) {
        res.status(500).json({ error: "Internal Server error!" })
    }
})
app.listen(5050, () => {
    console.log("Der Server läuft 🏋️");
});
