import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai';
import '../styles/ChatBot.css'; // Import your CSS file for styling
import { useMutation, useQuery } from 'convex/react';
import { api } from "../../convex/_generated/api"
import { AxiosError } from 'axios';
import rawPrompt from '../prompt/prompt.txt';

const apiKey = 'AIzaSyBIrj-dFryj2Jbsb90WgMwrhl1L-2xHuLc';
const genAI = new GoogleGenerativeAI(apiKey!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

interface ChatBotProps { onRouteButtonClick: () => void; }

const ChatBot: React.FC<ChatBotProps> = ({onRouteButtonClick}) => {
  const savMsgToConvex = useMutation(api.functions.saveMsgs.saveMessage);
  const convexMsgs = useQuery(api.functions.fetchMsgs.fetchAll);
  // const savMsgToConvex = useMutation(api.functions.);

  const [response, setResponse] = useState('');
  const [userInput, setUserInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState('');

  fetch(rawPrompt)
    .then(r => r.text())
    .then(text => {
      // console.log("PROMPT: " + text);
      setPrompt(text);
  });


  const getChatbotResponse = async (prompt: string): Promise<string> => {
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

  const outputChatbotResponse = async (input: string) => {
    // const result = await getChatbotResponse(`generate a list of ingredients to make ${input}`);
    console.log("PROMPT: " + prompt + " INPUT: " + input + " CONVEX: " + convexMsgs);
    const result = await getChatbotResponse(`generate a response based on ${prompt} and ${input} and previous answers ${convexMsgs}`);
    setResponse(result);
    console.log("CHATBOT: " + response);
    saveChatToConvex(response);
  };

  const saveChatToConvex = async (text: string) => {
    await savMsgToConvex({
      msg: text,
      type: "test", 
    });
  }

  const onSubmit = async () => { 
    try {
      saveChatToConvex(userInput); 
      outputChatbotResponse(userInput); 
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  // const onSubmitToTestFetch = async () => {
  //   try {
  //     console.log("CONVEX DATA R: " + JSON.stringify(convexMsgs));
  //   } catch (error) {
  //     console.error('Error fetching message:', error);
  //   }
  // };


  return (
    <div className="chat-container">
      <div className="chat-history">
        {/* {messages.map((message, index) => (
          <div key={index} className={`message ${message.user}`}>
            <div className="message-content">
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          </div>
        ))} */}
      </div>
      <div className="bottom-container">
        <div className="input-bar">
            <textarea
              className="user-input"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              style={{ resize: 'none', wordWrap: 'break-word'}}
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
