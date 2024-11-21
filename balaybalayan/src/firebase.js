// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Import dormitories data
import dormitories from './dormitories'; // Hello, ga work ni siya i dunno why ga error, pero its working fine -Adrian

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Function to populate Firestore with dormitory data
const populateDatabase = async () => {
  try {
    for (const dorm of dormitories) {
      const dormRef = doc(db, "dormitories", dorm.id); // Create a document with a specific ID
      await setDoc(dormRef, dorm);
      console.log(`Dorm ${dorm.dormName} added successfully!`);
    }
    console.log("All dormitories added!");
  } catch (error) {
    console.error("Error adding dormitories: ", error);
  }
};

// Debugging logs to confirm initialization
console.log("Firebase initialized:", app);
console.log("Firestore initialized:", db);
console.log("Auth initialized:", auth);
console.log("Storage initialized:", storage);

// Populate the database with dormitory data
populateDatabase();

// Export services for use in other parts of the app
export { db, auth, storage };
