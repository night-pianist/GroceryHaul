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

// mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
mapboxgl.accessToken = 'pk.eyJ1IjoiaGthbmcyMDUiLCJhIjoiY2x4cGVzem5vMG80azJxb2Voc29xbHN5MCJ9.JCkz5uwtuod3GKDXOzA-hg';

    
export default function DestinationScreen() {
    const container = useRef<HTMLDivElement>(null); // specify type for container and map
    const map = useRef<mapboxgl.Map | null>(null); 
    const mapContainer = useRef(null);
    const [lng, setLng] = useState(-118.4441); // use UCLA lat, lng as default 
    const [lat, setLat] = useState(34.0699);
    const [zoom, setZoom] = useState(15);
    
    useEffect(() => {
        if (map.current) return; // initialize map only once
    
        map.current = new mapboxgl.Map({
            container: mapContainer.current as unknown as HTMLElement, // type guard
            style: 'mapbox://styles/mapbox/dark-v11',
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

        // Create default markers
        // geoJson.features.map((feature) =>
        //     new mapboxgl.Marker().setLngLat(feature.geometry.coordinates).addTo(map)
        // );
    })
    
    return (
        <div className="map">
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>  
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}

