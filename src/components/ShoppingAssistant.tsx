import React, { useState } from 'react';

function ShoppingAssistant() {
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  async function sendMessage() {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput, apiKey }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        setAiResponse(`Error: ${data.error.message}`);
      } else {
        setAiResponse(data.candidates[0].output);
      }
    } catch (error) {
      console.error('Error fetching response:', error);
      setAiResponse('An error occurred. Please try again later.');
    }
  }

  return (
    <div>
      <input 
        type="text" 
        value={userInput} 
        onChange={e => setUserInput(e.target.value)} 
      />
      <button onClick={sendMessage}>Submit</button>
      <div>{aiResponse}</div>
    </div>
  );
}

export default ShoppingAssistant;
