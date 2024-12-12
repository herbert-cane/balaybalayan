import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../firebase';
import { doc, getDoc, collection, onSnapshot, updateDoc } from 'firebase/firestore';
import './Requests.css';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [visibleRequests, setVisibleRequests] = useState(5);
  const [requestUsers, setRequestUsers] = useState({});

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

  if (loading) {
    return <div className="requests-loading">Loading requests...</div>;
  }

  return (
    <div className="requests-container">
      <div className="requests-header">
        <h2 className="requests-title">Dormitory Requests</h2>
        <div className="filter-container">
          <select value={filterStatus} onChange={(e) => handleFilterChange(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="no-requests">No requests found.</div>
      ) : (
        <>
          <div className="requests-list">
            {filteredRequests.slice(0, visibleRequests).map((request) => (
              <div key={request.id} className="request-item">
                <div className="request-header">
                  <span className={`request-status ${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                  <span className="request-type">{request.type}</span>
                </div>
                <p className="request-description">{request.description}</p>
                <div className="request-footer">
                  <span className="request-user">By: {requestUsers[request.id] || "Unknown"}</span>
                  <span className="request-date">{request.createdAt.toDate().toLocaleString()}</span>
                </div>
                <div className="request-actions">
                  <button
                    className="btn btn-approve"
                    onClick={() => handleRequestAction(request.id, "approved")}
                    disabled={request.status === "approved"}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-reject"
                    onClick={() => handleRequestAction(request.id, "rejected")}
                    disabled={request.status === "rejected"}
                  >
                    Reject
                  </button>
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
