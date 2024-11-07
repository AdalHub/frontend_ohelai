// PrivacyPolicy.js

import React from 'react';
import '../styles/landingPage.css';
import Header from '../components/Header';

function PrivacyPolicy() {
  return (
    <div className="privacy-policy">
      <Header />
      <h1>Privacy Policy</h1>

      <p>Effective Date: [November 7, 2024]</p>

      <p>
        OHEL Technologies ("we," "us," or "our") is committed to protecting your privacy. This Privacy
        Policy explains how we collect, use, disclose, and safeguard your information when you use our
        Services. By accessing or using the Services, you agree to this Privacy Policy.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>
          <strong>Personal Information:</strong> When you create an account, we collect your name, email
          address, and password (encrypted).
        </li>
        <li>
          <strong>Chat Sessions:</strong> We store your chat interactions to improve our machine learning
          algorithms for better product recommendations.
        </li>
        <li>
          <strong>Usage Data:</strong> Information about your device and how you use the Services (e.g.,
          IP address, browser type).
        </li>
      </ul>

      <h2>2. Use of Your Information</h2>
      <p>We use the collected data to:</p>
      <ul>
        <li>Provide and maintain our Services.</li>
        <li>Improve and personalize your experience.</li>
        <li>Develop new features and services.</li>
        <li>Communicate with you about updates or changes.</li>
      </ul>

      <h2>3. Disclosure of Your Information</h2>
      <p>We may disclose your information in the following ways:</p>
      <ul>
        <li>
          <strong>Internal Use:</strong> Data is shared within OHEL Technologies for operational purposes.
        </li>
        <li>
          <strong>Third-Party Services:</strong> We use third-party APIs and services, including:
          <ul>
            <li>
              <strong>YouTube API Services:</strong> Our Services utilize YouTube API Services to fetch
              relevant videos. By using our Services, you agree to be bound by the YouTube{' '}
              <a href="https://www.youtube.com/t/terms" className="highlighted-link">Terms of Service</a>. For information on how
              YouTube collects and processes data, please visit the{' '}
              <a href="https://policies.google.com/privacy" className="highlighted-link">Google Privacy Policy</a>.
            </li>
            <li>
              <strong>OpenAI API</strong>
            </li>
            <li>
              <strong>Elasticsearch API</strong>
            </li>
            <li>
              <strong>Fauna Database API</strong>
            </li>
          </ul>
        </li>
        <li>
          <strong>Legal Requirements:</strong> We may disclose your information if required to do so by
          law.
        </li>
      </ul>

      <h2>4. Data Retention</h2>
      <p>
        We retain your personal information indefinitely unless you request deletion. Upon account
        deletion, personal information is removed from our active databases, but residual data may remain
        in backup systems.
      </p>

      <h2>5. Security of Your Information</h2>
      <p>
        We use industry-standard security measures to protect your data, including encryption of passwords
        and secure storage practices.
      </p>

      <h2>6. Children's Privacy</h2>
      <p>
        Our Services are not intended for individuals under the age of 13. We do not knowingly collect
        personal information from children under 13. If we become aware that we have collected such
        information, we will take steps to delete it.
      </p>

      <h2>7. Your Choices</h2>
      <ul>
        <li>
          <strong>Account Information:</strong> You can update or delete your account information at any
          time by logging into your account settings.
        </li>
        <li>
          <strong>Communication Preferences:</strong> You may opt out of receiving promotional
          communications from us.
        </li>
      </ul>

      <h2>8. Third-Party Links</h2>
      <p>
        Our Services may contain links to third-party websites not operated by us. We have no control over
        and assume no responsibility for the content or practices of any third-party sites.
      </p>

      <h2>9. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy periodically. We will notify you of any changes by posting the
        new Privacy Policy on this page and updating the "Effective Date."
      </p>

      <h2>10. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us:</p>
      <p>
        OHEL Technologies
        <br />
        12317 Technology Blvd Suite 100
        <br />
        Austin, TX 78727
        <br />
        Email: <a href="mailto:ohelai@oheltechnologies.com" className="highlighted-link">ohelai@oheltechnologies.com</a>
        <br />
        Phone: (512) 565-4030
      </p>
    </div>
  );
}

export default PrivacyPolicy;
