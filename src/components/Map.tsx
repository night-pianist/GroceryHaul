import React, { useState } from 'react';
import ReactMapGL from "react-map-gl";
import '../styles/Map.css';

const Map = () => {
    const [viewport, setViewport] = useState({
        latitude: 34.0699, // ucla latitude and longitude as default
        longitude: -118.4441,
        width: "100vw", // fix map isnt showing full screen
        height: "100vh",
        zoom: 10
    });

    const handleViewportChange = () => {
        setViewport(viewport);
      };    

    return ( 
        <div className="map">
            <ReactMapGL
              { ...viewport } 
              mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
              mapStyle = "mapbox://styles/mapbox/dark-v11"
            //   onViewportChange={handleViewportChange}
            >

            </ReactMapGL>
        </div>
     );
}
 
export default Map;