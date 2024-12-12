import React from 'react';

const Announcements = ({ announcements }) => {
  return (
    <div className="announcements">
      <h2 className="section-title">Announcements</h2>
      <div className="announcement-content">
        {announcements.length ? (
          announcements.map((announcement) => (
            <div key={announcement.id} className="announcement-item">
              <h3 className="announcement-title">{announcement.title}</h3>
              <p className="announcement-content">{announcement.content}</p>
            </div>
          ))
        ) : (
          <p>No announcements at this time.</p>
        )}
      </div>
    </div>
  );
};

export default Announcements;