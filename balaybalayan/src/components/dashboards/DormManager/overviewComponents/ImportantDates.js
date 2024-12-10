import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase'; // Adjust the import path
import './ImportantDates.css';

const ImportantDates = ({ dormitoryId }) => {
  const [dates, setDates] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [newEvent, setNewEvent] = useState('');

  useEffect(() => {
    if (dormitoryId) {
      console.log('dormitoryId:', dormitoryId); // Debugging line
      const datesRef = collection(db, 'dormitories', dormitoryId, 'importantDates');
      const unsubscribe = onSnapshot(datesRef, (snapshot) => {
        const fetchedDates = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDates(fetchedDates);
      });
  
      return () => unsubscribe();
    } else {
      console.log('dormitoryId is missing');
    }
  }, [dormitoryId]);  

  const handleAddDate = async () => {
    console.log('Add Date button clicked'); // Debugging line
    if (newDate && newEvent && dormitoryId) {
      try {
        const datesRef = collection(db, 'dormitories', dormitoryId, 'importantDates');
        await addDoc(datesRef, {
          date: newDate,
          event: newEvent,
          timestamp: new Date().toISOString(),
        });
  
        // Reset the form fields after submitting
        setNewDate('');
        setNewEvent('');
      } catch (error) {
        console.error('Error adding date:', error);
      }
    } else {
      console.log('Missing newDate, newEvent, or dormitoryId');
    }
  };
  

  return (
    <div className="important-dates">
      <h3>Important Dates</h3>
      <ul>
        {dates.length === 0 ? (
          <li>No important dates available.</li>
        ) : (
          dates.map((dateItem) => (
            <li key={dateItem.id} className="date-item">
              <strong>{dateItem.date}</strong> - {dateItem.event}
            </li>
          ))
        )}
      </ul>

      <div className="date-form">
        <input
          type="date"
          value={newDate}
          onChange={(e) => {
            console.log('Date changed:', e.target.value); // Debugging line
            setNewDate(e.target.value);
          }}
          className="input-date"
        />

        <input
          type="text"
          placeholder="Event"
          value={newEvent}
          onChange={(e) => {
            console.log('Event changed:', e.target.value); // Debugging line
            setNewEvent(e.target.value);
          }}
          className="input-event"
        />
        <button onClick={handleAddDate} className="btn-add-date">
          Add Date
        </button>
      </div>
    </div>
  );
};

export default ImportantDates;
