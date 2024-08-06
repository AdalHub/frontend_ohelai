// Header.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate together
import logoImage from '../images/OhelAiLogo.jpeg'; 
import '../styles/header.css';

const Header = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLogoClick = () => {
    navigate('/landing'); // Navigate to the landing page route
  };

  const handleLogout = () => {
    // Remove the token from local storage or any state management library you are using
    localStorage.removeItem('token');
    
    // Clear user state if any stored in context or state management library
  
    // Redirect to the homepage or login page after logout
    navigate('/');
    console.log('User logged out');
  };
  

  return (
    <nav className="top-nav">
      <div className="logo" onClick={handleLogoClick}>
        <img src={logoImage} alt="OhelAI Logo" /> {/* Logo image */}
        OhelAI
      </div> 
      <div className="nav-links">
        <Link to="/chatbot" className="nav-link">OhelAI</Link>
        {/* <Link to="/shop" className="nav-link">Shop</Link> */}
        {/* <Link to="/about-us" className="nav-link">About Us</Link>
        <Link to="/contacts" className="nav-link">Contacts</Link> */}
      </div>
      <button onClick={handleLogout} className="logout-btn">Logout</button> 
    </nav>
  );
};

export default Header;
