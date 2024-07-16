import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export default function RootLayout() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      routerPush={(to: string) => navigate(to)}
      routerReplace={(to: string) => navigate(to, { replace: true })}
      publishableKey={PUBLISHABLE_KEY}
    >
      <main>
        <Outlet />
      </main>
    </ClerkProvider>
  );
}

function NavigateOnSignIn({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
  useEffect(() => {
    console.log("NavigateOnSignIn useEffect called");
    navigate('/dashboard');
  }, [navigate]);

  return null;
}
