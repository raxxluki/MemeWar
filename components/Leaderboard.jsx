import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";

function Leaderboard() {
  const { address } = useAccount();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  
  useEffect(() => {
    // Load leaderboard from global state or localStorage
    const savedLeaderboard = window.leaderboard || JSON.parse(localStorage.getItem('memeWarLeaderboard')) || [];
    setLeaderboard(savedLeaderboard);
    
    // Find user's rank
    if (address) {
      const userIndex = savedLeaderboard.findIndex(entry => entry.address === address);
      if (userIndex !== -1) {
        setUserRank(userIndex + 1);
      }
    }
  }, [address]);
  
  const getRewardAmount = (rank) => {
    if (rank === 1) return 1000;
    if (rank === 2) return 750;
    if (rank === 3) return 500;
    if (rank <= 10) return 250;
    if (rank <= 20) return 100;
    return 50;
  };
  
  const claimRewards = () => {
    // Mock implementation for claiming rewards
    alert(`Claimed ${getRewardAmount(userRank)} MEME tokens! (Mock implementation)`);
  };
  
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Leaderboard</h2>
        {userRank && (
          <button
            onClick={claimRewards}
            className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all duration-300 border border-purple-500/30"
          >
            Claim {getRewardAmount(userRank)} MEME
          </button>
        )}
      </div>
      
      {userRank && (
        <div className="mb-6 p-4 bg-white/10 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Your Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-400">Rank</p>
              <p className="text-2xl font-bold text-white">#{userRank}</p>
            </div>
            <div>
              <p className="text-gray-400">Score</p>
              <p className="text-2xl font-bold text-white">
                {leaderboard[userRank - 1]?.score || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Team</p>
              <p className={`text-2xl font-bold ${leaderboard[userRank - 1]?.team === 'doge' ? 'text-yellow-400' : 'text-green-400'}`}>
                {leaderboard[userRank - 1]?.team === 'doge' ? 'Doge' : 'Pepe'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="leaderboard-container">
        <div className="grid grid-cols-12 gap-4 p-3 bg-white/5 rounded-lg mb-2 font-bold">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5">Address</div>
          <div className="col-span-2">Team</div>
          <div className="col-span-2">Score</div>
          <div className="col-span-2">Reward</div>
        </div>
        
        {leaderboard.length > 0 ? (
          leaderboard.map((entry, index) => (
            <div 
              key={index}
              className={`grid grid-cols-12 gap-4 p-3 rounded-lg mb-2 ${
                entry.address === address 
                  ? 'bg-blue-500/20 border border-blue-500/30' 
                  : index % 2 === 0 
                    ? 'bg-white/5' 
                    : 'bg-white/10'
              }`}
            >
              <div className="col-span-1 font-bold">#{index + 1}</div>
              <div className="col-span-5 font-mono truncate">
                {entry.address.substring(0, 6)}...{entry.address.substring(entry.address.length - 4)}
              </div>
              <div className="col-span-2">
                <span className={entry.team === 'doge' ? 'text-yellow-400' : 'text-green-400'}>
                  {entry.team === 'doge' ? 'Doge' : 'Pepe'}
                </span>
              </div>
              <div className="col-span-2">{entry.score}</div>
              <div className="col-span-2">{getRewardAmount(index + 1)} MEME</div>
            </div>
          ))
        ) : (
          <div className="text-center p-6 text-gray-400">
            No entries yet. Start contributing to the canvas to earn points!
          </div>
        )}
      </div>
      
      <div className="mt-6 text-sm text-gray-400">
        <h3 className="font-bold mb-2">How to Earn Points</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Add a meme to the canvas: +10 points</li>
          <li>Vote in daily tribe battle: +5 points</li>
          <li>Win daily tribe battle: +20 points (distributed to all team members)</li>
          <li>Get your meme featured: +50 points</li>
        </ul>
      </div>
    </div>
  );
}

window.Leaderboard = Leaderboard;