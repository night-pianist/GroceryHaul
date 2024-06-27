import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
// apiKey: 'AIzaSyAqUCPu2C3BrFCf2urbF6aksW_bRs0prjc',

// const genAI = new GoogleGenerativeAI('AIzaSyB5rLcXCczp92gxKXTORk3g_LJAzyBm9zA');
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const Chatbot = () => {
  // const [response, setResponse] = useState<string | null>(null);

  // const getIngredients = async (prompt: string): Promise<string> => {
  //   try {
  //     const result = await model.generateContent(prompt);
  //     const response = await result.response;
  //     const text = await response.text();
  //     return text;
  //   } catch {
  //     if ((Error as unknown as AxiosError).response && (Error as unknown as AxiosError).response!.status === 429) {
  //       throw new Error('Quota exceeded. Please try again later.');
  //     } else {
  //       throw new Error('An error occurred while fetching data.');
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const fetchData = async () => { 
  //     const result = await getIngredients("give me a list of ingredients to make macarons");
  //     setResponse(result);
  //   };

  //   fetchData();
  // }, []);

  return ( 
    <div className="chatbot">
      {/* {response ? <p>{response}</p> : <p>Loading...</p>}  */}
    </div>
   );
}
 
export default Chatbot;