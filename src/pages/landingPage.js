//landingPage.js

import React from 'react';
import '../styles/landingPage.css';
import LandingPageImage from '../images/landingPageimage.png';
import Header from '../components/Header';

function LandingPage() {
  return (
    <div className="landing-page">
      <Header /> 

      <div className="content-container">
        <main className="text-content">
          <h1>Introducing an AI-powered platform for a Purchasing Assistance: </h1>
          <p className="chatbot-description">OhelAI takes the guesswork out of buying, personalized to customer needs and budget.
          Discover hidden deals, compare options effortlessly, and secure the best services. Save time, save money and shop smarter with OHEL AI.</p>
          {/* <button className="download-button">Download Now</button> */}
        </main>

        <div className="image-container">
          <img src={LandingPageImage} alt="Hero" className="hero-image" />
        </div>
      </div>

      <div className="additional-info">
        <section className="features-list">
          <h2>Feature List:</h2>
          <ul>
            <li>Interactive Conversations</li>
            <li>24/7 Availability</li>
            <li>Seamless Integration</li>

          </ul>
        </section>

        <section className="system-requirements">
          <h2>System Requirements/Compatibility:</h2>
          <ul>
            <li>Compatible with modern browsers</li>
            <li>No additional downloads required</li>
            <li>Responsive design for all devices</li>

          </ul>
        </section>
      </div>

      <footer className="footer-nav">
        <div className="footer-links">
          <a href="/faq" className="footer-link">FAQs</a>
          <a href="/support" className="footer-link">Customer Support</a>
          <a href="/contact" className="footer-link">Contact Us</a>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
