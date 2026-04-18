import React, { useState, useEffect } from 'react';
import UserLayout from '../../components/UserLayout';
import { getFromStorage } from '../../utils/storage';
import { Trophy, Medal, Award } from 'lucide-react';

export default function Leaderboard() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const subjs = getFromStorage('subjects', []);
    setSubjects(subjs);
    if (subjs.length > 0) {
      setSelectedSubjectId(subjs[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedSubjectId) {
      const attempts = getFromStorage('attempts', []).filter(a => a.subjectId === selectedSubjectId);
      const users = getFromStorage('users', []);
      
      const combined = attempts.map(att => {
        const user = users.find(u => u.id === att.userId);
        return {
          username: user ? user.username : 'Unknown',
          score: att.score,
          maxScore: att.maxScore
        };
      });

      combined.sort((a, b) => b.score - a.score);
      setLeaderboardData(combined);
    }
  }, [selectedSubjectId]);

  return (
    <UserLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-1" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Trophy color="var(--warning)" /> Leaderboard
        </h1>
        <select className="input" style={{ width: 'auto' }} value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)}>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {leaderboardData.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-tertiary)', textAlign: 'left' }}>
                <th style={{ padding: '1.25rem', width: '100px', textAlign: 'center' }}>Rank</th>
                <th style={{ padding: '1.25rem' }}>User</th>
                <th style={{ padding: '1.25rem', textAlign: 'right' }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((data, index) => {
                let rankIcon;
                if (index === 0) rankIcon = <Trophy size={24} color="#fbbf24" />; // Gold
                else if (index === 1) rankIcon = <Medal size={24} color="#94a3b8" />; // Silver
                else if (index === 2) rankIcon = <Award size={24} color="#b45309" />; // Bronze
                else rankIcon = <span style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-muted)' }}>{index + 1}</span>;

                return (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: index < 3 ? 'rgba(30, 41, 59, 0.4)' : 'transparent' }}>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>{rankIcon}</td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: index < 3 ? 600 : 400, fontSize: '1.125rem' }}>{data.username}</td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 600, color: 'var(--accent-primary)', fontSize: '1.125rem' }}>
                      {data.score} / {data.maxScore}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Trophy size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>No attempts recorded for this subject yet.</p>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
