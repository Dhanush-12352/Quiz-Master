import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getFromStorage } from '../../utils/storage';
import { Users, BookOpen, HelpCircle, Activity, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, subjects: 0, questions: 0 });
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const users = getFromStorage('users', []).filter(u => u.role === 'user');
    const subjects = getFromStorage('subjects', []);
    const questions = getFromStorage('questions', []);
    setStats({ users: users.length, subjects: subjects.length, questions: questions.length });
    
    // Grab the 3 most recently registered non-admin users
    setRecentUsers(users.slice(-3).reverse());
  }, []);

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-1" style={{ margin: 0 }}>Dashboard Overview</h1>
        <span className="badge badge-success" style={{ padding: '0.5rem 1rem' }}>System Online</span>
      </div>
      
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ borderTop: '4px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(139, 92, 246, 0.2)', borderRadius: 'var(--radius-md)', color: 'var(--accent-primary)' }}>
              <Users size={24} />
            </div>
            <div>
              <p className="text-muted" style={{ margin: 0 }}>Total Students</p>
              <h2 className="heading-2" style={{ margin: 0 }}>{stats.users}</h2>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderTop: '4px solid var(--accent-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: 'var(--radius-md)', color: 'var(--accent-secondary)' }}>
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-muted" style={{ margin: 0 }}>Total Subjects</p>
              <h2 className="heading-2" style={{ margin: 0 }}>{stats.subjects}</h2>
            </div>
          </div>
        </div>

        <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}>
              <HelpCircle size={24} />
            </div>
            <div>
              <p className="text-muted" style={{ margin: 0 }}>Total Questions</p>
              <h2 className="heading-2" style={{ margin: 0 }}>{stats.questions}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area filling up the blank space */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Quick Actions Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            <Activity size={20} color="var(--accent-primary)" /> Quick Actions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
            <Link to="/admin/subjects" className="btn btn-outline" style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem', backgroundColor: 'var(--bg-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <BookOpen size={20} color="var(--accent-secondary)" />
                <span style={{ fontWeight: 500 }}>Create New Subject</span>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </Link>
            
            <Link to="/admin/questions" className="btn btn-outline" style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem', backgroundColor: 'var(--bg-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <HelpCircle size={20} color="var(--success)" />
                <span style={{ fontWeight: 500 }}>Add Quiz Questions</span>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </Link>

            <Link to="/admin/users" className="btn btn-outline" style={{ display: 'flex', justifyContent: 'space-between', padding: '1.25rem', backgroundColor: 'var(--bg-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Users size={20} color="var(--warning)" />
                <span style={{ fontWeight: 500 }}>Review User Scores</span>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </Link>
          </div>
        </div>

        {/* Recent Registrations Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            <Users size={20} color="var(--accent-primary)" /> Recent Registrations
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: recentUsers.length === 0 ? 'center' : 'flex-start' }}>
            {recentUsers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentUsers.map(user => (
                  <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--accent-primary)' }}>
                    <div>
                      <p style={{ fontWeight: 600, margin: '0 0 0.25rem 0' }}>{user.username}</p>
                      <p className="text-muted" style={{ fontSize: '0.875rem', margin: 0 }}>{user.email}</p>
                    </div>
                    <span className="badge" style={{ backgroundColor: 'var(--bg-tertiary)' }}>Student</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <Users size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto', display: 'block' }} />
                <p>No students have registered yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
