import React, { useState, useEffect } from "react";
import "./DormerAccountInfo.css";
import { db } from "../../../firebase.js";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getDocs, collection } from "firebase/firestore";
import { auth } from "../../../firebase.js";
import { useNavigate } from "react-router-dom";
import EditInformationForm from "./DormerInfoEdit.js";
import DormitorySelection from "./DormitorySelection.js";

const AccountInformation = () => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Toggles edit form visibility
  const [availableDormitories, setAvailableDormitories] = useState([]); // Dormitory options
  const [selectedDorm, setSelectedDorm] = useState(null); // User-selected dormitory
  const [showDormSelection, setShowDormSelection] = useState(false); // Toggle dormitory selection UI

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
      
              // Fetch dormitory details using dormitoryId
              if (userData.dormitoryId) {
                const dormRef = doc(db, "dormitories", userData.dormitoryId);
                const dormSnap = await getDoc(dormRef);
                if (dormSnap.exists()) {
                  setSelectedDorm(dormSnap.data());
                } else {
                  console.error("Dormitory not found for the provided ID.");
                  setSelectedDorm(null);
                }
              }
            } else {
              console.error("No account information found!");
            }
          } else {
            console.error("User is not logged in.");
          }
        } catch (error) {
          console.error("Error fetching account information:", error);
        } finally {
          setLoading(false);
        }
      };
      

    const fetchDormitories = async () => {
      try {
        const dormSnapshot = await getDocs(collection(db, "dormitories"));
        setAvailableDormitories(
          dormSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.error("Error fetching dormitories:", error);
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
        alert("Information updated successfully!");
      }
    } catch (error) {
      console.error("Error updating information:", error);
    }
  };

  const handleDormSelection = async (newDormId) => {
    try {
      const selectedDorm = availableDormitories.find((dorm) => dorm.id === newDormId);
      if (!selectedDorm) {
        alert("Selected dormitory not found.");
        return;
      }
  
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        // Store only the dormitory ID in the user's document
        await updateDoc(docRef, { dormitoryId: selectedDorm.id });
        setSelectedDorm(selectedDorm); // Update local state for immediate UI feedback
        alert("Dormitory updated successfully!");
        setShowDormSelection(false); // Close the dormitory selection UI
      }
    } catch (error) {
      console.error("Error updating dormitory:", error);
      alert("Failed to update dormitory. Please try again.");
    }
  };

  const handleAccountDeletion = async () => {
    const confirmDeletion = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmDeletion) {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          await deleteDoc(docRef);
          await user.delete();
          alert("Account deleted successfully.");
          navigate("/"); // Redirect to home page after account deletion
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account.");
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading account information...</div>;
  }

  if (!accountInfo) {
    return <div className="error">Unable to load account information.</div>;
  }

  return (
    <div className="account-info-container expanded">
      <h2>Account Information</h2>
      {isEditing ? (
        <EditInformationForm
          accountInfo={accountInfo}
          onSave={handleEditSave}
          onCancel={handleEditToggle}
        />
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
      <div className="info-section">
        <button className="edit-button" onClick={handleEditToggle}>
          {isEditing ? "Cancel Edit" : "Edit Information"}
        </button>
        <button
          className="my-dorm-button"
          onClick={() => setShowDormSelection(!showDormSelection)}
        >
          My Dormitory
        </button>
        <button className="delete-button" onClick={handleAccountDeletion}>
          Delete My Account
        </button>
      </div>
      {showDormSelection && (
        <DormitorySelection
          dormitories={availableDormitories}
          onSelectDormitory={handleDormSelection}
        />
      )}
    </div>
  );
};

export default AccountInformation;
