const express = require("express");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
let { notes } = require("./db/db");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

function validateNote(note) {
  if (!note.title || typeof note.title !== "string") {
    return false;
  }
  if (!note.text || typeof note.title !== "string") {
    return false;
  }
  return true;
}

function findById(id, notesArray) {
  const result = notesArray.filter((note) => note.id === id)[0];
  return result;
}

function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const result = findById(req.params.id, notes);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send("Note Not Found!");
  }
});

app.post("/api/notes", (req, res) => {
  if (!validateNote(req.body)) {
    res.status(400).send("This note is not properly formatted.");
  } else {
    const note = createNewNote(req.body, notes);
    res.json(note);
  }
});

app.delete("/api/notes/:id", (req, res) => {
  notes = notes.filter((note) => parseInt(note.id) !== parseInt(req.params.id));

  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify({ notes: notes }, null, 2)
  );

  res.json(notes);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
