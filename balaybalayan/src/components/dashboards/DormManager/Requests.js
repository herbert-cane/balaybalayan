import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase';
import { doc, getDoc, collection, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import './Requests.css';
import { FaFilter, FaSort, FaClock, FaUser } from 'react-icons/fa';
import { MdRequestPage } from 'react-icons/md';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [visibleRequests, setVisibleRequests] = useState(5);
  const [requestUsers, setRequestUsers] = useState({});
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().dormitoryId) {
            const dormitoryId = userDoc.data().dormitoryId;
            const requestsRef = collection(db, "dormitories", dormitoryId, "requests");

            const unsubscribe = onSnapshot(requestsRef, async (snapshot) => {
              const fetchedRequests = await Promise.all(snapshot.docs.map(async (requestDoc) => {
                const requestData = { id: requestDoc.id, ...requestDoc.data() };
                const userRef = doc(db, "users", requestData.userId);
                const userSnap = await getDoc(userRef);
                return {
                  ...requestData,
                  userLastName: userSnap.exists() ? userSnap.data().lastName : 'Unknown',
                };
              }));

              fetchedRequests.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
              setRequests(fetchedRequests);
              setFilteredRequests(fetchedRequests);
              setLoading(false);
            });

            return () => unsubscribe();
          }
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setVisibleRequests(5);
    setFilteredRequests(
      status ? requests.filter((request) => request.status.toLowerCase() === status.toLowerCase()) : requests
    );
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      const user = auth.currentUser;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().dormitoryId) {
        const dormitoryId = userDoc.data().dormitoryId;
        const requestRef = doc(db, "dormitories", dormitoryId, "requests", requestId);
        await updateDoc(requestRef, { status: action });
      }
    } catch (error) {
      console.error("Error updating request status:", error);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        const user = auth.currentUser;
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().dormitoryId) {
          const dormitoryId = userDoc.data().dormitoryId;
          await deleteDoc(doc(db, "dormitories", dormitoryId, "requests", requestId));
        }
      } catch (error) {
        console.error("Error deleting request:", error);
      }
    }
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setFilteredRequests(prevRequests => {
      const sorted = [...prevRequests].sort((a, b) => {
        const comparison = a.createdAt.toDate() - b.createdAt.toDate();
        return value === 'desc' ? -comparison : comparison;
      });
      return sorted;
    });
  };

  if (loading) {
    return <div className="requests-loading">Loading requests...</div>;
  }

  return (
    <div className="requests-container">
      <div className="requests-header">
        <h2 className="requests-title"><MdRequestPage className="section-icon" /> Dormitory Requests</h2>
        <div className="filter-container">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select value={filterStatus} onChange={(e) => handleFilterChange(e.target.value)}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="unresolved">Unresolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="separator">|</div>
          <div className="filter-group">
            <span className="filter-label">Sort by:</span>
            <select value={sortOrder} onChange={(e) => handleSortChange(e.target.value)}>
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="no-requests">No requests found.</div>
      ) : (
        <>
          <div className="requests-list">
            {filteredRequests.slice(0, visibleRequests).map((request) => (
              <div key={request.id} className="request-item">
                <div 
                  className="request-delete"
                  onClick={() => handleDeleteRequest(request.id)}
                  title="Delete request"
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </div>
                <div className="request-header">
                  <span className={`request-status ${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                  <span className="request-type">{request.type}</span>
                </div>
                <p className="request-description">{request.description}</p>
                <div className="request-footer">
                  <span className="request-user"><FaUser className="user-icon" /> {request.userLastName}</span>
                  <span className="request-date">
                    <FaClock className="clock-icon" /> {request.createdAt.toDate().toLocaleString()}
                  </span>
                </div>
                <div className="status-action-container">
                  <select 
                    className="status-select"
                    value={request.status}
                    onChange={(e) => handleRequestAction(request.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="acknowledged">Acknowledged</option>
                    <option value="unresolved">Unresolved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
          {visibleRequests < filteredRequests.length && (
            <div className="see-more-container">
              <button className="btn-see-more" onClick={() => setVisibleRequests((prev) => prev + 5)}>
                See More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Requests;
