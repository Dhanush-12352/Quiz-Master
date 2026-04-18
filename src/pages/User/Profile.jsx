import React, { useState, useEffect } from 'react';
import UserLayout from '../../components/UserLayout';
import { getFromStorage } from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';
import { Trophy, User, BookOpen, Clock, ArrowRight, CheckCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser } = useAuth();
  const [userStats, setUserStats] = useState({ totalAttempts: 0, enrolled: 0 });
  const [enrolledSubjectsDetails, setEnrolledSubjectsDetails] = useState([]);
  const [attempts, setAttempts] = useState([]);
  
  // Password modal state so users can attempt quizzes straight from Profile
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedSubjectForQuiz, setSelectedSubjectForQuiz] = useState(null);
  const [quizPasswordInput, setQuizPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const subjects = getFromStorage('subjects', []);
    const allAttempts = getFromStorage('attempts', []);
    const users = getFromStorage('users', []);

    const dbUser = users.find(u => u.id === currentUser.id);
    const enrolledIds = dbUser ? dbUser.enrolledSubjects || [] : [];
    
    const userAttempts = allAttempts.filter(a => a.userId === currentUser.id);
    setUserStats({ totalAttempts: userAttempts.length, enrolled: enrolledIds.length });
    setAttempts(userAttempts);

    // Map enrolled subject IDs to their actual objects
    const enrolledList = subjects.filter(s => enrolledIds.includes(s.id));
    setEnrolledSubjectsDetails(enrolledList);

  }, [currentUser]);

  const handleAttemptClick = (subject) => {
    if (subject.quizPassword) {
      setSelectedSubjectForQuiz(subject);
      setQuizPasswordInput('');
      setPasswordError('');
      setShowPasswordModal(true);
    } else {
      navigate(`/user/quiz/${subject.id}`);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (quizPasswordInput === selectedSubjectForQuiz.quizPassword) {
      setShowPasswordModal(false);
      navigate(`/user/quiz/${selectedSubjectForQuiz.id}`);
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  return (
    <UserLayout>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        
        {/* Left Side: Profile Card */}
        <div>
          <div className="card" style={{ textAlign: 'center', padding: '2rem', position: 'sticky', top: '2rem' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <User size={40} color="var(--accent-primary)" />
            </div>
            <h2 className="heading-2" style={{ marginBottom: '0.25rem' }}>{currentUser?.username}</h2>
            <p className="text-secondary" style={{ marginBottom: '2rem' }}>{currentUser?.email}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} color="var(--text-muted)" />
                <span className="text-secondary">Enrolled</span>
              </div>
              <span style={{ fontWeight: 600 }}>{userStats.enrolled}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={18} color="var(--text-muted)" />
                <span className="text-secondary">Quizzes Taken</span>
              </div>
              <span style={{ fontWeight: 600 }}>{userStats.totalAttempts}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Enrolled Subjects */}
        <div>
          <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <BookOpen size={24} color="var(--accent-primary)" /> My Enrolled Subjects
          </h2>

          {enrolledSubjectsDetails.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {enrolledSubjectsDetails.map(subject => {
                const userAttempt = attempts.find(a => a.subjectId === subject.id);

                return (
                  <div key={subject.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 className="heading-2" style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{subject.name}</h3>
                        {subject.quizPassword && <Lock size={16} color="var(--text-muted)" title="Password Protected" />}
                      </div>
                      <p className="text-secondary" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>{subject.description}</p>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <span className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12}/> {subject.durationMinutes} Mins</span>
                        <span className="badge" style={{ backgroundColor: 'var(--bg-tertiary)' }}>{subject.startDate} to {subject.endDate}</span>
                      </div>

                      {userAttempt ? (
                        <div style={{ marginBottom: '1.5rem', padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                          <p style={{ margin: 0, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle size={16} color="var(--success)" />
                            Score: <b style={{ color: 'var(--success)' }}>{userAttempt.score}/{userAttempt.maxScore}</b>
                          </p>
                        </div>
                      ) : (
                        <div style={{ marginBottom: '1.5rem', padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--warning)', fontWeight: 500 }}>
                            Pending Attempt
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div style={{ marginTop: 'auto' }}>
                      {!userAttempt ? (
                        <button onClick={() => handleAttemptClick(subject)} className="btn btn-primary" style={{ width: '100%' }}>
                          Attempt Quiz <ArrowRight size={16} />
                        </button>
                      ) : (
                        <button disabled className="btn btn-outline" style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}>
                          Completed
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <BookOpen size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto', display: 'block' }} />
              <p>You haven't enrolled in any subjects yet.</p>
              <button className="btn btn-outline" style={{ marginTop: '1rem' }} onClick={() => navigate('/user')}>
                Browse Available Subjects
              </button>
            </div>
          )}
        </div>

      </div>

      {showPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 className="heading-2" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Lock size={20} /> Access Protected Quiz
            </h3>
            <p className="text-secondary" style={{ marginBottom: '1.5rem' }}>Enter the password for <b>{selectedSubjectForQuiz?.name}</b></p>
            
            {passwordError && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.875rem' }}>{passwordError}</div>}
            
            <form onSubmit={handlePasswordSubmit}>
              <input 
                type="password" 
                className="input" 
                placeholder="Quiz Password" 
                value={quizPasswordInput} 
                onChange={e => setQuizPasswordInput(e.target.value)} 
                required 
                autoFocus
                style={{ marginBottom: '1.5rem' }}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowPasswordModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Unlock & Start</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </UserLayout>
  );
}
