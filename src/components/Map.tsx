import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map, Control } from 'mapbox-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css'; // for mapbox styling
import '../styles/Map.css';

// import geoJson from "./chicago-parks.json"; // used to import data to display

// const dotenv = require('dotenv');
// dotenv.config();

// console.log('Mapbox Token:', process.env.REACT_APP_MAPBOX_TOKEN);
// const mapbox_token: string = (process.env.REACT_APP_MAPBOX_TOKEN as string);
// console.log('Mapbox Token as string:', mapbox_token);

// mapboxgl.accessToken = String(process.env.REACT_APP_MAPBOX_TOKEN);
mapboxgl.accessToken = 'pk.eyJ1IjoiaGthbmcyMDUiLCJhIjoiY2x4cGVzem5vMG80azJxb2Voc29xbHN5MCJ9.JCkz5uwtuod3GKDXOzA-hg';

const successLocation = (position: GeolocationPosition) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    DestinationScreen(center)
    // Pass coordinates to DestinationScreen component
    return <DestinationScreen center={[longitude, latitude]} />;
};

const errorLocation = () => {
    console.error('Error getting location');
};

// Usage in React component or elsewhere
navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true
});
function DestinationScreen(ce
{
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [zoom, setZoom] = useState<number>(15); // Initialize with default zoom level

    useEffect(() => {
        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/dark-v11',
            center: <center></center>,
            zoom,
            attributionControl: false
        });

        // Cleanup function to remove map instance on unmount or re-render
        return () => {
            if (map.current) {
                map.current.remove();
            }
        };
    }, [center]); // Update map when center coordinates change

    return (
        <div className="map">
            <div className="sidebar">
                Longitude: {center[0]} | Latitude: {center[1]} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
};


