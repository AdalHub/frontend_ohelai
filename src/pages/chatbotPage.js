import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import ProductPanel from '../components/ProductPanel';
import '../styles/chatbotPage.css';
import logo from '../images/OhelAiLogo.jpeg'; // Ensure the path to your image is correct

import { FaUserCircle, FaPaperPlane, FaTimes, FaSpinner} from 'react-icons/fa';//ADDED 7/6/24
//const userEmail = localStorage.getItem('userEmail');
//console.log(userEmail)

function ChatbotPage() { //This is line 10
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));
  const [isLoading, setIsLoading] = useState(false); //added 7/6/24
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const [sessions, setSessions] = useState([
    { id: 0, messages: [{ text: "Hello, welcome to your Shopping Assistant, how can I help you?", sender: 'bot' }] }
  ]);
  const [products, setProducts] = useState([]);


  const drawerRef = useRef();
  const [userInput, setUserInput] = useState('');

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSend = async () => {
    if (!sessions[activeSessionIndex]) {
      handleAddSession(); // Initialize a new session if none exists
      return; // Return after initializing to allow state update
    }

    if (userInput.trim()) {
      const userMessage = { id: Date.now(), text: userInput, sender: 'user' };
  
      setSessions(currentSessions => {
        const newSessions = [...currentSessions];
        if (!newSessions[activeSessionIndex].messages.find(msg => msg.id === userMessage.id)) {
          const newMessages = [...newSessions[activeSessionIndex].messages, userMessage];
          newSessions[activeSessionIndex] = { ...newSessions[activeSessionIndex], messages: newMessages };
        }//add the opposite of this if saying sorry message repeat
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

        // Inside the handleSend function after fetching data
        if (data.elasticsearch_lookup) {
          setProducts(data.elasticsearch_lookup.map(item => ({
            ...item,
            source: 'Elasticsearch'
          })));
        }

        if (data.tavily_search) {
          setProducts(products => [...products, ...data.tavily_search.map(item => ({
            ...item,
            source: 'Tavily'
          }))]);
        }
  
        
      } catch (error) {
        console.error('Error:', error);
        // Handle error by adding an error message or similar
        setIsLoading(false); // ADDED 7/6/24
      }
    }
  };
  let messageIdCounter = 0;
  const generateUniqueMessageId = () => {
    return Date.now() + (messageIdCounter++);
  };
  

  const formatMessage = (item, toolKey) => {
    if (toolKey === 'elasticsearch_lookup') {
      return `Title: ${item?.title || 'N/A'}
  Description: ${item?.description || 'N/A'}
  Price: ${item?.price || 'N/A'}
  Rating: ${item?.rating || 'N/A'}
  URL: <a href="${item?.url || '#'}" target="_blank">View Here</a>
  Image: <img src="${item?.image || 'https://placehold.it/150'}" alt="Product Image" style="max-width:100%;height:auto;">`;
    } else {
      return `Title: ${item?.title || 'N/A'}
  Description: ${item?.description || 'N/A'}
  Price: ${item?.price || 'N/A'}
  URL: <a href="${item?.url || '#'}" target="_blank">View Here</a>
  Image: <img src="${item?.image || 'https://placehold.it/150'}" alt="Product Image" style="max-width:100%;height:auto;">`;
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
      if (activeSessionIndex === sessionIndex) {//if your deleteing the chat that your currently on
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


  


  // Listen for changes in local storage
  useEffect(() => {
    const handleStorageChange = () => {
      console.log("Storage changed!");
      setUserEmail(localStorage.getItem('userEmail')); // Update userEmail when local storage changes
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const typingIntervalRef = useRef(null);

  useEffect(() => {
    console.log("Using react effects");
    const fetchChatHistory = async () => {
      console.log("fetching chat history");
      if (!userEmail) {
        console.log("No user email available yet.");//ensures user email is availabel
        setTimeout(fetchChatHistory, 1000); // Retry after 1 second
        return;
      }  
      console.log("Attempting to fetch history with email:", userEmail);

      try {
        const response = await fetch('https://api.ohel.ai/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: userEmail }),
        });
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched data:", data);
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
  
        // Synchronously update sessions and active session index
        await new Promise(resolve => {
          setSessions(sessionsArray, () => resolve());
        });
  
        const activeSessionIndexFromHistory = data.findIndex(chat => chat.chatsession === '0');
        setActiveSessionIndex(activeSessionIndexFromHistory !== -1 ? activeSessionIndexFromHistory : 0);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchChatHistory();
  }, [userEmail]); // Ensure useEffect runs when userEmail changes

  if (!userEmail) {
    return <div>Loading user information...</div>; // Show a loading screen if userEmail is not yet available
  }
  
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
      <div className="main-container">
        <div className={`side-drawer ${isDrawerOpen ? 'open' : ''}`} ref={drawerRef}>
          <div className="drawer-title">
            Sessions
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
                  onClick={(event) => handleDeleteSession(index, event)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="chat-and-product-container">
          <div className="chat-area-container" style={{ marginLeft: isDrawerOpen ? '250px' : '0', width: isDrawerOpen ? 'calc(100% - 250px)' : '100%' }}>
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
          <ProductPanel products={products} />
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
