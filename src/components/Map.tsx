import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Control } from 'mapbox-gl'; 
import '../styles/Map.css';

// const dotenv = require('dotenv');
// dotenv.config();

// console.log('Mapbox Token:', process.env.REACT_APP_MAPBOX_TOKEN);
// const mapbox_token: string = (process.env.REACT_APP_MAPBOX_TOKEN as string);
// console.log('Mapbox Token as string:', mapbox_token);
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;


// mapboxgl.accessToken = 'pk.eyJ1IjoiaGthbmcyMDUiLCJhIjoiY2x4cGVzem5vMG80azJxb2Voc29xbHN5MCJ9.JCkz5uwtuod3GKDXOzA-hg';

    
export default function DestinationScreen() {
    const container = useRef<HTMLDivElement>(null); // specify type for map container
    const map = useRef<mapboxgl.Map | null>(null); // specify type for map instance
    const mapContainer = useRef(null);
    const [lng, setLng] = useState(-118.4441);
    const [lat, setLat] = useState(34.0699);
    const [zoom, setZoom] = useState(15);
    
    useEffect(() => {
        if (map.current) return;
    
        map.current = new mapboxgl.Map({
            container: mapContainer.current as unknown as HTMLElement, // Type guard
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [lng, lat],
            zoom: zoom,
            attributionControl: false
        });
    })
    
    return (
        <div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
    
}

