import React, { useState, useEffect } from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";

function Home() {
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [activeTab, setActiveTab] = useState('canvas');
  const [dailyTheme, setDailyTheme] = useState('');
  
  // Daily themes rotation
  const themes = [
    "Doge Day: Space Adventures",
    "Pepe Party: Royal Edition",
    "Meme Mashup Monday",
    "Doge vs Pepe: Battle Royale",
    "Crypto Memes Unite",
    "Meme to the Moon",
    "Weekend Warrior Memes"
  ];
  
  useEffect(() => {
    // Set daily theme based on day of week
    const dayOfWeek = new Date().getDay();
    setDailyTheme(themes[dayOfWeek]);
    
    // Load saved memes from localStorage
    const savedMemes = localStorage.getItem('memeWarCanvas');
    if (savedMemes) {
      window.memeCanvasItems = JSON.parse(savedMemes);
    } else {
      window.memeCanvasItems = [];
    }
    
    // Initialize team scores
    const savedScores = localStorage.getItem('memeWarScores');
    if (savedScores) {
      window.teamScores = JSON.parse(savedScores);
    } else {
      window.teamScores = { doge: 50, pepe: 50 };
    }
    
    // Initialize leaderboard
    const savedLeaderboard = localStorage.getItem('memeWarLeaderboard');
    if (savedLeaderboard) {
      window.leaderboard = JSON.parse(savedLeaderboard);
    } else {
      window.leaderboard = [];
    }
  }, []);

  // Logo SVG
  const MemeWarLogo = () => (
    <svg width="200" height="80" viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d9a648" />
          <stop offset="100%" stopColor="#5cb85c" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="180" height="60" rx="10" fill="none" stroke="url(#logoGradient)" strokeWidth="3" />
      <text x="100" y="40" fontFamily="Arial" fontSize="20" fontWeight="bold" textAnchor="middle" fill="url(#logoGradient)">MEME WAR</text>
      <text x="100" y="60" fontFamily="Arial" fontSize="16" textAnchor="middle" fill="url(#logoGradient)">CANVAS</text>
      <circle cx="40" cy="40" r="15" fill="#d9a648" opacity="0.7" />
      <circle cx="160" cy="40" r="15" fill="#5cb85c" opacity="0.7" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0">
            <MemeWarLogo />
          </div>
          
          {isConnected ? (
            <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
              <p className="text-sm text-gray-400 mr-2">Connected:</p>
              <p className="font-mono text-sm truncate max-w-[150px]">{address}</p>
              <button
                onClick={() => disconnect()}
                className="ml-4 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all duration-300 text-sm"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30 text-sm"
                >
                  Connect {connector.name}
                </button>
              ))}
            </div>
          )}
        </header>
        
        <div className="mb-6 text-center">
          <div className="theme-badge">
            Today's Theme: {dailyTheme}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400">
            Meme War Canvas
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Create and place AI-generated Doge or Pepe memes on the collaborative canvas.
            Join a tribe, earn points, and help your team win the daily battle!
          </p>
        </div>
        
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-bold text-center">Connect your wallet to join the Meme War!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/30 flex items-center justify-center space-x-2 group"
                >
                  <span className="text-lg font-medium group-hover:scale-105 transition-transform">
                    Connect with {connector.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex space-x-2 border-b border-white/10 mb-6">
              <button
                onClick={() => setActiveTab('canvas')}
                className={`px-4 py-2 font-medium transition-all duration-300 ${
                  activeTab === 'canvas'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Canvas
              </button>
              <button
                onClick={() => setActiveTab('generator')}
                className={`px-4 py-2 font-medium transition-all duration-300 ${
                  activeTab === 'generator'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Create Meme
              </button>
              <button
                onClick={() => setActiveTab('battle')}
                className={`px-4 py-2 font-medium transition-all duration-300 ${
                  activeTab === 'battle'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Tribe Battle
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-4 py-2 font-medium transition-all duration-300 ${
                  activeTab === 'leaderboard'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Leaderboard
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === 'canvas' && <window.Canvas />}
              {activeTab === 'generator' && <window.MemeGenerator />}
              {activeTab === 'battle' && <window.TribeBattle />}
              {activeTab === 'leaderboard' && <window.Leaderboard />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

window.Home = Home;