import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
// apiKey: 'AIzaSyDS_r9lIGkYi-v2k014NTI-1nW4dvzJTTU',

const genAI = new GoogleGenerativeAI('AIzaSyAqUCPu2C3BrFCf2urbF6aksW_bRs0prjc');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// const result = await model.generateContent([
//     "What's in this photo?",
//     {inlineData: {data: imgDataInBase64, mimeType: 'image/png'}}
// ]);


const Chatbot = () => {
  const [response, setResponse] = useState<string | null>(null);

  const getIngredients = async (prompt: string): Promise<string> => {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      return text;
    } catch {
      if ((Error as unknown as AxiosError).response && (Error as unknown as AxiosError).response!.status === 429) {
        throw new Error('Quota exceeded. Please try again later.');
      } else {
        throw new Error('An error occurred while fetching data.');
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getIngredients("give me a list of ingredients to make macarons");
      setResponse(result);
    };

    fetchData();
  }, []);

  return ( 
    <div className="chatbot">
      {response ? <p>{response}</p> : <p>Loading...</p>}
    </div>
   );
}
 
export default Chatbot;

// Extend the Window interface directly in the same file
// declare global {
//     interface Window {
//       GeminiChatbot: {
//         init: (config: { apiKey: string; containerId: string }) => void;
//         destroy: () => void;
//       };
//     }
//   }

// const Chatbot: React.FC = () => {
//   useEffect(() => {
//     // Function to load the external script
//     const loadScript = (src: string, onload: () => void) => {
//       const script = document.createElement('script');
//       script.src = src;
//       script.async = true;
//       script.onload = onload;
//       document.body.appendChild(script);
//     };

//     // Function to initialize the chatbot
//     const initializeChatbot = () => {
//       // Replace with actual initialization method from Gemini's documentation
//       if (window.GeminiChatbot) {
//         window.GeminiChatbot.init({
//           apiKey: 'AIzaSyDS_r9lIGkYi-v2k014NTI-1nW4dvzJTTU',
//           containerId: 'gemini-chatbot-container',
//           // Other configuration options as required by Gemini
//         });
//       }
//     };

//     // Load the script and initialize the chatbot
//     // FIX THIS BC ITS NOT DISPLAY CUZ OF THIS
//     loadScript('https://path.to.gemini.chatbot/sdk.js', initializeChatbot);

//     // Cleanup function to remove the script and destroy the chatbot instance if necessary
//     return () => {
//       const scripts = document.querySelectorAll('script[src="https://path.to.gemini.chatbot/sdk.js"]');
//       scripts.forEach((script) => script.remove());
//       if (window.GeminiChatbot) {
//         window.GeminiChatbot.destroy();
//       }
//     };
//   }, []);

//   return <div id="gemini-chatbot-container" />;
// };

// export default Chatbot;


// const genAI = new GoogleGenerativeAI('AIzaSyDS_r9lIGkYi-v2k014NTI-1nW4dvzJTTU');
// export default async function getRankedList(prompt) {
//     let model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
//     return text;
// }