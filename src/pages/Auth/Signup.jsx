import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { getFromStorage, saveToStorage } from '../../utils/storage';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const isAdminSignup = new URLSearchParams(location.search).get('admin') === 'true';

  const handleSignup = (e) => {
    e.preventDefault();
    if (isAdminSignup && adminSecret !== 'ADMIN_SECURE_123') {
      setError('Invalid Admin Secret Key.');
      return;
    }

    const users = getFromStorage('users', []);
    if (users.find(u => u.username === username || u.email === email)) {
      setError('Username or Email already exists.');
      return;
    }

    const newUser = {
      id: `${isAdminSignup ? 'admin' : 'user'}_${Date.now()}`,
      email,
      username,
      password,
      role: isAdminSignup ? 'admin' : 'user',
      enrolledSubjects: []
    };

    saveToStorage('users', [...users, newUser]);
    
    alert('Account created successfully! Please log in.');
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="card glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="heading-1 text-gradient" style={{ marginBottom: '0.5rem' }}>QuizMaster</h1>
          <p className="text-muted">{isAdminSignup ? 'Create Administrator Account' : 'Create Student Account'}</p>
        </div>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" className="input" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Username</label>
            <input type="text" className="input" placeholder="Choose a username" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" className="input" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>

          {isAdminSignup && (
            <div className="input-group">
              <label style={{ color: 'var(--danger)' }}>Admin Secret Key</label>
              <input type="password" className="input" placeholder="Hint: ADMIN_SECURE_123" value={adminSecret} onChange={e => setAdminSecret(e.target.value)} required />
            </div>
          )}

          <button type="submit" className={`btn ${isAdminSignup ? 'btn-danger' : 'btn-primary'}`} style={{ width: '100%', marginTop: '1rem' }}>
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }} className="text-secondary">
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
