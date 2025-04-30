import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [basename, setBasename] = useState('');

  useEffect(() => {
    // Get the current path and remove index.html if present
    const path = window.location.pathname;
    const basePath = path.substring(0, path.lastIndexOf('/'));
    setBasename(basePath);

    const checkDependencies = () => {
      if (window.Web3Provider) {
        setIsReady(true);
      }
    };

    // Check immediately
    checkDependencies();

    // Set up an interval to check periodically
    const interval = setInterval(checkDependencies, 100);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  if (!isReady) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <window.Web3Provider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<window.Home />} />
        </Routes>
      </BrowserRouter>
    </window.Web3Provider>
  );
}

createRoot(document.getElementById('renderDiv')).render(<App />);