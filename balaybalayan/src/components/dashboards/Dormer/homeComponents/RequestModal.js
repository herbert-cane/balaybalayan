import React, { useState } from 'react';
import { db, auth } from '../../../../firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';

const RequestModal = ({ 
  selectedRequestType, 
  isOpen, 
  onClose 
}) => {
  const [requestDescription, setRequestDescription] = useState("");

  const createRequest = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().dormitoryId) {
          const dormitoryId = userDoc.data().dormitoryId;

          // Create a new request document in the dormitory's requests collection
          await addDoc(collection(db, "dormitories", dormitoryId, "requests"), {
            type: selectedRequestType,
            description: requestDescription,
            status: "Pending",
            userId: user.uid,
            userName: user.lastName || "Anonymous",
            createdAt: new Date()
          });

          // Reset form and close modal
          setRequestDescription("");
          onClose();

          // Optional: Show a success message
          alert("Request submitted successfully!");
        }
      }
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Failed to submit request. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="request-modal">
      <div className="request-modal-content">
        <h3>Submit {selectedRequestType} Request</h3>
        <textarea
          placeholder="Please describe your request in detail"
          value={requestDescription}
          onChange={(e) => setRequestDescription(e.target.value)}
          rows="4"
        />
        <div className="modal-buttons">
          <button onClick={createRequest}>Submit Request</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;