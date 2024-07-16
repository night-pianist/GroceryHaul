import { useState } from 'react';
import { SignedIn, UserButton } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import '../index.css';

function Index(): JSX.Element {
  const mapAnimationPath = `/MapArrowAnimation.gif`;
  const staticMapPath = `/StaticBackgroundMap.svg`;
  const groceryLogo = `/GroceryLogo.png`;

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
            <img src={groceryLogo} alt="grocery logo" />
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
      </div>
  );
}

export default Index;

