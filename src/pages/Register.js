import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password requirements
    if (!passwordRequirements.minLength) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (!passwordRequirements.hasUppercase) {
      setError('Password must contain at least one uppercase letter');
      return;
    }
    if (!passwordRequirements.hasLowercase) {
      setError('Password must contain at least one lowercase letter');
      return;
    }
    if (!passwordRequirements.hasNumber) {
      setError('Password must contain at least one number');
      return;
    }

    // Navigate to next step with email and password
    navigate('/register/personal-info', {
      state: {
        email: formData.email,
        password: formData.password,
      }
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Join AADA</h1>
        <p className="auth-subtitle">Step 1 of 4: Account Setup</p>

        <div className="progress-indicator">
          <div className="progress-step active"></div>
          <div className="progress-step"></div>
          <div className="progress-step"></div>
          <div className="progress-step"></div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
            {formData.password && (
              <div style={{ marginTop: '8px' }}>
                <div className="requirement-item">
                  <svg viewBox="0 0 16 16" fill="currentColor" style={{ color: passwordRequirements.minLength ? '#4caf50' : '#999' }}>
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                  <span style={{ color: passwordRequirements.minLength ? '#4caf50' : '#666' }}>At least 8 characters</span>
                </div>
                <div className="requirement-item">
                  <svg viewBox="0 0 16 16" fill="currentColor" style={{ color: passwordRequirements.hasUppercase ? '#4caf50' : '#999' }}>
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                  <span style={{ color: passwordRequirements.hasUppercase ? '#4caf50' : '#666' }}>One uppercase letter</span>
                </div>
                <div className="requirement-item">
                  <svg viewBox="0 0 16 16" fill="currentColor" style={{ color: passwordRequirements.hasLowercase ? '#4caf50' : '#999' }}>
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                  <span style={{ color: passwordRequirements.hasLowercase ? '#4caf50' : '#666' }}>One lowercase letter</span>
                </div>
                <div className="requirement-item">
                  <svg viewBox="0 0 16 16" fill="currentColor" style={{ color: passwordRequirements.hasNumber ? '#4caf50' : '#999' }}>
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                  <span style={{ color: passwordRequirements.hasNumber ? '#4caf50' : '#666' }}>One number</span>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm password"
            />
          </div>

          <button type="submit" className="btn-primary">
            Next Step
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;