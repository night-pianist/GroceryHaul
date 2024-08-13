import { useEffect } from 'react';
import '../styles/root-layout.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { SignedIn } from '@clerk/clerk-react';

export default function RootLayout({ center }: { center: [number, number] | null }) {
  const navigate = useNavigate();

  return (
    <>
      <SignedIn>
        <NavigateOnSignIn navigate={navigate} />
      </SignedIn>
      <main>
        <Outlet context={{ center }} />
      </main>
    </>
  );
}

function NavigateOnSignIn({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  useEffect(() => {
    console.log("NavigateOnSignIn useEffect called");
    navigate('/destinationScreen');
  }, [navigate]);
  
  return null;
}
