import React, { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { subscribeToCanvasItems } from "../firebase";
import { ErrorBoundary } from "./ErrorBoundary";

function Canvas() {
  const { address } = useAccount();
  const [canvasItems, setCanvasItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [canvasScale, setCanvasScale] = useState(1);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  useEffect(() => {
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Initial resize
    handleResize();
    
    // Subscribe to real-time updates from Firebase
    try {
      const unsubscribe = subscribeToCanvasItems((items) => {
        setCanvasItems(items);
        // Update global state for backward compatibility
        window.memeCanvasItems = items;
        // Save to localStorage for offline access
        localStorage.setItem('memeWarCanvas', JSON.stringify(items));
      });
      
      // Fallback to localStorage if Firebase fails to load
      if (window.memeCanvasItems) {
        setCanvasItems(window.memeCanvasItems);
      } else {
        const savedMemes = localStorage.getItem('memeWarCanvas');
        if (savedMemes) {
          try {
            const parsedMemes = JSON.parse(savedMemes);
            setCanvasItems(parsedMemes);
            window.memeCanvasItems = parsedMemes;
          } catch (error) {
            console.error("Error parsing saved memes:", error);
            setCanvasItems([]);
            window.memeCanvasItems = [];
          }
        } else {
          setCanvasItems([]);
          window.memeCanvasItems = [];
        }
      }
      
      return () => {
        window.removeEventListener('resize', handleResize);
        unsubscribe(); // Unsubscribe from Firebase on component unmount
      };
    } catch (error) {
      console.error("Error setting up Firebase subscription:", error);
      // Fallback to localStorage if Firebase fails
      if (window.memeCanvasItems) {
        setCanvasItems(window.memeCanvasItems);
      }
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);
  
  const handleResize = () => {
    // Adjust canvas scale based on window size
    if (canvasRef.current) {
      const width = canvasRef.current.offsetWidth;
      const scale = width / 1000; // Assuming 1000px is the base width
      setCanvasScale(scale);
    }
  };
  
  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - canvasPosition.x,
        y: e.clientY - canvasPosition.y
      });
    }
  };
  
  const handleCanvasMouseMove = (e) => {
    if (isDragging) {
      setCanvasPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleCanvasWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(0.5, canvasScale + delta), 3);
    setCanvasScale(newScale);
  };
  
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };
  
  const mintNFT = () => {
    // Mock implementation for minting the canvas as NFT
    alert("NFT minting functionality would be implemented here. This is a mock implementation.");
    
    // In a real implementation, this would interact with a smart contract
    console.log("Minting canvas as NFT...");
  };
  
  const shareOnTwitter = () => {
    const text = "Check out my contribution to the Meme War Canvas! #AgenticIDE #VibeCodingHackathon";
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <ErrorBoundary>
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Collaborative Canvas</h2>
          <div className="flex space-x-2">
            <button 
              onClick={mintNFT}
              className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all duration-300 border border-purple-500/30"
            >
              Mint as NFT
            </button>
            <button 
              onClick={shareOnTwitter}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-300 border border-blue-500/30"
            >
              Share on X
            </button>
          </div>
        </div>
      
      <div 
        ref={canvasRef}
        className="canvas-container"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        onWheel={handleCanvasWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
          style={{
            transform: `translate(${canvasPosition.x}px, ${canvasPosition.y}px) scale(${canvasScale})`,
            transformOrigin: 'center',
            width: '1000px',
            height: '1000px',
            position: 'absolute',
            transition: isDragging ? 'none' : 'transform 0.3s ease'
          }}
        >
          {canvasItems.map((item, index) => (
            <div
              key={index}
              className={`canvas-item ${item.team === 'doge' ? 'doge-team' : 'pepe-team'}`}
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
                backgroundImage: `url(${item.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: selectedItem === item ? 100 : 1
              }}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>
      </div>
      
      {selectedItem && (
        <div className="mt-4 p-4 bg-white/5 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Selected Meme</h3>
          <p><strong>Created by:</strong> {selectedItem.creator.substring(0, 6)}...{selectedItem.creator.substring(selectedItem.creator.length - 4)}</p>
          <p><strong>Team:</strong> {selectedItem.team === 'doge' ? 'Team Doge' : 'Team Pepe'}</p>
          <p><strong>Description:</strong> {selectedItem.description}</p>
          <p><strong>Created:</strong> {new Date(selectedItem.timestamp).toLocaleString()}</p>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-400">
        <p>Tip: Scroll to zoom, drag to pan the canvas</p>
        <p>Current items on canvas: {canvasItems.length}</p>
      </div>
    </div>
    </ErrorBoundary>
  );
}

window.Canvas = Canvas;