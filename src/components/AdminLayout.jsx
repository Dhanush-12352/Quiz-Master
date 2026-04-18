import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, HelpCircle, Users, LogOut } from 'lucide-react';

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '250px', backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h2 className="heading-2 text-gradient" style={{ margin: 0 }}>QuizMaster</h2>
          <span className="badge badge-primary" style={{ marginTop: '0.5rem' }}>Admin Portal</span>
        </div>
        
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navItems.map(item => (
              <li key={item.name}>
                <Link 
                  to={item.path} 
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem',
                    color: location.pathname === item.path ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: location.pathname === item.path ? 'var(--bg-tertiary)' : 'transparent',
                    borderLeft: location.pathname === item.path ? '3px solid var(--accent-primary)' : '3px solid transparent'
                  }}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--danger)' }}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
