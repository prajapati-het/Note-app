import React, { useEffect, useState } from "react";
import NotesContainer from "./Components/NoteContainer/NoteContainer";
import Sidebar from "./Components/Sidebar/Sidebar";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);

  // Fetch notes from backend when component mounts
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://localhost:5000/notes');
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      }
    };

    fetchNotes();
  }, []);

  const addNote = async (color) => {
    const newNote = {
      text: "",
      time: Date.now(),
      color,
    };

    try {
      const response = await fetch('http://localhost:5000/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNote)
      });

      const data = await response.json();
      setNotes(prevNotes => [...prevNotes, data]);
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await fetch(`http://localhost:5000/notes/${id}`, {
        method: 'DELETE'
      });

      setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const updateText = async (text, id) => {
    try {
      await fetch(`http://localhost:5000/notes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      setNotes(prevNotes => {
        const updatedNotes = [...prevNotes];
        const index = updatedNotes.findIndex(note => note._id === id);
        if (index !== -1) {
          updatedNotes[index].text = text;
        }
        return updatedNotes;
      });
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  return (
    <div className="App">
      <Sidebar addNote={addNote} />
      <NotesContainer
        notes={notes}
        deleteNote={deleteNote}
        updateText={updateText}
      />
    </div>
  );
}

export default App;
