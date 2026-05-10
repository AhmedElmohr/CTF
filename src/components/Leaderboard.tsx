"use client";

import { useState, useEffect } from "react";
import { Trophy, Medal, User } from "lucide-react";
import { LeaderboardEntry } from "@/types";
import clsx from "clsx";
import GlitchText from "./GlitchText";

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        if (res.ok) {
          const data = await res.json();
          setEntries(data);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30 font-bold";
      case 2: return "text-gray-300 bg-gray-300/10 border-gray-300/30 font-bold";
      case 3: return "text-amber-600 bg-amber-600/10 border-amber-600/30 font-bold";
      default: return "text-gray-400 border-gray-800";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-300" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 text-center">{rank}</span>;
    }
  };

  return (
    <div id="leaderboard" className="py-20 border-t border-gray-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <GlitchText as="h2" text="Global Leaderboard" className="text-3xl text-white mb-4" />
          <p className="text-gray-400">Top hackers dominating the environment.</p>
        </div>

        <div className="bg-black/60 border border-gray-800 rounded-lg overflow-hidden shadow-2xl relative">
          {/* Decorative terminal header */}
          <div className="bg-gray-900 border-b border-gray-800 px-4 py-2 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>

          <div className="p-1 sm:p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-500 text-sm font-mono border-b border-gray-800">
                  <th className="p-3 font-medium">Rank</th>
                  <th className="p-3 font-medium">Hacker</th>
                  <th className="p-3 font-medium text-right">Score</th>
                  <th className="p-3 font-medium text-center hidden sm:table-cell">Solved</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse border-b border-gray-800/50">
                      <td className="p-3"><div className="h-4 bg-gray-800 rounded w-8"></div></td>
                      <td className="p-3"><div className="h-4 bg-gray-800 rounded w-32"></div></td>
                      <td className="p-3"><div className="h-4 bg-gray-800 rounded w-16 ml-auto"></div></td>
                      <td className="p-3 hidden sm:table-cell"><div className="h-4 bg-gray-800 rounded w-12 mx-auto"></div></td>
                    </tr>
                  ))
                ) : entries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500 font-mono">
                      No data available. Be the first to capture a flag!
                    </td>
                  </tr>
                ) : (
                  entries.map((entry, index) => {
                    const rank = index + 1;
                    const style = getRankStyle(rank);
                    
                    return (
                      <tr 
                        key={entry.username} 
                        className="group border-b border-gray-800/50 hover:bg-gray-900/50 transition-colors"
                      >
                        <td className="p-3 font-mono">
                          <div className={clsx("flex items-center justify-center w-8 h-8 rounded border", style)}>
                            {getRankIcon(rank)}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-800 rounded-full group-hover:text-hacker-cyan transition-colors">
                              <User className="w-4 h-4" />
                            </div>
                            <span className={clsx("font-bold", rank <= 3 ? "text-white" : "text-gray-300")}>
                              {entry.username}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-right font-mono">
                          <span className={clsx(rank === 1 ? "text-hacker-green font-bold drop-shadow-[0_0_5px_rgba(0,255,65,0.5)]" : "text-gray-300")}>
                            {entry.points.toLocaleString()}
                          </span>
                        </td>
                        <td className="p-3 text-center hidden sm:table-cell text-gray-400 font-mono">
                          {entry.solvedCount}/10
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
