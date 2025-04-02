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

// POST
app.post("/exercises/", (req, res) => {
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

app.listen(5050, () => {
    console.log("Der Server läuft 🏋️");
});
