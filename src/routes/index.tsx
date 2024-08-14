import React, { useState } from 'react';
import '../styles/index.css';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';

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

  return (
      <div className="home-container">
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
          <SignedOut>
              <Link to="/sign-in" className="btn btn-primary btn-lg" role="button">
                LOGIN
              </Link>
              <Link to="/sign-up" className="btn btn-primary btn-lg" role="button">
                SIGNUP
              </Link>
          </SignedOut>
          <SignedIn>
            <div className="btn btn-primary btn-lg" role="button">
              <UserButton />
            </div>  
          </SignedIn>
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

