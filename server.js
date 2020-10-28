// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
const fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sets routes
// =============================================================
// Route to notes page
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "notes.html"));
});

// Basic route that sends the user first to the index page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Interacting with database
// =============================================================
// Returns all saved notes from database
app.get("/api/notes", function (req, res) {
    return res.json("db.json");
})

// Receive new note and add to database
app.post("/api/notes", function (req, res) {
    let newNote = req.body;
    // add id to note prior to saving
    let notes = readNotes();
    let index = "";
    if (lastIndexOf(notes) === -1) {
        index = 1;
    }
    else {
        index = lastIndexOf(notes) + 1;
    }
    newNote.id = index;
    // save note to database 
    fs.appendFile("db.json", newNote, (err) => {
        if (err) throw err;
        res.send("db.json")
    })
})

// Deletes note from database
app.delete("api/notes/:id", function (req, res) {
    let id = req.params.id;
    // Reads all notes
    let notes = readNotes();
    // Identifies note to be deleted inside of database
    let deleteNote = notes.findIndex(note => note.id === id);
    // deletes note from notes 
    notes.splice(deleteNote);
    // Writes remaining notes back to database
    fs.writeFile("db.json", notes, (err) => {
        if (err) throw err;
    })
})

// Read existing database file
function readNotes() {
    let notes = fs.readFile("db.json", (err, data) => {
        if (err) throw err;
        return data;
    })
    return notes;
}

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
