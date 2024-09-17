import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai';
import '../styles/ChatBot.css'; // Import your CSS file for styling
import { useMutation, useQuery } from 'convex/react';
import { api } from "../../convex/_generated/api";
import { AxiosError } from 'axios';
import rawPrompt from '../prompt/prompt.txt';
import rawExamples from '../prompt/examples.txt';

const apiKey = import.meta.env.VITE_API_KEY;
if (!apiKey) {
  throw new Error("Missing API key");
}
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

interface ChatBotProps { 
  onRouteButtonClick: () => void; 
  onStoresUpdate: (stores: string[]) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({onRouteButtonClick, onStoresUpdate}) => {
  const savMsgToConvex2 = useMutation(api.functions.saveMsgs.saveMessage2);
  const parsedConvexMsgs2 = useQuery(api.functions.fetchMsgs.fetchAllParsed2);
  const convexMsgs2 = useQuery(api.functions.fetchMsgs.fetchAll2);

  const [botResponse, setBotResponse] = useState('');
  const [userInput, setUserInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [promptExamples, setPromptExamples] = useState('');
  const [stores, setStores] = useState<string[]>([]); // used to get the finalized list of stores

  fetch(rawPrompt) // read in the chatbot overarching prompt from prompt.txt
    .then(r => r.text())
    .then(text => {
      setPrompt(text);
  });

  fetch(rawExamples) // read in the chatbot examples from examples.txt
    .then(r => r.text())
    .then(text => {
      setPromptExamples(text);
  });

  // GET THE FINAL ROUTE
  useEffect(() => { 
    const getStores = async () => {
      if (botResponse.includes('finalized')) {
        const regex = /finalized list of stores you should stop at:\s*([^.]*)\./;
        const match = botResponse.match(regex);

        if (match) {
            const storeList = match[1].trim();
            const storesArray = storeList.split(',').map((store: string) => store.trim());

          console.log("FINALIZED STORES 1: " + storesArray.join(', '));

          setStores(storesArray);
          onStoresUpdate(storesArray);
        }
      }
    };
    getStores();
  }, [botResponse]);

  useEffect(() => {
    console.log("FINALIZED STORES 2: " + stores.join(', '));
  }, [stores]);

  // GENERATE THE CHATBOTS RESPONSE
  const getChatbotResponse = async (prompt: string): Promise<string> => {
    try { 
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      return text;
    } catch {
      if ((Error as unknown as AxiosError).response && (Error as unknown as AxiosError).response!.status === 429) {
        throw new Error('Quota exceeded. Please try again later 1.');
      } else {
        throw new Error('An error occurred while fetching data 1.');
      }
    }
  };

  const outputChatbotResponse = async (input: string) => {
    const result = await getChatbotResponse(`Here is the conversation history:\n${parsedConvexMsgs2}\nThe user's most recent response: ${input}\nThe overarching prompt:\n${prompt}\nAnd an example to help guide you in conversing and helping the user:\n${promptExamples}\nPlease generate a response based on all this information.`);
    setBotResponse(result); // set the chatbot's response to check for finalized list
    await savMsgToConvex2({ msg: result, type: "chat" }); 
  };

  const onSubmit = async () => { 
    try {
      await savMsgToConvex2({ msg: userInput, type: "user" }); 
      outputChatbotResponse(userInput); 
      setUserInput(''); // clear the textarea
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleKeyDown = (e: { key: string; shiftKey: any; preventDefault: () => void; }) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {convexMsgs2?.map((message: { type: string; msg: string | null | undefined; }, index: React.Key | null | undefined) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-content">
              <ReactMarkdown>{message.msg}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      <div className="bottom-container">
        <div className="input-bar">
            <textarea
              className="user-input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              style={{ resize: 'none', wordWrap: 'break-word'}}
              onKeyDown={handleKeyDown}
            ></textarea>
             <button className="send-button" onClick={onSubmit}>
              <img src="/refrigerator.png" alt="Refrigerator" className="send-image" />
           </button>
        </div>
        <button className="route-button" onClick={onRouteButtonClick}>
            <img src="/routeIconCircle.png" alt="Routing" />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;