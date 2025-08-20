import { useState } from 'react';
import ChatbotScreen from './components/ChatbotScreen';
import RoleplayScreen from './components/RoleplayScreen';
import './index.css';

function App() {
  const [mode, setMode] = useState('chatbot'); // 'chatbot' or 'roleplay'

  return (
    <div className="container">
      <h1>SpeakGenie AI Tutor</h1>
      <div className="tabs">
        <button onClick={() => setMode('chatbot')}>AI Tutor</button>
        <button onClick={() => setMode('roleplay')}>Roleplay</button>
      </div>
      
      {mode === 'chatbot' ? <ChatbotScreen /> : <RoleplayScreen />}
    </div>
  );
}

export default App;