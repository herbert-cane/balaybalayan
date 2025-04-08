import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { Navigate } from 'react-router-dom';
import { uploadProfilePhoto } from '../../utils/firebaseStorage';
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
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [dormitoryId, setDormitoryId] = useState('');

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

// Fetch available rooms when a dormitory is selected
useEffect(() => {
  if (dormitoryId) {
    console.log("Fetching rooms for dormitoryId:", dormitoryId);  // Debugging log
    const fetchRooms = async () => {
      try {
        const roomQuery = query(
          collection(db, 'dormitories', dormitoryId, 'rooms'),
          where('status', '==', 'Available')
        );
        const querySnapshot = await getDocs(roomQuery);

        // Check if the querySnapshot is empty
        if (querySnapshot.empty) {
          console.log("No available rooms found.");
          setRooms([]);  // No rooms available
        } else {
          // Extract room data correctly
          const availableRooms = querySnapshot.docs.map(doc => ({
            id: doc.id,  // roomID
            name: doc.data().name  // Room name
          }));

          // Sort the rooms by the room number extracted from the name
          const sortedRooms = availableRooms.sort((a, b) => {
            const roomA = a.name.match(/(\d+)/);
            const roomB = b.name.match(/(\d+)/);

            if (roomA && roomB) {
              return parseInt(roomA[0]) - parseInt(roomB[0]);
            }
            return 0;  // If no number is found, leave them in the current order
          });

          console.log("Available rooms (sorted):", sortedRooms);  // Debugging log
          setRooms(sortedRooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }
}, [dormitoryId]);  // Fetch rooms whenever the dormitoryId changes
  
  const handleSignUp = async (e) => {
    e.preventDefault();
  
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
        emergencyContact: {
          firstName: emergencyContactFirstName,
          lastName: emergencyContactLastName,
          phone: emergencyContactPhone,
        },
        profilePhotoURL: '',
        room: selectedRoom, // Save selected room
      });
  
      const userId = userCredential.user.uid;
  
      // Upload the profile photo if provided
      let profilePhotoURL = '';
      if (profilePhoto) {
        profilePhotoURL = await uploadProfilePhoto(profilePhoto, userId);
        await setDoc(doc(db, 'users', userId), { profilePhotoURL }, { merge: true });
      }
  
    // After signing up the user and selecting a room
    if (selectedRoom && dormitoryId) {
      const roomRef = doc(db, 'dormitories', dormitoryId, 'rooms', selectedRoom); // Use roomID (not room name)

      try {
        // Add dormer's user ID to the room's dormers subcollection
        await setDoc(
          roomRef,
          {
            dormers: [userId]  // Add dormer's userId to the dormers array
          },
          { merge: true }
        );
        console.log("Dormer added to room:", selectedRoom);
      } catch (error) {
        console.error("Error adding dormer to room:", error);
      }
    }
  
      // Update the user profile in the users collection
      await setDoc(doc(db, 'users', userId), { profilePhotoURL }, { merge: true });
  
      // Redirect the user after successful signup
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
        <label className="input-label">Select Room:</label>
        <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} required>
          <option className='labels' value="">Choose a room:</option>
          {rooms.length > 0 ? (
            rooms.map((room, index) => (
              <option key={index} value={room.id}>  {/* Use roomID here */}
                {room.name}
              </option>
            ))
          ) : (
            <option disabled>No available rooms</option>
          )}
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