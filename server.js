// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");
const data = require("./db/db.json");
const database = "db/db.json";

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 8001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// generate unique ID
function generateNewId() {
    let idIndex = Math.floor(Math.random() * 9999) + 1;
    //if (notes.length >= 1) {
    if (data.forEach(element => element.id === idIndex)) {
        idIndex = generateNewId()
    }
    // }
    return idIndex;
}

// Sets routes
// =============================================================
// Route to notes page
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Interacting with database
// =============================================================
// Returns all saved notes from database
app.get("/api/notes", function (req, res) {
    res.json(data);
})

// Receive new note and add to database
app.post("/api/notes", function (req, res) {
    let newNote = req.body;
    newNote.id = `${generateNewId()}`;
    data.push(newNote);
    fs.writeFileSync(database, JSON.stringify(data), (err) => {
        if (err) throw err;
    })
    res.json(data);
})

// Deletes note from database
app.delete("/api/notes/:id", function (req, res) {
    let id = req.params.id;
    //Identifies note to be deleted inside of database
    for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
            data.splice(i, 1);
            // Writes remaining notes back to database
            fs.writeFileSync(database, JSON.stringify(data), (err) => {
                if (err) throw err;
            })
            res.send(data[i]);
        }
    }
})

// Basic route that sends the user first to the index page
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
