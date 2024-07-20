import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

// Import the layouts
import RootLayout from './layouts/root-layout'
import ProtectedLayout from './layouts/protected-layout'

// Import the components
import IndexPage from './routes'
import ContactPage from './routes/contact'
import SignInPage from './routes/sign-in'
import SignUpPage from './routes/sign-up'
import DashboardPage from './routes/dashboard'
import InvoicesPage from './routes/invoices'
import DestinationScreenPage from './routes/DestinationScreen'

import { ConvexProvider, ConvexReactClient } from "convex/react";
// const convexUrl: string = process.env.REACT_VITE_CONVEX_URL as string;

// if (!convexUrl) { throw new Error("REACT_APP_CONVEX_URL is not defined"); }
// const convex = new ConvexReactClient(convexUrl);
const convex = new ConvexReactClient("https://fleet-guanaco-936.convex.cloud");


// const router = createBrowserRouter([
//   {
//     element: <RootLayout />,
//     children: [
//       { path: "/", element: <IndexPage /> },
//       { path: "/contact", element: <ContactPage /> },
//       { path: "/sign-in/*", element: <SignInPage /> },
//       { path: "/sign-up/*", element: <SignUpPage /> },
//       {
//         element: <DashboardLayout />,
//         path: "dashboard",
//         children: [
//           { path: "/dashboard", element: <DashboardPage /> },
//           // { path: "/destinationScreen", element: <DestinationScreenPage center={center} />},
//           { path: "/dashboard/invoices", element: <InvoicesPage /> }
//         ]
//       }
//     ]
//   }
// ])

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>,
// )

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

  const router = createBrowserRouter([
    {
      element: <RootLayout center={center} />,
      children: [
        { path: "/", element: <IndexPage /> },
        { path: "/contact", element: <ContactPage /> },
        { path: "/sign-in/*", element: <SignInPage /> },
        { path: "/sign-up/*", element: <SignUpPage /> },
        {
          element: <ProtectedLayout />, // Use ProtectedLayout to protect DestinationScreenPage
          children: [
            { path: "/destinationScreen", element: <DestinationScreenPage center={center} /> }
          ]
        }
      ]
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    // <App />
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);
