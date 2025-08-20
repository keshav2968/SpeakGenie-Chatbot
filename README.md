# SpeakGenie AI Voice Tutor - Internship Task

This project is a real-time AI Voice English Tutor built for the SpeakGenie internship selection process. It allows young learners to practice their English speaking skills through a general Q&A chatbot and interactive roleplaying scenarios.

---

## ✨ Features

* **Real-Time Voice Conversation:** Users can speak to the AI tutor and receive spoken responses, creating a natural conversational flow.
* **AI Tutor Mode:** A general-purpose chatbot that can answer questions about English grammar, vocabulary, and more.
* **Roleplay Mode:** Users can practice real-life conversations in different scenarios like "At the Store" or "At School."
* **Smart Speaking Tips:** The AI provides gentle, corrective feedback on the user's grammar to help them improve.
* **Native Language Playback:** AI responses can be translated and played back in Hindi for better understanding.
* **Polished UI:** A clean, modern chat interface with clear visual distinction between the user and the AI.

---

## 🛠️ Technologies Used

* **Frontend:** React, Vite
* **AI Services:**
    * **Language Model:** OpenAI GPT-3.5 Turbo API
    * **Speech-to-Text:** Browser's Web Speech API
    * **Text-to-Speech:** Browser's Web SpeechSynthesis API
* **Styling:** Plain CSS

---

## 🚀 How to Run Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later recommended)
* npm

### Installation & Setup

1.  Clone the repository (or download the source code).
2.  Navigate to the project directory in your terminal:
    ```sh
    cd speakgenie-tutor
    ```
3.  Install the necessary packages:
    ```sh
    npm install
    ```
4.  Create a `.env` file in the root of the project.
5.  Add your OpenAI API key to the `.env` file:
    ```
    VITE_OPENAI_API_KEY=your_api_key_here
    ```
6.  Start the development server:
    ```sh
    npm run dev
    ```
7.  Open your browser and go to `http://localhost:5173` (or whatever address the terminal shows).