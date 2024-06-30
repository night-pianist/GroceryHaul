import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map, Control } from 'mapbox-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css'; // for mapbox styling
import '../styles/DestinationScreen.css';
import axios, { AxiosError } from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyB5rLcXCczp92gxKXTORk3g_LJAzyBm9zA');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const PROMPT_PATH = './prompt.txt'

// import geoJson from "./chicago-parks.json"; // used to import data to display

// const dotenv = require('dotenv');
// dotenv.config();

// console.log('Mapbox Token:', process.env.REACT_APP_MAPBOX_TOKEN);
// const mapbox_token: string = (process.env.REACT_APP_MAPBOX_TOKEN as string);
// console.log('Mapbox Token as string:', mapbox_token);

// mapboxgl.accessToken = String(process.env.REACT_APP_MAPBOX_TOKEN);
mapboxgl.accessToken = 'pk.eyJ1IjoiaGthbmcyMDUiLCJhIjoiY2x4cGVzem5vMG80azJxb2Voc29xbHN5MCJ9.JCkz5uwtuod3GKDXOzA-hg';

interface DestinationScreenProps { // for the map display
    center: [ number, number ]; // Define center as a tuple with named properties
}

interface Message { // for the chat history
    user: string;
    text: string;
}

const DestinationScreen: React.FC<DestinationScreenProps> = ({ center }) => {
    const container = useRef<HTMLDivElement>(null); // specify type for container and map
    const map = useRef<mapboxgl.Map | null>(null); 
    const mapContainer = useRef(null);
    const [lng, setLng] = useState(center[1]); // Access longitude from the tuple
    const [lat, setLat] = useState(center[0]); // Access latitude from the tuple
    const [zoom, setZoom] = useState(15);

    const [promptText, setPromptText] = useState<string>(''); // to read prompt for gemini
    const readPromptFile = async (): Promise<string> => {
        try {
          const response = await fetch('/prompt.txt');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const text = await response.text();
          return text;
        } catch (error) {
          console.error('Error reading the prompt file:', error);
          throw error;
        }
    };

    const [messages, setMessages] = useState<Message[]>([]); // for the chat history
    
    useEffect(() => {
        const fetchPromptText = async () => {
            try {
              const text = await readPromptFile();
              setPromptText(text);
            } catch (error) {
              console.error('Failed to fetch prompt text:', error);
            }
        };
      
        fetchPromptText();

        if (map.current) return; // initialize map only once
    
        map.current = new mapboxgl.Map({
            container: mapContainer.current as unknown as HTMLElement, // type guard
            style: 'mapbox://styles/mapbox/dark-v11', // can change style to whatever
            center: [lng, lat],
            zoom: zoom,
            attributionControl: false
        });

        // add navigation control 
        map.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true,
                showUserHeading: true
            }), 'top-right'
        );

        // update lat/long values when map is moved 
        const onMove = () => {
            if (map.current) {
                const newLng = parseFloat(map.current.getCenter().lng.toFixed(4)); // convert to number to be used in setState
                const newLat = parseFloat(map.current.getCenter().lat.toFixed(4));
                const newZoom = parseFloat(map.current.getZoom().toFixed(2)); 
    
                setLng(newLng); // update states with respective new values 
                setLat(newLat); 
                setZoom(newZoom); 
            }
        };
        map.current.on('move', onMove);   
    })

    // const [response, setResponse] = useState<string | null>(null);
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
        const result = await getIngredients(`${promptText} ${input}`);
        setMessages((prevMessages) => [...prevMessages, { user: 'bot', text: result }]);
        // setResponse(result);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newMessage = { user: 'user', text: userInput };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        fetchData(userInput);
        setUserInput('');
    };

    return (
        <div className="map">
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className="map-container" /> 
            <div className="chatbot">
                <div className="chat-history">
                    {messages.map((message, index) => (
                        <div key={index} className={message.user === 'user' ? 'user-message' : 'bot-message'}>
                        <strong>{message.user}: </strong>
                        {message.text}
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        value={userInput} 
                        onChange={(e) => setUserInput(e.target.value)} 
                        required 
                    />
                    <button type="submit">Submit</button>
                </form>
                {/* {response ? <p>{response}</p> : <p>Loading...</p>} */}
            </div>
        </div>
    );
}

export default DestinationScreen;
