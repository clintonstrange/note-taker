const express = require("express");

const PORT = process.env.PORT || 3001;
const app = express();
const { notes } = require("./db/db");

function findByRouteName(routeName, notesArray) {
  const result = notesArray.filter((note) => note.routeName === routeName)[0];
  return result;
}

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:routeName", (req, res) => {
  const result = findByRouteName(req.params.routeName, notes);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send("Note Not Found!");
  }
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
