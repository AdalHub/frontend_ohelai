import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Logo from '../images/OhelAiLogo.jpeg';
import '../styles/loginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSocialLogins, setShowSocialLogins] = useState(false);
  const [showSignupSuccess, setShowSignupSuccess] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post('https://api.ohel.ai/api/users/login', {
        //const response = await axios.post('http://127.0.0.1:3001/api/users/login', {
        email,
        password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userEmail', email); // Store user's email
        const userEmail = localStorage.getItem('userEmail');
        console.log(userEmail)
        // Send user's email to Flask backend
        //await axios.post('https://api.ohel.ai/history', {
          //email,
       // });
        navigate('/chatbot');
      } else {
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('User does not exist. Please sign up.');
      } else {
        alert(error.response?.data?.message || 'An error occurred during login.');
      }
    }
  };

  useEffect(() => {
    if (location.state?.fromSignup) {
      setShowSignupSuccess(true);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => {
        setShowSignupSuccess(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="main-background">
      <div className="login-container">
        <img src={Logo} alt="Logo" className="logo" />
        <h2>Login</h2>

        {/* Success message after signup */}
        {showSignupSuccess && (
          <div className="success-message">Signup successful! Please log in.</div>
        )}

        <form onSubmit={handleLogin} autoComplete="off">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <br />
            <input type="email" id="email" placeholder="Your email address" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <br />
            <input type="password" id="password" placeholder="Enter your password" required />
          </div>
          <button type="submit">Log In</button>
        </form>

        <div className="signup-link">
          Don't have an account? <span onClick={() => navigate('/signup')}>Sign up</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
