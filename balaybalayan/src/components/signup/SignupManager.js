import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { Navigate } from 'react-router-dom';
import { uploadProfilePhoto } from '../../utils/firebaseStorage';
import { collection, addDoc, getDocs,doc,setDoc } from 'firebase/firestore'; 
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
  const [newDormPrice, setNewDormPrice] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState('');
  const [curfew, setCurfew] = useState('');
  const [type, setType] = useState('');

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
        const newDorm = {
          dormName: newDormName,
          dormLogo: newDormLogo,
          dormPhoto: newDormPhoto,
          dormAddress: newDormAddress,
          priceRange: newDormPrice,
          description,
          amenities,
          curfew,
          type,
          path: `/dormitories/${newDormName.toLowerCase().replace(/\s+/g, '')}`,
        };

        // Create the new dormitory document
        await addDoc(collection(db, 'dormitories'), newDorm);
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

        {/* Upload Profile Photo */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePhoto(e.target.files[0])}
        />

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
            <input
              type="text"
              placeholder="Dormitory Price Range"
              value={newDormPrice}
              onChange={(e) => setNewDormPrice(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="text"
              placeholder="Amenities"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
            />
            <input
              type="text"
              placeholder="Curfew"
              value={curfew}
              onChange={(e) => setCurfew(e.target.value)}
            />
            <input
              type="text"
              placeholder="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
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
