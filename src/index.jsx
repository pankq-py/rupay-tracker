import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initializeApp } from "firebase/app";
import { AuthProvider } from './contexts/AuthContext';

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

// Suppress extension errors
window.addEventListener('error', (e) => {
  if (e.message.includes('MessageNotSentError') || 
      e.message.includes('RegisterClientLocalizationsError')) {
    e.preventDefault();
  }
}, true);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
