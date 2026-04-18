import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Shield } from 'lucide-react';

export default function Login() {
  const [activeTab, setActiveTab] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const res = login(username, password);
    if (res.success) {
      if (activeTab === 'admin' && res.role !== 'admin') {
        setError('This account does not have admin privileges.');
      } else if (activeTab === 'student' && res.role === 'admin') {
        setError('Please use the Admin login portal.');
      } else {
        if (res.role === 'admin') navigate('/admin');
        else navigate('/user');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="card glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: 0, overflow: 'hidden' }}>
        
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
          <button 
            style={{ 
              flex: 1, padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              backgroundColor: activeTab === 'student' ? 'transparent' : 'rgba(0,0,0,0.2)',
              borderBottom: activeTab === 'student' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === 'student' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 600
            }}
            onClick={() => { setActiveTab('student'); setError(''); }}
          >
            <User size={18} /> Student Login
          </button>
          <button 
            style={{ 
              flex: 1, padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              backgroundColor: activeTab === 'admin' ? 'transparent' : 'rgba(0,0,0,0.2)',
              borderBottom: activeTab === 'admin' ? '2px solid var(--danger)' : '2px solid transparent',
              color: activeTab === 'admin' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 600
            }}
            onClick={() => { setActiveTab('admin'); setError(''); }}
          >
            <Shield size={18} /> Admin Portal
          </button>
        </div>

        <div style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="heading-1 text-gradient" style={{ marginBottom: '0.5rem' }}>QuizMaster</h1>
            <p className="text-muted">
              {activeTab === 'student' ? 'Welcome back, Student!' : 'Secured Administrator Login'}
            </p>
          </div>
          
          {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Username</label>
              <input 
                type="text" 
                className="input" 
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input 
                type="password" 
                className="input" 
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={`btn ${activeTab === 'admin' ? 'btn-danger' : 'btn-primary'}`} style={{ width: '100%', marginTop: '1rem' }}>
              Sign In
            </button>
          </form>

          {activeTab === 'student' && (
            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }} className="text-secondary">
              Don't have an account? <Link to="/signup" style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>Sign up</Link>
            </p>
          )}
          {activeTab === 'admin' && (
            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Need Admin access? <Link to="/signup?admin=true" style={{ color: 'var(--danger)', fontWeight: '500' }}>Register here</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
