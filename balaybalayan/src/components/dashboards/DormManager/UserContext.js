import React, { createContext, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';  // Make sure the path to your firebase config is correct

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dormitoryId, setDormitoryId] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (loggedInUser) => {
      if (loggedInUser) {
        setUser(loggedInUser);

        // Fetch dormitoryId from Firestore (or any other method)
        const userDocRef = doc(db, 'users', loggedInUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDormitoryId(userData.dormitoryId);  // Assuming dormitoryId is saved in user's document
        }
      } else {
        setUser(null);
        setDormitoryId(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, dormitoryId }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };