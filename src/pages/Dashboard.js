import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, logout, getUserDocuments } from '../services/authService';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [documents, setDocuments] = useState(null);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [documentError, setDocumentError] = useState(null);

  useEffect(() => {
    const userData = getStoredUser();
    if (!userData) {
      navigate('/login');
    } else {
      setUser(userData);
      loadDocuments();
    }
  }, [navigate]);

  const loadDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const docs = await getUserDocuments();
      setDocuments(docs);
      setDocumentError(null);
    } catch (error) {
      console.error('Document fetch error:', error);
      setDocumentError(error.message || 'Failed to load documents');
    } finally {
      setLoadingDocuments(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const userName = user.first_name && user.last_name
    ? `${user.first_name} ${user.last_name}`
    : user.email;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout} className="btn-logout">
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '20px', height: '20px' }}>
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
        </button>
      </header>

      <div className="dashboard-content">
        <h2 className="welcome-text">Welcome, {userName}!</h2>

        {activeTab === 'dashboard' && (
          <div className="documents-section">
            <h3 className="section-title">My Documents</h3>

            {loadingDocuments ? (
              <div className="loading-state">
                <div className="spinner"></div>
              </div>
            ) : documentError ? (
              <div className="error-state">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', color: '#f44336' }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <p>Error loading documents: {documentError}</p>
              </div>
            ) : !documents || documents.length === 0 ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '48px', height: '48px', color: '#999' }}>
                  <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
                </svg>
                <p>No documents uploaded yet</p>
              </div>
            ) : (
              <div className="documents-list">
                {documents.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="content-section">
            <div className="quiz-card" style={{ backgroundColor: '#f5f5f5' }}>
              <h4>Dental Anatomy Quiz</h4>
              <p>Status: Not Started</p>
            </div>
            <div className="quiz-card" style={{ backgroundColor: '#ffecb3' }}>
              <h4>Chairside Assisting Quiz</h4>
              <p>Status: In Progress</p>
            </div>
            <div className="quiz-card" style={{ backgroundColor: '#c8e6c9' }}>
              <h4>OSHA Guidelines Quiz</h4>
              <p>Status: Completed • Score: 90%</p>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="content-section">
            <div className="job-card">
              <div className="job-info">
                <h4>Dental Assistant – Smile Dental</h4>
                <p>Atlanta, GA</p>
              </div>
              <button className="apply-button">Apply</button>
            </div>
            <div className="job-card">
              <div className="job-info">
                <h4>Sterilization Tech – Tooth & Co.</h4>
                <p>Marietta, GA</p>
              </div>
              <button className="apply-button">Apply</button>
            </div>
            <div className="job-card">
              <div className="job-info">
                <h4>Front Desk Admin – Clear Dental</h4>
                <p>Kennesaw, GA</p>
              </div>
              <button className="apply-button">Apply</button>
            </div>
          </div>
        )}

        {activeTab === 'tuition' && (
          <div className="content-section">
            <div className="tuition-card" style={{ backgroundColor: '#ef5350' }}>
              <h4>Past Due</h4>
              <p>$400 due on June 15</p>
            </div>
            <div className="tuition-card" style={{ backgroundColor: '#81c784' }}>
              <h4>Upcoming</h4>
              <p>$500 due on July 10</p>
            </div>
            <div className="tuition-card" style={{ backgroundColor: '#bbdefb' }}>
              <h4>Tuition Balance</h4>
              <p>$2,100 remaining</p>
            </div>
          </div>
        )}
      </div>

      <nav className="bottom-navigation">
        <button
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
          <span>Dashboard</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'quizzes' ? 'active' : ''}`}
          onClick={() => setActiveTab('quizzes')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
          </svg>
          <span>Quizzes</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
          </svg>
          <span>Job Board</span>
        </button>

        <button
          className={`nav-item ${activeTab === 'tuition' ? 'active' : ''}`}
          onClick={() => setActiveTab('tuition')}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
          </svg>
          <span>My Tuition</span>
        </button>
      </nav>
    </div>
  );
}

// Document Card Component
function DocumentCard({ document }) {
  const formatDocumentType = (type) => {
    if (type === 'transcript') return 'Academic Transcript';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getStatusColor = () => {
    switch (document.verification_status) {
      case 'approved':
        return '#4caf50';
      case 'rejected':
        return '#f44336';
      case 'pending':
      default:
        return '#ff9800';
    }
  };

  const getStatusIcon = () => {
    switch (document.verification_status) {
      case 'approved':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', color: getStatusColor() }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'rejected':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', color: getStatusColor() }}>
            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
          </svg>
        );
      case 'pending':
      default:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', color: getStatusColor() }}>
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const statusColor = getStatusColor();

  return (
    <div className="document-card" style={{ borderColor: `${statusColor}50` }}>
      <div className="document-card-header">
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', color: statusColor }}>
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
        <div className="document-info">
          <div className="document-type">{formatDocumentType(document.document_type)}</div>
          <div className="document-filename">{document.file_name}</div>
        </div>
        {getStatusIcon()}
      </div>
      <div className="document-card-footer">
        <div className="document-date">
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '14px', height: '14px', color: '#999', marginRight: '4px' }}>
            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
          </svg>
          Uploaded: {formatDate(document.uploaded_at)}
        </div>
        <div className="document-status" style={{ backgroundColor: `${statusColor}20`, color: statusColor }}>
          {document.friendly_verification_status || document.verification_status}
        </div>
      </div>
      {document.verification_notes && (
        <div className="document-notes">
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '16px', height: '16px', color: '#666', marginRight: '8px' }}>
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
          {document.verification_notes}
        </div>
      )}
    </div>
  );
}

export default Dashboard;