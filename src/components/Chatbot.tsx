import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
// apiKey: 'AIzaSyAqUCPu2C3BrFCf2urbF6aksW_bRs0prjc',

const genAI = new GoogleGenerativeAI('AIzaSyB5rLcXCczp92gxKXTORk3g_LJAzyBm9zA');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const Chatbot = () => {
  const [response, setResponse] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<string>(''); // get user input

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

  const fetchData = async (input: string) => {
    const result = await getIngredients(`generate a list of ingredients to make ${input}`);
    setResponse(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(userInput);
  };

  return ( 
    <div className="chatbot">
      <form onSubmit={handleSubmit}>
        <label className="subtitle">Enter your request:</label>
        <input 
          type="text" 
          value={userInput} 
          onChange={(e) => setUserInput(e.target.value)} 
          required 
        />
        <button type="submit">Submit</button>
      </form>
      {response ? <p>{response}</p> : <p>Loading...</p>}
    </div>
   );
}
 
export default Chatbot;