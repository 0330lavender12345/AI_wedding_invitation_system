// App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import Slideshow from './components/Slideshow';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showOverlay, setShowOverlay] = useState(true);

  const handleLoginSuccess = (email) => {
    setCurrentUser(email);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleScroll = () => {
    setShowOverlay(false);
  };

  return (
    <div className="app-container">
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <Slideshow
        currentUser={currentUser}
        onLoginSuccess={handleLoginSuccess}
        showOverlay={showOverlay}
        onScroll={handleScroll}
      />
      <Footer />
    </div>
  );
}

export default App;