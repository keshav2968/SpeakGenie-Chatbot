/**
 * ChatbotScreen.jsx
 * 
 * This component implements an interactive English tutor chatbot for children aged 8-12.
 * It uses speech recognition for user input and speech synthesis for AI responses.
 * The AI provides simple, encouraging feedback and grammar tips, and can translate its responses to Hindi.
 * 
 * Features:
 * - Listens to user's speech and transcribes it.
 * - Sends user input to an AI model with a tutor prompt for a friendly, simple response.
 * - AI checks user's grammar and provides a speaking tip if needed.
 * - AI response is spoken aloud using speech synthesis.
 * - Option to translate AI response to Hindi and speak it.
 * - Displays chat history with user and AI messages.
 * 
 * Dependencies:
 * - React (useState, useEffect)
 * - getAIResponse: Function to get AI's response (imported from '../ai')
 * - translateText: Function to translate text (imported from '../ai')
 * 
 * Constants:
 * @constant {string} TUTOR_PROMPT - Prompt for the AI to act as a friendly English tutor, including instructions for grammar correction and emoji ending.
 * 
 * Variables:
 * @var {SpeechRecognition|null} recognition - Instance of browser's SpeechRecognition API, initialized if available.
 * 
 * State:
 * @state {boolean} isListening - Whether the app is currently listening for user speech.
 * @state {Array<{sender: string, text: string}>} messages - Array of chat messages between user and AI.
 * @state {boolean} isResponding - Whether the AI is currently generating a response.
 * 
 * Functions:
 * @function speakText
 * @description Uses browser speech synthesis to speak a given text aloud.
 * @param {string} text - The text to be spoken.
 * 
 * @function handleUserSpeech
 * @description Handles the main logic when user speech is transcribed: adds user message, gets AI response, adds AI message, and speaks AI response.
 * @param {string} transcript - The transcribed user speech.
 * 
 * @function handleListen
 * @description Starts speech recognition and sets listening state.
 * 
 * @function handleTranslateAndSpeak
 * @description Translates given text to Hindi and speaks it aloud.
 * @param {string} text - The text to translate and speak.
 * 
 * useEffect:
 * - Initializes SpeechRecognition instance and sets up event handlers for result, end, and error.
 * - Cleans up event handlers and aborts recognition on unmount.
 * 
 * Render:
 * - Displays chat messages with sender distinction.
 * - Shows a button to translate and speak AI messages in Hindi.
 * - Shows a loading indicator when AI is responding.
 * - Provides a button to start listening for user speech.
 * 
 * @component
 */
import { useState, useEffect } from 'react';
import { getAIResponse, translateText } from '../ai';

// These can stay outside the component as they don't change.
const TUTOR_PROMPT = `You are SpeakGenie, a friendly and patient English tutor for a child aged 8-12. Your tone is encouraging and simple. Keep your responses short.
After your main response, check if the user's last sentence had any grammatical errors.
If it did, provide a single, simple correction on a new line, starting with "💡 Speaking tip:".
For example, if the user says 'What is apples?', you could add '
💡 Speaking tip: To ask about more than one, you can say, "What *are* apples?".'
If the user's grammar is perfect, do not add a speaking tip.
Always end your entire response with a fun, relevant emoji.`;

// SpeechRecognition will be initialized in useEffect to avoid SSR/window issues
let recognition = null;
if (typeof window !== 'undefined') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
  }
}

function ChatbotScreen() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isResponding, setIsResponding] = useState(false);

  // Function for AI to speak
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1;
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  // This function will run the main logic
  const handleUserSpeech = async (transcript) => {
    if (!transcript) return;

    const userMessage = { sender: 'user', text: transcript };
    setMessages(prev => [...prev, userMessage]);
    
    setIsResponding(true);

    // Get AI response and add it to the chat
    // *** FIX: Pass the TUTOR_PROMPT as the second argument ***
    const aiResponse = await getAIResponse(transcript, TUTOR_PROMPT);
    const aiMessage = { sender: 'ai', text: aiResponse };
    setMessages(prev => [...prev, aiMessage]);

    // Speak the AI's response
    speakText(aiResponse);

    setIsResponding(false);
  };

  useEffect(() => {
    let localRecognition = null;
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        localRecognition = new SpeechRecognition();
        localRecognition.continuous = false;
        localRecognition.lang = 'en-US';
        localRecognition.interimResults = false;

        localRecognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          handleUserSpeech(transcript);
        };

        localRecognition.onend = () => setIsListening(false);
        localRecognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }
    }
    // Store recognition instance for use in handlers
    recognition = localRecognition;

    // Cleanup
    return () => {
      if (localRecognition) {
        localRecognition.onresult = null;
        localRecognition.onend = null;
        localRecognition.onerror = null;
        localRecognition.abort && localRecognition.abort();
      }
    };
  }, []); // This dependency array is correct

  const handleListen = () => {
    if (!recognition) return;
    recognition.start();
    setIsListening(true);
  };
    
    const handleTranslateAndSpeak = async (text) => {
      console.log("Translating text:", text);
      const translatedText = await translateText(text, "Hindi");
      console.log("Translated text:", translatedText);
  
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = 'hi-IN'; // Set the language code for Hindi
      window.speechSynthesis.speak(utterance);
    };

  return (
    <div className="chatbot-container">
      <div className="messages-display">
        {messages.map((msg, index) => (
            <div key={index} className={`message-container ${msg.sender}`}>
                <div className={`message ${msg.sender}`}>
                {msg.text}
                {msg.sender === 'ai' && (
                    <button 
                    onClick={() => handleTranslateAndSpeak(msg.text)} 
                    style={{ color: 'black', marginLeft: '10px', fontSize: '10px', padding: '2px 8px', verticalAlign: 'middle' }}>
                    🇮🇳
                    </button>
                )}
                </div>
            </div>
            ))}
        {isResponding && <div className="loading-indicator">🧠 Thinking...</div>}
      </div>
      <button onClick={handleListen} disabled={isResponding}>
        {isListening ? '...Listening...' : 'Speak Now'}
      </button>
    </div>
  );
}

export default ChatbotScreen;