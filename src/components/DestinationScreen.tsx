import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map, Control } from 'mapbox-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css'; // for mapbox styling
import '../styles/DestinationScreen.css';
import axios, { AxiosError } from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI('AIzaSyB5rLcXCczp92gxKXTORk3g_LJAzyBm9zA');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

// import geoJson from "./chicago-parks.json"; // used to import data to display

// const dotenv = require('dotenv');
// dotenv.config();

// console.log('Mapbox Token:', process.env.REACT_APP_MAPBOX_TOKEN);
// const mapbox_token: string = (process.env.REACT_APP_MAPBOX_TOKEN as string);
// console.log('Mapbox Token as string:', mapbox_token);

// mapboxgl.accessToken = String(process.env.REACT_APP_MAPBOX_TOKEN);
mapboxgl.accessToken = 'pk.eyJ1IjoiaGthbmcyMDUiLCJhIjoiY2x4cGVzem5vMG80azJxb2Voc29xbHN5MCJ9.JCkz5uwtuod3GKDXOzA-hg';

  
// const successLocation = (position: GeolocationPosition) => {
//     const latitude = position.coords.latitude;
//     const longitude = position.coords.longitude;
//     // Pass coordinates to DestinationScreen component
//     return <DestinationScreen center={[longitude, latitude]} />;
// };
// Define props interface for DestinationScreen component
// interface DestinationScreenProps {
//     center: [number, number]; // Tuple for longitude and latitude
// }

// // Function to render the DestinationScreen component with coordinates
// const successLocation = (position: GeolocationPosition) => {
//     const latitude = position.coords.latitude;
//     const longitude = position.coords.longitude;
//     // Pass coordinates to DestinationScreen component
//     return <DestinationScreen center={[longitude, latitude]} />;
// };

// export default function DestinationScreen() {
    // const DestinationScreen: React.FC<DestinationScreenProps> = ({ center }) => {

const defaultLatitude = 34.0699; 
const defaultLongitude = -10.4441;

interface DestinationScreenProps {
    // center: [latitude: number, longitude: number]; // Define center as a tuple with named properties
    center: [ number, number ]; // Define center as a tuple with named properties
}

const DestinationScreen: React.FC<DestinationScreenProps> = ({ center }) => {
    const container = useRef<HTMLDivElement>(null); // specify type for container and map
    const map = useRef<mapboxgl.Map | null>(null); 
    const mapContainer = useRef(null);
    // const [lng, setLng] = useState(-118.4441); // use UCLA lat, lng as default 
    // const [lat, setLat] = useState(34.0699);
    const [lng, setLng] = useState(center[1]); // Access longitude from the tuple
    const [lat, setLat] = useState(center[0]); // Access latitude from the tuple
    const [zoom, setZoom] = useState(15);
    
    useEffect(() => {
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
        <div className="map">
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className="map-container" /> 
            <div className="chatbot">
                <form onSubmit={handleSubmit} className="form">
                    {/* <label className="subtitle">Enter your request:</label> */}
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
        </div>
    );
}

export default DestinationScreen;
