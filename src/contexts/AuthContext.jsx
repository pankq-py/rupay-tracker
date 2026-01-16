import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Load username from Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid, 'profile', 'info');
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setUsername(userDoc.data().username || 'User');
          } else {
            setUsername('User');
          }
        } catch (err) {
          console.error('Error loading username:', err);
          setUsername('User');
        }
      } else {
        setUsername(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const validateMasterPassword = async (masterPassword) => {
    try {
      // Fetch master password from Firestore config
      const configDoc = await getDoc(doc(db, 'config', 'masterPassword'));
      
      if (!configDoc.exists()) {
        throw new Error('Master password not configured');
      }

      const storedPassword = configDoc.data().password;
      const isValid = masterPassword === storedPassword;

      return isValid;
    } catch (error) {
      console.error('Error validating master password:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const register = async (username, email, password, masterPassword) => {
    try {
      setError(null);

      // Validate master password via Cloud Function (server-side)
      const isValid = await validateMasterPassword(masterPassword);
      if (!isValid) {
        const error = new Error('Invalid master password');
        setError('Invalid master password, contact Pankaj Gujar for access.');
        throw error;
      }

      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Save username in Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid, 'profile', 'info');
      await setDoc(userDocRef, {
        username: username,
        email: email,
        createdAt: new Date().toISOString()
      });

      setUsername(username);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setUsername(null);
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, username, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};


