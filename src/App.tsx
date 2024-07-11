import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import DestinationScreen from './components/DestinationScreen'
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Signup from './components/Signup';
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "./convex/_generated/api";


function App() {
  const [center, setCenter] = useState<[number, number] | null>(null);

  useEffect(() => {
    const successLocation = (position: GeolocationPosition) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log("position is " + position);
        console.log("latitude is " + latitude + " and longitude is " + longitude);
        setCenter([latitude, longitude]);
    };

    const errorLocation = () => {
        console.error('Error getting location');
        // Optionally set a default location if there's an error
        setCenter([-118.4441, 34.0699]);
    };

    navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
        enableHighAccuracy: true
    });
  }, []);

  if (center === null) {
      return <div>Loading...</div>; // Or any loading indicator
  }

  return (
      <>
      <main>
      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>
      <Authenticated>
        <UserButton />
        <Content />
      </Authenticated>
    </main>
        <Routes>
          { <Route path="/" element={<Home />} /> } 
          { <Route path="/map" element={<DestinationScreen center={center} />} /> }
          { <Route path="/login" element={<Login />} /> }
          { <Route path="/signup" element={<Signup />} />}
          { <Route path="/dashboard" element={<Dashboard />} /> }
        </Routes>
      </>
  )
}

function Content() {
  const messages = useQuery(api.messages.getForCurrentUser);
  return <div>Authenticated content: {messages?.length}</div>;
}

export default App 