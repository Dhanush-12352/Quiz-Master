import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Trophy, LogOut, User } from 'lucide-react';

export default function UserLayout({ children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Subjects', path: '/user', icon: <BookOpen size={20} /> },
    { name: 'Leaderboard', path: '/user/leaderboard', icon: <Trophy size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '1rem 2rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
             <h2 className="heading-2 text-gradient" style={{ margin: 0 }}>QuizMaster</h2>
          </div>
          
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            {navItems.map(item => (
              <Link 
                key={item.name}
                to={item.path} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  color: location.pathname === item.path ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  fontWeight: location.pathname === item.path ? '600' : '400'
                }}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            
            <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 0.5rem' }}></div>
            
            <Link to="/user/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: location.pathname === '/user/profile' ? 'var(--accent-primary)' : 'var(--text-primary)', fontWeight: 500, padding: '0.5rem' }}>
              <User size={20} />
              <span>Profile</span>
            </Link>
            
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', color: 'var(--danger)', marginLeft: '0.5rem' }}>
              <LogOut size={16} />
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main style={{ flex: 1, padding: '2rem', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
