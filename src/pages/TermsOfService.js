// TermsOfService.js
import { Link } from 'react-router-dom';
import React from 'react';
import '../styles/landingPage.css';
import Header from '../components/Header';

function TermsOfService() {
  return (
    <div className="terms-of-service">
      <Header />
      <h1>Terms of Service</h1>

      <p>Effective Date: [November 7, 2024]</p>

      <p>
        Welcome to OhelAi, a service provided by OHEL Technologies ("we," "us," or "our"). These Terms
        of Service ("Terms") govern your access to and use of the OhelAi website and services
        (collectively, the "Services"). By creating an account or using our Services, you agree to be
        bound by these Terms. If you do not agree to these Terms, please do not use our Services.
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing or using our Services, you acknowledge that you have read, understood, and agree
        to be bound by these Terms and our Privacy Policy. You also agree to comply with all
        applicable laws and regulations.
        <br />
        Please read our <Link to="/privacy" className="highlighted-link">Privacy Policy</Link> for more information.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 13 years of age to use our Services. By using the Services, you represent
        and warrant that you meet this age requirement.
      </p>

      <h2>3. Description of Services</h2>
      <p>
        OhelAi is a chatbot application that utilizes OpenAI's API to generate language model
        responses. It also offers:
      </p>
      <ul>
        <li>
          <strong>Product Recommendations:</strong> Retrieval Augmented Generation (RAG) functions
          that retrieve web-scraped results stored in our Elasticsearch database.
        </li>
        <li>
          <strong>YouTube Video Access:</strong> Integration with YouTube API Services to fetch
          relevant YouTube videos.
        </li>
      </ul>

      <h2>4. Account Registration</h2>
      <p>
        To access certain features of our Services, you must create an account by providing:
      </p>
      <ul>
        <li>Full Name</li>
        <li>Email Address</li>
        <li>Password (encrypted and stored securely)</li>
      </ul>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials and for
        all activities that occur under your account.
      </p>

      <h2>5. User Conduct</h2>
      <p>You agree not to use the Services to:</p>
      <ul>
        <li>Violate any local, state, national, or international law.</li>
        <li>
          Transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory,
          vulgar, obscene, or otherwise objectionable.
        </li>
        <li>
          Abuse the token request system or engage in any activity that disrupts or interferes with
          the Services.
        </li>
        <li>
          Attempt to gain unauthorized access to any portion of the Services or any other accounts,
          computer systems, or networks connected to the Services.
        </li>
      </ul>

      <h2>6. Intellectual Property Rights</h2>
      <p>
        All content, features, and functionality on the Services—including but not limited to text,
        graphics, logos, icons, images, and software—are the exclusive property of OHEL Technologies
        and are protected by U.S. and international copyright, trademark, patent, trade secret, and
        other intellectual property laws.
      </p>

      <h2>7. Third-Party Services</h2>
      <p>
        Our Services incorporate third-party APIs and services, including but not limited to:
      </p>
      <ul>
        <li>OpenAI API</li>
        <li>YouTube API Services</li>
        <li>Elasticsearch API</li>
        <li>Fauna Database API</li>
      </ul>
      <p>
        By using our Services, you agree to be bound by the YouTube{' '}
        <a href="https://www.youtube.com/t/terms" className="highlighted-link">Terms of Service</a>
        <br />
        For reference please visit YouTube's terms of service page:{' '}
        <a href="https://www.youtube.com/t/terms" className="highlighted-link">https://www.youtube.com/t/terms</a>
      </p>
      <p>
        We are not responsible for the content or practices of third-party websites or services linked
        to or from our Services.
      </p>

      <h2>8. Privacy Policy</h2>
      <p>
        Your privacy is important to us. Please review our <Link to="/privacy" className="highlighted-link">Privacy Policy</Link>,
        which describes how we collect, use, and disclose information about you. By using our Services,
        you consent to our collection and use of your data as outlined therein.
      </p>

      <h2>9. Data Collection and Use</h2>
      <p>We collect and store the following user data:</p>
      <ul>
        <li>
          <strong>Personal Information:</strong> Name, email address, and encrypted password.
        </li>
        <li>
          <strong>Chat Sessions:</strong> Stored to improve our machine learning algorithms for better
          product recommendations.
        </li>
        <li>
          <strong>Usage Data:</strong> Information on how you access and use the Services.
        </li>
      </ul>

      <h2>10. Data Retention</h2>
      <p>
        User data is retained indefinitely unless you request deletion of your account. Upon deletion,
        personal information will be removed; however, data already used to train our machine learning
        models will remain as part of the aggregated data.
      </p>

      <h2>11. Security Measures</h2>
      <p>
        We implement industry-standard security measures to protect your personal information.
        Passwords are encrypted and stored securely in our Fauna database.
      </p>

      <h2>12. Disclaimer of Warranties</h2>
      <p>
        The Services are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any
        kind, either express or implied. We do not warrant that the Services will be uninterrupted,
        error-free, or free of viruses or other harmful components.
      </p>

      <h2>13. Limitation of Liability</h2>
      <p>
        In no event shall OHEL Technologies, its affiliates, or their licensors, service providers,
        employees, agents, officers, or directors be liable for damages of any kind arising out of or
        in connection with your use of the Services.
      </p>

      <h2>14. Indemnification</h2>
      <p>
        You agree to defend, indemnify, and hold harmless OHEL Technologies and its affiliates from and
        against any claims, liabilities, damages, judgments, awards, losses, costs, or expenses arising
        out of your violation of these Terms or your use of the Services.
      </p>

      <h2>15. Termination</h2>
      <p>
        We reserve the right to terminate or suspend your access to all or part of the Services at our
        sole discretion, without notice, for any reason, including violation of these Terms.
      </p>

      <h2>16. Governing Law and Jurisdiction</h2>
      <p>
        These Terms are governed by the laws of the State of Texas, USA, without regard to its conflict
        of law provisions. You agree to submit to the personal jurisdiction of the state and federal
        courts located in Texas for the resolution of any disputes.
      </p>

      <h2>17. Changes to the Terms</h2>
      <p>
        We may modify these Terms at any time. Changes will be effective immediately upon posting. Your
        continued use of the Services after changes are posted constitutes your acceptance of the
        modified Terms.
      </p>

      <h2>18. Contact Information</h2>
      <p>For questions or concerns about these Terms, please contact us:</p>
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
        <br />
        Website:{' '}
        <a href="https://www.oheltechnologies.com" className="highlighted-link">https://www.oheltechnologies.com</a>
      </p>
    </div>
  );
}

export default TermsOfService;
