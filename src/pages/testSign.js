// chatbotPage.js

import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import { FaUserCircle, FaPaperPlane } from 'react-icons/fa';
import '../styles/chatbotPage.css';
import logo from '../images/OhelAiLogo.jpeg'; // Ensure the path to your image is correct

function TestChat() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const [sessions, setSessions] = useState([
    { id: 0, messages: [{ text: "Hello, welcome to your Shopping Assistant, how can I help you?", sender: 'bot' }] }
  ]);

  const drawerRef = useRef();
  const [userInput, setUserInput] = useState('');
  const userEmail = localStorage.getItem('userEmail');

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const fetchChatHistory = async (userEmail) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Chatbot response:', data); // Log chatbot response
      return data; // Assuming data is an array of chat messages
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return []; // Return an empty array in case of error
    }
  };

  const handleSend = async () => {
    if (userInput.trim()) {
      const userMessage = { id: Date.now(), text: userInput, sender: 'user' };
  
      setSessions(currentSessions => {
        const newSessions = [...currentSessions];
        if (!newSessions[activeSessionIndex].messages.find(msg => msg.id === userMessage.id)) {
          const newMessages = [...newSessions[activeSessionIndex].messages, userMessage];
          newSessions[activeSessionIndex] = { ...newSessions[activeSessionIndex], messages: newMessages };
        }
        return newSessions;
      });
  
      setUserInput(''); // Clear input after sending
      try {
        const response = await fetch('http://127.0.0.1:5000/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: userInput, email: userEmail}),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();

        const botResponse = { id: Date.now(), text: data.response, sender: 'bot' };
  
        // Then, add the bot's response to the session
        setSessions(currentSessions => {
          const newSessions = [...currentSessions];
          if (!newSessions[activeSessionIndex].messages.find(msg => msg.id === botResponse.id)) {
            newSessions[activeSessionIndex].messages.push(botResponse);
          }
          return newSessions;
        });
  
      } catch (error) {
        console.error('Error:', error);
        // Handle error by adding an error message or similar
      }
    }
  };
  

  const handleAddSession = async () => {
    const newSessionId = sessions.length;
    const newSessions = [
      ...sessions,
      { id: newSessionId, messages: await fetchChatHistory(userEmail) },
    ];
    setSessions(newSessions);
    setActiveSessionIndex(newSessionId);
  };

  const handleDeleteSession = (sessionIndex, event) => {
    event.stopPropagation(); // This stops the click from triggering the switchSession click event
    const updatedSessions = sessions.filter((_, index) => index !== sessionIndex);
    setSessions(updatedSessions);
    setActiveSessionIndex(updatedSessions.length > 0 ? updatedSessions.length - 1 : 0);
  };

  const switchSession = (sessionIndex) => {
    setActiveSessionIndex(sessionIndex);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent the default action to avoid a line break in the textarea
      handleSend(); // Call your send function
    }
    // If Shift + Enter is pressed, a new line is added by the textarea's default behavior
  };

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      fetchChatHistory(userEmail).then(chatHistory => {
        setSessions(currentSessions => {
          const newSessions = [...currentSessions];
          newSessions[activeSessionIndex] = { ...newSessions[activeSessionIndex], messages: chatHistory };
          return newSessions;
        });
      });
    }
  }, []); // Fetch chat history on component mount

  return (
    <div className="chatbot-page">
      <Header />
      <div className="drawer-chat-container">
        <div className={`side-drawer ${isDrawerOpen ? 'open' : ''}`} ref={drawerRef}>
          <div className="drawer-title">
            Chatbot Sessions
            <button className="add-session-btn" onClick={handleAddSession}>+</button>
          </div>
          <div className="chat-sessions">
            {sessions.map((session, index) => (
              <div
                key={session.id}
                className={`chat-session ${index === activeSessionIndex ? 'active' : ''}`}
                onClick={() => switchSession(index)}
              >
                <span>Session {session.id + 1}</span>
                <button
                  className="delete-session-btn"
                  onClick={(e) => handleDeleteSession(index, e)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="chat-area-container">
          <h2 className="chat-title">OhelAI, your Smart and Safe Shopping Guru Media!</h2>
          <div className="messages-container">
            {sessions[activeSessionIndex]?.messages.map((message, index) => (
              <div key={index} className="message-row">
                {message.sender === 'bot' ? (
                  <img src={logo} alt="Bot Logo" className="bot-icon icon-spacing" />
                ) : (
                  <FaUserCircle className="user-icon icon-spacing" />
                )}
                <div className={`message-bubble ${message.sender}`}>
                  <div className="message">{message.text}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="input-area">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={handleKeyPress}
              rows={1} // This starts the textarea with a single line
              style={{ resize: 'none' }} // This prevents the textarea from being resized
            />
            <button className="send-btn" onClick={handleSend}>
              <FaPaperPlane size="1.5em" />
            </button>
          </div>
        </div>
        <button
          className={`toggle-btn ${isDrawerOpen ? 'button-shift' : ''}`}
          onClick={toggleDrawer}
        >
          {isDrawerOpen ? '<' : '>'}
        </button>
      </div>
    </div>
  );
}

export default TestChat;
