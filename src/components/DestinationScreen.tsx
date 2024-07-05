import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map, Control, GeoJSONSourceRaw } from 'mapbox-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css'; // for mapbox styling
import '../styles/Map.css';

// mapboxgl.accessToken = String(process.env.REACT_APP_MAPBOX_TOKEN);
mapboxgl.accessToken = 'pk.eyJ1IjoiaGthbmcyMDUiLCJhIjoiY2x4cGVzem5vMG80azJxb2Voc29xbHN5MCJ9.JCkz5uwtuod3GKDXOzA-hg';

interface DestinationScreenProps {
    // center: [latitude: number, longitude: number]; // Define center as a tuple with named properties
    center: [ number, number ]; // Define center as a tuple with named properties
}

const DestinationScreen: React.FC<DestinationScreenProps> = ({ center }) => {
    const map = useRef<mapboxgl.Map | null>(null); 
    const mapContainer = useRef(null);
    const [lng, setLng] = useState(center[1]); // Access longitude from the tuple
    const [lat, setLat] = useState(center[0]); // Access latitude from the tuple
    const [zoom, setZoom] = useState(15);
    const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number; steps: string[] } | null>(null);
    
    useEffect(() => {
        if (map.current) return; // initialize map only once
    
        map.current = new mapboxgl.Map({
            container: mapContainer.current as unknown as HTMLElement, // type guard
            style: 'mapbox://styles/mapbox/streets-v12', // can change style to whatever
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

        // Routing Function
        const start = center;
        const currentMap = map.current;

        const getRoute = async (coordRoute: string) => {
            const query = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${start[1]},${start[0]};${coordRoute}`
                + `?steps=true`
                + `&banner_instructions=true`
                + `&geometries=geojson`
                + `&overview=full`
                + `&annotations=distance,duration`
                + `&access_token=${mapboxgl.accessToken}`,      
                { method: 'GET' }
            );
            const json = await query.json();
            if (!json.routes || !json.routes[0]) {
                console.error('No routes found');
                return;
            }
            const data = json.routes[0];
            const route = data.geometry.coordinates;

            let allSteps: { instruction: string; distance: number }[] = [];

            data.legs.forEach((leg: any) => {
                let stepsWithDistance = leg.steps.map((step: any) => ({
                    instruction: step.maneuver.instruction,
                    distance: step.distance
                }));
                allSteps = allSteps.concat(stepsWithDistance);
            });

            const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: route
                }
            };
            // if the route already exists on the map, we'll reset it using setData
            if (currentMap.getSource('route')) {
                (currentMap.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson);
            } else {
                // otherwise, we'll make a new request
                currentMap.addLayer({
                    id: 'route',
                    type: 'line',
                    source: {
                        type: 'geojson',
                        data: geojson
                    },
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#3887be',
                        'line-width': 5,
                        'line-opacity': 0.75
                    }
                });
            }

            // Extract instructions into an array of strings
            const instructions = allSteps.map(step => step.instruction);

            // Update route information state
            setRouteInfo({
                distance: data.distance,
                duration: data.duration,
                steps: instructions
            });
        }

        // geoCode Addresses (turning names passed in from Gemini to actual locations in the form of lng, lat)
        async function geocodeAddress(addressName: string) {
            try {
                const encodedAddress = encodeURIComponent(addressName);
                const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json`
                    + `?proximity=${start[1]},${start[0]}`
                    + `&types=poi`
                    + `&fuzzyMatch=true`
                    + `&limit=1`
                    + `&access_token=${mapboxgl.accessToken}`
                )
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data.features && data.features.length > 0) {
                    // Return the coordinates of the first feature
                    return data.features[0].center;
                } else {
                    console.error('No features found for the given address');
                    return null;
                } 
            } catch (error) {
                console.error('Error geocoding address:', error);
                return null;
            }
        }

        // geoCode address list (converts list of names to a list of pairs of location (lng, lat))
        async function getCoordinateForAddresses(addressNamesList: string[]): Promise<string> {
            let coordinatesString: string = "";

            for (let addressName of addressNamesList) {
                console.log(addressName);
                let coordinate = await geocodeAddress(addressName);
                coordinatesString += `${coordinate[0]},${coordinate[1]};`;
                console.log(coordinatesString);
            }

            // Remove the trailing semicolon if it exists
            if (coordinatesString.endsWith(';')) {
                coordinatesString = coordinatesString.slice(0, -1);
            }

            return coordinatesString;
        }


        // geoCode tester
        map.current.on('load', async () => {
            console.log('Map loaded!');
            try {
                let routePoints = await getCoordinateForAddresses(['Ralphs', 'Walmart']);
                console.log(routePoints);
                getRoute(routePoints);
            } catch (error) {
                console.error('Error geocoding address:', error);
            }
        })


        // // Event listener for click events to get directions
        // map.current.on('click', (event) => {
        //     const coords = [event.lngLat.lat, event.lngLat.lng];
        //     const end: mapboxgl.GeoJSONSourceRaw = {
        //         type: 'geojson',
        //         data: {
        //             type: 'FeatureCollection',
        //             features: [
        //                 {
        //                     type: 'Feature',
        //                     properties: {},
        //                     geometry: {
        //                         type: 'Point',
        //                         coordinates: coords
        //                     }
        //                 }
        //             ]
        //         }
        //     };
        //     if (currentMap.getLayer('end')) {
        //         const source = currentMap.getSource('end') as mapboxgl.GeoJSONSource | undefined;
        //         if (source) {
        //             source.setData(end.data as GeoJSON.FeatureCollection);
        //         } else {
        //             console.error('Source is undefined.');
        //         }
        //     } else {
        //         currentMap.addLayer({
        //             id: 'end',
        //             type: 'circle',
        //             source: {
        //                 type: 'geojson',
        //                 data: end.data
        //             },
        //             paint: {
        //                 'circle-radius': 10,
        //                 'circle-color': '#f30'
        //             }
        //         });
        //     }
        //     getRoute(coords as [number, number]);

        // });
        
    })

    // Display route information
    console.log('Route Info:', routeInfo);

    return (
        <div className="map">
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}

export default DestinationScreen;

