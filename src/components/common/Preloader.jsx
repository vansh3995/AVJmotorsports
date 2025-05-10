import React from 'react';
import './Preloader.css';
import loadingGif from '../../../static/giphy.gif';

const Preloader = () => (
  <div className="preloader" style={{ padding: 0, margin: 0 }}>
    <img
      src={loadingGif}
      alt="Loading..."
      className="fullscreen-gif"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        objectFit: "cover",
        zIndex: 9999,
        margin: 0,
        padding: 0,
        border: "none",
        background: "#000"
      }}
    />
    {/* <p className="loading-text">Loading...</p> */}
  </div>
);

export default Preloader;