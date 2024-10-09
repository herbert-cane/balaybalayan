import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from './firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (uid) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? userDoc.data().role : null;
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userRole = await fetchUserRole(userCredential.user.uid);
      setUser(userCredential.user);
      setRole(userRole);
      //LOCAL STORAGE
      localStorage.setItem('user', JSON.stringify(userCredential.user));
      localStorage.setItem('role', userRole);
      return userCredential;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (email, password, role, userData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
        setRole(role); 

        await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: email,
            role: role, 
            ...userData, 
        });
        
        return userCredential;
    } catch (error) {
        console.error("Signup error:", error);
        throw error;
    }
};


  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRole = await fetchUserRole(currentUser.uid);
        setRole(userRole);

        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('role', userRole);
      } else {
        setUser(null);
        setRole(null);

        localStorage.removeItem('user');
        localStorage.removeItem('role');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ login, signup, logout, user, role }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
