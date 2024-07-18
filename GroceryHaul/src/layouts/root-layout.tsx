import {useEffect} from 'react';
import '../styles/root-layout.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export default function RootLayout({ center }: { center: [number, number] | null }) {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      routerPush={(to: string) => navigate(to)}
      routerReplace={(to: string) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
    >
      <SignedIn>
        <NavigateOnSignIn navigate={navigate} /> 
      </SignedIn>
      <main>
        <Outlet  context={{center} } />
      </main>
    </ClerkProvider>
  );
}

function NavigateOnSignIn({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  useEffect(() => {
    console.log("NavigateOnSignIn useEffect called");
    navigate('/destinationScreen');
  }, [navigate]);

  return null;
}
