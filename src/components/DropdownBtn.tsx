import React, { useState, useRef, useEffect } from 'react';
import '../styles/Dropdown.css'; // Import the corresponding CSS file for the dropdown

interface DropdownProps {
    routes: { name: string; coordinates: any }[];
    onSelectRoute: (routeName: string, routeCoordinates: any) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ routes, onSelectRoute }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleRouteClick = (route: { name: string; coordinates: any }) => {
        setSelectedRoute(route.name);
        setIsOpen(false);
        onSelectRoute(route.name, route.coordinates);
    };

    // console.log("Dropdown props:", routes); // Add this console.log to check props
    return (
        <div className="dropdown-center" ref={dropdownRef}>
            <button className="dropdown-button" onClick={toggleDropdown}>
                {selectedRoute || 'Select a Route'}
            </button>
            <ul className={`dropdown-menu ${isOpen ? 'active' : ''}`}>
                {routes.map((route, index) => (
                    <li key={index} className="dropdown-item" onClick={() => handleRouteClick(route)}>
                        {route.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dropdown;
