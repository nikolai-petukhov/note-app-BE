require('dotenv').config();
const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const { requestLogger, unknownEndpoint} = require('./middleware/requestLogger');

const Note = require('./models/note');

app.use(express.json());
app.use(requestLogger);
app.use(cors());
app.use(express.static('build'));

// const url = `mongodb+srv://nikolaipetukhov:111nikolaipetukhov111@cluster0.lbxz0cr.mongodb.net/noteApp?retryWrites=true&w=majority`;
// mongoose.connect(url);

// const noteSchema = new mongoose.Schema({
//   content: String,
//   date: Date,
//   important: Boolean
// });

// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   }
// });

// const Note = mongoose.model('Note', noteSchema);


app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response) => {
  // const id = +request.params.id; // Number(request.params.id)
  // const note = notes.find((note) => note.id === id);

  // note ? response.json(note) : response.status(404).end();
  Note.findById(request.params.id).then(note => {
    response.json(note);
  })
});

app.post("/api/notes", (request, response) => {
  const body = request.body;
  
  !body.content
    && response.status(400).json({error: 'content missing'});

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    });

    note.save().then(saveNote => {
      response.json(saveNote);
    });

    // notes.concat(note);
    
    // response.json(note);
});

app.delete("/api/notes/:id", (request, response) => {
  const id = +request.params.id;
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
