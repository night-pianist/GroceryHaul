// import React, { useState, useEffect } from 'react';

// // Import the necessary modules from the Google Generative AI SDK
// import { GoogleGenerativeAI } from '@google/generative-ai';

// // Get the API key from the environment variables
// const apiKey = 'AIzaSyBIrj-dFryj2Jbsb90WgMwrhl1L-2xHuLc';

// const ChatBot: React.FC = () => {
//   const [userMessage, setUserMessage] = useState('');
//   const [botResponse, setBotResponse] = useState('');
//   const [savedResponse, setSavedResponse] = useState('');
//   const [stores, setStores] = useState<string[]>([]);
//   const ogStores: string[] = [];
//   interface Message { // message interface to display the chat history
//     user: string;
//     text: string;
//   }
//   const [messages, setMessages] = useState<Message[]>(() => { // set up for the msg interface 
//     const savedMessages = localStorage.getItem('messages'); // set up for chat history
//     return savedMessages ? JSON.parse(savedMessages) : []; 
//   });
//   //debugging 
//   // const testing = 'testing';
//   // const [debugResult, setDebugResult] = useState('');

//   // Initialize the Generative AI model
//   const genAI = new GoogleGenerativeAI(apiKey!);
//   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

//   const generationConfig = {
//     temperature: 1,
//     topP: 0.95,
//     topK: 64,
//     maxOutputTokens: 8192,
//     responseMimeType: 'text/plain',
//   };
//   //debugging 
//   // useEffect(() => {
//   //   if (testing.includes('testing')) {
//   //     setDebugResult('Message updated');
//   //     setBotResponse('Here is the finalized list of stores you should stop at: Ralphs, Costco, Smart & Final.')
//   //   }
//   // }, [userMessage]);

//   useEffect(() => {
//     if (botResponse.includes('finalized')) {
//       const responseText = botResponse;
//       setSavedResponse(responseText);
//       // setDebugResult('if statement for botresponse works')

//       const ogStores: string[] = [];
//       let startIndex = responseText.indexOf(':') + 1;
//       let endIndex = responseText.indexOf('.', startIndex);

//       while (startIndex < endIndex) {
//         const commaIndex = responseText.indexOf(',', startIndex);
//         const store = commaIndex !== -1 && commaIndex < endIndex 
//           ? responseText.slice(startIndex, commaIndex).trim()
//           : responseText.slice(startIndex, endIndex).trim();

//         if (store) {
//           ogStores.push(store);
//         }

//         startIndex = commaIndex !== -1 && commaIndex < endIndex 
//           ? commaIndex + 1
//           : endIndex + 1;
//       }

//       setStores((prevStores) => [...prevStores, ...ogStores]);
//     }
//   }, [botResponse]);

//   const updateMessages = (userMessage: string, botMessage: string) => {
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { user: 'user', text: userMessage },
//       { user: 'bot', text: botMessage },
//     ]);
//   };

//   const sendMessage = async () => {
//     try {
//       const chatSession = model.startChat({
//         generationConfig,
//         history: [
//           {
//             role: "user",
//             parts: [
//               {text: "You are a friendly assistant that helps users with their shopping errands.\nThey will provide a food item they want you to make and you will respond with a recipe to make that food item. Save the recipe to give the user later but immediately respond with the list of ingredients the user would need to fulfill that recipe. Also, check what the user's location is and what stores they most prefer to shop at.\nFor each of those ingredients, make a list of the stores that considers distance (stores that are closest to the user’s location) and the prices of the ingredients at those stores (want to be most cost effective so low prices). This list will be titled the Economical List. Then make a list of the stores that considers the user’s store preferences and the prices of the ingredients at each of those stores (want to be most cost effective so low prices). This list will be the Preferential List. After the user gives the stores they prefer to shop at, do not respond until you have both the Economical List and the Preferential List to send.  Give the user each list of stores and ask the user for feedback on which list they would prefer to use to do their shopping. Then confirm and send that list with the response following the template of “Here is the finalized list of stores you should stop at: *insert list of stores here*”.  First only respond with the list of the store names. Then in the next sentence after the aforementioned template, you may offer more details about the stores and ingredients. \nIf they are satisfied, respond with the recipe.\nPlease await the user's input.\n"},
//             ],
//           },
//           {
//             role: "model",
//             parts: [
//               {text: "Okay, I'm ready to help!  Tell me, what tasty dish are you whipping up today?  Once I know what you're making, please also share your location and the stores you prefer to shop at. I'll then find the most economical places to get your ingredients, considering both distance and your favorite stores. Let's get cooking! 🛒😊  \n"},
//             ],
//           },
//         ],
//       });
//       const result = await chatSession.sendMessage(userMessage);
//       const responseText = await result.response.text();
//       setBotResponse(responseText);
//       updateMessages(userMessage, responseText);

