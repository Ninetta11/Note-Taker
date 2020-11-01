// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
const fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const database = "db/db.json";
const notes = [];

// Read existing database file
function readNotes() {
    fs.readFile((database), (err, data) => {
        if (err) throw err;
        return data;
    })
}

// generate unique ID
function generateNewId() {
    let idIndex = Math.floor(Math.random() * 9999) + 1;
    //if (notes.length >= 1) {
    if (notes.forEach(element => element.id === idIndex)) {
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
    let savedNotes = readNotes();
    res.json(savedNotes);
})

// Receive new note and add to database
app.post("/api/notes", function (req, res) {
    let newNote = req.body;
    newNote.id = `${generateNewId()}`;
    notes.push(newNote);
    fs.writeFile(database, JSON.stringify(notes), (err) => {
        if (err) throw err;
    })
    res.json(notes);
})

// Deletes note from database
app.delete("api/notes/:id", function (req, res) {
    let id = parseInt(req.params.id);
    // Reads all notes
    notes = readNotes();
    // Identifies note to be deleted inside of database
    let deleteNote = notes.filter(note => note.id === id);
    // deletes note from notes 
    notes.splice(deleteNote);
    // Writes remaining notes back to database
    fs.writeFile(database, notes, (err) => {
        if (err) throw err;
    })
    res.json(notes);
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
