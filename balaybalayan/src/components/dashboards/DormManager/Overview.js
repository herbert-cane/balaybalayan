import React, { useState } from 'react';
import { useAuth } from '../../../AuthContext';
import { FaChartPie, FaFileAlt } from 'react-icons/fa';
import { MdAnnouncement } from 'react-icons/md';
import { BsCalendarEvent } from 'react-icons/bs';
import PieChart from './overviewComponents/PieChart';
import Permits from './overviewComponents/Permits';
import Announcements from './overviewComponents/Announcements';
import ImportantDates from './overviewComponents/ImportantDates';
import './overview.css';

const Overview = () => {
  const { dormitoryId } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [importantDates, setImportantDates] = useState([]);

  const addAnnouncement = (announcement) => setAnnouncements([...announcements, announcement]);
  const addImportantDate = (date) => setImportantDates([...importantDates, date]);

  return (
    <div className="overview-container">
      <div className="chart-section">
        <h2><FaChartPie className="section-icon" /> Dorm Capacity</h2>
        <PieChart dormitoryId={dormitoryId} />
      </div>
      <div className="permits-section">
        <h2><FaFileAlt className="section-icon" /> Permits</h2>
        <Permits dormitoryId={dormitoryId} />
      </div>
      <div className="info-section">
        <div className="announcements-section">
          <h2><MdAnnouncement className="section-icon" /> Announcements</h2>
          <Announcements dormitoryId={dormitoryId} addAnnouncement={addAnnouncement} />
        </div>
        <div className="important-dates-section">
          <h2><BsCalendarEvent className="section-icon" /> Important Dates</h2>
          <ImportantDates dormitoryId={dormitoryId} dates={importantDates} addDate={addImportantDate} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
