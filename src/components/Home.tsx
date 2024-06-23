import React, {useState} from 'react'
import '../styles/Home.css'
import mapAnimation from 'public/MapArrowAnimation.gif'
import staticMap from 'public/StaticBackgroundMap.svg'

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
      </div>
    );
  }
  

export default Home;
