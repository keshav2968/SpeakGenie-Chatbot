/**
 * RoleplayScreen component allows users to select a roleplay scenario and interact with an AI character using speech recognition and text-to-speech.
 * The AI starts the conversation based on the selected scenario, and the user can reply by speaking.
 * The conversation is displayed in a chat-like interface.
 *
 * State:
 * - selectedScenario: The currently selected scenario object from the scenarios list, or null if none selected.
 * - messages: Array of message objects representing the conversation history. Each message has a sender ('user' or 'ai') and text.
 * - isListening: Boolean indicating if speech recognition is currently active.
 * - isResponding: Boolean indicating if the AI is generating a response.
 *
 * Functions:
 * - speakText(text): Uses the Web Speech API to speak the given text aloud.
 * - startConversation(scenario): Initializes a new conversation with the selected scenario, setting the first AI message.
 * - handleUserSpeech(transcript): Handles the user's spoken input, updates the conversation, and gets the AI's response.
 * - handleListen(): Toggles speech recognition on or off.
 *
 * Effects:
 * - useEffect: Sets up speech recognition event handlers and re-attaches them when the selected scenario or messages change.
 *
 * Render:
 * - If no scenario is selected, displays a list of available scenarios for the user to choose from.
 * - If a scenario is selected, displays the conversation, a button to start/stop listening, and a button to go back to scenario selection.
 */

/**
 * scenarios
 * Imported array of scenario objects, each containing:
 * - id: Unique identifier for the scenario.
 * - title: Display name of the scenario.
 * - starter: The initial message from the AI character.
 * - prompt: Additional prompt/context for the AI.
 */

/**
 * getAIResponse
 * Imported async function that takes the full conversation and scenario prompt,
 * and returns the AI's next response as a string.
 */

/**
 * SpeechRecognition
 * Web Speech API interface for speech recognition, used to capture user's spoken replies.
 */

/**
 * recognition
 * Instance of SpeechRecognition, configured for English and non-continuous listening.
 */

/**
 * speakText
 * @function
 * @param {string} text - The text to be spoken aloud using the browser's speech synthesis.
 */

/**
 * startConversation
 * @function
 * @param {Object} scenario - The scenario object selected by the user.
 * Initializes the conversation with the scenario's starter message.
 */

/**
 * handleUserSpeech
 * @function
 * @param {string} transcript - The user's spoken input as text.
 * Adds the user's message to the conversation, gets the AI's response, and updates the conversation.
 */

/**
 * handleListen
 * @function
 * Toggles the speech recognition on or off based on the current listening state.
 */
// src/components/RoleplayScreen.jsx

import { useState, useEffect } from 'react';
import { scenarios } from '../scenarios'; 
import { getAIResponse } from '../ai'; 


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
            {isListening ? '...Listening...' : 'Speak Your Reply'}
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