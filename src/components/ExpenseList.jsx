import { useState } from 'react';

const ExpenseList = ({ expenses, onDelete, onEdit, onEditStart }) => {
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Get unique categories
  const categories = [...new Set(expenses.map(e => e.category))];

  // Filter expenses
  const filtered = expenses.filter(exp => {
    const categoryMatch = !filterCategory || exp.category === filterCategory;
    const startMatch = !filterStartDate || new Date(exp.date) >= new Date(filterStartDate);
    const endMatch = !filterEndDate || new Date(exp.date) <= new Date(filterEndDate);
    return categoryMatch && startMatch && endMatch;
  });

  const total = filtered.reduce((sum, exp) => sum + exp.amount, 0);

  const handleEdit = (exp) => {
    onEditStart(exp);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="expense-list">
      <h2>💰 Expenses (Total: ₹{total.toFixed(2)})</h2>

      {/* Filters */}
      <div className="filters">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          placeholder="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="date"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
          placeholder="Start date"
        />

        <input
          type="date"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
          placeholder="End date"
        />

        <button
          onClick={() => {
            setFilterCategory('');
            setFilterStartDate('');
            setFilterEndDate('');
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Expense List */}
      {filtered.length === 0 ? (
        <div className="empty-state">📭 No expenses found</div>
      ) : (
        <ul>
          {filtered.map((exp) => (
            <li key={exp.id} className="expense-item">
              <div className="expense-item-header">
                <span className="expense-amount">₹{exp.amount.toFixed(2)}</span>
                <span className="expense-category">{exp.category}</span>
                <span className="expense-date">{new Date(exp.date).toLocaleDateString()}</span>
              </div>
              <div className="expense-actions">
                <button className="edit-btn" onClick={() => handleEdit(exp)}>✏️ Edit</button>
                <button className="delete-btn" onClick={() => onDelete(exp.id)}>🗑️ Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;
