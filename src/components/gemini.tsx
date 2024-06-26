import React, { useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
// apiKey: 'AIzaSyDS_r9lIGkYi-v2k014NTI-1nW4dvzJTTU',

// const genAI = new GoogleGenerativeAI('AIzaSyDS_r9lIGkYi-v2k014NTI-1nW4dvzJTTU');

const Chatbot: React.FC = () => {
  useEffect(() => {
    // Function to load the external script
    const loadScript = (src: string, onload: () => void) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = onload;
      document.body.appendChild(script);
    };

    // Function to initialize the chatbot
    const initializeChatbot = () => {
      // Replace with actual initialization method from Gemini's documentation
      if (window.GeminiChatbot) {
        window.GeminiChatbot.init({
          apiKey: 'AIzaSyDS_r9lIGkYi-v2k014NTI-1nW4dvzJTTU',
          containerId: 'gemini-chatbot-container',
          // Other configuration options as required by Gemini
        });
      }
    };

    // Load the script and initialize the chatbot
    loadScript('https://path.to.gemini.chatbot/sdk.js', initializeChatbot);

    // Cleanup function to remove the script and destroy the chatbot instance if necessary
    return () => {
      const scripts = document.querySelectorAll('script[src="https://path.to.gemini.chatbot/sdk.js"]');
      scripts.forEach((script) => script.remove());
      if (window.GeminiChatbot) {
        window.GeminiChatbot.destroy();
      }
    };
  }, []);

  return <div id="gemini-chatbot-container" />;
};

export default Chatbot;


// export default async function getRankedList(prompt) {
//     let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
//     return text;
// }