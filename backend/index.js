const { error } = require("console");
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

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
        const id = Number(req.params.id);
        const exercises = readFile();

        const { name,
            category,
            duration,
            repetitions,
            level,
            description } = req.body;
        const foundExercise = exercises.find(exercise => exercise.id === id);

        if (!foundExercise) {
            return res.status(404).json({ error: "Exercise not found" });
        }

        if (name) {
            foundExercise.name = name;
        }
        if (category) {
            foundExercise.category = category;
        }
        if (duration) {
            foundExercise.duration = duration;
        }
        if (repetitions) {
            foundExercise.repetitions = repetitions;
        }
        if (level) {
            foundExercise.level = level;
        }
        if (description) {
            foundExercise.description = description;
        }
        writeFile(exercises);
        res.json(foundExercise);
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(5050, () => {
    console.log("Der Server läuft 🏋️");
});
