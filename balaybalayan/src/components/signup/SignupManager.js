import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { Navigate } from 'react-router-dom';
import { uploadProfilePhoto } from '../../utils/firebaseStorage';
import { doc, setDoc } from 'firebase/firestore'; 
import { db } from '../../firebase'; 

const SignUpManager = () => {
  const { signup, user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sex, setSex] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dormName, setDormName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);

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
      });
      
      const userId = userCredential.user.uid;
  
     
      let profilePhotoURL = '';
      if (profilePhoto) {
          profilePhotoURL = await uploadProfilePhoto(profilePhoto, userId);
          await setDoc(doc(db, 'users', userId), { profilePhotoURL }, { merge: true });
      }
  
      await setDoc(doc(db, 'users', userId), { profilePhotoURL }, { merge: true });
  
      setRedirect(true);
  } catch (error) {
      setError(error.message);
  }
}

  if (user && redirect) {
    return <Navigate to="/dorm-manager" replace />;
  }

  return (
    <div>
      <h1>Sign up | Dorm Manager</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSignUp}>
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
        {/* profile photo */}
        <input 
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePhoto(e.target.files[0])}
        />
        <select value={dormName} onChange={(e) => setDormName(e.target.value)} required>
          <option value="">Select Dorm Name</option>
          <option value="E&T">E&T Dormitelle</option>
          <option value="Nochete">Nochete's</option>
          <option value="BlueHouse">Blue House</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpManager;
