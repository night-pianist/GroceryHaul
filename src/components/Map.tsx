import React, { useState } from 'react';
import ReactMapGL from "react-map-gl";

const Map = () => {
    const [viewport, setViewport] = useState({
        latitude: 34.0699,
        longitude: 118.4441,
        width: "100vw",
        height: "100vh",
        zoom: 10
    });

    return ( 
        <div className="map">
            <ReactMapGL
              { ...viewport } 
              mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
              mapStyle = "mapbox://styles/mapbox/outdoors-v12"
            //   onViewportChange={viewport => setViewport(viewport)}
            >

            </ReactMapGL>
        </div>
     );
}
 
export default Map;