import React from 'react';

const UpcomingEvents = ({ importantDates }) => {
  return (
    <div className="upcoming-events">
      <h2 className="section-title">Upcoming Events</h2>
      <div className="events-content">
        {importantDates.length ? (
          importantDates.map((event) => (
            <div key={event.id} className="event-item">
              <strong>{event.date}</strong> - {event.event}
            </div>
          ))
        ) : (
          <p>No upcoming events scheduled.</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingEvents;