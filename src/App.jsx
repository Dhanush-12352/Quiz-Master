import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Auth Pages
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard'
import ManageSubjects from './pages/Admin/ManageSubjects'
import ManageQuestions from './pages/Admin/ManageQuestions'
import ViewUsers from './pages/Admin/ViewUsers'

// User Pages
import UserDashboard from './pages/User/UserDashboard'
import QuizAttempt from './pages/User/QuizAttempt'
import Leaderboard from './pages/User/Leaderboard'
import Profile from './pages/User/Profile'

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) return <Navigate to="/login" />;
  if (allowedRole && currentUser.role !== allowedRole) {
    return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/user'} />;
  }
  
  return children;
}

function App() {
  const { currentUser } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Navigate to={!currentUser ? "/login" : (currentUser.role === 'admin' ? "/admin" : "/user")} />
        } />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/subjects" element={<ProtectedRoute allowedRole="admin"><ManageSubjects /></ProtectedRoute>} />
        <Route path="/admin/questions" element={<ProtectedRoute allowedRole="admin"><ManageQuestions /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRole="admin"><ViewUsers /></ProtectedRoute>} />

        {/* User Routes */}
        <Route path="/user" element={<ProtectedRoute allowedRole="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/quiz/:subjectId" element={<ProtectedRoute allowedRole="user"><QuizAttempt /></ProtectedRoute>} />
        <Route path="/user/leaderboard" element={<ProtectedRoute allowedRole="user"><Leaderboard /></ProtectedRoute>} />
        <Route path="/user/profile" element={<ProtectedRoute allowedRole="user"><Profile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
