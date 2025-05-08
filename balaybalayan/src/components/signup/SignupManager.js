import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { Navigate } from 'react-router-dom';
import { uploadProfilePhoto, uploadCarouselPic, uploadDormLogo } from '../../utils/firebaseStorage';
import { collection, getDocs, getDoc, doc,setDoc } from 'firebase/firestore'; 
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
  const [employmentProof, setEmploymentProof] = useState(null);


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
      if (!type) return; 

      try {
        const docRef = doc(db, 'amenities', 'amenitiesLogin'); 
        const docSnap = await getDoc(docRef); 

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAmenities(Array.isArray(data[type]?.amenities) ? data[type]?.amenities : []);
        } else {
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
      // Sign up the user and get their UID
      const userCredential = await signup(email, password, 'manager', {
        firstName,
        lastName,
        sex,
        phoneNumber,
        dob,
      });
      const userId = userCredential.user.uid;
  
      // Upload the profile photo if provided
      let profilePhotoURL = '';
      if (profilePhoto) {
        profilePhotoURL = await uploadProfilePhoto(profilePhoto, userId);
      }
  
      // Prepare user data with mandatory "manager" role
      const userData = {
        firstName,
        lastName,
        sex,
        phoneNumber,
        dob,
        profilePhotoURL,
        role: 'manager', // Add role field
        isVerified: false
      };
  
      let dormitoryId = '';
  
      // Handle existing dormitory selection
      if (!createNewDorm) {
        const selectedDorm = dormitories.find(dorm => dorm.dormName === dormName);
        if (!selectedDorm) {
          setError('Selected dormitory not found');
          return;
        }
        dormitoryId = selectedDorm.id; // Assuming each dormitory document has an `id` field
      } else {
        // Handle new dormitory creation
        dormitoryId = newDormName.toLowerCase().replace(/\s+/g, ''); // Generate ID from dorm name
  
        // Upload dormitory logo and photo
        const dormLogoURL = await handleDormLogoUpload(newDormLogo, dormitoryId);
        const dormPhotoURL = await handleCarouselUpload(newDormPhoto, dormitoryId);
  
        // Create the new dormitory document
        const newDorm = {
          dormName: newDormName,
          dormLogo: dormLogoURL,
          dormPhoto: dormPhotoURL,
          dormAddress: newDormAddress,
          priceRange: `₱${newDormPrice.min} - ₱${newDormPrice.max}`,
          description,
          amenities: selectedAmenities,
          curfew,
          type,
          id: {dormitoryId},
          path: `/dormitories/${dormitoryId}`,
        };
        await setDoc(doc(db, 'dormitories', dormitoryId), newDorm);
      }
  
      // Add dormitoryId to the user data
      userData.dormitoryId = dormitoryId;
  
      // Save user data to Firestore
      await setDoc(doc(db, 'users', userId), userData);
  
      // Redirect to the dashboard
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
      <div className="particles">
        {[...Array(100)].map((_, index) => (
          <div 
            key={index} 
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${15 + Math.random() * 15}s`,
              animationDelay: `-${Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      <h1>Sign up | Dorm Manager</h1>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSignUp}>
        <div className="form-row">
          <div className="form-group">
            <label className="input-label">First Name:</label>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="input-label">Last Name:</label>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="input-label">Sex:</label>
          <select value={sex} onChange={(e) => setSex(e.target.value)} required>
            <option value="">Select sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="input-label">Email Address:</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="input-label">Phone Number:</label>
          <input
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="input-label">Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="input-label">Confirm Password:</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="input-label">Date of Birth:</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>

        <div className="upload-section">
          <h4 className="labels">Upload Profile Photo:</h4>
          <div 
            className={`upload-box ${profilePhoto ? 'has-file' : ''}`}
            data-file-name={profilePhoto?.name || ''}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files[0])}
            />
          </div>
        </div>

        <div className="upload-section">
          <h4 className="labels">Upload Proof of Employment:</h4>
          <div 
            className={`upload-box ${employmentProof ? 'has-file' : ''}`}
            data-file-name={employmentProof?.name || ''}
          >
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={(e) => setEmploymentProof(e.target.files[0])}
              required
            />
          </div>
          <small className="hint-text">Upload a valid ID, certificate, or any document proving your employment at the dormitory</small>
        </div>

        {!createNewDorm ? (
          <div className="form-group">
            <label className="input-label">Select Dormitory:</label>
            <select value={dormName} onChange={(e) => setDormName(e.target.value)} required>
              <option value="">Choose the dorm you're currently managing</option>
              {dormitories.map(dorm => (
                <option key={dorm.dormName} value={dorm.dormName}>
                  {dorm.dormName}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label className="input-label">Dormitory Name:</label>
              <input
                type="text"
                placeholder="Dormitory Name"
                value={newDormName}
                onChange={(e) => setNewDormName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="input-label">Dormitory Address:</label>
              <input
                type="text"
                placeholder="Dormitory Address"
                value={newDormAddress}
                onChange={(e) => setNewDormAddress(e.target.value)}
                required
              />
            </div>

            <div className="upload-section">
              <h4 className="labels">Upload Dormitory Logo:</h4>
              <div 
                className={`upload-box ${newDormLogo ? 'has-file' : ''}`}
                data-file-name={newDormLogo?.name || ''}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewDormLogo(e.target.files[0])}
                />
              </div>
            </div>

            <div className="upload-section">
              <h4 className="labels">Upload Dormitory Photo:</h4>
              <div 
                className={`upload-box ${newDormPhoto ? 'has-file' : ''}`}
                data-file-name={newDormPhoto?.name || ''}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewDormPhoto(e.target.files[0])}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="input-label">Price Range:</label>
              <div className="price-row">
                <div className="price-input">
                  <span>₱</span>
                  <input
                    type="number"
                    placeholder="Minimum Price"
                    value={newDormPrice.min}
                    onChange={(e) => setNewDormPrice(prev => ({ ...prev, min: e.target.value }))}
                    required
                  />
                </div>
                <div className="price-input">
                  <span>₱</span>
                  <input
                    type="number"
                    placeholder="Maximum Price"
                    value={newDormPrice.max}
                    onChange={(e) => setNewDormPrice(prev => ({ ...prev, max: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="input-label">Description:</label>
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="description-input"
              />
            </div>

            <div className="form-group">
              <label className="input-label">Dormitory Type:</label>
              <select value={type} onChange={(e) => setType(e.target.value)} required>
                <option value="">Select Dormitory Type</option>
                <option value="Private">Private</option>
                <option value="University">University</option>
              </select>
            </div>

            {type && amenities.length > 0 && (
              <div className="form-group">
                <label className="input-label">Amenities:</label>
                <div className="amenities-grid">
                  {amenities.map((amenity, index) => (
                    <label key={index} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAmenities(prev => [...prev, amenity]);
                          } else {
                            setSelectedAmenities(prev => 
                              prev.filter(selected => selected !== amenity)
                            );
                          }
                        }}
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="input-label">Curfew:</label>
              <select value={curfew} onChange={(e) => setCurfew(e.target.value)} required>
                <option value="">Select Curfew</option>
                <option value="9 PM">9 PM</option>
                <option value="10 PM">10 PM</option>
                <option value="11 PM">11 PM</option>
                <option value="12 PM">12 PM</option>
                <option value="None">None</option>
              </select>
            </div>
          </>
        )}

        <button
          type="button"
          className="toggle-btn"
          onClick={() => setCreateNewDorm(!createNewDorm)}
        >
          {createNewDorm ? 'Cancel Dormitory Creation' : 'Create New Dormitory'}
        </button>

        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpManager;
