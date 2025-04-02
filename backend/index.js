const express = require("express");
const fs = require("fs")
const path = require("path");
const app = express();
app.use(express.json())
app.use(express.static(path.join(__dirname, "frontend")))



app.listen(5050, () => {
    console.log("Der Server läuft 🏋️")
})