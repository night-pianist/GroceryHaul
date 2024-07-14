import React, { useRef, useEffect, useState } from 'react';
import mapboxgl, { Map, Control, GeoJSONSourceRaw } from 'mapbox-gl'; 
import 'mapbox-gl/dist/mapbox-gl.css'; // for mapbox styling
import '../styles/Map.css';
import Dropdown from './DropdownBtn';

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
    const [routeInfos, setRouteInfos] = useState<Array<{ distFormatted: string; duration: string; stepsInstr: string[]; stepsDist: string[]; routeCoordinates: any; routeName: string; storeList: string[]; addressList: string[]; geoPointsArr: any[]}>>([]); 
    // Input data from the chatbot will be stored in this array
    const [inputData, addInputData] = useState<Array<{ routeName: string; storeList: string[]}>>([]);
    // Keeps track of selected route
    const [selectedRoute, setSelectedRoute] = useState<{ distFormatted: string; duration: string; stepsInstr: string[]; stepsDist: string[]; routeCoordinates: any; routeName: string; storeList: string[]; addressList: string[] } | null>(null);
    const [prevMarkers, setPrevMarkers] = useState<mapboxgl.Marker[]>([]);
    
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
                    const coordDest = await getCoordinateForAddresses(route.storeList);
                    const pathName = await formatPathName(route.storeList);
                    await generateRouteInfo(coordDest.coordinates, route.routeName, route.storeList, coordDest.matchingPlaceNames, coordDest.geoPointsArr);
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
            `https://api.mapbox.com/directions/v5/mapbox/driving/${center[1]},${center[0]};${coordRoute}`
            + `?steps=true`
            + `&banner_instructions=true`
            + `&geometries=geojson`
            + `&overview=full`
            + `&annotations=distance,duration`
            + `&voice_instructions=true`
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

        let allSteps: { instruction: string; distance: string; announcement: string }[] = [];

        data.legs.forEach((leg: any) => {
            let stepsWithDistance = leg.steps.map((step: any) => ({
                instruction: step.maneuver.instruction,
                distance: formatDistance2(step.distance),
                announcement: step.voiceInstructions && step.voiceInstructions[0]?.announcement || ""
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
    const storeRouteInfo = (routeInfo: any, routeName: string, storeList: string[], addressList: string[], geoPointsArr: any[]) => {
        const distance = formatDistance1(routeInfo.distance);
        
        const durationInSeconds = routeInfo.duration;
        const hours = Math.floor(durationInSeconds / 3600);
        const minutes = Math.floor((durationInSeconds % 3600) / 60);

        const durationFormatted = hours > 0
            ? `${hours} hr ${minutes} min`
            : `${minutes} min`;

        setRouteInfos(prevRouteInfos => [
            ...prevRouteInfos,
            {
                distFormatted: distance,
                duration: durationFormatted,
                stepsInstr: routeInfo.steps.map((step: any) => step.instruction),
                stepsDist: routeInfo.steps.map((step: any) => step.distance),
                routeCoordinates: routeInfo.routeCoordinates,
                routeName: routeName,
                storeList: storeList,
                addressList: addressList,
                geoPointsArr: geoPointsArr
            }
        ]);
    }

    // storeRouteInfo helper function
    const formatDistance1 = (distance: number) => {
        let distanceFormatted = "";
        if (distance < 160 && distance > 0) {
            const distInFeet = Math.floor(distance * 3);
            distanceFormatted = `${distInFeet} feet`;
        }
        else if (distance >= 160) {
            const distInMiles = Math.round(distance * 0.000621371192237 * 10) / 10;
            distanceFormatted = `${distInMiles} miles`;
        }
        return distanceFormatted;
    }

    const formatDistance2 = (distance: number) => {
        let distanceFormatted = "";
        if (distance < 160 && distance > 0) {
            const distInFeet = Math.floor(distance * 3);
            distanceFormatted = `${distInFeet} ft`;
        }
        else if (distance >= 160) {
            const distInMiles = Math.round(distance * 0.000621371192237 * 10) / 10;
            distanceFormatted = `${distInMiles} mi`;
        }
        return distanceFormatted;
    }

    // displayRoute function
    // add geopoint parameter routInfo.geoPoints
    const displayRoute = (routeCoordinates: any, geoPointsArr: any[]) => {
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
                console.log("Route updated");
                console.log(geoPointsArr)
                console.log("Previous Markers")
                console.log(prevMarkers)
                prevMarkers.forEach(markers => markers.remove())
                console.log(prevMarkers)
                removeAllMarkers()
                displayMarkers(geoPointsArr)
            } else {
                // otherwise, we'll make a new request
                console.log("Displaying a new route");
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
                displayMarkers(geoPointsArr);
            }
        }
    };
    // Marker Implementation
    const addMarker = (marker: mapboxgl.Marker) => {
        setPrevMarkers(prevMarkers => [...prevMarkers, marker]);
    };

    const removeAllMarkers = () => {
        setPrevMarkers([]);
    };

    const displayMarkers = (geoPointsArr: any[]) => {
        const currentMap = map.current;
        if (!currentMap) {
            console.error("Map is not initialized.");
            return;
        }
        for (let i = 0; i < geoPointsArr.length; i++) {
            var oneMarker= new mapboxgl.Marker().setLngLat(geoPointsArr[i]).addTo(currentMap)
            addMarker(oneMarker)
        }
        console.log("first previous markers")
        console.log(prevMarkers)
    }

    // formatPathName
    const formatPathName = (addressNameList: string[]) => {
        let formattedPathName: string = "";
        for (let addressName of addressNameList) {
            formattedPathName += addressName + ' → ';
        }

        if (formattedPathName.endsWith(' → ')) {
            formattedPathName = formattedPathName.slice(0, -3);
        }

        return formattedPathName;
    };

    // generateRouteInfo returning routeCoordinates or null if failed
    const generateRouteInfo = async (coordRoute: string, routeName: string, storeList: string[], addressList: string[], geoPointsArr: any[]) => {
        const routeInfo = await fetchRouteInfo(coordRoute);
        if (routeInfo) {
            storeRouteInfo(routeInfo, routeName, storeList, addressList, geoPointsArr);
            return routeInfo.routeCoordinates;
        }
        return null;
    };

    // generateAndStoreRoutes processes multiple routes storing each route's info and not returning anything
    // const generateAndStoreRoutes = async (routes: { name: string, addresses: string[]} []) => {
    //     for (const route of routes) {
    //         const coordRoute = await getCoordinateForAddresses(route.addresses);
    //         const routeInfo = await fetchRouteInfo(coordRoute.coordinates);
    //         if (routeInfo) {
    //             storeRouteInfo(routeInfo, route.name, route.addresses, coordRoute.matchingPlaceNames);
    //         }
    //     }
    // }

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
                const feature = data.features[0];
                return {
                    coordinates: feature.center,
                    matchingPlaceName: feature.matching_place_name || feature.place_name
                };
            } else {
                console.error('No features found for the given address');
                return null;
            } 
        } catch (error) {
            console.error('Error geocoding address:', error);
            return null;
        }
    }

    // getCoordinate helper function
    const formatMatchingPlaceName = (address: string) => {
        // Split the address by commas
        const parts = address.split(',');

        // Remove store name (first part) and country name (last part)
        const storeAndCountryRemoved = parts.slice(1, -1).join(', ').trim();

        return storeAndCountryRemoved;
    }

    // geoCode address list (converts list of names to a list of pairs of location (lng, lat))
    async function getCoordinateForAddresses(addressNamesList: string[]): Promise<{ coordinates: string; matchingPlaceNames: string[], geoPointsArr: any[]}> {
        let coordinatesString: string = "";
        let geoPointsArr: any = []
        let matchingPlaceNames: string[] = [];
        for (let addressName of addressNamesList) {
            console.log(addressName);
            let feature = await getCoordinate(addressName);
            if (feature) {
                console.log('Feature found:', feature);
                coordinatesString += `${feature.coordinates[0]},${feature.coordinates[1]};`
                matchingPlaceNames.push(formatMatchingPlaceName(feature.matchingPlaceName));
                geoPointsArr.push(feature.coordinates)
            } else {
                console.error('Feature is null for address:', addressName);
            }
        }
          //     // Remove the trailing semicolon if it exists
        if (coordinatesString.endsWith(';')) {
            coordinatesString = coordinatesString.slice(0, -1);
        }
        return {
            coordinates: coordinatesString,
            matchingPlaceNames: matchingPlaceNames,
            geoPointsArr: geoPointsArr
        };
    }

    console.log("routeInfos:", routeInfos);
    return (
        <div className="display-container">
            <div className="graybox">
                <Dropdown 
                    routes={routeInfos.map(route => ({ 
                        name: route.routeName, 
                        coordinates: route.routeCoordinates,
                        geoPointsArr: route.geoPointsArr
                    }))} 
                    onSelectRoute={(routeName, routeCoordinates, geoPointsArr) => {
                        const selected = routeInfos.find(route => route.routeName === routeName);
                        if (selected) {
                            setSelectedRoute(selected);
                        }
                        console.log(`Selected route: ${routeName}`);
                        displayRoute(routeCoordinates, geoPointsArr)
                    }}
                />
                {selectedRoute && (
                    <div className="route-info">
                        <div className="first-white-background">
                            <div className="white-background" style={{textAlign: 'center'}}>
                                <span style={{fontSize: '1.2em', fontWeight: 'bold'}}>{formatPathName(selectedRoute.storeList)}</span>
                            </div>
                        </div>
                        <div className="white-background">
                            <span style={{color: '#0D99FF', fontSize: '18px', fontWeight: 'bold'}}>{selectedRoute.duration}</span>
                            <span style={{color: '#757575', fontSize: '18px', fontWeight: 'bold'}}> ({selectedRoute.distFormatted})</span>
                        </div>
                        <div className="white-background" style={{ overflowY: 'auto', maxHeight: '75vh' }}>
                        <div className="pink-background">
                            <div className="text-styling">
                                <span style={{fontSize: '18px', fontWeight: 'bold'}}>Current Location</span>
                                <br />
                                <span style={{ color: 'grey', fontSize: '0.8em'}}>Starting your adventures!</span>
                            </div>
                        </div>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {selectedRoute && (
                                    // Use a for loop to iterate through selectedRoute.stepsInstr length
                                    (() => {
                                        const items = [];
                                        let storeIndex = 0; // Initialize storeIndex

                                        for (let i = 0; i < selectedRoute.stepsInstr.length; i++) {
                                            const step = selectedRoute.stepsInstr[i];

                                            items.push(
                                                <li key={i} className="step-item">
                                                    {step} 
                                                    <br />
                                                    {
                                                        selectedRoute.stepsDist[i] !== "" ? (
                                                            <span style={{ display: 'flex', alignItems: 'center', color: 'grey', fontSize: '0.8em' }}>
                                                                {selectedRoute.stepsDist[i]}
                                                                <span className="grey-line"></span>
                                                            </span>
                                                        ) : (
                                                            <div className="pink-background">
                                                                <div className="text-styling">
                                                                    <span style={{ fontSize: '18px', fontWeight: 'bold'}}>{selectedRoute.storeList[storeIndex]}</span>
                                                                    <br />
                                                                    <span style={{ color: 'grey', fontSize: '0.8em'}}>{selectedRoute.addressList[storeIndex]}</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </li>
                                            );
                                            if (selectedRoute.stepsDist[i] === "") {storeIndex += 1}
                                        }
                                        return items;
                                    })()
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
            <div ref={mapContainer} className = "map-container" />
        </div>
    )
}

export default DestinationScreen;

