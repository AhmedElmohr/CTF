"use client";

import { useEffect, useRef, useState } from "react";
import { Challenge } from "@/types";
import { X, Shield, Loader2, Play, CheckCircle, ExternalLink, Cpu, Database, Network } from "lucide-react";
import FlagSubmitForm from "./FlagSubmitForm";
import clsx from "clsx";

interface LabModalProps {
  challenge: Challenge;
  isSolved: boolean;
  onSolve: () => void;
  onClose: () => void;
}

export default function LabModal({ challenge, isSolved, onSolve, onClose }: LabModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [deploymentState, setDeploymentState] = useState<"offline" | "booting" | "online">("offline");
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleDeploy = () => {
    setDeploymentState("booting");
    
    const logs = [
      "Authenticating with security cluster...",
      "Allocating isolated sandbox (ID: SB-8892)...",
      "Provisioning vulnerable OS instance...",
      "Mounting exploit scenarios...",
      "Injecting mission objectives...",
      "Secure link established."
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      setBootLogs(prev => [...prev, logs[currentLog]]);
      currentLog++;
      
      if (currentLog === logs.length) {
        clearInterval(interval);
        setTimeout(() => setDeploymentState("online"), 800);
      }
    }, 500);
  };

  const difficultyStyles = {
    Easy: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    Medium: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    Hard: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    Insane: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-darkest/90 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        ref={modalRef}
        className="w-full max-w-5xl bg-surface-darker border border-white/5 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white leading-none">Simulation Environment</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Instance Control Panel</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 overflow-y-auto flex-1 flex flex-col custom-scrollbar">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 mb-8">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={clsx("px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border", difficultyStyles[challenge.difficulty])}>
                  {challenge.difficulty}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  {challenge.category}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-700"></span>
                <span className="text-xs font-black text-brand-secondary">
                  {challenge.points} Points
                </span>
              </div>
              <h3 className="text-3xl font-black text-white mb-4 leading-tight">{challenge.name}</h3>
              <p className="text-slate-400 font-medium leading-relaxed mb-6 italic">
                {challenge.goal}
              </p>
            </div>
            
            <div className="lg:col-span-4 flex flex-col gap-2">
               {challenge.cwe.map((cwe) => (
                <div key={cwe} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-bold text-slate-300">
                  <Shield className="w-4 h-4 text-brand-primary" />
                  {cwe}
                </div>
              ))}
            </div>
          </div>

          {/* Sandbox Area */}
          <div className={clsx(
            "flex-1 min-h-[400px] rounded-[2rem] mb-8 flex flex-col overflow-hidden relative transition-all duration-500 border",
            deploymentState === "online" ? "border-brand-primary/30 bg-brand-primary/5" : "border-dashed border-white/10 bg-white/[0.02]"
          )}>
            
            {deploymentState === "offline" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Network className="w-10 h-10 text-slate-600" />
                </div>
                <h4 className="text-2xl font-black text-white mb-3">System Ready for Deployment</h4>
                <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
                  The mission requires a specialized isolated environment. Click below to provision your personal sandbox instance.
                </p>
                <button 
                  onClick={handleDeploy}
                  className="group relative bg-brand-primary text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all hover:bg-brand-secondary hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] flex items-center gap-3"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Deploy Sandbox
                </button>
              </div>
            )}

            {deploymentState === "booting" && (
              <div className="absolute inset-0 p-10 font-sans">
                <div className="flex items-center gap-4 text-brand-primary mb-10">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-xl font-black tracking-tight">Initializing Infrastructure...</span>
                </div>
                <div className="space-y-4">
                  {bootLogs.map((log, index) => (
                    <div key={index} className="flex items-center gap-3 text-slate-400 font-bold text-sm animate-in slide-in-from-left-4 fade-in duration-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/40"></div>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {deploymentState === "online" && (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center animate-in zoom-in-95 duration-500">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-brand-accent/20 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-brand-accent/10 rounded-full border-2 border-brand-accent flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-brand-accent" />
                  </div>
                </div>
                <h4 className="text-3xl font-black text-white mb-4">Environment Online</h4>
                <p className="text-slate-500 font-medium mb-10 max-w-md">
                  Your secure connection is established. You may now access the target system in an isolated browser window.
                </p>
                <a 
                  href={`/labs/${challenge.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-white text-surface-darkest px-10 py-5 rounded-2xl font-black text-xl transition-all hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] hover:scale-105 flex items-center gap-4"
                >
                  <ExternalLink className="w-6 h-6" />
                  Access Simulation
                </a>
              </div>
            )}
          </div>

          {/* Flag Submission */}
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6">
            <h3 className="text-white font-black mb-4 flex items-center gap-3">
              <Shield className="w-5 h-5 text-brand-accent" />
              Intelligence Submission
            </h3>
            <FlagSubmitForm challengeId={challenge.id} isSolved={isSolved} onSolve={onSolve} />
          </div>
        </div>
      </div>
    </div>
  );
}
