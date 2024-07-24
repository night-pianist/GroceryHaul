import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai';
import '../styles/ChatBot.css'; // Import your CSS file for styling
import { useMutation, useQuery } from 'convex/react';
import { api } from "../../convex/_generated/api"
import { AxiosError } from 'axios';
import rawPrompt from '../prompt/prompt.txt';
import rawExamples from '../prompt/examples.txt';

const apiKey = 'AIzaSyBIrj-dFryj2Jbsb90WgMwrhl1L-2xHuLc';
const genAI = new GoogleGenerativeAI(apiKey!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
const apiKey2 = 'AIzaSyDpQmeHNkykz0T6rFDsP4z8tMn3fl9hDRM'
const genAI2 = new GoogleGenerativeAI(apiKey2!);
const model2 = genAI2.getGenerativeModel({ model: 'gemini-1.5-pro' });

interface ChatBotProps { onRouteButtonClick: () => void; }

const ChatBot: React.FC<ChatBotProps> = ({onRouteButtonClick}) => {
  const savMsgToConvex = useMutation(api.functions.saveMsgs.saveMessage);
  const parsedConvexMsgs = useQuery(api.functions.fetchMsgs.fetchAllParsed);
  const convexMsgs = useQuery(api.functions.fetchMsgs.fetchAll);
  // const savMsgToConvex = useMutation(api.functions.);

  const [botResponse, setBotResponse] = useState('');
  const [userInput, setUserInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [promptExamples, setPromptExamples] = useState('');
  // const [history, setHistory] = useState('');
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

  useEffect(() => { // get the calculated route
    const getStores = async () => {
      if (botResponse.includes('finalized')) {
        const responseText = botResponse;
        const result = await getChatbotResponse2(`You will be given a response that has a list of stores. Your job is to parse that list and output the names of the stores in the list in a string format. Here is the response:\n${responseText}`);
        // console.log("chat bot res: " + result);
        const storeList = result.split(',').map(store => store.trim()); // parses result
        console.log("FINALIZED STORES: " + storeList);
        setStores(storeList);
      }
    };
    getStores();
  }, [botResponse]);

  const getChatbotResponse2 = async (prompt: string): Promise<string> => {
    try { // generate the chatbot's response to parse the stores
      const result = await model2.generateContent(prompt);
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

  const getChatbotResponse = async (prompt: string): Promise<string> => {
    try { // generate the chatbot's response
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

  const outputChatbotResponse = async (input: string) => {
    // setHistory(JSON.stringify(parsedConvexMsgs));
    const result = await getChatbotResponse(`Here is the conversation history:\n${parsedConvexMsgs}\nThe user's most recent response: ${input}\nThe overarching prompt:\n${prompt}\nAnd an example to help guide you in conversing and helping the user:\n${promptExamples}\nPlease generate a response based on all this information.`);
    setBotResponse(result);
    saveChatMsgToConvex(result);
  };

  const saveUserMsgToConvex = async (text: string) => {
    await savMsgToConvex({ msg: text, type: "user" });
  }

  const saveChatMsgToConvex = async (text: string) => {
    await savMsgToConvex({ msg: text, type: "chat" });
  }

  const onSubmit = async () => { 
    try {
      saveUserMsgToConvex(userInput); 
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
        {convexMsgs?.map((message, index) => (
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
        {/* <button className="route-button" onClick={onRouteButtonClick}> R→ </button> */}
      </div>
    </div>
  );
};

export default ChatBot;

// {messages.map((message, index) => (
//   <div key={index} className={`message ${message.user}`}>
//     <div className="message-content">
//       <ReactMarkdown>{message.text}</ReactMarkdown>
//     </div>
//   </div>
// ))}