import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';

function PersonalInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, password } = location.state || {};

  // Redirect if no email/password
  React.useEffect(() => {
    if (!email || !password) {
      navigate('/register');
    }
  }, [email, password, navigate]);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
  });
  const [error, setError] = useState('');

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    if (phoneNumber.length <= 3) {
      return phoneNumber.length > 0 ? `(${phoneNumber}` : '';
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted.length <= 14) {
      setFormData({
        ...formData,
        [e.target.name]: formatted,
      });
    }
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validateZipCode = (zip) => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.first_name.trim()) {
      setError('Please enter your first name');
      return;
    }
    if (!formData.last_name.trim()) {
      setError('Please enter your last name');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!validatePhone(formData.phone)) {
      setError('Please enter a valid phone number');
      return;
    }
    if (!formData.address_line1.trim()) {
      setError('Please enter your address');
      return;
    }
    if (!formData.city.trim()) {
      setError('Please enter your city');
      return;
    }
    if (!formData.state) {
      setError('Please select your state');
      return;
    }
    if (!formData.zip_code.trim()) {
      setError('Please enter your ZIP code');
      return;
    }
    if (!validateZipCode(formData.zip_code)) {
      setError('Please enter a valid ZIP code');
      return;
    }
    if (!formData.emergency_contact_name.trim()) {
      setError('Please enter emergency contact name');
      return;
    }
    if (!formData.emergency_contact_phone.trim()) {
      setError('Please enter emergency contact phone');
      return;
    }
    if (!validatePhone(formData.emergency_contact_phone)) {
      setError('Please enter a valid emergency contact phone number');
      return;
    }

    // Pass all data to document upload step
    const registrationData = {
      email,
      password,
      ...formData,
    };

    navigate('/register/document-upload', { state: registrationData });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Personal Information</h1>
        <p className="auth-subtitle">Step 2 of 4: Tell us about yourself</p>

        <div className="progress-indicator">
          <div className="progress-step active"></div>
          <div className="progress-step active"></div>
          <div className="progress-step"></div>
          <div className="progress-step"></div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name *</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="First name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name *</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              required
              placeholder="(555) 123-4567"
            />
          </div>

          <h3 style={{ color: '#333', marginTop: '24px', marginBottom: '16px' }}>Address</h3>

          <div className="form-group">
            <label htmlFor="address_line1">Address Line 1 *</label>
            <input
              type="text"
              id="address_line1"
              name="address_line1"
              value={formData.address_line1}
              onChange={handleChange}
              required
              placeholder="Street address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address_line2">Address Line 2 (Optional)</label>
            <input
              type="text"
              id="address_line2"
              name="address_line2"
              value={formData.address_line2}
              onChange={handleChange}
              placeholder="Apt, suite, unit, etc."
            />
          </div>

          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                placeholder="City"
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">State *</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="zip_code">ZIP *</label>
              <input
                type="text"
                id="zip_code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                required
                placeholder="12345"
              />
            </div>
          </div>

          <h3 style={{ color: '#333', marginTop: '24px', marginBottom: '16px' }}>Emergency Contact</h3>

          <div className="form-group">
            <label htmlFor="emergency_contact_name">Emergency Contact Name *</label>
            <input
              type="text"
              id="emergency_contact_name"
              name="emergency_contact_name"
              value={formData.emergency_contact_name}
              onChange={handleChange}
              required
              placeholder="Full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="emergency_contact_phone">Emergency Contact Phone *</label>
            <input
              type="tel"
              id="emergency_contact_phone"
              name="emergency_contact_phone"
              value={formData.emergency_contact_phone}
              onChange={handlePhoneChange}
              required
              placeholder="(555) 123-4567"
            />
          </div>

          <button type="submit" className="btn-primary">
            Next Step
          </button>
        </form>
      </div>
    </div>
  );
}

export default PersonalInfo;