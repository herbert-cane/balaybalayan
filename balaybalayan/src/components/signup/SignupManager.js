import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { Navigate } from 'react-router-dom';
import { uploadProfilePhoto } from '../../utils/firebaseStorage';
import { collection, addDoc, getDocs, getDoc, doc,setDoc } from 'firebase/firestore'; 
import { uploadProfilePhoto, uploadCarouselPic, uploadDormLogo } from '../../utils/firebaseStorage';
import { collection, getDocs,doc,setDoc } from 'firebase/firestore'; 
import { db } from '../../firebase'; 
import './signUpUser.css'; 

const SignUpManager = () => {
  const { signup, user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sex, setSex] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [dormName, setDormName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [dormitories, setDormitories] = useState([]);
  const [createNewDorm, setCreateNewDorm] = useState(false);  // State for creating new dormitory
  const [newDormName, setNewDormName] = useState('');
  const [newDormLogo, setNewDormLogo] = useState('');
  const [newDormPhoto, setNewDormPhoto] = useState(null);
  const [newDormAddress, setNewDormAddress] = useState('');
  const [newDormPrice, setNewDormPrice] = useState({ min: "", max: "" });
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [curfew, setCurfew] = useState('');
  const [type, setType] = useState('');


  // Photo uploads

  const handleCarouselUpload= async (file, dormId) => {
    if (file) {
      const photoPath = `${dormId}Pic.png`;
      const photoURL = await uploadCarouselPic(file, photoPath); // Reuse upload function
      return photoURL;
    }
    return '';
  };
  
  const handleDormLogoUpload = async (file, dormId) => {
    if (file) {
      const logoPath = `${dormId}Logo.png`;
      const logoURL = await uploadDormLogo(file, logoPath); // Reuse upload function
      return logoURL;
    }
    return '';
  };

  // Fetch dormitories from Firestore
  useEffect(() => {
    const fetchDormitories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'dormitories'));
        const dorms = querySnapshot.docs.map(doc => doc.data());
        setDormitories(dorms); 
      } catch (error) {
        console.error("Error fetching dormitories:", error);
      }
    };

    fetchDormitories();
  }, []);

  // Fetch amenities based on dorm type
  useEffect(() => {
    const fetchAmenities = async () => {
      if (!type) return; // Don't fetch if type is not selected

      try {
        const docRef = doc(db, 'amenities', 'amenitiesLogin'); // Reference the document
        const docSnap = await getDoc(docRef); // Fetch the document

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log('Fetched data:', data[type]?.amenities);
          setAmenities(Array.isArray(data[type]?.amenities) ? data[type]?.amenities : []);
        } else {
          console.error('No such document!');
          setAmenities([]);
        }
      } catch (error) {
        console.error('Error fetching amenities:', error);
      }
    };

    fetchAmenities();
  }, [type]);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password.length < 6) { 
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const userCredential = await signup(email, password, 'manager', {
          firstName,
          lastName,
          sex,
          phoneNumber,
          dormName,
          profilePhotoURL: '', 
          dob,
      });
      
      const userId = userCredential.user.uid;
  
      let profilePhotoURL = '';
      if (profilePhoto) {
          profilePhotoURL = await uploadProfilePhoto(profilePhoto, userId);
          await setDoc(doc(db, 'users', userId), { profilePhotoURL }, { merge: true });
      }
  
      await setDoc(doc(db, 'users', userId), { profilePhotoURL }, { merge: true });

      // Handle new dormitory creation if selected
      if (createNewDorm) {
        const newDormId = newDormName.toLowerCase().replace(/\s+/g, ''); // Generate ID from dorm name

         // Handle uploads for dorm logo and photo
        const dormLogoURL = await handleDormLogoUpload(newDormLogo, newDormId);
        const dormPhotoURL = await handleCarouselUpload(newDormPhoto, newDormId);
        const newDorm = {
          dormName: newDormName,
          dormLogo: dormLogoURL,
          dormPhoto: dormPhotoURL,
          dormAddress: newDormAddress,
          priceRange: `₱${newDormPrice.min} - ₱${newDormPrice.max}`, // Format price range
          description,
          amenities: selectedAmenities,
          curfew,
          type,
          path: `/dormitories/${newDormId}`,
        };
      
        // Create the new dormitory document with custom ID
        await setDoc(doc(db, 'dormitories', newDormId), newDorm);
      }
      
      setRedirect(true);
    } catch (error) {
      setError(error.message);
    }
  };

  if (user && redirect) {
    return <Navigate to="/dorm-manager" replace />;
  }

  return (
    <div className="container">
      <h1>Sign up | Dorm Manager</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSignUp}>
        {/* Form for personal details */}
        <div className="form-row">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <select value={sex} onChange={(e) => setSex(e.target.value)} required>
          <option value="">Sex</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        
        {/* Date of Birth field */}
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />

        <div className="upload-section">
          <h4>Profile Photo:</h4>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
          />
        </div>


        {/* Dormitory selection or creation */}
        {!createNewDorm ? (
          <select value={dormName} onChange={(e) => setDormName(e.target.value)} required>
            <option value="">Choose the dorm you're currently managing:</option>
            {dormitories.map(dorm => (
              <option key={dorm.dormName} value={dorm.dormName}>
                {dorm.dormName}
              </option>
            ))}
          </select>
        ) : (
          <>
           
            <input
              type="text"
              placeholder="Dormitory Name"
              value={newDormName}
              onChange={(e) => setNewDormName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Dormitory Address"
              value={newDormAddress}
              onChange={(e) => setNewDormAddress(e.target.value)}
              required
            />
            <div className="upload-section">
              <h4>Dormitory Logo:</h4>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewDormLogo(e.target.files[0])}
              />
            </div>

            <div className="upload-section">
              <h4>Dormitory Photo:</h4>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewDormPhoto(e.target.files[0])}
              />
            </div>
            <div className="form-row price-row">
              <div className="price-input">
                <span>₱</span>
                <input
                  type="number"
                  placeholder="Minimum Price"
                  value={newDormPrice.min}
                  onChange={(e) =>
                    setNewDormPrice((prev) => ({ ...prev, min: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="price-input">
                <span>₱</span>
                <input
                  type="number"
                  placeholder="Maximum Price"
                  value={newDormPrice.max}
                  onChange={(e) =>
                    setNewDormPrice((prev) => ({ ...prev, max: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="text"
              placeholder="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
            {/* Type Selection */}
            <select value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="">Select Dormitory Type</option>
              <option value="Private">Private</option>
              <option value="University">University</option>
            </select>

            {/* Amenities Dropdown */}
            {type && (
              <div>
                <label>Amenities</label>
                {amenities.length > 0 ? (
                  <div className="amenities-dropdown">
                    {amenities.map((amenity, index) => (
                      <label key={index} className="checkbox-label">
                        <input
                          type="checkbox"
                          value={amenity}
                          checked={selectedAmenities.includes(amenity)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAmenities((prev) => [...prev, amenity]);
                            } else {
                              setSelectedAmenities((prev) =>
                                prev.filter((selected) => selected !== amenity)
                              );
                            }
                          }}
                        />
                        {amenity}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p>No amenities available for the selected type.</p>
                )}
              </div>
            )}
            <input
              type="text"
              placeholder="Curfew"
              placeholder="Amenities"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
            />
            <select
              value={curfew}
              onChange={(e) => setCurfew(e.target.value)}
              required
            >
              <option value="">Select Curfew</option>
              <option value="9 PM">9 PM</option>
              <option value="10 PM">10 PM</option>
              <option value="11 PM">11 PM</option>
              <option value="12 PM">12 PM</option>
              <option value="None">None</option>
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="">Select Dormitory Type</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </>
        )}

        {/* Button to toggle creation of new dormitory */}
        <button
          type="button"
          onClick={() => setCreateNewDorm(!createNewDorm)}
        >
          {createNewDorm ? 'Cancel Dormitory Creation' : 'Create New Dormitory'}
        </button>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpManager;
