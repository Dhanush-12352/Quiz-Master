import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFromStorage, saveToStorage } from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';
import { Clock, CheckCircle } from 'lucide-react';

export default function QuizAttempt() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [subject, setSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const s = getFromStorage('subjects', []).find(sub => sub.id === subjectId);
    if (s) {
      setSubject(s);
      setTimeLeft(s.durationMinutes * 60);
    }
    const q = getFromStorage('questions', []).filter(qu => qu.subjectId === subjectId);
    setQuestions(q);
  }, [subjectId]);

  useEffect(() => {
    if (!isSubmitted && timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && !isSubmitted && subject) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const handleSelect = (idx) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIdx]: idx });
  };

  const handleSubmit = () => {
    let finalScore = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctOptionIndex) finalScore += 1;
    });
    setScore(finalScore);
    setIsSubmitted(true);

    const attempts = getFromStorage('attempts', []);
    if (!attempts.find(a => a.userId === currentUser.id && a.subjectId === subjectId)) {
      attempts.push({
        id: `att_${Date.now()}`,
        userId: currentUser.id,
        subjectId: subjectId,
        score: finalScore,
        maxScore: questions.length,
        date: new Date().toISOString()
      });
      saveToStorage('attempts', attempts);
    }
  };

  if (!subject) return <div className="container" style={{ padding: '2rem' }}>Loading subject...</div>;
  if (questions.length === 0) return <div className="container" style={{ padding: '2rem' }}>No questions found for this subject.</div>;

  const currentQ = questions[currentIdx];

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="heading-2" style={{ margin: 0 }}>{subject.name} - Quiz</h2>
          {!isSubmitted && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: timeLeft < 60 ? 'var(--danger)' : 'var(--warning)', fontWeight: 'bold' }}>
              <Clock size={20} />
              <span style={{ fontSize: '1.25rem' }}>{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
      </header>

      <main className="container" style={{ flex: 1, padding: '2rem 1rem', maxWidth: '800px', width: '100%' }}>
        {isSubmitted ? (
          <div className="card text-center animate-fade-in" style={{ padding: '3rem' }}>
            <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 1.5rem auto', display: 'block' }} />
            <h1 className="heading-1">Quiz Completed!</h1>
            <p className="text-secondary" style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
              Your Score: <b style={{ color: 'var(--success)', fontSize: '2rem' }}>{score}</b> / {questions.length}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => navigate('/user')} className="btn btn-primary">Back to Dashboard</button>
              <button onClick={() => navigate('/user/leaderboard')} className="btn btn-outline">View Leaderboard</button>
            </div>
          </div>
        ) : (
          <div className="card animate-fade-in" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <span className="badge badge-primary" style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
                Question {currentIdx + 1} of {questions.length}
              </span>
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>{currentQ.text}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentQ.options.map((opt, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  style={{
                    padding: '1.25rem',
                    textAlign: 'left',
                    borderRadius: 'var(--radius-md)',
                    border: `2px solid ${selectedAnswers[currentIdx] === idx ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    backgroundColor: selectedAnswers[currentIdx] === idx ? 'rgba(139, 92, 246, 0.1)' : 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '1.125rem',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
              <button 
                className="btn btn-outline" 
                disabled={currentIdx === 0} 
                onClick={() => setCurrentIdx(prev => prev - 1)}
              >
                Previous
              </button>

              {currentIdx === questions.length - 1 ? (
                <button className="btn btn-primary" onClick={handleSubmit}>Submit Quiz</button>
              ) : (
                <button className="btn btn-primary" onClick={() => setCurrentIdx(prev => prev + 1)}>
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
