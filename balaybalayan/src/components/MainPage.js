import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import './main.css';


function MainPage() {
  const navigate = useNavigate();
  const [dormitories, setDormitories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [pendingDormers, setPendingDormers] = useState(0);
  const [pendingManagers, setPendingManagers] = useState(0);
  const [verifiedDormers, setVerifiedDormers] = useState(0);
  const [verifiedManagers, setVerifiedManagers] = useState(0);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      }
    });
  
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserCounts = async () => {
      if (userRole === 'admin') {
        // Count pending dormers (isVerified is false)
        const pendingDormersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'dormer'),
          where('isVerified', '==', false)
        );
        const pendingDormersSnapshot = await getDocs(pendingDormersQuery);
        setPendingDormers(pendingDormersSnapshot.size);

        // Count verified dormers
        const verifiedDormersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'dormer'),
          where('isVerified', '==', true)
        );
        const verifiedDormersSnapshot = await getDocs(verifiedDormersQuery);
        setVerifiedDormers(verifiedDormersSnapshot.size);

        // Count pending managers (isVerified is false)
        const pendingManagersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'manager'),
          where('isVerified', '==', false)
        );
        const pendingManagersSnapshot = await getDocs(pendingManagersQuery);
        setPendingManagers(pendingManagersSnapshot.size);

        // Count verified managers
        const verifiedManagersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'manager'),
          where('isVerified', '==', true)
        );
        const verifiedManagersSnapshot = await getDocs(verifiedManagersQuery);
        setVerifiedManagers(verifiedManagersSnapshot.size);
      }
    };

    fetchUserCounts();
  }, [userRole]);

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
      {userRole === 'admin' ? (
        <div className="admin-container">
          <div className="admin-card">
            <h1 className="admin-title">Admin Dashboard</h1>
            <div className="admin-content">
              <div className="pending-counters">
                <div className="pending-counter">
                  <div className="counter-label">Dormers</div>
                  <div className="counter-stats">
                    <div className="stat-item">
                      <span>Pending: </span>
                      <span className="pending">{pendingDormers}</span>
                    </div>
                    <div className="stat-item">
                      <span>Verified: </span>
                      <span className="verified">{verifiedDormers}</span>
                    </div>
                  </div>
                </div>
                <div className="pending-counter">
                  <div className="counter-label">Dorm Managers</div>
                  <div className="counter-stats">
                    <div className="stat-item">
                      <span>Pending: </span>
                      <span className="pending">{pendingManagers}</span>
                    </div>
                    <div className="stat-item">
                      <span>Verified: </span>
                      <span className="verified">{verifiedManagers}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/admin')}
                className="verify-users-button"
              >
                Verify Users
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default MainPage;