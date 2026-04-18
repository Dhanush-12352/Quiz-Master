import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getFromStorage } from '../../utils/storage';

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    setUsers(getFromStorage('users', []).filter(u => u.role === 'user'));
    setAttempts(getFromStorage('attempts', []));
    setSubjects(getFromStorage('subjects', []));
  }, []);

  return (
    <AdminLayout>
      <h1 className="heading-1" style={{ marginBottom: '2rem' }}>Enrolled Users</h1>
      
      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-tertiary)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Username</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Email</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Enrolled Subjects</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Scores</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{user.username}</td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {user.enrolledSubjects?.map(subjId => {
                      const s = subjects.find(sub => sub.id === subjId);
                      return s ? <span key={subjId} className="badge badge-primary">{s.name}</span> : null;
                    }) || <span className="text-muted">None</span>}
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {attempts.filter(a => a.userId === user.id).map((att, idx) => {
                      const s = subjects.find(sub => sub.id === att.subjectId);
                      return s ? (
                        <div key={idx} style={{ fontSize: '0.875rem' }}>
                          {s.name}: <span style={{ color: 'var(--success)', fontWeight: 600 }}>{att.score}/{att.maxScore}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
