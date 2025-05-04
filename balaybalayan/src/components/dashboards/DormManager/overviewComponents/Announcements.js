import React, { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import './Announcements.css';

const Announcements = ({ dormitoryId }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null); // To track if we are editing
  const [expanded, setExpanded] = useState(false); // To manage "See More" state
  const [currentPage, setCurrentPage] = useState(0);
  const announcementsPerPage = 5;

  useEffect(() => {
    if (dormitoryId) {
      const announcementsRef = collection(db, 'dormitories', dormitoryId, 'announcements');
      const unsubscribe = onSnapshot(announcementsRef, (snapshot) => {
        const fetchedAnnouncements = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnnouncements(fetchedAnnouncements);
      });

      return () => unsubscribe();
    }
  }, [dormitoryId]);

  const handleAddOrUpdateAnnouncement = async () => {
    if (title && content && dormitoryId) {
      try {
        const announcementId = editId || title.toLowerCase().replace(/\s+/g, '');
        const announcementRef = doc(db, 'dormitories', dormitoryId, 'announcements', announcementId);

        await setDoc(announcementRef, {
          title,
          content,
          timestamp: new Date().toISOString(),
        });

        setTitle('');
        setContent('');
        setEditId(null); // Reset edit mode
      } catch (error) {
        console.error('Error adding/updating announcement:', error);
      }
    }
  };

  const handleEdit = (id) => {
    const announcementToEdit = announcements.find((ann) => ann.id === id);
    if (announcementToEdit) {
      setTitle(announcementToEdit.title);
      setContent(announcementToEdit.content);
      setEditId(id); // Set edit mode
    }
  };

  const handleDelete = async (id) => {
    if (dormitoryId && id) {
      try {
        const announcementRef = doc(db, 'dormitories', dormitoryId, 'announcements', id);
        await deleteDoc(announcementRef);
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };

  const pageCount = Math.ceil(announcements.length / announcementsPerPage);
  const currentAnnouncements = announcements.slice(
    currentPage * announcementsPerPage,
    (currentPage + 1) * announcementsPerPage
  );

  return (
    <div className="announcements">
      <h3>Announcements</h3>
      <ul className="announcements-list">
        {currentAnnouncements.map((announcement) => (
          <li key={announcement.id} className="announcement-item">
            <div className="announcement-header">
              <h4>{announcement.title}</h4>
              <div className="announcement-actions">
                <button className="btn-edit" onClick={() => handleEdit(announcement.id)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(announcement.id)}>Delete</button>
              </div>
            </div>
            <p>{announcement.content}</p>
          </li>
        ))}
      </ul>
      {pageCount > 1 && (
        <div className="announcements-pagination">
          <div className="pagination-buttons">
            <button 
              className="pagination-button"
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            <button 
              className="pagination-button"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === pageCount - 1}
            >
              Next
            </button>
          </div>
          <span className="page-indicator">
            Page {currentPage + 1} of {pageCount}
          </span>
        </div>
      )}
      <div className="announcement-form">
        <input
          type="text"
          className="input-title"
          placeholder="Enter announcement title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="input-content"
          placeholder="Enter announcement content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="btn-post" onClick={handleAddOrUpdateAnnouncement}>
          {editId ? 'Update Announcement' : 'Post Announcement'}
        </button>
      </div>
    </div>
  );
};

export default Announcements;
