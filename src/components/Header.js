// Header.js

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import logoImage from '../images/OhelAiLogo.jpeg'; 
import '../styles/header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Logo always takes you to /landing
  const handleLogoClick = () => {
    navigate('/landing');
  };

  // Logout always clears token and sends you to "/"
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    console.log('User logged out');
  };

  // Decide the label/action based on if we're on "/chatbot" or not
  const isOnChatbotPage = location.pathname === '/chatbot';
  const buttonLabel = isOnChatbotPage ? 'About Us' : 'ShopRAG';
  const buttonAction = () => {
    if (isOnChatbotPage) {
      navigate('/landing');
    } else {
      navigate('/chatbot');
    }
  };

  return (
    <nav className="top-nav">
      <div className="logo" onClick={handleLogoClick}>
        <img src={logoImage} alt="OhelAI Logo" />
        OhelAI
      </div>
      <div className="nav-links">
        <button onClick={buttonAction} className="nav-link">
          {buttonLabel}
        </button>
        <button onClick={handleLogout} className="nav-link">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Header;
