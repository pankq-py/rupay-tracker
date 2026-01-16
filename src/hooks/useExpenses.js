import { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';

export const useExpenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    console.log('Setting up Firestore listener for user:', user.uid);
    setLoading(true);
    const expensesRef = doc(db, 'users', user.uid, 'data', 'expenses');
    
    const unsubscribe = onSnapshot(
      expensesRef,
      (snap) => {
        console.log('Firestore snapshot:', snap.data());
        const data = snap.data()?.expenses || [];
        setExpenses(data);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore error:', error.code, error.message);
        setError(error.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user]);

  const addExpense = async (expense) => {
    if (!user) {
      alert('You must be logged in to add expenses');
      return;
    }

    try {
      console.log('Adding expense to Firebase:', expense);
      const docRef = doc(db, 'users', user.uid, 'data', 'expenses');
      
      const docSnap = await getDoc(docRef);
      console.log('Document exists:', docSnap.exists());
      
      if (docSnap.exists()) {
        console.log('Updating existing document');
        await updateDoc(docRef, {
          expenses: [...(docSnap.data()?.expenses || []), expense]
        });
      } else {
        console.log('Creating new document');
        await setDoc(docRef, { expenses: [expense] });
      }
      console.log('✓ Expense saved to Firebase');
      
      // Small delay to let Firestore propagate
      setTimeout(() => {
        const docRef2 = doc(db, 'users', user.uid, 'data', 'expenses');
        getDoc(docRef2).then(snap => {
          if (snap.exists()) {
            setExpenses(snap.data()?.expenses || []);
          }
        });
      }, 500);
    } catch (error) {
      console.error('✗ Firebase error:', error.code, error.message);
      setError(error.message);
      alert('Firebase Error: ' + error.message + '\nCheck console for details.');
    }
  };

  const deleteExpense = async (id) => {
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid, 'data', 'expenses');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          expenses: docSnap.data().expenses.filter(e => e.id !== id)
        });
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError(error.message);
    }
  };

  const editExpense = async (id, updatedExpense) => {
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid, 'data', 'expenses');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const updated = docSnap.data().expenses.map(e =>
          e.id === id ? { ...e, ...updatedExpense } : e
        );
        await updateDoc(docRef, { expenses: updated });
      }
    } catch (error) {
      console.error('Error editing expense:', error);
      setError(error.message);
    }
  };

  return { expenses, addExpense, deleteExpense, editExpense, loading, error };
};
