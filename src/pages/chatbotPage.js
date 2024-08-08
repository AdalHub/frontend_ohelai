import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import '../styles/chatbotPage.css';
import logo from '../images/OhelAiLogo.jpeg'; // Ensure the path to your image is correct

import { FaUserCircle, FaPaperPlane, FaTimes, FaSpinner} from 'react-icons/fa';//ADDED 7/6/24
const userEmail = localStorage.getItem('userEmail');


console.log(userEmail)

function ChatbotPage() {

  const [isLoading, setIsLoading] = useState(false); //added 7/6/24
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const [sessions, setSessions] = useState([
    { id: 0, messages: [{ text: "Hello, welcome to your Shopping Assistant, how can I help you?", sender: 'bot' }] }
  ]);

  const drawerRef = useRef();
  const [userInput, setUserInput] = useState('');

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
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
      setIsLoading(true);  // Start loading ADDED 7/6/24
      try {
        const response = await fetch('https://api.ohel.ai/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: userInput, email: userEmail, session: activeSessionIndex }),
        });

        setIsLoading(false); //ADDED 7/6/24
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log('API response:', data); // Log to inspect the structure






        if (data.response) {
          const botResponse = { id: Date.now(), text: data.response, sender: 'bot' };
          addMessageToSession(botResponse);
        }
  
        // Iterate through each additional key in the response
        // Iterate through each additional key in the response
        Object.keys(data).forEach(key => {
          if (key !== 'response') {
            const rawData = data[key].output; // Assuming output holds the raw data
            const parsedData = safeJsonParse(rawData); // Parse JSON data from string
            const toolResponses = formatToolResponse(parsedData, key);
            toolResponses.forEach(msg => addMessageToSession(msg));
          }
        });






    
      } catch (error) {
        console.error('Error:', error);
        // Handle error by adding an error message or similar
        setIsLoading(false); // ADDED 7/6/24
      }
    }
  };
  

  const handleAddSession = () => {
    const newSessionId = sessions.length;
    const newSessions = [
      ...sessions,
      { id: newSessionId, messages: [{ text: '', sender: 'bot' }] }, // Start with an empty message
    ];
    setSessions(newSessions);
    setActiveSessionIndex(newSessionId);
    
    // Set a timeout to allow state update before starting to type
    setTimeout(() => {
      typeMessage("Hello, welcome to your Shopping Assistant, how can I help you?", newSessionId);
    }, 0);
  };
  
  const handleDeleteSession = async (sessionIndex, event) => {
    event.stopPropagation();
    const sessionIdToDelete = sessions[sessionIndex].id;
    try {
      const response = await fetch('https://api.ohel.ai/deletechatsession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, session: sessionIdToDelete }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedSessions = sessions.filter(session => session.id !== sessionIdToDelete);
      setSessions(updatedSessions);
      if (activeSessionIndex === sessionIndex) {
        setActiveSessionIndex(updatedSessions.length > 0 ? 0 : -1);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const switchSession = (sessionIndex) => {
    setActiveSessionIndex(sessionIndex);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };








  const addMessageToSession = (message) => {
    setSessions(currentSessions => {
      const newSessions = [...currentSessions];
      if (!newSessions[activeSessionIndex].messages.find(msg => msg.id === message.id)) {
        newSessions[activeSessionIndex].messages.push(message);
      }
      return newSessions;
    });
  };
  
  
  const formatToolResponse = (toolData, toolKey) => {
    // Assume toolData is an array of objects or a single object
    if (Array.isArray(toolData)) {
      return toolData.map(item => ({
        id: Date.now() + Math.random(), // ensure unique ID
        text: formatMessage(item, toolKey),
        sender: 'bot'
      }));
    } else {
      return [{
        id: Date.now(),
        text: formatMessage(toolData, toolKey),
        sender: 'bot'
      }];
    }
  };
  
// Helper function to safely parse JSON
const safeJsonParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return null;
  }
};

// Updated formatting function that handles different response types
const formatMessage = (item, toolKey) => {
  if (typeof item === 'string') {
    // Assume it's a JSON string for tavily_search or a regular string for others
    item = safeJsonParse(item);
    if (!item) return 'Error: Invalid data format'; // Handle parsing errors
  }

  switch (toolKey) {
    case 'tavily_search':
      // Handle array of objects (assuming item is now an array)
      return item.map(product => `Title: ${product.title || 'N/A'}\nDescription: ${product.description || 'N/A'}`).join('\n');
    case 'elasticsearch_lookup':
      // Extract and format if item is already a proper object
      return `Title: ${item.title || 'N/A'}\nDescription: ${item.description || 'N/A'}\nPrice: ${item.price || 'N/A'}\nURL: [View Here](${item.url || '#'})`;
    default:
      return item; // Default text handling
  }
};

  





  const typingIntervalRef = useRef(null);


  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch('https://api.ohel.ai/history', {
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
        
        const sessionsFromHistory = data.reduce((acc, chat) => {
          const sessionIndex = chat.chatsession;
          if (!acc[sessionIndex]) {
            acc[sessionIndex] = {
              id: sessionIndex,
              messages: []
            };
          }
          acc[sessionIndex].messages.push({ text: chat.user, sender: 'user' });
          acc[sessionIndex].messages.push({ text: chat.assistant, sender: 'bot' });
          return acc;
        }, {});

        const sessionsArray = Object.keys(sessionsFromHistory).map(key => sessionsFromHistory[key]);
        setSessions(sessionsArray);

        const activeSessionIndexFromHistory = data.findIndex(chat => chat.chatsession === '0');
        setActiveSessionIndex(activeSessionIndexFromHistory !== -1 ? activeSessionIndexFromHistory : 0);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchChatHistory();
  }, [userEmail]);

  const typeMessage = (message, sessionIndex) => {
    let typedMessage = '';
    const words = message.split(' ');
    let index = 0;
  
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
  
    typingIntervalRef.current = setInterval(() => {
      if (index < words.length) {
        typedMessage += words[index] + ' ';
        setSessions((currentSessions) => {
          const newSessions = currentSessions.map((session, idx) => {
            if (idx === sessionIndex) {
              const newMessages = [...session.messages];
              newMessages[0] = { ...newMessages[0], text: typedMessage.trim() };
              return { ...session, messages: newMessages };
            }
            return session;
          });
          return newSessions;
        });
        index++;
      } else {
        clearInterval(typingIntervalRef.current);
      }
    }, 200);
  };

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
                  onClick={(event) => handleDeleteSession(index, event)} //added 7/6/24
                  > 
                    <FaTimes />
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
                  <div className="message" dangerouslySetInnerHTML={{ __html: message.text }}></div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-row">
                <FaSpinner className="spinner" />
              </div>
            )}
          </div>

          <div className="input-area">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={handleKeyPress}
              rows={1}
              style={{ resize: 'none' }}
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

export default ChatbotPage;
