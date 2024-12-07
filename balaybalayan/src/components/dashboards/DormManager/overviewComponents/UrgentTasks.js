// UrgentTasks.js
import React from 'react';

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

export default UrgentTasks;
