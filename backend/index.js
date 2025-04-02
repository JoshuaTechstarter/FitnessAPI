const { error } = require("console");
const express = require("express");
const fs = require("fs")
const path = require("path");
//const cors = require("cors");

const app = express();

// app.use(cors());
// app.use(cors({
//     origin: "http://localhost:5050"
// }))

app.use(express.json())
app.use(express.static(path.join(__dirname, "frontend")))

function readFile() {
    try {
        const data = fs.readFileSync("exercices.json", "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading file:", error);
        throw error;
    }
}
function writeFile(data) {
    try {
        fs.writeFileSync("exercices.json", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error writing file:", error);
        throw error;
    }
}





app.put("/workout/:id", (req, res) => {
    try {
        const id = req.params.id;
        if (isNaN(id)) {
            return res.status(400).json({ error: "ID muss ein Zahl sein!" });
        }
        const exercices = readFile();
        const userExercice = exercices.find(exercice => exercice.id == id);
        if (!userExercice) {
            return res.status(404).json({ error: "Exercice nicht gefunden!" });
        }
        const newName = req.body.name;
        if (!newName) {
            return res.status(404).json({ error: "Name kann nicht leer sein!" });
        }
        const newDescription = req.body.description;
        if (!newDescription) {
            return res.status(404).json({ error: "Description kann nicht leer sein!" });
        }
        userExercice.name = newName;
        userExercice.description = newDescription;
        writeFile(exercices);
        res.json(userExercice);
    } catch (err) {
        res.status(500).json({ error: "Internal Server error!" });
    }
})

app.listen(5050, () => {
    console.log("Der Server läuft 🏋️")
})