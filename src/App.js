// App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import ChatbotPage from './pages/chatbotPage';
import LoginPage from './pages/loginPage';
import SignupPage from './pages/signupPage';
import LoadingAnimation from './components/LoadingAnimation'; 


function AppContent() {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Start loading
    setIsLoading(true);
    // Simulate a loading delay (e.g., fetching data)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust the timeout as needed

    return () => clearTimeout(timer);
  }, [location.pathname]); // Triggered on route change

  return (
    <>
      {isLoading && <LoadingAnimation />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Add more routes as needed */}
      </Routes>
      <title>TrustShop</title>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
