import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqIu14oEtPssODmP0aowDtFQ1LSWTzBuk",
  authDomain: "rupay-tracker.firebaseapp.com",
  projectId: "rupay-tracker",
  storageBucket: "rupay-tracker.firebasestorage.app",
  messagingSenderId: "334223899163",
  appId: "1:334223899163:web:002d8ba3b4f81d3e8256be",
  measurementId: "G-BSHC418XCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { firebaseConfig };
export const db = getFirestore(app);
export const auth = getAuth();
