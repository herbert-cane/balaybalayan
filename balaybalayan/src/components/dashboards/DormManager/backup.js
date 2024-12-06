import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '../../../AuthContext'; // Import useAuth

// Register required elements
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ dormitoryId }) => {
  const [maxOccupants, setMaxOccupants] = useState(0);
  const [currentDormers, setCurrentDormers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const roomRef = collection(db, 'rooms');
      const q = query(roomRef, where('dormitoryId', '==', dormitoryId));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let totalMaxOccupants = 0;
        let totalCurrentDormers = 0;

        snapshot.forEach((doc) => {
          const data = doc.data();
          totalMaxOccupants += data.maxOccupants || 0;
          totalCurrentDormers += data.currentDormers || 0;
        });

        setMaxOccupants(totalMaxOccupants);
        setCurrentDormers(totalCurrentDormers);
      });

      // Cleanup function to unsubscribe from the snapshot listener
      return () => unsubscribe();
    };

    fetchData();
  }, [dormitoryId]);

  const data = {
    labels: ['Occupied', 'Available'],
    datasets: [
      {
        data: [currentDormers, maxOccupants - currentDormers],
        backgroundColor: ['#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#36A2EB', '#FFCE56'],
      },
    ],
  };

  return <Pie data={data} />;
};

const UrgentTasks = ({ tasks }) => {
  return (
    <div className="urgent-tasks">
      <h3>Urgent Tasks</h3>
      <ul>
        {tasks.length ? (
          tasks.map((task, index) => (
            <li key={index}>{task}</li>
          ))
        ) : (
          <p>No urgent tasks at the moment.</p>
        )}
      </ul>
    </div>
  );
};

const Announcements = ({ dormitoryId, addAnnouncement }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  useEffect(() => {
    if (dormitoryId) {
      const announcementsRef = collection(db, 'dormitories', dormitoryId, 'announcements');
      const unsubscribe = onSnapshot(announcementsRef, (snapshot) => {
        const fetchedAnnouncements = snapshot.docs.map((doc) => doc.data().text);
        setAnnouncements(fetchedAnnouncements);
      });

      // Cleanup function for unsubscribing from the snapshot listener
      return () => unsubscribe();
    }
  }, [dormitoryId]);

  const handleAddAnnouncement = async () => {
    if (newAnnouncement && dormitoryId) {
      try {
        const announcementsRef = collection(db, 'dormitories', dormitoryId, 'announcements');
        await addDoc(announcementsRef, { text: newAnnouncement });
        setNewAnnouncement('');
        addAnnouncement(newAnnouncement); // Pass the new announcement to the parent
      } catch (error) {
        console.error("Error adding announcement:", error);
      }
    } else {
      console.log('Missing dormitoryId or announcement text');
    }
  };

  return (
    <div className="announcements">
      <h3>Announcements</h3>
      <ul>
        {announcements.map((announcement, index) => (
          <li key={index}>{announcement}</li>
        ))}
      </ul>
      <div className="announcement-form">
        <input
          type="text"
          placeholder="Add announcement"
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
        />
        <button onClick={handleAddAnnouncement}>Post</button>
      </div>
    </div>
  );
};

const ImportantDates = ({ dates, addDate }) => {
  const [newDate, setNewDate] = React.useState('');
  const [newEvent, setNewEvent] = React.useState('');

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

const Overview = () => {
  const { dormitoryId } = useAuth(); // Use useAuth hook here

  const [announcements, setAnnouncements] = useState([]);
  const [importantDates, setImportantDates] = useState([]);
  const [urgentTasks] = useState(['Check water system', 'Inspect Room 10']);

  const addAnnouncement = (announcement) => setAnnouncements([...announcements, announcement]);
  const addImportantDate = (date) => setImportantDates([...importantDates, date]);

  return (
    <div className="overview-container">
      <div className="chart-section">
        <h2>Overview</h2>
        <PieChart dormitoryId={dormitoryId} />
      </div>
      <div className="tasks-section">
        <UrgentTasks tasks={urgentTasks} />
      </div>
      <div className="announcements-section">
        <Announcements dormitoryId={dormitoryId} addAnnouncement={addAnnouncement} />
      </div>
      <div className="important-dates-section">
        <ImportantDates dates={importantDates} addDate={addImportantDate} />
      </div>
    </div>
  );
};

export default Overview;
