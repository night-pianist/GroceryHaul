import React, { useState } from 'react';
import '../styles/index.css';
import { SignedIn, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from 'convex/react';
import { api } from "../../convex/_generated/api"
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

function Index(): JSX.Element {
  const mapAnimationPath = `/darkPinkMap.gif`;
  const staticMapPath = `/StaticBackgroundMap.svg`;
  const groceryLogo = `/fridgeLogo.PNG`;

  const [src, setSrc] = useState(mapAnimationPath);
  const [backgroundVisible, setBackgroundVisible] = useState(true);

  const handleError = () => {
    setSrc(staticMapPath);
    setBackgroundVisible(false); 
  };

  const saveUserToConvex = useMutation(api.users.createUser);
  const [text, setText] = useState(''); // State to hold the text value
  
  const saveUser = async (text: string) => {
    try {
      await saveUserToConvex({ userName: text });
      console.log("user saved");
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  }

  // const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
  //   console.log("HERE");
    // setText("TESTTT");
  //   event.preventDefault(); // Prevent default button behavior if needed
  //   // await saveUser(text);
  // };

  const handleClick = async () => { 
    try {
      console.log("HERE");
      setText("TESTTT");
      await saveUser(text);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };


  return (
      <div className="home-container">
        <Authenticated>Logged in</Authenticated>
        <Unauthenticated>
          <button className="send-button" onClick={handleClick}>
            click here
          </button>
        </Unauthenticated>
        <AuthLoading>Still loading</AuthLoading>
        {backgroundVisible && (
          <img
            src={src}
            alt="background"
            className="background"
            onError={handleError}
            style={{ display: 'none' }}
          />
        )}
        <div
          className="background"
          style={{ backgroundImage: `url(${src})`, display: backgroundVisible ? 'block' : 'none' }}
        ></div>
        <div className="home-card">
          <div className="logo-container">
            <h1>MY</h1>
            <img src={groceryLogo} alt="grocery logo" />
            <h2>GROCERY</h2>
          </div>
        </div>
        <div className="buttons-container">
          <Link to="/sign-in" className="btn btn-primary btn-lg" role="button">
            LOGIN
          </Link>
          <Link to="/sign-up" className="btn btn-primary btn-lg" role="button">
            SIGNUP
          </Link>
        </div>
          <div className="user-button-container">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
      </div>
  );
}

export default Index;

