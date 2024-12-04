import React, { useState, useEffect } from 'react';
import api from './api';
import Navbar from './components/Navbar';
import NotesList from './components/NotesList';
import NoteForm from './components/NoteForm';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  const fetchNotes = async () => {
    const response = await api.get('/');
    setNotes(response.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSave = async (note) => {
    if (note.id) {
      await api.put(`/${note.id}`, { title: note.title, content: note.content });
    } else {
      await api.post('/', { title: note.title, content: note.content });
    }
    fetchNotes();
    setSelectedNote(null);
  };

  const handleDelete = async (id) => {
    await api.delete(`/${id}`);
    fetchNotes();
  };

  return (
    <div className="app">
      <Navbar />
      <div className="content">
        <NoteForm selectedNote={selectedNote} onSave={handleSave} />
        <NotesList notes={notes} onEdit={setSelectedNote} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default App;
