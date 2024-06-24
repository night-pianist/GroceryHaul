import React, {useState} from 'react'
import '../styles/Home.css'
import { Link } from 'react-router-dom';

function Home(): JSX.Element {
    const mapAnimationPath = `${process.env.PUBLIC_URL}/MapArrowAnimation.gif`;
    const staticMapPath = `${process.env.PUBLIC_URL}/StaticBackgroundMap.svg`;
    const whiteBox = `${process.env.PUBLIC_URL}/WhiteBox.png`;
    const groceryLogo = `${process.env.PUBLIC_URL}/GroceryLogo.png`;

  
    const [src, setSrc] = useState(mapAnimationPath);
  
    const handleError = () => {
      setSrc(staticMapPath);
    };
  
    return (
      <div className="home-container">
        <div className="background" style={{ backgroundImage: `url(${src})` }} onError={handleError}></div>
        <div className="whitebox-container">
            <img src={whiteBox} alt="white box"></img>
            <div className="buttons-container">
              <Link to="/login" className="btn btn-primary btn-lg" role="button">LOGIN</Link>
              <Link to="/signup" className="btn btn-primary btn-lg" role="button">SIGNUP</Link>
            </div>
        </div>
        <div className="logo-container">
            <img src={groceryLogo} alt="grocery logo"></img>
        </div>
      </div>
    );
  }
  

export default Home;
