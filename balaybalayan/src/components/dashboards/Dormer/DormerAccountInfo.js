import React, { useState, useEffect } from "react";
import "./DormerAccountInfo.css";
import { db } from "../../../firebase.js";
import { doc, getDoc, updateDoc, deleteDoc, getDocs,collection } from "firebase/firestore";
import { auth } from "../../../firebase.js";
import { useNavigate } from "react-router-dom";
import EditInformationForm from "./DormerInfoEdit.js";

const AccountInformation = () => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDorm, setSelectedDorm] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setAccountInfo(userData);
            if (userData.dormitoryId) {
              const dormRef = doc(db, "dormitories", userData.dormitoryId);
              const dormSnap = await getDoc(dormRef);
              if (dormSnap.exists()) {
                setSelectedDorm(dormSnap.data());
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching account info", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleEditSave = async (updatedInfo) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, updatedInfo);
        setAccountInfo(updatedInfo);
        setIsEditing(false);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000); // Hide message after 3 seconds
      }
    } catch (error) {
      console.error("Error updating information", error);
    }
  };

  const handleAccountDeletion = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmAccountDeletion = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        await deleteDoc(docRef);
        await user.delete();
        alert("Account deleted successfully.");
        navigate("/");
      } catch (error) {
        console.error("Error deleting account", error);
      }
    }
  };

  const cancelAccountDeletion = () => {
    setShowDeleteConfirmation(false);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!accountInfo) return <div className="error">Unable to load account info.</div>;

  return (
    <div className="account-info-container">
      <h2>Account Information</h2>
      {isEditing ? (
        <EditInformationForm accountInfo={accountInfo} onSave={handleEditSave} onCancel={handleEditToggle} />
      ) : (
        <>
          <div className="info-section">
            <h3>Personal Details</h3>
            <p><strong>Name:</strong> {accountInfo.firstName || "N/A"} {accountInfo.lastName || "N/A"}</p>
            <p><strong>Email:</strong> {auth.currentUser?.email || "N/A"}</p>
            <p><strong>Address:</strong> {accountInfo.address || "N/A"}</p>
          </div>

          <div className="info-section">
            <h3>Emergency Contact Information</h3>
            <p><strong>Name:</strong> {accountInfo.emergencyContact?.firstName || "N/A"} {accountInfo.emergencyContact?.lastName || "N/A"}</p>
            <p><strong>Contact Number:</strong> {accountInfo.emergencyContact?.phone || "N/A"}</p>
          </div>

          <div className="info-section">
            <h3>Dormitory Details</h3>
            {selectedDorm ? (
              <>
                <p><strong>Dorm Name:</strong> {selectedDorm.dormName || "N/A"}</p>
                <p><strong>Address:</strong> {selectedDorm.dormAddress || "N/A"}</p>
                <p><strong>Price Range:</strong> {selectedDorm.priceRange || "N/A"}</p>
              </>
            ) : (
              <p>No dormitory information available.</p>
            )}
          </div>
        </>
      )}

      {showSuccessMessage && <div className="success-message">Changes saved successfully!</div>}

      <div className="info-section button-container">
        <button className="edit-button" onClick={handleEditToggle}>
          {isEditing ? "Cancel Edit" : "Edit Information"}
        </button>
        <button className="delete-button" onClick={handleAccountDeletion}>
          Delete My Account
        </button>
      </div>

      {showDeleteConfirmation && (
        <div className="confirmation-modal">
          <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          <button onClick={confirmAccountDeletion} className="delete-button">Yes, Delete</button>
          <button onClick={cancelAccountDeletion} className="edit-button">Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AccountInformation;
