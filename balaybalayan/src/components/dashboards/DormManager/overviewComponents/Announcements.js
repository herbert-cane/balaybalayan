// Announcements.js
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';

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

      return () => unsubscribe();
    }
  }, [dormitoryId]);

  const handleAddAnnouncement = async () => {
    if (newAnnouncement && dormitoryId) {
      try {
        const announcementsRef = collection(db, 'dormitories', dormitoryId, 'announcements');
        await addDoc(announcementsRef, { text: newAnnouncement });
        setNewAnnouncement('');
        addAnnouncement(newAnnouncement);
      } catch (error) {
        console.error("Error adding announcement:", error);
      }
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

export default Announcements;
