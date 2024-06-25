const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/notes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Note Schema
const noteSchema = new mongoose.Schema({
  text: String,
  time: { type: Date, default: Date.now },
  color: String
});

const Note = mongoose.model('Note', noteSchema);

// Routes
/*app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});*/

app.post('/notes', async (req, res) => {
  /*const note = new Note({
    text: req.body.text,
    time: req.body.time,
    color: req.body.color
  });*/

  const {textdata} = req.body;

  try {

    const notedata = new Note({
      text: textdata,
      time: Date.now(),
      color: "Red"
    });

    //const newNote = await note.save();
    //res.status(201).json(newNote);

    await notedata.save()
    res.status(201).json({ message: `Message Saved: ${notedata}` });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.patch('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (req.body.text != null) {
      note.text = req.body.text;
    }

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    await note.remove();
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
