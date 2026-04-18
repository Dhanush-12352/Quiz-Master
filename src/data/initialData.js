import { getFromStorage, saveToStorage } from '../utils/storage';

const defaultSubjects = [
  {
    id: 'subj_1',
    name: 'IWP',
    description: 'Internet and Web Programming',
    durationMinutes: 30,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    quizPassword: 'iwp'
  },
  {
    id: 'subj_2',
    name: 'Python',
    description: 'Python Programming Language',
    durationMinutes: 45,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    quizPassword: 'py'
  },
  {
    id: 'subj_3',
    name: 'Java',
    description: 'Advanced Java Programming',
    durationMinutes: 60,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    quizPassword: 'java'
  }
];

const generateQuestions = (subjectId, subjectName) => {
  return Array.from({ length: 10 }).map((_, idx) => ({
    id: `q_${subjectId}_${idx + 1}`,
    subjectId,
    text: `Sample question ${idx + 1} for ${subjectName}?`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correctOptionIndex: Math.floor(Math.random() * 4)
  }));
};

const defaultQuestions = [
  ...generateQuestions('subj_1', 'IWP'),
  ...generateQuestions('subj_2', 'Python'),
  ...generateQuestions('subj_3', 'Java')
];

export const initializeAppStorage = () => {
  const users = getFromStorage('users');
  if (!users) {
    saveToStorage('users', [
      { id: 'admin_1', username: 'admin', email: 'admin@quiz.com', password: 'admin', role: 'admin', enrolledSubjects: [] }
    ]);
  }

  const subjects = getFromStorage('subjects');
  if (!subjects) {
    saveToStorage('subjects', defaultSubjects);
  }

  const questions = getFromStorage('questions');
  if (!questions) {
    saveToStorage('questions', defaultQuestions);
  }
  
  const attempts = getFromStorage('attempts');
  if (!attempts) {
    saveToStorage('attempts', []); 
  }
};
