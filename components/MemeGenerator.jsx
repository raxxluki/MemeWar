import React, { useState } from "react";
import { useAccount } from "wagmi";
import { addCanvasItem } from "../firebase";
import { ErrorBoundary } from "./ErrorBoundary";

function MemeGenerator() {
  const { address } = useAccount();
  const [memeType, setMemeType] = useState('doge');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Enhanced mock image generation with keyword mapping
  const generateMemeImage = () => {
    if (!description.trim()) {
      alert("Please enter a description for your meme");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Keyword to image mapping
      const dogeKeywords = {
        'space': 'images/doge-space.webp',
        'moon': 'images/doge-space.webp',
        'rocket': 'images/doge-space.webp',
        'astronaut': 'images/doge-space.webp',
        'galaxy': 'images/doge-space.webp',
        // Add more keywords as needed
      };
      
      const pepeKeywords = {
        'king': 'images/pepe-king.webp',
        'crown': 'images/pepe-king.webp',
        'royal': 'images/pepe-king.webp',
        'throne': 'images/pepe-king.webp',
        'kingdom': 'images/pepe-king.webp',
        // Add more keywords as needed
      };
      
      // Parse description for keywords
      const keywords = memeType === 'doge' ? dogeKeywords : pepeKeywords;
      const descriptionLower = description.toLowerCase();
      
      // Find matching keyword
      let imageUrl = null;
      for (const [keyword, url] of Object.entries(keywords)) {
        if (descriptionLower.includes(keyword)) {
          imageUrl = url;
          break;
        }
      }
      
      // Fallback to default if no keyword matches
      if (!imageUrl) {
        imageUrl = memeType === 'doge' ? 'images/doge-space.webp' : 'images/pepe-king.webp';
      }
      
      // Simulate API call delay
      setTimeout(() => {
        setGeneratedImage(imageUrl);
        setIsGenerating(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating meme image:", error);
      alert("There was an error generating your meme. Please try again.");
      setIsGenerating(false);
    }
  };
  
  const addToCanvas = async () => {
    if (!generatedImage) return;
    
    try {
      // Generate random position if not set
      const randomX = Math.floor(Math.random() * 800);
      const randomY = Math.floor(Math.random() * 800);
      
      const newItem = {
        imageUrl: generatedImage,
        description: description,
        team: memeType,
        creator: address,
        timestamp: Date.now(),
        x: position.x || randomX,
        y: position.y || randomY,
        width: 150,
        height: 150
      };
      
      // Add to Firebase
      await addCanvasItem(newItem);
      
      // For backward compatibility, also update local state
      // Firebase subscription will update the UI automatically
      if (!window.memeCanvasItems) {
        window.memeCanvasItems = [];
      }
      
      // Update team scores
      if (!window.teamScores) {
        window.teamScores = { doge: 50, pepe: 50 };
      }
      
      if (memeType === 'doge') {
        window.teamScores.doge += 1;
      } else {
        window.teamScores.pepe += 1;
      }
      
      // Normalize scores to percentages
      const total = window.teamScores.doge + window.teamScores.pepe;
      window.teamScores.doge = Math.round((window.teamScores.doge / total) * 100);
      window.teamScores.pepe = Math.round((window.teamScores.pepe / total) * 100);
      
      // Save scores
      localStorage.setItem('memeWarScores', JSON.stringify(window.teamScores));
      
      // Update leaderboard
      let leaderboard = window.leaderboard || [];
      const existingEntry = leaderboard.find(entry => entry.address === address);
      
      if (existingEntry) {
        existingEntry.score += 10;
      } else {
        leaderboard.push({
          address: address,
          score: 10,
          team: memeType
        });
      }
      
      // Sort leaderboard by score
      leaderboard.sort((a, b) => b.score - a.score);
      
      // Save leaderboard
      window.leaderboard = leaderboard;
      localStorage.setItem('memeWarLeaderboard', JSON.stringify(leaderboard));
      
      // Reset form
      setGeneratedImage(null);
      setDescription('');
      
      // Show success message
      alert("Your meme has been added to the canvas!");
    } catch (error) {
      console.error("Error adding meme to canvas:", error);
      alert("There was an error adding your meme to the canvas. Please try again.");
    }
  };
  
  const shareOnTwitter = () => {
    if (!generatedImage) return;
    
    const text = `I just created a ${memeType === 'doge' ? 'Doge' : 'Pepe'} meme: "${description}" on Meme War Canvas! #AgenticIDE #VibeCodingHackathon`;
    const url = window.location.href;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <ErrorBoundary>
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold mb-4">Create Your Meme</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="meme-generator-container">
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Choose Your Tribe</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setMemeType('doge')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex-1 ${
                  memeType === 'doge'
                    ? 'bg-yellow-500/30 border border-yellow-500/50 text-yellow-300'
                    : 'bg-white/10 border border-white/20 text-gray-300'
                }`}
              >
                Team Doge
              </button>
              <button
                onClick={() => setMemeType('pepe')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex-1 ${
                  memeType === 'pepe'
                    ? 'bg-green-500/30 border border-green-500/50 text-green-300'
                    : 'bg-white/10 border border-white/20 text-gray-300'
                }`}
              >
                Team Pepe
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Describe Your Meme</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Describe your ${memeType === 'doge' ? 'Doge' : 'Pepe'} meme (e.g., "${memeType === 'doge' ? 'Doge in a spacesuit' : 'Pepe wearing a crown'}")`}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 placeholder-gray-400 min-h-[100px]"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Position on Canvas (Optional)</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-sm mb-1">X Position</label>
                <input
                  type="number"
                  value={position.x}
                  onChange={(e) => setPosition({...position, x: parseInt(e.target.value) || 0})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  min="0"
                  max="850"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Y Position</label>
                <input
                  type="number"
                  value={position.y}
                  onChange={(e) => setPosition({...position, y: parseInt(e.target.value) || 0})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  min="0"
                  max="850"
                />
              </div>
            </div>
          </div>
          
          <button
            onClick={generateMemeImage}
            disabled={isGenerating || !description.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            {isGenerating ? 'Generating...' : 'Generate Meme'}
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-300">Generating your meme...</p>
            </div>
          ) : generatedImage ? (
            <div className="flex flex-col items-center">
              <div 
                className={`w-48 h-48 bg-cover bg-center rounded-lg mb-4 ${memeType === 'doge' ? 'border-2 border-yellow-500/50' : 'border-2 border-green-500/50'}`}
                style={{ backgroundImage: `url(${generatedImage})` }}
              ></div>
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={addToCanvas}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-300 border border-blue-500/30"
                >
                  Add to Canvas
                </button>
                <button
                  onClick={shareOnTwitter}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-300 border border-blue-500/30"
                >
                  Share on X
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <p className="mb-2">Your generated meme will appear here</p>
              <p className="text-sm">Fill out the form and click "Generate Meme"</p>
            </div>
          )}
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}

window.MemeGenerator = MemeGenerator;