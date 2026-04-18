import React, { useEffect, useState } from 'react';
import UserLayout from '../../components/UserLayout';
import { getFromStorage, saveToStorage } from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Lock, Trophy, Target, Clock, BookOpen } from 'lucide-react';

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [attempts, setAttempts] = useState([]);
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedSubjectForQuiz, setSelectedSubjectForQuiz] = useState(null);
  const [quizPasswordInput, setQuizPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    setSubjects(getFromStorage('subjects', []));
    
    const users = getFromStorage('users', []);
    const user = users.find(u => u.id === currentUser.id);
    setEnrolledSubjects(user?.enrolledSubjects || []);
    
    const allAttempts = getFromStorage('attempts', []);
    setAttempts(allAttempts.filter(a => a.userId === currentUser.id));
  }, [currentUser.id]);

  const handleEnroll = (subjectId) => {
    const users = getFromStorage('users', []);
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex > -1) {
      if (!users[userIndex].enrolledSubjects) users[userIndex].enrolledSubjects = [];
      users[userIndex].enrolledSubjects.push(subjectId);
      saveToStorage('users', users);
      setEnrolledSubjects([...enrolledSubjects, subjectId]);
    }
  };

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

  const totalEnrolled = enrolledSubjects.length;
  const completedQuizzes = attempts.length;
  const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
  const maxPossibleScore = attempts.reduce((sum, a) => sum + a.maxScore, 0);
  const accuracy = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

  return (
    <UserLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-1" style={{ margin: 0 }}>Student Dashboard</h1>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: '2.5rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(139, 92, 246, 0.2)', borderRadius: 'var(--radius-md)' }}>
            <Target size={28} color="var(--accent-primary)" />
          </div>
          <div>
            <p className="text-muted" style={{ margin: 0 }}>Enrolled Subjects</p>
            <h2 className="heading-2" style={{ margin: 0 }}>{totalEnrolled} / {subjects.length}</h2>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle size={28} color="var(--accent-secondary)" />
          </div>
          <div>
            <p className="text-muted" style={{ margin: 0 }}>Quizzes Completed</p>
            <h2 className="heading-2" style={{ margin: 0 }}>{completedQuizzes}</h2>
          </div>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--success)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-md)' }}>
            <Trophy size={28} color="var(--success)" />
          </div>
          <div>
            <p className="text-muted" style={{ margin: 0 }}>Overall Accuracy</p>
            <h2 className="heading-2" style={{ margin: 0 }}>{accuracy}%</h2>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        <div style={{ flex: 2, minWidth: '350px' }}>
          <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <BookOpen size={20} color="var(--accent-primary)" /> Available Subjects
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {subjects.map(subject => {
              const isEnrolled = enrolledSubjects.includes(subject.id);
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
                    </div>

                    {userAttempt && (
                      <div style={{ marginBottom: '1.5rem', padding: '0.75rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                        <p style={{ margin: 0, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle size={16} color="var(--success)" />
                          Score: <b style={{ color: 'var(--success)' }}>{userAttempt.score}/{userAttempt.maxScore}</b>
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ marginTop: 'auto' }}>
                    {!isEnrolled ? (
                      <button onClick={() => handleEnroll(subject.id)} className="btn btn-outline" style={{ width: '100%' }}>
                        Enroll Now
                      </button>
                    ) : !userAttempt ? (
                      <button disabled className="btn btn-primary" style={{ width: '100%', opacity: 0.8, cursor: 'default' }}>
                        Enrolled
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
        </div>

        <div style={{ flex: 1, minWidth: '300px' }}>
          <div className="card" style={{ position: 'sticky', top: '2rem' }}>
            <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <Clock size={20} color="var(--accent-secondary)" /> Recent Activity
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {attempts.length > 0 ? (
                attempts.slice().reverse().map(att => {
                  const sub = subjects.find(s => s.id === att.subjectId);
                  if (!sub) return null;
                  const isPerfect = att.score === att.maxScore;
                  
                  return (
                    <div key={att.id} style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${isPerfect ? 'var(--success)' : 'var(--accent-primary)'}` }}>
                      <p style={{ fontWeight: 600, margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>Completed {sub.name}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p className="text-secondary" style={{ margin: 0, fontSize: '0.75rem' }}>
                          {new Date(att.date).toLocaleDateString()}
                        </p>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isPerfect ? 'var(--success)' : 'var(--accent-primary)' }}>
                          {att.score}/{att.maxScore} pts
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                  <Trophy size={40} style={{ opacity: 0.2, margin: '0 auto 1rem auto', display: 'block' }} />
                  <p style={{ fontSize: '0.875rem' }}>No quizzes completed yet. Enroll in a subject to get started!</p>
                </div>
              )}
            </div>
            
            {enrolledSubjects.length > 0 && attempts.length === 0 && (
              <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ color: 'var(--accent-secondary)', fontSize: '0.875rem', margin: 0, textAlign: 'center', fontWeight: 500 }}>
                  You're enrolled! Take your first quiz when you're ready.
                </p>
              </div>
            )}
            
          </div>
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
