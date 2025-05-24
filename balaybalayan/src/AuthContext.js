import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user object
  const [role, setRole] = useState(null); // User role (e.g., admin, manager)
  const [dormitoryId, setDormitoryId] = useState(null); // Associated dormitory ID
  const [loading, setLoading] = useState(true); // Loading state for auth operations
  const [isVerified, setIsVerified] = useState(true); // Default to true to avoid flashing Pending page

  // Fetch user role from Firestore
  const fetchUserRole = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data().role : null;
  };

  // Fetch user dormitory ID from Firestore
  const fetchDormitoryId = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data().dormitoryId : null;
  };

  // Login function
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = userCredential.user;

      const userRole = await fetchUserRole(uid);
      const userDormitoryId = await fetchDormitoryId(uid);
      const userVerified = await fetchIsVerified(uid);

      setUser(userCredential.user);
      setRole(userRole);
      setDormitoryId(userDormitoryId);
      setIsVerified(userVerified);

      // Save data to localStorage
      localStorage.setItem("user", JSON.stringify(userCredential.user));
      localStorage.setItem("role", userRole);
      localStorage.setItem("dormitoryId", userDormitoryId);
      localStorage.setItem("isVerified", userVerified);

      return userCredential;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Signup function
  const signup = async (email, password, role, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = userCredential.user;

      setUser(userCredential.user);
      setRole(role);

      // Save user data to Firestore
      await setDoc(doc(db, "users", uid), {
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

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
      setDormitoryId(null);

      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("dormitoryId");
      localStorage.removeItem("isVerified");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchIsVerified = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data().isVerified ?? true : true; // default true
  };

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userRole = await fetchUserRole(currentUser.uid);
        const userDormitoryId = await fetchDormitoryId(currentUser.uid);
        const userVerified = await fetchIsVerified(currentUser.uid);

        setRole(userRole);
        setDormitoryId(userDormitoryId);
        setIsVerified(userVerified);

        // Save data to localStorage
        localStorage.setItem("user", JSON.stringify(currentUser));
        localStorage.setItem("role", userRole);
        localStorage.setItem("dormitoryId", userDormitoryId);
        localStorage.setItem("isVerified", userVerified);
      } else {
        setUser(null);
        setRole(null);
        setDormitoryId(null);

        // Clear localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("dormitoryId");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ login, signup, logout, user, role, dormitoryId, isVerified }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
