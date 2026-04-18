import React, { createContext, useState, useContext, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = getFromStorage('currentUser');
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const login = (username, password) => {
    const users = getFromStorage('users', []);
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      saveToStorage('currentUser', user);
      return { success: true, role: user.role };
    }
    return { success: false, message: 'Invalid username or password' };
  };

  const signup = (email, username, password) => {
    const users = getFromStorage('users', []);
    if (users.find(u => u.username === username || u.email === email)) {
      return { success: false, message: 'User already exists' };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email,
      username,
      password,
      role: 'user',
      enrolledSubjects: []
    };

    const updatedUsers = [...users, newUser];
    saveToStorage('users', updatedUsers);
    
    // Auto-login
    setCurrentUser(newUser);
    saveToStorage('currentUser', newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    window.localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
