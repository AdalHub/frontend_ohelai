import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import ProductPanel from '../components/ProductPanel';
import VideoPanel from '../components/VideoPanel';
import '../styles/chatbotPage.css';
import logo from '../images/OhelAiLogo.jpeg'; // Ensure the path to your image is correct
import { Link } from 'react-router-dom'; // Add this line

import { FaUserCircle, FaPaperPlane, FaTimes, FaSpinner} from 'react-icons/fa';//ADDED 7/6/24



function ChatbotPage() { //This is line 10
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));
  const [isLoading, setIsLoading] = useState(false); //added 7/6/24
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const [sessions, setSessions] = useState([
    { id: 0, name: '',messages: [] } // Initialize with an empty messages array
  ]);
  const [products, setProducts] = useState([]);

  const [videoIDs, setVideoIDs] = useState([]);

  const drawerRef = useRef();
  const [userInput, setUserInput] = useState('');

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    if (sessions.length === 0) {
      handleAddSession();
    }
  }, [sessions.length]);
  

  // Enhanced useEffect with console logs
  useEffect(() => {
    console.log('Switching sessions: clearing products and videos');
    setProducts([]);  // Clear products array
    setVideoIDs([]);  // Clear video IDs array
    console.log('Current Session Index:', activeSessionIndex);
    console.log('Current Products:', products);
    console.log('Current Videos:', videoIDs);
  }, [activeSessionIndex]);  // Depend on activeSessionIndex



  const handleSend = async () => {
    if (activeSessionIndex === -1 || !sessions[activeSessionIndex]) {
      handleAddSession();
      // Wait for the session to be added before proceeding
      setTimeout(() => {
        handleSend(); // Retry sending the message
      }, 100);
      return;
    }
  
    if (userInput.trim()) {
      const userMessage = { id: Date.now(), text: userInput, sender: 'user' };
  
      setSessions(currentSessions => {
        const newSessions = [...currentSessions];
        if (!newSessions[activeSessionIndex].messages.find(msg => msg.id === userMessage.id)) {
          const newMessages = [...newSessions[activeSessionIndex].messages, userMessage];
          newSessions[activeSessionIndex] = { ...newSessions[activeSessionIndex], messages: newMessages };
        } // Add logic to handle duplicate messages if needed
        return newSessions;
      });
  
      setUserInput(''); // Clear input after sending
      setIsLoading(true);  // Start loading
      let itemCollector;
          // Check if this is the first message in the current session
      const isFirstMessage =
        sessions[activeSessionIndex]?.messages.length === 0;

      try {
        // First fetch to get initial data
        const response = await fetch('https://api.ohel.ai/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: userInput, email: userEmail, session: activeSessionIndex, is_first_message: isFirstMessage }),
        });
  
        setIsLoading(false); // Stop loading
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
  
        console.log('API response:', data); // Log to inspect the structure
        
        // If the backend returns a session name, store it locally
        if (data.chatName) {
          // Force to string if it’s an object
          const chatNameString = typeof data.chatName === 'string'
            ? data.chatName
            : JSON.stringify(data.chatName);
        
          setSessions((prevSessions) => {
            const updated = [...prevSessions];
            updated[activeSessionIndex] = {
              ...updated[activeSessionIndex],
              name: chatNameString
            };
            return updated;
          });
        }

        if (data.elasticsearch_lookup || data.tavily_search) {
          itemCollector = data;
        }
  
        if (data.response) {
          typeMessage(data.response, activeSessionIndex);
        }
  
        if (data.youtube_search) {
          setVideoIDs(data.youtube_search); // Save the YouTube video IDs
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle error by adding an error message or similar
        setIsLoading(false);
      }
  
      try {
        if (itemCollector) {
          console.log('Item Collector:', itemCollector);
          const res= itemCollector.response;
          const ela= itemCollector.elasticsearch_lookup;
          const tav= itemCollector.tavily_search;

          // Second fetch to process and filter the search results
          const processResponse = await fetch('https://api.ohel.ai/process_search_results', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              response: res,
              elasticsearch_results: ela,
              tavily_results: tav,
            }),
          });
  
          const data2 = await processResponse.json();
          console.log('API response:', data2);
          
          // Extract relevant indices
          const relevantElasticIndices = data2.response?.relevant_elastic || [];
          const relevantTavilyIndices = data2.response?.relevant_tavily || [];
          console.log('Relevant Elastic Indices:', relevantElasticIndices);
          console.log('Relevant Tavily Indices:', relevantTavilyIndices);

          // Filter products based on relevant indices
          const relevantElasticProducts = relevantElasticIndices.map(index => {
            const items = itemCollector.elasticsearch_lookup || [];
            const item = items[index];
            if (item) {
              return {
                ...item,
                source: 'Elasticsearch'
              };
            }
            return null; // Or handle accordingly
          }).filter(item => item !== null);
          
          const relevantTavilyProducts = relevantTavilyIndices.map(index => {
            const items = itemCollector.tavily_search || [];
            const item = items[index];
            if (item) {
              return {
                ...item,
                source: 'Tavily'
              };
            }
            return null; // Or handle accordingly
          }).filter(item => item !== null);
          
  
          // Update the products state with only the relevant products
          setProducts([...relevantElasticProducts, ...relevantTavilyProducts]);
          console.log('Updated Products State:', [...relevantElasticProducts, ...relevantTavilyProducts]);
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle error by adding an error message or similar
        setIsLoading(false);
      }
    }
  };
  

  const handleAddSession = () => {
    const newSessionId = sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 0;
    const newSession = { id: newSessionId, messages: [] };
    setSessions(prevSessions => [...prevSessions, newSession]);
    setActiveSessionIndex(sessions.length); // Set to the new session's index
  
    
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





  useEffect(() => {
    return () => {
      // Cleanup intervals when component unmounts
      Object.values(typingIntervalRef.current).forEach(clearInterval);
    };
  }, []);
  
  


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


  const typingIntervalRef = useRef({});

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
              name: chat.name || '',        // <--- Retrieve the name from DB
              messages: []
            };
          }
          // If the DB stores name on every record, you can do a last-write-wins or first-write-wins
          // to set 'name' if it's blank:
          if (!acc[sessionIndex].name && chat.name) {
            acc[sessionIndex].name = chat.name;
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
    const messageId = Date.now() + Math.random(); // Ensure unique ID
  
    // Add a new message with empty text
    setSessions((currentSessions) => {
      const newSessions = currentSessions.map((session, idx) => {
        if (idx === sessionIndex) {
          const newMessages = [...session.messages];
          newMessages.push({ id: messageId, text: '', sender: 'bot' });
          return { ...session, messages: newMessages };
        }
        return session;
      });
      return newSessions;
    });
  
    let typedMessage = '';
    const words = message.split(' ');
    let index = 0;
  
    // Clear any existing interval for this message
    if (typingIntervalRef.current[messageId]) {
      clearInterval(typingIntervalRef.current[messageId]);
    }
  
    typingIntervalRef.current[messageId] = setInterval(() => {
      if (index < words.length) {
        typedMessage += words[index] + ' ';
        setSessions((currentSessions) => {
          const newSessions = currentSessions.map((session, idx) => {
            if (idx === sessionIndex) {
              const newMessages = session.messages.map(msg => {
                if (msg.id === messageId) {
                  return { ...msg, text: typedMessage.trim() };
                }
                return msg;
              });
              return { ...session, messages: newMessages };
            }
            return session;
          });
          return newSessions;
        });
        index++;
      } else {
        clearInterval(typingIntervalRef.current[messageId]);
        delete typingIntervalRef.current[messageId];
      }
    }, 24);
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
                <span>
                  {session.name ? session.name : `Session ${session.id + 1}`}
                </span>
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
          <div
            className={`chat-area-container ${sessions[activeSessionIndex]?.messages.length > 0 ? 'with-messages' : ''}`}
            style={{
              marginLeft: isDrawerOpen ? '250px' : '0',
              width: isDrawerOpen ? 'calc(100% - 250px)' : '100%',
            }}
          >
            {/*
              New wrapper: conditionally adds
              'with-messages' or 'no-messages'
            */}
            <div
              className={`header-and-messages-wrapper ${
                sessions[activeSessionIndex]?.messages.length > 0
                  ? 'with-messages'
                  : 'no-messages'
              }`}
            >
              <h2 className="chat-title">OhelAI, your Smart and Safe Shopping Guru Media!</h2>
              {/* Only render the messages area if there are messages */}
              {sessions[activeSessionIndex]?.messages.length > 0 && (
                <div className="messages-area">
                  <div className="messages-container">
                    {sessions[activeSessionIndex]?.messages.map((message, index) => (
                      <div key={index} className="message-row">
                        {message.sender === 'bot' ? (
                          <img src={logo} alt="Bot Logo" className="bot-icon icon-spacing" />
                        ) : (
                          <FaUserCircle className="user-icon icon-spacing" />
                        )}
                        <div className={`message-bubble ${message.sender}`}>
                          <div
                            className="message"
                            dangerouslySetInnerHTML={{ __html: message.text }}
                          ></div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="message-row">
                        <FaSpinner className="spinner" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div> {/* <-- Properly closed here instead of <div/> */}
  
            <div className="input-area-middle">
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
          </div>
  
          <ProductPanel products={products} />
          <VideoPanel videoIDs={videoIDs} />
        </div>
  
        <button
          className={`toggle-btn ${isDrawerOpen ? 'button-shift' : ''}`}
          onClick={toggleDrawer}
        >
          {isDrawerOpen ? '<' : '>'}
        </button>
      </div>
      
      <footer className="footer-nav">
        <div className="footer-links">
          <a href="/faq" className="footer-link">FAQs</a>
          <a href="/support" className="footer-link">Customer Support</a>
          <a href="/contact" className="footer-link">Contact Us</a>
          <Link to="/terms" className="footer-link">Terms of Service</Link>
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
  
  
}

export default ChatbotPage;

