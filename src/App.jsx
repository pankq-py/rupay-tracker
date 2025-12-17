import React, { useState, useEffect } from 'react';
import { PieChart } from 'react-minimal-pie-chart';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');

  useEffect(() => {
    const saved = localStorage.getItem('rupayExpenses');
    if (saved) setExpenses(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('rupayExpenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!amount) return;
    setExpenses(prev => [
      ...prev,
      {
        id: Date.now(),
        amount: Number(amount),
        category,
        date: new Date().toLocaleDateString(),
      },
    ]);
    setAmount('');
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryTotals).map(([title, value]) => ({
    title,
    value,
    color: '#' + ((Math.random() * 0xffffff) | 0).toString(16).padStart(6, '0'),
  }));

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: '0 auto', fontFamily: 'system-ui' }}>
      <h2>Rupay Tracker</h2>

      <div style={{ marginBottom: 16 }}>
        <input
          type="number"
          placeholder="Amount ₹"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ marginRight: 8 }}>
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Entertainment</option>
          <option>Other</option>
        </select>
        <button onClick={addExpense}>Add</button>
      </div>

      <h3>Total: ₹{total.toFixed(0)}</h3>

      {total > 0 && (
        <PieChart
          data={pieData}
          label={({ dataEntry }) =>
            `${dataEntry.title} ${Math.round(dataEntry.percentage)}%`
          }
          style={{ height: 250 }}
        />
      )}

      <ul>
        {expenses.slice().reverse().map(e => (
          <li key={e.id}>
            {e.date} – {e.category}: ₹{e.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
