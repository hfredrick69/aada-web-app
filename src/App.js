import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import PersonalInfo from './pages/PersonalInfo';
import DocumentUpload from './pages/DocumentUpload';
import Dashboard from './pages/Dashboard';
import { isLoggedIn } from './services/authService';
import './App.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/personal-info" element={<PersonalInfo />} />
        <Route path="/register/document-upload" element={<DocumentUpload />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;