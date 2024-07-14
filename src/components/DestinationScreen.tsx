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
    // Array of all the routeInfos
    //[array_name, function that sets the array]
    const [routeInfos, setRouteInfos] = useState<Array<{ distance: number; duration: number; steps: string[]; routeCoordinates: any; routeName: string }>>([]); 
    const [inputData, addInputData] = useState<Array<{ routeName: string; storeList: string[]}>>([]);
    const [artists, setArtists] = useState([]);
    
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
    }, [lng, lat, zoom]);

     // Add routes when map is loaded
    useEffect(() => {
        const addRoutes = async () => {
            try {
                addNewRoute('Route 1', ['Walmart', 'Ralphs']);
                //console.log('Route 1 added');
                addNewRoute('Route 2', ['99 Ranch', 'Home Depot']);
                //console.log('Route 2 added');
            } catch (error) {
                console.error('Error adding routes:', error);
            }
        };

        if (map.current) {
            map.current.on('load', addRoutes);
        }
    }, []);


    useEffect(() => {
        const processRoutes = async () => {
            try {
                // Processing Input Data
                for (const route of inputData) {
                    //console.log("entered for loop");
                    const result = await getCoordinateForAddresses(route.storeList);
                    const coordDest = result.coordinatesString;
                    const geoPoints = result.geoPointsArr
                    //console.log("obtained route coordinates");
                    const routeCoords = await generateRouteInfo(coordDest, route.routeName);
                    //console.log("generated routeInfo");
                }
            } catch (error) {
                console.error('Error geocoding address:', error);
            }
        };
    
        if (inputData.length > 0) {
            processRoutes();
        }
    }, [inputData]);

    /* FUNCTION DEFINITIONS */
    // Adding a new route
    const addNewRoute = (routeName: string, storeList: string[]) => {
        addInputData(prevInputData => [
            ...prevInputData,
            { routeName, storeList }
        ]);
    };

    // Routing Function
    const fetchRouteInfo = async (coordRoute: string) => {
        const query = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${coordRoute}`
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

        return {
            distance: data.distance,
            duration: data.duration,
            steps: allSteps,
            routeCoordinates: route
        };
    }

    // Store Route Information
    const storeRouteInfo = (routeInfo: any, routeName: string, geoPoints: [[int]]) => {
        setRouteInfos(prevRouteInfos => [
            ...prevRouteInfos,
            {
                distance: routeInfo.distance,
                duration: routeInfo.duration,
                steps: routeInfo.steps.map((step: any) => step.instruction),
                routeCoordinates: routeInfo.routeCoordinates,
                routeName: routeName
                //geopoint declaration
            }
        ]);
    }

    //[[lattitude, longitude],[lattitude, longitude]]
    // var routeGeopoint = function (routeName, geoPoints)
    // var Card = function(rank, suit){
    //     this.rank = rank; 
    //     this.suit = suit
    //   }

    // displayRoute function
    // add geopoint parameter routInfo.geoPoints
    const displayRoute = (routeCoordinates: any) => {
        // add markers here
        //console.log("executing display route function");
        if (map.current) {
            const currentMap = map.current;
            const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: routeCoordinates
                }
            };
            // if the route already exists on the map, we'll reset it using setData
            if (currentMap.getSource('route')) {
                (currentMap.getSource('route') as mapboxgl.GeoJSONSource).setData(geojson);
                //console.log("no route displayed");
            } else {
                // otherwise, we'll make a new request
               // console.log("displaying a route");
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
        }
    };

    // generateRouteInfo returning routeCoordinates or null if failed
    const generateRouteInfo = async (coordRoute: string, routeName: string) => {
        const routeInfo = await fetchRouteInfo(coordRoute);
        if (routeInfo) {
            storeRouteInfo(routeInfo, routeName); //pass in geopoints [lattitude, longitude]
            //storeRouteInfo is to update the array
            //change the declaration o f
            return routeInfo.routeCoordinates;
        }
        return null;
    };

    // generateAndStoreRoutes processes multiple routes storing each route's info and not returning anything
    const generateAndStoreRoutes = async (routes: { name: string, addresses: string[]} []) => {
        for (const route of routes) {
            const coordRoute = await getCoordinateForAddresses(route.addresses);
            const routeInfo = await fetchRouteInfo(coordRoute);
            if (routeInfo) {
                storeRouteInfo(routeInfo, route.name);
            }
        }
    }

    // gets coordinate of a passed in name using forward geocoding (turning names passed in from Gemini to actual locations in the form of lng, lat)
    async function getCoordinate(addressName: string) {
        try {
            const encodedAddress = encodeURIComponent(addressName);
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${center[1], center[0]};${encodedAddress}.json`
                + `?proximity=${center[1]},${center[0]}`
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
    
    async function getCoordinateForAddresses(addressNamesList: string[]): Promise<{geoPointsArr: any[], coordinatesString: string}> {
        const currentMap = map.current;
        let coordinatesString: string = "";
        let geoPointsArr: any = []

        if (!currentMap) {
            console.error("Map is not initialized.");
            return geoPointsArr;
        }
        
        for (let addressName of addressNamesList) {
            console.log(addressName);
            let coordinate = await getCoordinate(addressName);
            coordinatesString += `${coordinate[0]},${coordinate[1]};`
            new mapboxgl.Marker().setLngLat(coordinate).addTo(currentMap)
            geoPointsArr.push(coordinate)
        }
          //     // Remove the trailing semicolon if it exists
        if (coordinatesString.endsWith(';')) {
            coordinatesString = coordinatesString.slice(0, -1);
        }

        console.log(geoPointsArr)
        // Remove the trailing semicolon if it exists
        return {geoPointsArr, coordinatesString}
    }
        
    return (
        <div className="map">
            <div ref={mapContainer} className="map-container" />
            <div className="sidebar">
                {/* <div>
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div> */}
                {routeInfos.length > 0 ? (
                    <div className="route-buttons">
                        {routeInfos.map((routeInfo, index) => (
                            <button key={index} onClick={() => displayRoute(routeInfo.routeCoordinates)}>
                                Display {routeInfo.routeName}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div>Loading routes...</div>
                )}
            </div>
        </div>
    );
}

export default DestinationScreen;

