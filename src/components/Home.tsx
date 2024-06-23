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
            
        </div>
        <nav> 
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Signup</Link></li>
            </ul>
        </nav>
      </div>
    );
  }
  

export default Home;
