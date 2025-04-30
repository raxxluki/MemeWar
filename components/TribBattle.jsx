import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";

function TribeBattle() {
  const { address } = useAccount();
  const [scores, setScores] = useState({ doge: 50, pepe: 50 });
  const [userTeam, setUserTeam] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  
  useEffect(() => {
    // Load scores from global state
    if (window.teamScores) {
      setScores(window.teamScores);
    }
    
    // Check if user has already voted today
    const lastVote = localStorage.getItem(`memeWarVote_${address}`);
    if (lastVote) {
      const lastVoteDate = new Date(parseInt(lastVote));
      const today = new Date();
      if (lastVoteDate.toDateString() === today.toDateString()) {
        setHasVoted(true);
        
        // Get user's team
        const team = localStorage.getItem(`memeWarTeam_${address}`);
        if (team) {
          setUserTeam(team);
        }
      }
    }
    
    // Calculate time until next reset (midnight)
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow - now;
    setTimeLeft(timeUntilMidnight);
    
    // Update countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          // Reset at midnight
          setHasVoted(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [address]);
  
  const voteForTeam = (team) => {
    if (hasVoted) return;
    
    // Update scores
    const newScores = { ...scores };
    if (team === 'doge') {
      newScores.doge += 2;
      newScores.pepe -= 2;
    } else {
      newScores.doge -= 2;
      newScores.pepe += 2;
    }
    
    // Ensure scores are within bounds
    newScores.doge = Math.max(0, Math.min(100, newScores.doge));
    newScores.pepe = Math.max(0, Math.min(100, newScores.pepe));
    
    // Normalize to ensure they add up to 100
    const total = newScores.doge + newScores.pepe;
    newScores.doge = Math.round((newScores.doge / total) * 100);
    newScores.pepe = Math.round((newScores.pepe / total) * 100);
    
    // Update state
    setScores(newScores);
    window.teamScores = newScores;
    
    // Save to localStorage
    localStorage.setItem('memeWarScores', JSON.stringify(newScores));
    
    // Mark user as voted
    localStorage.setItem(`memeWarVote_${address}`, Date.now().toString());
    localStorage.setItem(`memeWarTeam_${address}`, team);
    
    setHasVoted(true);
    setUserTeam(team);
    
    // Update leaderboard
    let leaderboard = JSON.parse(localStorage.getItem('memeWarLeaderboard')) || [];
    const existingEntry = leaderboard.find(entry => entry.address === address);
    
    if (existingEntry) {
      existingEntry.score += 5;
      existingEntry.team = team;
    } else {
      leaderboard.push({
        address: address,
        score: 5,
        team: team
      });
    }
    
    // Sort leaderboard by score
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Save leaderboard
    window.leaderboard = leaderboard;
    localStorage.setItem('memeWarLeaderboard', JSON.stringify(leaderboard));
  };
  
  // Format time left
  const formatTimeLeft = () => {
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h2 className="text-2xl font-bold mb-4">Tribe Battle</h2>
      
      <div className="mb-6">
        <p className="text-gray-300 mb-2">
          Vote for your favorite tribe and help them win the daily battle! The winning tribe gets bonus tokens.
        </p>
        <div className="flex justify-between items-center">
          <span className="text-yellow-400 font-bold">Team Doge: {scores.doge}%</span>
          <span className="text-green-400 font-bold">Team Pepe: {scores.pepe}%</span>
        </div>
        <div className="progress-container">
          <div 
            className="progress-bar doge-progress" 
            style={{ width: `${scores.doge}%` }}
          ></div>
        </div>
      </div>
      
      <div className="tribe-battle-container">
        <div className="tribe-battle-side doge-side">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">Team Doge</h3>
          <div 
            className="w-32 h-32 mx-auto bg-cover bg-center rounded-full mb-4 border-4 border-yellow-500/50"
            style={{ backgroundImage: `url(images/doge-space.webp)` }}
          ></div>
          <p className="text-gray-300 mb-4">
            Join the Doge tribe and spread positivity and fun across the canvas!
          </p>
          <button
            onClick={() => voteForTeam('doge')}
            disabled={hasVoted}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 w-full ${
              hasVoted 
                ? userTeam === 'doge'
                  ? 'bg-yellow-500/50 text-yellow-200 border border-yellow-500/70'
                  : 'bg-white/10 text-gray-400 cursor-not-allowed'
                : 'bg-yellow-500/30 hover:bg-yellow-500/40 text-yellow-300 border border-yellow-500/50'
            }`}
          >
            {hasVoted 
              ? userTeam === 'doge' 
                ? 'Voted for Doge!' 
                : 'Already Voted'
              : 'Vote for Doge'
            }
          </button>
        </div>
        
        <div className="tribe-battle-side pepe-side">
          <h3 className="text-xl font-bold text-green-400 mb-4">Team Pepe</h3>
          <div 
            className="w-32 h-32 mx-auto bg-cover bg-center rounded-full mb-4 border-4 border-green-500/50"
            style={{ backgroundImage: `url(images/pepe-king.webp)` }}
          ></div>
          <p className="text-gray-300 mb-4">
            Join the Pepe tribe and showcase your creativity and meme mastery!
          </p>
          <button
            onClick={() => voteForTeam('pepe')}
            disabled={hasVoted}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 w-full ${
              hasVoted 
                ? userTeam === 'pepe'
                  ? 'bg-green-500/50 text-green-200 border border-green-500/70'
                  : 'bg-white/10 text-gray-400 cursor-not-allowed'
                : 'bg-green-500/30 hover:bg-green-500/40 text-green-300 border border-green-500/50'
            }`}
          >
            {hasVoted 
              ? userTeam === 'pepe' 
                ? 'Voted for Pepe!' 
                : 'Already Voted'
              : 'Vote for Pepe'
            }
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-400">
          {hasVoted 
            ? `You've voted for today. Next vote available in: ${formatTimeLeft()}`
            : 'Vote now to earn 5 points for your leaderboard score!'
          }
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Battle resets daily at midnight. Current leader: {scores.doge > scores.pepe ? 'Team Doge' : 'Team Pepe'}
        </p>
      </div>
    </div>
  );
}

window.TribeBattle = TribeBattle;