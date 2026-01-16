// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

let analytics = null;