//       console.log(userMessage);
//       console.log(responseText);

//     } catch (error) {
//       console.error('Error sending message:', error);
//     }
//   };

//   return (
//     <div>
      
//       <h1>ChatBot</h1>
//       <textarea
//         value={userMessage}
//         onChange={(e) => setUserMessage(e.target.value)}
//       ></textarea>
//       <button onClick={sendMessage}>Send</button>
//       <div>
//         <h2>Bot Response:</h2>
//         <p>{botResponse}</p>
//       </div>
      
//       <div>
//         <h2>Stores:</h2>
//         <ul>
//           {stores.map((response, index) => (
//             <li key={index}>{response}</li>
//           ))}
//         </ul>
//         <p>{ogStores}</p>
//         {/* debugging */}
//         {/* <p>{debugResult}</p> */}
//         <div className="chat-history">
//           {messages.map((message, index) => (
//             <div key={index}>
//               {message.user === 'user' ? (
//                 <strong className="user-message">You: </strong>
//               ) : (
//                 <strong className="bot-message">Grocery-Haul: </strong>
//               )}
//               <div className="chat-response">
//                 <p>{message.text}</p>
//                 <p>{index}</p>
//               </div>
//             </div>
//           ))}
          
//         </div>
//       </div>
      
//     </div>
//   );
// };

// export default ChatBot;

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai';
import '../styles/ChatBot.css'; // Import your CSS file for styling

const apiKey = 'AIzaSyBIrj-dFryj2Jbsb90WgMwrhl1L-2xHuLc';

const ChatBot: React.FC = () => {
  const [userMessage, setUserMessage] = useState('');
  const [botResponse, setBotResponse] = useState('');
  const [messages, setMessages] = useState<{ user: string; text: string }[]>(() => {
    const savedMessages = localStorage.getItem('messages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const genAI = new GoogleGenerativeAI(apiKey!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
  };

  const updateMessages = (userMessage: string, botMessage: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: 'user', text: userMessage },
      { user: 'bot', text: botMessage },
    ]);
  };

  const sendMessage = async () => {
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              { text: "You are a friendly assistant that helps users with their shopping errands. They will provide a food item they want you to make and you will respond with a recipe to make that food item. Save the recipe to give the user later but immediately respond with the list of ingredients the user would need to fulfill that recipe. Also, check what the user's location is and what stores they most prefer to shop at. For each of those ingredients, make a list of the stores that considers distance (stores that are closest to the user’s location) and the prices of the ingredients at those stores (want to be most cost effective so low prices). This list will be titled the Economical List. Then make a list of the stores that considers the user’s store preferences and the prices of the ingredients at each of those stores (want to be most cost effective so low prices). This list will be the Preferential List. After the user gives the stores they prefer to shop at, do not respond until you have both the Economical List and the Preferential List to send. Give the user each list of stores and ask the user for feedback on which list they would prefer to use to do their shopping. Then confirm and send that list with the response following the template of “Here is the finalized list of stores you should stop at: *insert list of stores here*”. First only respond with the list of the store names. Then in the next sentence after the aforementioned template, you may offer more details about the stores and ingredients. If they are satisfied, respond with the recipe. Please await the user's input." },
            ],
          },
          {
            role: "model",
            parts: [
              { text: "Okay, I'm ready to help! Tell me, what tasty dish are you whipping up today? Once I know what you're making, please also share your location and the stores you prefer to shop at. I'll then find the most economical places to get your ingredients, considering both distance and your favorite stores. Let's get cooking! 🛒😊" },
            ],
          },
        ],
      });
      const result = await chatSession.sendMessage(userMessage);
      const responseText = await result.response.text();
      setBotResponse(responseText);
      updateMessages(userMessage, responseText);

      console.log(userMessage);
      console.log(responseText);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    const chatContainer = document.querySelector('.input-bar');
    if (chatContainer) {
      const brElements = chatContainer.querySelectorAll('br');
      brElements.forEach(br => {
        br.parentNode?.removeChild(br); // Use optional chaining to prevent null error
      });
    }
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <div className="chat-container">
      <div className="chat-history">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.user}`}>
            <div className="message-content">
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      <div className="input-bar">
        <textarea
          className="user-input"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ resize: 'none', wordWrap: 'break-word'}}
        ></textarea>
        <button className="send-button" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;
