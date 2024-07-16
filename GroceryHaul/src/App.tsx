// import './App.css';
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

// export default function App() {
//   console.log("App component rendered");

//   const navigate = useNavigate();

//   return (
//     <header>
//       <SignedOut>
//         <SignInButton />
//       </SignedOut>
//       <SignedIn>
//         <UserButton />
//         <NavigateOnSignIn navigate={navigate} />
//       </SignedIn>
//     </header>
//   );
// }

// function NavigateOnSignIn({ navigate }: { navigate: ReturnType<typeof useNavigate> }) {
//   useEffect(() => {
//     console.log("NavigateOnSignIn useEffect called");
//     navigate('/dashboard');
//   }, [navigate]);

//   return null;
// }
