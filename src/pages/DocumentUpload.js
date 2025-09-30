import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { register } from '../services/authService';
import './Auth.css';
import './DocumentUpload.css';

function DocumentUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const registrationData = location.state;

  // Redirect if no registration data
  React.useEffect(() => {
    if (!registrationData || !registrationData.email) {
      navigate('/register');
    }
  }, [registrationData, navigate]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png',
                           'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF, DOC, DOCX, JPG, or PNG file');
        return;
      }

      setSelectedFile(file);
      setError('');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError('');
  };

  const getFileSizeString = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  const handleCompleteRegistration = async () => {
    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    if (!selectedFile) {
      setError('Please upload your academic transcript');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Step 1: Register the user with basic info
      const response = await register({
        email: registrationData.email,
        password: registrationData.password,
        first_name: registrationData.first_name,
        last_name: registrationData.last_name,
        phone: registrationData.phone,
        role: 'student',
      });

      // Get user ID from registration response
      const userId = response.id;

      // Step 2: Upload the document
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('document_type', 'transcript');
      formData.append('user_id', userId);

      const uploadResponse = await fetch(
        'https://aada-backend-app12345.azurewebsites.net/documents/upload-registration',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.detail || 'Document upload failed');
      }

      // Show success message and redirect to login
      alert('Registration successful! Your document has been uploaded. Please login with your credentials.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Upload Documents</h1>
        <p className="auth-subtitle">Step 3 of 4: Upload Required Documents</p>

        <div className="progress-indicator">
          <div className="progress-step active"></div>
          <div className="progress-step active"></div>
          <div className="progress-step active"></div>
          <div className="progress-step"></div>
        </div>

        <p style={{ textAlign: 'center', color: '#666', margin: '24px 0', fontSize: '14px' }}>
          Please upload the following documents to complete your registration. All documents will be reviewed for verification.
        </p>

        {error && <div className="error-message">{error}</div>}

        <div className="document-card">
          <div className="document-header">
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', color: '#2196F3' }}>
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
            </svg>
            <div style={{ flex: 1, marginLeft: '12px' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
                Academic Transcript
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                Upload your official academic transcript (high school, college, or trade school)
              </p>
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            {selectedFile ? (
              <div>
                <div className="file-preview">
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', color: '#2196F3' }}>
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  <div style={{ flex: 1, marginLeft: '12px' }}>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#333' }}>
                      {selectedFile.name}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                      {getFileSizeString(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#999',
                      padding: '4px'
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="upload-button">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    style={{ display: 'none' }}
                  />
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px', marginRight: '8px' }}>
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  Choose File (PDF, DOC, JPG, PNG)
                </label>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'flex-start' }}>
          <input
            type="checkbox"
            id="terms"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            style={{ marginTop: '2px', cursor: 'pointer' }}
          />
          <label
            htmlFor="terms"
            style={{ marginLeft: '8px', fontSize: '14px', color: '#333', cursor: 'pointer' }}
          >
            I agree to the Terms of Service and Privacy Policy
          </label>
        </div>

        <button
          type="button"
          onClick={handleCompleteRegistration}
          className="btn-primary"
          disabled={loading}
          style={{ marginTop: '24px' }}
        >
          {loading ? 'Completing Registration...' : 'Complete Registration'}
        </button>
      </div>
    </div>
  );
}

export default DocumentUpload;