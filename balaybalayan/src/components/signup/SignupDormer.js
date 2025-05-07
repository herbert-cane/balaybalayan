import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { Navigate } from 'react-router-dom';
import { uploadProfilePhoto, uploadForm5 } from '../../utils/firebaseStorage';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import './signUpUser.css';

const SignUpDormer = () => {
  const { signup, user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sex, setSex] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dormName, setDormName] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [emergencyContactFirstName, setEmergencyContactFirstName] = useState('');
  const [emergencyContactLastName, setEmergencyContactLastName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [dormitories, setDormitories] = useState([]);
  const [dormitoryId, setDormitoryId] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [course, setCourse] = useState('');
  const [college, setCollege] = useState('');
  const [form5, setForm5] = useState(null);
  const [form5Error, setForm5Error] = useState('');

  const validateForm5 = (file) => {
    if (file) {
      if (file.type !== 'application/pdf') {
        setForm5Error('Please upload a PDF file');
        return false;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB in bytes
        setForm5Error('File size should be less than 2MB');
        return false;
      }
      setForm5Error('');
      return true;
    }
    return false;
  };

  // Fetch dormitories from Firestore
  useEffect(() => {
    const fetchDormitories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'dormitories'));
        const dorms = querySnapshot.docs.map(doc => ({
          dormName: doc.data().dormName,
          dormitoryId: doc.id,  // Save the dormitoryId here
        }));
        setDormitories(dorms);
      } catch (error) {
        console.error("Error fetching dormitories:", error);
      }
    };

    fetchDormitories();
  }, []);
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!validateForm5(form5)) {
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    try {
      // Create the new dormer user
      const userCredential = await signup(email, password, 'dormer', {
        firstName,
        lastName,
        sex,
        phoneNumber,
        dormName,
        dormitoryId,  // Save dormitoryId as part of the user
        moveInDate,
        studentNumber,
        course,
        college,
        emergencyContact: {
          firstName: emergencyContactFirstName,
          lastName: emergencyContactLastName,
          phone: emergencyContactPhone,
        },
        profilePhotoURL: '',
        form5URL: '',  // Initialize form5URL
        isDormer: true  // Add this new field
      });
  
      const userId = userCredential.user.uid;
  
      // Upload the profile photo if provided
      let profilePhotoURL = '';
      if (profilePhoto) {
        profilePhotoURL = await uploadProfilePhoto(profilePhoto, userId);
      }

      // Upload Form5 PDF
      let form5URL = '';
      if (form5) {
        form5URL = await uploadForm5(form5, userId);
      }
  
      // Update the user profile with all URLs
      await setDoc(doc(db, 'users', userId), {
        profilePhotoURL,
        form5URL,
        studentNumber,
        course,
        college
      }, { merge: true });
  
      setRedirect(true);
    } catch (error) {
      setError(error.message);
    }
  };
  
  if (user && redirect) {
    return <Navigate to="/dormers" replace />;
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
      <h1>Sign up | Dormer</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
        <div className="upload-section">
          <h4 className='labels'>Upload Profile Photo:</h4>
          <div 
            className={`upload-box ${profilePhoto ? 'has-file' : ''}`}
            data-file-name={profilePhoto?.name || ''}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setProfilePhoto(file);
                }
              }}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="input-label">Student Number:</label>
          <input
            type="number"
            placeholder="Enter your student number"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="input-label">Course:</label>
          <input
            type="text"
            placeholder="Enter your course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="input-label">College:</label>
          <input
            type="text"
            placeholder="Enter your college"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="input-label">Form 5 (PDF only, max 2MB):</label>
          <div className={`upload-box ${form5 ? 'has-file' : ''}`}>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                if (validateForm5(file)) {
                  setForm5(file);
                }
              }}
              required
            />
          </div>
          {form5Error && <p className="error-message">{form5Error}</p>}
        </div>

        <label className="input-label">Select Dormitory:</label>
        <select value={dormName} onChange={(e) => {
          const selectedDorm = dormitories.find(dorm => dorm.dormName === e.target.value);
          setDormName(e.target.value);
          setDormitoryId(selectedDorm.dormitoryId);  // Set dormitoryId for querying rooms
        }} required>
          <option className='labels' value="">Choose the dorm you're currently staying at:</option>
          {dormitories.map(dorm => (
            <option key={dorm.dormitoryId} value={dorm.dormName}>
              {dorm.dormName}
            </option>
          ))}
        </select>
        <h3 className='labels'>Moving in Date:</h3>
        <input
          type="date"
          placeholder="Move-in Date"
          value={moveInDate}
          onChange={(e) => setMoveInDate(e.target.value)}
          required
        />
        <h3 className='labels'>Emergency Contact:</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="First Name"
            value={emergencyContactFirstName}
            onChange={(e) => setEmergencyContactFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={emergencyContactLastName}
            onChange={(e) => setEmergencyContactLastName(e.target.value)}
            required
          />
        </div>
        <input
          type="tel"
          placeholder="Phone Number"
          value={emergencyContactPhone}
          onChange={(e) => setEmergencyContactPhone(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpDormer;