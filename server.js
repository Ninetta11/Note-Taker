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
    res.send("db.json");
})

// Receive new note and add to database
app.post("/api/notes", function (req, res) {
    const newNote = req.body;

    res.send("db.json")
}) 