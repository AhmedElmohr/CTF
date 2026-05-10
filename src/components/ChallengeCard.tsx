"use client";

import { useState, useEffect } from "react";
import { Challenge } from "@/types";
import { Play, CheckCircle, Shield, Trophy } from "lucide-react";
import clsx from "clsx";
import FlagSubmitForm from "./FlagSubmitForm";
import LabModal from "./LabModal";

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    const solved = localStorage.getItem(`solved_${challenge.id}`);
    if (solved === "true") setIsSolved(true);
  }, [challenge.id]);

  const handleSolve = () => {
    setIsSolved(true);
    localStorage.setItem(`solved_${challenge.id}`, "true");
  };

  const difficultyStyles = {
    Easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Hard: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Insane: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  return (
    <>
      <div className="group relative bg-surface-darker border border-white/5 rounded-[2rem] p-8 flex flex-col h-full transition-all duration-500 hover:border-brand-primary/30 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-2 overflow-hidden">
        
        {/* Glow Effect on Hover */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/10 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="flex justify-between items-start mb-6">
          <div className={clsx("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border", difficultyStyles[challenge.difficulty])}>
            {challenge.difficulty}
          </div>
          <div className="flex items-center gap-1.5 text-brand-secondary">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-bold">{challenge.points}</span>
          </div>
        </div>

        <h3 className="text-xl font-black text-white mb-3 group-hover:text-brand-primary transition-colors duration-300">
          {challenge.name}
        </h3>

        <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium line-clamp-2">
          {challenge.goal}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {challenge.cwe.map((cwe) => (
            <span key={cwe} className="text-[10px] font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-brand-primary/60" /> {cwe}
            </span>
          ))}
        </div>

        <div className="mt-auto space-y-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full group/btn relative flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-brand-primary hover:border-brand-primary text-white py-4 rounded-2xl transition-all duration-300 font-bold text-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Simulation</span>
          </button>
          
          <div className="relative">
            <FlagSubmitForm challengeId={challenge.id} isSolved={isSolved} onSolve={handleSolve} />
            {isSolved && (
              <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>

        {/* Solved Overlay */}
        {isSolved && (
          <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-tighter">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            Completed
          </div>
        )}
      </div>

      {isModalOpen && (
        <LabModal
          challenge={challenge}
          isSolved={isSolved}
          onSolve={handleSolve}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
