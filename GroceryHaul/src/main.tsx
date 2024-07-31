import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';

// Import layouts
import RootLayout from './layouts/root-layout';
import ProtectedLayout from './layouts/protected-layout';

// Import components
import IndexPage from './routes';
import ContactPage from './routes/contact';
import SignInPage from './routes/sign-in';
import SignUpPage from './routes/sign-up';
import DashboardPage from './routes/dashboard';
import InvoicesPage from './routes/invoices';
import DestinationScreenPage from './routes/DestinationScreen';

import { ConvexReactClient } from 'convex/react';
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

// Initialize Convex client
const convex = new ConvexReactClient('https://fleet-guanaco-936.convex.cloud');

function App() {
  const [center, setCenter] = useState<[number, number] | null>(null);

  useEffect(() => {
    const successLocation = (position: GeolocationPosition) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      setCenter([latitude, longitude]);
    };

    const errorLocation = () => {
      console.error('Error getting location');
      setCenter([-118.4441, 34.0699]); // Default location
    };

    navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
      enableHighAccuracy: true,
    });
  }, []);

  if (center === null) {
    return <div>Loading...</div>;
  }

  const router = createBrowserRouter([
    {
      element: <RootLayout center={center} />,
      children: [
        { path: '/', element: <IndexPage /> },
        { path: '/contact', element: <ContactPage /> },
        { path: '/sign-in/*', element: <SignInPage /> },
        { path: '/sign-up/*', element: <SignUpPage /> },
        {
          element: <ProtectedLayout />,
          children: [
            { path: '/destinationScreen', element: <DestinationScreenPage center={center} /> },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <App />
    </ConvexProviderWithClerk>
  </ClerkProvider>
);
