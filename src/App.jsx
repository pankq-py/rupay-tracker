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
        time: new Date().toLocaleTimeString(),
      },
    ]);
    setAmount('');
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
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
      <h2 style={{ textAlign: 'center' }}>Rupay Tracker</h2>

      <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="number"
          placeholder="Amount ₹"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{ flex: '0 0 100px', padding: 8 }}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ flex: '1 0 120px', padding: 8 }}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Entertainment</option>
          <option>Other</option>
        </select>
        <button onClick={addExpense} style={{ padding: '8px 16px' }}>
          Add
        </button>
      </div>

      <h3>Total: ₹{total.toFixed(0)}</h3>

      {total > 0 && (
        <div style={{ marginBottom: 16 }}>
          <PieChart
            data={pieData}
            label={({ dataEntry }) =>
              `${dataEntry.title} ${Math.round(dataEntry.percentage)}%`
            }
            labelPosition={60}
            labelStyle={{ fontSize: 5, fill: 'white' }}
            style={{ height: 250 }}
          />
        </div>
      )}

      <h3>Recent spends</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {expenses.slice().reverse().map(e => (
          <li
            key={e.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid #eee',
            }}
          >
            <div>
              <div>{e.category}: ₹{e.amount}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{e.date} {e.time}</div>
            </div>
            <button
              onClick={() => deleteExpense(e.id)}
              style={{ border: 'none', background: '#eee', padding: '4px 8px' }}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
