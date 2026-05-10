"use client";

import { useState, useEffect } from "react";
import { User, Trophy, Shield, Trash2, CheckCircle } from "lucide-react";
import { initialChallenges } from "@/lib/challenges";
import GlitchText from "@/components/GlitchText";

export default function ProfilePage() {
  const [username, setUsername] = useState("spark_hacker");
  const [isEditing, setIsEditing] = useState(false);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    // Load solved challenges from localStorage
    const solved: string[] = [];
    let points = 0;
    
    initialChallenges.forEach(challenge => {
      if (localStorage.getItem(`solved_${challenge.id}`) === "true") {
        solved.push(challenge.id);
        points += challenge.points;
      }
    });
    
    setSolvedIds(solved);
    setTotalPoints(points);
    
    const savedUsername = localStorage.getItem("ctf_username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleSaveUsername = () => {
    localStorage.setItem("ctf_username", username);
    setIsEditing(false);
  };

  const handleResetProgress = () => {
    if (confirm("Are you sure you want to reset all your progress? This cannot be undone.")) {
      initialChallenges.forEach(challenge => {
        localStorage.removeItem(`solved_${challenge.id}`);
      });
      setSolvedIds([]);
      setTotalPoints(0);
    }
  };

  return (
    <div className="py-12 md:py-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full flex-1">
      <div className="mb-12">
        <GlitchText as="h1" text="Hacker Profile" className="text-3xl md:text-4xl text-white mb-4" />
        <p className="text-gray-400">View your stats, manage your identity, and review captured flags.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-black/60 border border-gray-800 rounded-lg p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-hacker-green to-hacker-cyan"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-4 border-2 border-hacker-green/50 shadow-[0_0_15px_rgba(0,255,65,0.2)]">
                <User className="w-12 h-12 text-gray-400 group-hover:text-hacker-green transition-colors" />
              </div>
              
              {isEditing ? (
                <div className="w-full flex flex-col gap-2 mt-2">
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black border border-hacker-green text-white px-3 py-2 rounded font-mono text-sm focus:outline-none focus:ring-1 focus:ring-hacker-green text-center"
                    maxLength={20}
                  />
                  <button 
                    onClick={handleSaveUsername}
                    className="bg-hacker-green text-black px-4 py-2 rounded font-bold text-sm hover:bg-hacker-green-bright transition-colors"
                  >
                    Save Alias
                  </button>
                </div>
              ) : (
                <div className="mt-2">
                  <h2 className="text-2xl font-bold text-white font-mono break-all">{username}</h2>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-hacker-cyan text-sm hover:underline mt-2 inline-block"
                  >
                    Edit Alias
                  </button>
                </div>
              )}
            </div>
            
            <div className="mt-8 border-t border-gray-800 pt-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2"><Trophy className="w-4 h-4 text-hacker-yellow" /> Score</span>
                <span className="text-white font-mono font-bold text-lg">{totalPoints}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2"><Shield className="w-4 h-4 text-hacker-green" /> Solved</span>
                <span className="text-white font-mono font-bold text-lg">{solvedIds.length} / {initialChallenges.length}</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleResetProgress}
            className="w-full bg-black/60 border border-hacker-red/30 hover:bg-hacker-red/10 hover:border-hacker-red/50 text-hacker-red rounded-lg p-4 flex items-center justify-center gap-2 transition-colors font-bold"
          >
            <Trash2 className="w-5 h-5" />
            Reset Progress
          </button>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-black/60 border border-gray-800 rounded-lg p-6 shadow-2xl h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Captured Flags</h3>
            
            {solvedIds.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 font-mono text-center min-h-[200px]">
                <Shield className="w-16 h-16 mb-4 opacity-20" />
                <p>No flags captured yet.</p>
                <p className="text-sm mt-2 text-gray-600">Head to the challenges page, deploy a lab, and start hacking!</p>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto pr-2">
                {initialChallenges.map(challenge => {
                  if (!solvedIds.includes(challenge.id)) return null;
                  
                  return (
                    <div key={challenge.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-hacker-green/5 border border-hacker-green/20 rounded-md hover:bg-hacker-green/10 transition-colors">
                      <div className="mb-2 sm:mb-0">
                        <h4 className="text-white font-bold">{challenge.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs font-mono text-gray-400 bg-black/50 px-2 py-0.5 rounded">{challenge.category}</span>
                          <span className="text-xs font-mono text-hacker-yellow">{challenge.points} pts</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-hacker-green self-end sm:self-auto">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-bold">System Pwned</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
