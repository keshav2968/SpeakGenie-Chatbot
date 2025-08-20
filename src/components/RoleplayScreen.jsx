// src/components/RoleplayScreen.jsx

import { useState, useEffect } from 'react';
import { scenarios } from '../scenarios'; // Import our scenarios
import { getAIResponse } from '../ai'; // Import our reusable AI function

// Speech Recognition setup (same as ChatbotScreen)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;

function RoleplayScreen() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  
  // Text-to-Speech function (same as ChatbotScreen)
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startConversation = (scenario) => {
    setSelectedScenario(scenario);
    // The AI starts the conversation
    const initialMessage = { sender: 'ai', text: scenario.starter };
    setMessages([initialMessage]);
    speakText(scenario.starter);
  };

  const handleUserSpeech = async (transcript) => {
    if (!transcript || !selectedScenario) return;

    const userMessage = { sender: 'user', text: transcript };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    
    setIsResponding(true);

    const fullConversation = currentMessages.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
    const aiResponse = await getAIResponse(fullConversation, selectedScenario.prompt);
    
    const aiMessage = { sender: 'ai', text: aiResponse };
    setMessages(prev => [...prev, aiMessage]);
    speakText(aiResponse);

    setIsResponding(false);
  };
  
  useEffect(() => {
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      handleUserSpeech(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
  }, [selectedScenario, messages]); // Re-attach listeners if scenario changes

  const handleListen = () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="roleplay-container">
      {!selectedScenario ? (
        // SCENARIO SELECTION VIEW
        <div>
          <h2>Select a Scenario</h2>
          {scenarios.map((scenario) => (
            <button key={scenario.id} onClick={() => startConversation(scenario)}>
              {scenario.title}
            </button>
          ))}
        </div>
      ) : (
        // CONVERSATION VIEW
        <div style={{ textAlign: 'center' }}>
          <h3>Roleplay: {selectedScenario.title}</h3>
          <div className="messages-display" style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
            {messages.map((msg, index) => (
              <p key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                <strong>{msg.sender === 'user' ? 'You' : 'Character'}:</strong> {msg.text}
              </p>
            ))}
            {isResponding && <p><i>Thinking...</i></p>}
          </div>
          <button onClick={handleListen} disabled={isResponding}>
            {isListening ? '...Listening...' : '🎤 Speak Your Reply'}
          </button>
          <br />
          <button style={{marginTop: '20px'}} onClick={() => setSelectedScenario(null)}>
            &larr; Back to Scenarios
          </button>
        </div>
      )}
    </div>
  );
}

export default RoleplayScreen;