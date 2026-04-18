import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getFromStorage, saveToStorage } from '../../utils/storage';
import { Edit2, Trash2, Key } from 'lucide-react';

export default function ManageSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '', name: '', description: '', durationMinutes: 30, startDate: '', endDate: '', quizPassword: ''
  });

  useEffect(() => {
    setSubjects(getFromStorage('subjects', []));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    let newSubjects;
    if (isEditing) {
      newSubjects = subjects.map(s => s.id === formData.id ? formData : s);
    } else {
      newSubjects = [...subjects, { ...formData, id: `subj_${Date.now()}` }];
    }
    setSubjects(newSubjects);
    saveToStorage('subjects', newSubjects);
    setFormData({ id: '', name: '', description: '', durationMinutes: 30, startDate: '', endDate: '', quizPassword: '' });
    setIsEditing(false);
  };

  const handleEdit = (subject) => {
    setFormData({
      ...subject,
      quizPassword: subject.quizPassword || ''
    });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      const newSubjects = subjects.filter(s => s.id !== id);
      setSubjects(newSubjects);
      saveToStorage('subjects', newSubjects);
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="heading-1" style={{ margin: 0 }}>Manage Subjects</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Form */}
        <div className="card">
          <h2 className="heading-2">{isEditing ? 'Edit Subject' : 'Add New Subject'}</h2>
          <form onSubmit={handleSave}>
            <div className="input-group">
              <label>Subject Name</label>
              <input type="text" className="input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea className="input" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Duration (Minutes)</label>
              <input type="number" className="input" required value={formData.durationMinutes} onChange={e => setFormData({...formData, durationMinutes: parseInt(e.target.value)})} />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label>Start Date</label>
                <input type="date" className="input" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label>End Date</label>
                <input type="date" className="input" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              </div>
            </div>
            <div className="input-group">
              <label>Quiz Access Password</label>
              <input type="text" className="input" placeholder="Leave blank for no password" value={formData.quizPassword} onChange={e => setFormData({...formData, quizPassword: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              {isEditing ? 'Update Subject' : 'Add Subject'}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-outline" style={{ width: '100%', marginTop: '0.5rem' }} onClick={() => { setIsEditing(false); setFormData({ id: '', name: '', description: '', durationMinutes: 30, startDate: '', endDate: '', quizPassword: '' }) }}>
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {subjects.map(subject => (
            <div key={subject.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>{subject.name}</h3>
                <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>{subject.durationMinutes} mins | {subject.startDate} to {subject.endDate}</p>
                {subject.quizPassword && (
                  <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Key size={12} /> Password Protected
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEdit(subject)} className="btn btn-outline" style={{ padding: '0.5rem' }}><Edit2 size={16} /></button>
                <button onClick={() => handleDelete(subject.id)} className="btn btn-danger" style={{ padding: '0.5rem' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
