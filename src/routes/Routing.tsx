import React from 'react';
import Dropdown from './DropdownBtn';
import '../styles/Routing.css';
import { SignedIn, UserButton } from '@clerk/clerk-react';


interface RouteInfo {
    distFormatted: string;
    duration: string;
    stepsInstr: string[];
    stepsDist: string[];
    routeCoordinates: any; // Adjust type as per your actual data structure
    routeName: string;
    storeList: string[];
    addressList: string[];
    geoPointsArr: any[]; // Adjust type as per your actual data structure
}

interface Props {
    routeInfos: RouteInfo[];
    selectedRoute: RouteInfo | null;
    setSelectedRoute: React.Dispatch<React.SetStateAction<RouteInfo | null>>;
    displayRoute: (routeCoordinates: any, geoPointsArr: any[]) => void; // Adjust type as per your actual implementation
    onChatButtonClick: () => void;
}

const Routing: React.FC<Props> = ({ routeInfos, selectedRoute, setSelectedRoute, displayRoute, onChatButtonClick }) => {

    const formatPathName = (storeList: string[]) => {
        return storeList.join(' → ');
    };

    // routing return statement
    return (
        <div className="routing-container">
            <div className="top-container">
                <div className = "user-button-container">
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
                <button className="return-chat-btn" onClick={onChatButtonClick}>
                    <img src="/chatIconCircle.png" alt="goto chat btn" />
                </button>
                <div className="dropdown-wrapper">
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
                            displayRoute(routeCoordinates, geoPointsArr);
                        }}
                    />
                </div>
            </div>
            {selectedRoute && (
                <div className="route-info">
                    <div className="first-white-background">
                        <div className="white-background" style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{formatPathName(selectedRoute.storeList)}</span>
                        </div>
                    </div>
                    <div className="white-background">
                        <span style={{ color: '#0D99FF', fontSize: '18px', fontWeight: 'bold' }}>{selectedRoute.duration}</span>
                        <span style={{ color: '#757575', fontSize: '18px', fontWeight: 'bold' }}> ({selectedRoute.distFormatted})</span>
                    </div>
                    <div className="white-background" style={{ overflowY: 'auto', maxHeight: '75vh' }}>
                        <div className="pink-background">
                            <div className="text-styling">
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Current Location</span>
                                <br />
                                <span style={{ color: 'grey', fontSize: '0.8em' }}>Starting your adventures!</span>
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
    );
};

export default Routing;
