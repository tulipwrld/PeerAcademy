import React from 'react';
import HighSkillLogo from './p2p.png'
import GoogleImg from "./google.png";
import './Login.css';

const HighSkillLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google/url';
  };

  return (
    <div className="high-skill-container">
      <div className="high-skill-top-section">
        <img src={HighSkillLogo} className="high-skill-logo" alt="High Skill Logo" />
        <h1 className="high-skill-main-title">Peer Academy</h1>
      </div>
      {/* <div className="high-skill-top-section">
        <img src={HighSkillLogo} className="high-skill-logo" alt="High Skill Logo" />
        <h1 className="high-skill-main-title">High Skill</h1>
      </div> */}

      <div className="high-skill-card">
         <div className="high-skill-header">
           <h1 className="high-skill-title">Welcome to</h1>
           <h1 className="high-skill-title-1">Peer Academy</h1>
         </div>
        
        <div className="high-skill-login-section">
          <button 
            className="google-login-btn"
            onClick={handleGoogleLogin}
          >
            <img src={GoogleImg} className='google-icon' alt="Google"/>
            Log in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default HighSkillLogin;
