"use client";

import { useState } from "react";
import { 
  Globe, 
  RotateCcw, 
  Home, 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  Info,
  ChevronDown,
  Terminal,
  ExternalLink
} from "lucide-react";
import clsx from "clsx";
import FlagSubmitForm from "./FlagSubmitForm";

interface LabEnvironmentProps {
  children: React.ReactNode;
  challengeId: string;
  targetUrl: string;
  challengeName: string;
}

export default function LabEnvironment({ 
  children, 
  challengeId, 
  targetUrl, 
  challengeName 
}: LabEnvironmentProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-surface-darkest flex flex-col font-sans">
      {/* Platform Top Bar (Subtle) */}
      <div className="bg-surface-darkest border-b border-white/5 px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-brand-primary flex items-center justify-center">
            <Shield className="w-3 h-3 text-white" />
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Simulation Instance: <span className="text-white">{challengeId}</span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 hover:text-white transition-all"
          >
            <Info className="w-3 h-3" />
            Mission Briefing
          </button>
          <div className="h-4 w-px bg-white/10"></div>
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-tighter">
            Target Connected
          </span>
        </div>
      </div>

      {/* Browser Simulation Container */}
      <div className="flex-1 p-4 md:p-8 flex flex-col">
        <div className="flex-1 bg-surface-darker rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden">
          
          {/* Browser Chrome (Title Bar + URL Bar) */}
          <div className="bg-white/[0.03] border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-6">
              {/* Window Controls */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg text-slate-500 hover:bg-white/5 hover:text-white transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg text-slate-500 hover:bg-white/5 hover:text-white transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleRefresh}
                  className={clsx(
                    "p-1.5 rounded-lg text-slate-500 hover:bg-white/5 hover:text-white transition-all",
                    isRefreshing && "animate-spin text-brand-primary"
                  )}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg text-slate-500 hover:bg-white/5 hover:text-white transition-all">
                  <Home className="w-4 h-4" />
                </button>
              </div>

              {/* URL Bar */}
              <div className="flex-1 max-w-2xl bg-black/40 rounded-xl border border-white/5 px-4 py-2 flex items-center gap-3">
                <Globe className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-400 select-all truncate">
                  {targetUrl}
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">Secure</span>
                </div>
              </div>

              {/* Tool Toggle */}
              <div className="flex items-center gap-2">
                 <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-400 hover:bg-white/10 transition-all flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  DevTools
                </button>
              </div>
            </div>
          </div>

          {/* Simulated Webpage Content */}
          <div className={clsx(
            "flex-1 overflow-auto relative transition-opacity duration-300",
            isRefreshing ? "opacity-20 pointer-events-none" : "opacity-100"
          )}>
            {children}
          </div>
        </div>
      </div>

      {/* Floating Mission Control (Bottom Left) */}
      <div className="fixed bottom-10 left-10 z-[60]">
        <div className="relative group">
          <div className="absolute inset-0 bg-brand-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative glass-dark border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Active Mission</div>
              <div className="text-sm font-black text-white tracking-tight">{challengeName}</div>
            </div>
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="ml-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-all"
            >
              <ChevronDown className={clsx("w-4 h-4 transition-transform", showInfo ? "rotate-180" : "")} />
            </button>
          </div>

          {/* Expanded Mission Details & Flag Submission */}
          {showInfo && (
            <div className="absolute bottom-full left-0 mb-4 w-80 glass-dark border border-white/10 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
              <h4 className="text-white font-black mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-brand-primary" />
                Mission Objective
              </h4>
              <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">
                Interact with the simulated environment above to identify the vulnerability. 
                Once found, extract the flag and submit it below.
              </p>
              
              <div className="pt-6 border-t border-white/5">
                <h4 className="text-white font-black mb-4 flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-brand-accent" />
                  Flag Submission
                </h4>
                <FlagSubmitForm challengeId={challengeId} isSolved={false} onSolve={() => {}} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Refresh Loading Overlay */}
      {isRefreshing && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
