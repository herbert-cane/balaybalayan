// ImportantDates.js
import React, { useState } from 'react';

const ImportantDates = ({ dates, addDate }) => {
  const [newDate, setNewDate] = useState('');
  const [newEvent, setNewEvent] = useState('');

  const handleAddDate = () => {
    if (newDate && newEvent) {
      addDate({ date: newDate, event: newEvent });
      setNewDate('');
      setNewEvent('');
    }
  };

  return (
    <div className="important-dates">
      <h3>Important Dates</h3>
      <ul>
        {dates.map((dateItem, index) => (
          <li key={index}>
            {dateItem.date} - {dateItem.event}
          </li>
        ))}
      </ul>
      <div className="date-form">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Event"
          value={newEvent}
          onChange={(e) => setNewEvent(e.target.value)}
        />
        <button onClick={handleAddDate}>Add</button>
      </div>
    </div>
  );
};

export default ImportantDates;
