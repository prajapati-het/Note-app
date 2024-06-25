import React from "react";
import Note from "../Note/Note";
import "./NoteContainer.css";

function NotesContainer({ notes, deleteNote, updateText }) {
  const reverseArray = (arr) => {
    return arr.slice().reverse(); // A simpler way to reverse the array
  };

  const reversedNotes = reverseArray(notes);

  return (
    <div className="notes-container">
      <h2>Notes</h2>
      <div className="notes-container_notes custom-scroll">
        {reversedNotes.length > 0 ? (
          reversedNotes.map((item) => (
            <Note
              key={item._id}
              note={item}
              deleteNote={deleteNote}
              updateText={updateText}
            />
          ))
        ) : (
          <h3>No Notes present</h3>
        )}
      </div>
    </div>
  );
}

export default NotesContainer;
