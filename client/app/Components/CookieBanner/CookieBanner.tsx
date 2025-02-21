'use client';

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already given consent
    const consent = Cookies.get('userConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('userConsent', 'true', { expires: 365 });
    setIsVisible(false);
  };

  const handleDecline = () => {
    Cookies.set('userConsent', 'false', { expires: 365 });
    setIsVisible(false);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div style={bannerStyle}>
        <p style={textStyle}>
          We use cookies to enhance your experience. By using our site, you agree to our{' '}
          <button onClick={toggleModal} style={linkStyle}>
            Privacy Policy
          </button>
          .
        </p>
        <div>
          <button onClick={handleAccept} style={buttonStyle}>
            I Accept
          </button>
          <button onClick={handleDecline} style={buttonStyle}>
            Decline
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button onClick={toggleModal} style={closeButtonStyle}>
              &times;
            </button>
            <h2>Privacy Policy</h2>
            <p style={{ marginTop: '20px' }}>
              {/* Your Privacy Policy content goes here */}
              <strong>Introduction</strong>
              <br />
              Welcome to HustleHub. We are committed to
              protecting your personal information and your right to privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your information when you use
              our task manager application.
            </p>
            <p style={{ marginTop: '20px' }}>
              <strong>Information We Collect</strong>
              <br />
              We collect personal information that you voluntarily provide to us when registering
              for an account, which is:
              <ul>
                <li>Name: To personalize your experience.</li>
                <li>Email Address: For account verification, communication, and password recovery.</li>
                <li>Password: To secure your account.</li>
              </ul>
              Additionally, as you use the Application, you may add, edit, or complete tasks. The
              information associated with these tasks includes:
              <ul>
                <li>Task Details: Descriptions or titles of tasks.</li>
                <li>Priority Levels: Indications of task importance.</li>
                <li>Relevant Dates: Due dates, completion dates, or other associated dates.</li>
              </ul>
            </p>
            <p style={{ marginTop: '20px' }}>
              <strong>How We Use Your Information</strong>
              <br />
              We use the information we collect or receive:
              <ul>
                <li>To facilitate account creation and logon process.</li>
                <li>To send administrative information to you.</li>
              </ul>
            </p>
            <p style={{ marginTop: '20px' }}>
              <strong>Changes to This Privacy Policy</strong>
              <br />
              We may update our Privacy Policy from time to time. You are advised to review this
              Privacy Policy periodically for any changes. Your information is not used for anything other than the stated purposes above.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

// Styles
const bannerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(43, 55, 59, 0.9)',
  color: '#fff',
  padding: '10px',
  textAlign: 'center',
  borderRadius: '10px 10px 0 0',
  border: '2px solid rgba(255, 255, 255, 0.5)',
  zIndex: 1000,
  opacity: 0.7,
};

const textStyle: React.CSSProperties = {
  display: 'inline',
  marginRight: '10px',
};

const linkStyle: React.CSSProperties = {
  color: '#fff',
  textDecoration: 'underline',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  font: 'inherit',
};

const buttonStyle: React.CSSProperties = {
  color: '#4e503b',
  fontSize: '14px',
  background: '#fff',
  borderRadius: '5px',
  padding: '6px 15px',
  margin: '5px',
  cursor: 'pointer',
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1001,
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '10px',
  width: '80%',
  maxWidth: '600px',
  maxHeight: '80%',
  overflowY: 'auto',
  position: 'relative',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'none',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
};

export default CookieBanner;
