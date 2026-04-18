import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getFromStorage, saveToStorage } from '../../utils/storage';
import { Edit2, Trash2 } from 'lucide-react';

export default function ManageQuestions() {
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '', text: '', options: ['', '', '', ''], correctOptionIndex: 0
  });

  useEffect(() => {
    const loadedSubjects = getFromStorage('subjects', []);
    setSubjects(loadedSubjects);
    if (loadedSubjects.length > 0) {
      setSelectedSubjectId(loadedSubjects[0].id);
    }
    setQuestions(getFromStorage('questions', []));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    let newQuestions;
    if (isEditing) {
      newQuestions = questions.map(q => q.id === formData.id ? { ...formData, subjectId: selectedSubjectId } : q);
    } else {
      newQuestions = [...questions, { ...formData, id: `q_${Date.now()}`, subjectId: selectedSubjectId }];
    }
    setQuestions(newQuestions);
    saveToStorage('questions', newQuestions);
    setFormData({ id: '', text: '', options: ['', '', '', ''], correctOptionIndex: 0 });
    setIsEditing(false);
  };

  const handleEdit = (q) => {
    setFormData({ ...q });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this question?')) {
      const newQuestions = questions.filter(q => q.id !== id);
      setQuestions(newQuestions);
      saveToStorage('questions', newQuestions);
    }
  };

  const currentQuestions = questions.filter(q => q.subjectId === selectedSubjectId);

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-1" style={{ margin: 0 }}>Manage Questions</h1>
        <select className="input" style={{ width: 'auto' }} value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)}>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Form */}
        <div className="card">
          <h2 className="heading-2">{isEditing ? 'Edit Question' : 'Add New Question'}</h2>
          <form onSubmit={handleSave}>
            <div className="input-group">
              <label>Question Text</label>
              <textarea className="input" required value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} rows={3} />
            </div>
            
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Options and Correct Answer</label>
            {formData.options.map((opt, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input 
                  type="radio" 
                  name="correctOption" 
                  checked={formData.correctOptionIndex == idx} 
                  onChange={() => setFormData({...formData, correctOptionIndex: idx})}
                />
                <input 
                  type="text" 
                  className="input" 
                  required 
                  placeholder={`Option ${idx + 1}`}
                  value={opt} 
                  onChange={e => {
                    const newOpts = [...formData.options];
                    newOpts[idx] = e.target.value;
                    setFormData({...formData, options: newOpts});
                  }} 
                />
              </div>
            ))}
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              {isEditing ? 'Update Question' : 'Add Question'}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-outline" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => { setIsEditing(false); setFormData({ id: '', text: '', options: ['', '', '', ''], correctOptionIndex: 0 }) }}>
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentQuestions.map((q, i) => (
            <div key={q.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, paddingRight: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem' }}>Q{i+1}. {q.text}</h3>
                <ul className="text-muted" style={{ fontSize: '0.875rem', paddingLeft: '1rem', listStyleType: 'disc' }}>
                  {q.options.map((opt, idx) => (
                    <li key={idx} style={{ color: idx == q.correctOptionIndex ? 'var(--success)' : 'inherit', fontWeight: idx == q.correctOptionIndex ? '600' : '400' }}>
                      {opt} {idx == q.correctOptionIndex && '(Correct)'}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(q)} className="btn btn-outline" style={{ padding: '0.5rem' }}><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(q.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {currentQuestions.length === 0 && <p className="text-muted">No questions found for this subject.</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
