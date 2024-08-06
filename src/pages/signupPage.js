// SignupPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signupPage.css'; 
import axios from 'axios';
import Logo from '../images/OhelAiLogo.jpeg'; 

const SignupPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleGoToLogin = () => {
    navigate('/'); // Adjust the path as needed to match your login page's route
  };
    // Validate password function
    const validatePassword = (password) => {
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%]/.test(password);
  
      const isValid = password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
      setIsPasswordValid(isValid);
  
      // Set error message based on missing criteria
      let errorMessage = 'Password must contain: ';
      const criteria = [
        [minLength, '8 characters'],
        [hasUpperCase, '1 uppercase letter'],
        [hasLowerCase, '1 lowercase letter'],
        [hasNumber, '1 number'],
        [hasSpecialChar, '1 special character (!@#$%)'],
      ];
  
      errorMessage += criteria.filter(criterion => !criterion[0]).map(criterion => criterion[1]).join(', ');
      setPasswordError(errorMessage);
  
      return isValid;
    };

      // Handle password change
    const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

    // Sign up handler
  const handleSignUp = async (event) => {
  event.preventDefault();

  // Extract form data
  const fullName = event.target.fullName.value;
  const email = event.target.email.value;
  const username = event.target.username.value;
  const confirmPassword = event.target.confirmPassword.value;
  const termsAccepted = event.target.terms.checked;

  // Basic validation
  if (!isPasswordValid) {
    setErrorMessage('Invalid password. ' + passwordError);
    return;
  }
  if (password !== confirmPassword) {
    setErrorMessage('Passwords do not match!');
    setShowError(true);
    setTimeout(() => setShowError(false), 3000); // Optional: hide the error message after 3 seconds
    return;
  }
  
  if (!termsAccepted) {
    setErrorMessage('You must accept the terms and conditions');
    return;
  }

  try {
    // Send a POST request to your backend
      const response = await axios.post('https://api.ohel.ai/api/users/signup', {
      //const response = await axios.post('http://127.0.0.1:3001/api/users/signup', {

      fullName,
      email,
      username,
      password,
    });

    // Handle response
    if (response.status === 200 || response.status === 201) {
      console.log("Signup successful!");
      navigate('/', { state: { fromSignup: true } }); // Pass state to indicate signup success
    } else {
    setErrorMessage('Failed to sign up');
    }

  } catch (error) {
    // Explicit handling for the 409 Conflict error
    if (error.response && error.response.status === 409) {
      console.error('Signup error:', error.response.data.message);
      setErrorMessage(error.response.data.message || 'User already exists. Please log in or use a different email.');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } else {
      setErrorMessage(error.response?.data?.message || 'An error occurred during the signup process.');
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(prev => !prev);
  };
  
  return (
    <div className="signup-container">
      <img src={Logo} alt="Logo" className="logo" />
      <h2>Sign Up</h2>
      
      {/* Temporary error message that will be shown based on the showError state */}
      {showError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
  
      <form onSubmit={handleSignUp} autoComplete="off">
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <br />
          <input type="text" id="fullName" name="fullName" placeholder="Your full name" required />
        </div>
  
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <br />
          <input type="email" id="email" name="email" placeholder="Your email address" required />
        </div>
  
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <br />
          <input type="text" id="username" name="username" placeholder="Create a username" required />
        </div>
  
        <div className="form-group">
        <label htmlFor="password">Password</label>
        <br />
        <div className="password-input-container">
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            id="password"
            name="password"
            className={isPasswordValid ? 'password-valid' : 'password-invalid'}
            placeholder="Create a password"
            required
            value={password}
            onChange={handlePasswordChange}
          />
          <div className={`eye-icon ${isPasswordVisible ? '' : 'eye-crossed'}`} onClick={togglePasswordVisibility}>
            <div className="eye">
              <div className="eyeball"></div>
            </div>
          </div>
        </div>
        {!isPasswordValid && <div className="password-criteria">{passwordError}</div>}
      </div>
  
      <div className="form-group">
  <label htmlFor="confirmPassword">Confirm Password</label>
  <br />
  <div className="password-input-container">
    <input
      type={isConfirmPasswordVisible ? 'text' : 'password'}
      id="confirmPassword"
      name="confirmPassword"
      className="password-input"
      placeholder="Confirm your password"
      required
    />
    <div className={`eye-icon ${isConfirmPasswordVisible ? '' : 'eye-crossed'}`} onClick={toggleConfirmPasswordVisibility} />
  </div>
</div>
  
        <div className="terms-container">
          <input type="checkbox" id="terms" name="terms" required />
          <label htmlFor="terms"> I agree with the Terms and Privacy Policy.</label>
        </div>
  
        <button type="submit">Sign Up</button>
      </form>
  
      <div className="signup-link">
        Already have an account? <span onClick={handleGoToLogin}>Login here</span>
      </div>
    </div>
  );
  
  };
  

export default SignupPage;
