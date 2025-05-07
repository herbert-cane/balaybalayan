import React, { useState } from 'react';
import { auth } from '../../../firebase';
import { uploadProfilePhoto } from '../../../utils/firebaseStorage';
import './DormerInfoEdit.css';

const EditInformationForm = ({ accountInfo, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: accountInfo.firstName || '',
    lastName: accountInfo.lastName || '',
    phoneNumber: accountInfo.phoneNumber || '',
    address: accountInfo.address || '',
    emergencyContact: {
      firstName: accountInfo.emergencyContact?.firstName || '',
      lastName: accountInfo.emergencyContact?.lastName || '',
      phone: accountInfo.emergencyContact?.phone || ''
    }
  });

  const [newProfilePhoto, setNewProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(accountInfo.profilePhotoURL || '');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('emergency.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedData = { ...formData };
      
      if (newProfilePhoto) {
        const photoURL = await uploadProfilePhoto(newProfilePhoto, auth.currentUser.uid);
        updatedData.profilePhotoURL = photoURL;
      }
      
      onSave(updatedData);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-form">
      <div className="photo-edit-section">
        <img 
          src={photoPreview || 'default-profile-image.jpg'} 
          alt="Profile Preview" 
          className="profile-preview"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="photo-input"
        />
      </div>

      <div className="form-section">
        <h3>Personal Information</h3>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Emergency Contact</h3>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="emergency.firstName"
            value={formData.emergencyContact.firstName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="emergency.lastName"
            value={formData.emergencyContact.lastName}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            name="emergency.phone"
            value={formData.emergencyContact.phone}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="save-button">Save Changes</button>
        <button type="button" onClick={onCancel} className="cancel-button">Cancel</button>
      </div>
    </form>
  );
};

export default EditInformationForm;