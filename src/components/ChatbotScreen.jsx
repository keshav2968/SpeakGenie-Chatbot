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
      {/* This JSX is fine, but I'll update it to use the new CSS classes from Step 4 for you */}
      <div className="messages-display">
        {messages.map((msg, index) => (
            <div key={index} className={`message-container ${msg.sender}`}>
                <div className={`message ${msg.sender}`}>
                {msg.text}
                {/* Add this button logic for AI messages */}
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
        {isListening ? '...Listening...' : '🎤 Speak Now'}
      </button>
    </div>
  );
}

export default ChatbotScreen;