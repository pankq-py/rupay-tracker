// src/components/ExpenseForm.jsx
import { useState, useEffect } from 'react';
import Select from 'react-select';

const categoryOptions = [
  { value: 'Food', label: 'Food' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Other', label: 'Other' }
];

const ExpenseForm = ({ onSubmit, editingExpense, onCancelEdit }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setCategory({ value: editingExpense.category, label: editingExpense.category });
      setDate(editingExpense.date);
    } else {
      setAmount('');
      setCategory(null);
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editingExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) {
      alert('Please fill in all fields');
      return;
    }
    const expenseData = {
      amount: parseFloat(amount),
      category: category.value,
      date,
    };
    onSubmit(expenseData);
    // Reset form after submission
    setAmount('');
    setCategory(null);
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      {editingExpense && (
        <div style={{ 
          gridColumn: '1 / -1', 
          background: '#fff3cd', 
          padding: '10px', 
          borderRadius: '5px',
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>✏️ Editing expense...</span>
          <button 
            type="button" 
            onClick={onCancelEdit}
            style={{
              background: '#999',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Cancel Edit
          </button>
        </div>
      )}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        step="0.01"
      />
      <Select
        options={categoryOptions}
        value={category}
        onChange={setCategory}
        placeholder="Select Category"
      />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <button type="submit">
        {editingExpense ? '💾 Save Changes' : '➕ Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;
