// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


// Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyCcXzRUkO2wgNlUXKq9Kt5kliyMpJERrYM",

  authDomain: "balay-balayan-b6fba.firebaseapp.com",

  projectId: "balay-balayan-b6fba",

  storageBucket: "balay-balayan-b6fba.appspot.com",

  messagingSenderId: "236004704530",

  appId: "1:236004704530:web:aca3fe51b6464c35ac33cb"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


// Debugging logs to confirm initialization
console.log("Firebase initialized:", app);
console.log("Firestore initialized:", db);
console.log("Auth initialized:", auth);
console.log("Storage initialized:", storage);

// Export services for use in other parts of the app
export { db, auth, storage, doc, setDoc, getDocs, collection };
