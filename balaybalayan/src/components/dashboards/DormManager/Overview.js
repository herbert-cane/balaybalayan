import React, { useState } from 'react';
import { useAuth } from '../../../AuthContext';
import PieChart from './overviewComponents/PieChart';
import UrgentTasks from './overviewComponents/UrgentTasks';
import Permits from './overviewComponents/Permits';
import Announcements from './overviewComponents/Announcements';
import ImportantDates from './overviewComponents/ImportantDates';
import './overview.css';

const Overview = () => {
  const { dormitoryId } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [importantDates, setImportantDates] = useState([]);
  const [urgentTasks] = useState(['Check water system', 'Inspect Room 10']);

  const addAnnouncement = (announcement) => setAnnouncements([...announcements, announcement]);
  const addImportantDate = (date) => setImportantDates([...importantDates, date]);

  return (
    <div className="overview-container">
      <div className="chart-section">
        <h2>Dorm Capacity</h2>
        <PieChart dormitoryId={dormitoryId} />
      </div>
      <div className="permits-section">
        <Permits dormitoryId={dormitoryId} />
      </div>
      <div className="tasks-section">
        <UrgentTasks tasks={urgentTasks} />
      </div>
      <div className="announcements-section">
        <Announcements dormitoryId={dormitoryId} addAnnouncement={addAnnouncement} />
      </div>
      <div className="important-dates-section">
        <ImportantDates dormitoryId={dormitoryId} dates={importantDates} addDate={addImportantDate} />
      </div>
    </div>
  );
};

export default Overview;
