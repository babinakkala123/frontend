import React from 'react';

const NotesList = ({ notes, onEdit, onDelete }) => (
  <div className="notes-container">
    {notes.map((note) => (
      <div key={note._id} className="note-card">
        <h3>{note.title}</h3>
        <p>{note.content}</p>
        <div className="note-actions">
          <button className="edit-btn" onClick={() => onEdit(note)}>
            Edit
          </button>
          <button className="delete-btn" onClick={() => onDelete(note._id)}>
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
);

export default NotesList;
