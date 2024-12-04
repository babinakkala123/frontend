const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(mongoURI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Note = mongoose.model('Note', noteSchema);

app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).send('Error fetching notes.');
  }
});

app.post('/notes', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send('Title and content are required.');
  }

  try {
    const note = new Note({ title, content });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).send('Error creating note.');
  }
});

app.put('/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title && !content) {
    return res.status(400).send('Title or content must be provided for update.');
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedNote) return res.status(404).send('Note not found.');
    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).send('Error updating note.');
  }
});

app.delete('/notes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) return res.status(404).send('Note not found.');
    res.status(200).send('Note deleted successfully.');
  } catch (err) {
    res.status(500).send('Error deleting note.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
