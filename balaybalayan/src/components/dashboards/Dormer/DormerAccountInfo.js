import React, { useState, useEffect } from "react";
import "./DormerAccountInfo.css";
import { db } from "../../../firebase.js";
import { doc, getDoc, updateDoc, deleteDoc, getDocs,collection } from "firebase/firestore";
import { auth } from "../../../firebase.js";
import { useNavigate } from "react-router-dom";
import EditInformationForm from "./DormerInfoEdit.js";
import DormitorySelection from "./DormitorySelection.js";

const AccountInformation = () => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [availableDormitories, setAvailableDormitories] = useState([]);
  const [selectedDorm, setSelectedDorm] = useState(null);
  const [showDormSelection, setShowDormSelection] = useState(false);
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

    const fetchDormitories = async () => {
      try {
        const dormSnapshot = await getDocs(collection(db, "dormitories"));
        setAvailableDormitories(dormSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching dormitories", error);
      }
    };

    fetchAccountInfo();
    fetchDormitories();
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

  const handleDormSelection = async (newDormId) => {
    try {
      const selectedDorm = availableDormitories.find((dorm) => dorm.id === newDormId);
      if (selectedDorm) {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          await updateDoc(docRef, { dormitoryId: selectedDorm.id });
          setSelectedDorm(selectedDorm);
          setShowDormSelection(false);
          setShowSuccessMessage(true);
          setTimeout(() => setShowSuccessMessage(false), 3000);
        }
      }
    } catch (error) {
      console.error("Error updating dormitory", error);
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
            <p><strong>Name:</strong> {accountInfo.firstName} {accountInfo.lastName}</p>
            <p><strong>Email:</strong> {accountInfo.email}</p>
            <p><strong>Address:</strong> {accountInfo.address || "N/A"}</p>
          </div>
          <div className="info-section">
            <h3>Dormitory Details</h3>
            {selectedDorm ? (
              <>
                <p><strong>Dorm Name:</strong> {selectedDorm.dormName}</p>
                <p><strong>Address:</strong> {selectedDorm.dormAddress}</p>
                <p><strong>Price Range:</strong> {selectedDorm.priceRange}</p>
              </>
            ) : (
              <p>No dormitory information available.</p>
            )}
          </div>
        </>
      )}

      {showSuccessMessage && <div className="success-message">Changes saved successfully!</div>}

      <div className="info-section">
        <button className="edit-button" onClick={handleEditToggle}>
          {isEditing ? "Cancel Edit" : "Edit Information"}
        </button>
        <button className="my-dorm-button" onClick={() => setShowDormSelection(!showDormSelection)}>
          My Dormitory
        </button>
        <button className="delete-button" onClick={handleAccountDeletion}>
          Delete My Account
        </button>
      </div>

      {showDormSelection && (
        <DormitorySelection dormitories={availableDormitories} onSelectDormitory={handleDormSelection} />
      )}

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
