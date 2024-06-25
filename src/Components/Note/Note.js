import React, { useState } from "react";
import deleteIcon from "../../assets/delete.svg";
import "./Note.css";
import axios from 'axios';

let timer = 500, timeout;

function Note({
  note, deleteNote, updateText
}) {
  const [text, setText] = useState('');
  const [message, setMessage] = useState(''); // Local state for the text

  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);
    const monthNames = [
      "Jan", "Feb", "March", "April", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec",
      "Jan", "Feb", "March", "April", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

    let hrs = date.getHours();
    let amPm = hrs >= 12 ? "PM" : "AM";
    hrs = hrs ? hrs : "12";
    hrs = hrs > 12 ? (hrs = 24 - hrs) : hrs;

    let min = date.getMinutes();
    min = min < 10 ? "0" + min : min;

    let day = date.getDate();
    const month = monthNames[date.getMonth()];

    return `${hrs}:${min} ${amPm} ${day} ${month}`;
  };

  const debounce = (func) => {
    clearTimeout(timeout);
    timeout = setTimeout(func, timer);
  };

  const handleChange = (event) => {
    const newText = event.target.value;
    setText(newText); // Update local state
    debounce(() => updateText(newText, note._id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newText = {
        text,
      };
  
      //console.log("Before post");
      const response = await axios.post('http://localhost:5000/notes', newText);
      //console.log("After post");
      setMessage(response.data.message);
  
      setText('');


    } catch (error) {
      console.error('Error creating user:', error);
      setMessage('Server error');
    }

  }

  return (
    <div className="note" style={{ backgroundColor: note.color }}>
      <textarea
        className="note_text"
        value={text} // Use local state value
        onChange={handleChange}
      />
      <div className="note_footer">
        <p>{formatDate(note.time)}</p>
        <img
          src={deleteIcon}
          alt="DELETE"
          onClick={() => deleteNote(note._id)}
        />
      </div>
      <div>
        <button type="submit" onClick={handleSubmit}>Save</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Note;
