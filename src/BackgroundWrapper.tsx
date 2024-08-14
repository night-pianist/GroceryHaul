import React, { useState } from 'react';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
  const mapAnimationPath = `/darkPinkMap.gif`;
  const staticMapPath = `/StaticBackgroundMap.svg`;

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
        style={{ backgroundImage: `url(${src})` }}
      ></div>
      {children}
    </div>
  );
};

export default BackgroundWrapper;
