import React, {useState} from 'react'
import '../styles/Home.css'
import mapAnimation from 'public/MapArrowAnimation.gif'
import staticMap from 'public/StaticBackgroundMap.svg'
import { Link } from 'react-router-dom';


function Home(): JSX.Element {
    const mapAnimationPath = `${process.env.PUBLIC_URL}/MapArrowAnimation.gif`;
    const staticMapPath = `${process.env.PUBLIC_URL}/StaticBackgroundMap.svg`;
  
    const [src, setSrc] = useState(mapAnimationPath);
  
    const handleError = () => {
      setSrc(staticMapPath);
    };
  
    return (
      <div className="fullscreen-container">
        <div className="background" style={{ backgroundImage: `url(${src})` }}>
          <nav className="btn-nav"> 
              <button className="home-btn">
                <a href="/">home</a>
              </button>
              <button className="login-btn">
                <a href="/login">login</a>
              </button>
              <button className="signup-btn">
                <a href="/signup">signup</a>
              </button>
          </nav>
        </div>
      </div>
    );
  }
  

export default Home;
