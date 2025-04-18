import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './main.css';

function MainPage() {
  const navigate = useNavigate();
  const [dormitories, setDormitories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDormitories = async () => {
      try {
        const dormitoriesSnapshot = await getDocs(collection(db, 'dormitories'));
        const dormitoriesData = dormitoriesSnapshot.docs.map((doc) => ({
          ...doc.data(),
          dormitoryId: doc.id,
        }));
        setDormitories(dormitoriesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dormitories:', error);
      }
    };

    fetchDormitories();
  }, []);

  return (
    <div className="main-page">
      <div className="particles">
        {[...Array(100)].map((_, index) => (
          <div
            key={index}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 10}s`,
              animationDelay: `-${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
      <div className="banner">
        <div className="banner-text">
          <h1 className="banner-title">Choose Your Dormitory</h1>
          <p className="banner-subtitle">Find the perfect place to stay!</p>
        </div>
        <img 
          src="https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg" 
          alt="Modern Dormitory Building" 
          className="banner-image"
        />
      </div>
      <div className="dormitory-selection">
        <h2 className="section-title">Available Dormitories</h2>
        {loading ? (
          <p className="loading-text">Loading dormitories...</p>
        ) : (
          <div className="dormitory-cards">
            {dormitories.map((dorm) => (
              <div
                key={dorm.dormitoryId}
                className="dorm-card"
                onClick={() => navigate(dorm.path)}
              >
                <img
                  src={dorm.dormPhoto || 'default-dorm.jpg'}
                  alt={dorm.dormName}
                  className="dorm-card-image"
                />
                <div className="dorm-card-content">
                  <h3 className="dorm-card-title">{dorm.dormName}</h3>
                  <p className="dorm-card-description">
                    {dorm.description}
                  </p>
                </div>
                <button className="dorm-card-button">View Details</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainPage;