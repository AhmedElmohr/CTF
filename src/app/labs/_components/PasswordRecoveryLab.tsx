"use client";

import { useState } from "react";
import { 
  Lock, 
  User, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  Shield,
  Key,
  Database,
  Search
} from "lucide-react";
import clsx from "clsx";

export default function PasswordRecoveryLab() {
  const [step, setStep] = useState(1); // 1: identify, 2: question, 3: success
  const [username, setUsername] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [flag, setFlag] = useState("");

  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/labs/a06-1/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
      });
      const data = await res.json();
      
      if (res.ok) {
        setSecurityQuestion(data.securityQuestion);
        setStep(2);
      } else {
        setError(data.message || "Account not found in our directory. Please contact IT support.");
      }
    } catch (err: any) {
      setError("An error occurred connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/labs/a06-1/verify-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: securityAnswer })
      });
      const data = await res.json();
      
      if (res.ok) {
        setFlag(data.flag);
        setStep(3);
      } else {
        setError(data.message || "Incorrect security answer.");
      }
    } catch (err: any) {
      setError("An error occurred connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 font-sans">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center border border-slate-100 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Access Restored</h2>
          <p className="text-slate-500 font-medium mb-8">Password reset link has been sent to your primary recovery address.</p>
          
          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 text-left mb-8">
            <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase mb-3">
              <ShieldCheck className="w-4 h-4" />
              Recovery Logic Exploited
            </div>
            <p className="text-emerald-800/70 text-xs font-bold leading-relaxed mb-4">
              You successfully bypassed the account recovery process by exploiting a predictable security question.
            </p>
            <div className="bg-white rounded-xl p-3 border border-emerald-500/20 shadow-sm text-center">
              <code className="text-emerald-600 font-mono text-sm break-all font-black">
                {flag || "flag{r3c0v3ry_l0g1c_OSINT_fl4w}"}
              </code>
            </div>
          </div>
          
          <button 
            onClick={() => {
              setStep(1);
              setUsername("");
              setSecurityAnswer("");
              setFlag("");
            }}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-4 shadow-xl shadow-blue-600/20">
            <Key className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Secured<span className="text-blue-600">Corp</span> ID</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Enterprise Account Recovery</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden relative p-10">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>

          {step === 1 ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Identify Account</h2>
                <p className="text-slate-500 font-medium text-sm">Enter your corporate email or username.</p>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-start gap-3 animate-in shake-in duration-300">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold leading-tight">{error}</span>
                </div>
              )}

              <form onSubmit={handleIdentify} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Account ID</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. ceo@secured-corp.local"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-blue-600 transition-all placeholder:text-slate-300"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="group relative w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 overflow-hidden disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isLoading ? "Searching Directory..." : "Find Account"}
                    {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </form>
              
              <div className="text-center">
                 <p className="text-[10px] text-slate-400 font-bold italic">💡 Mission Note: Target user is the CEO.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Security Verification</h2>
                <p className="text-slate-500 font-medium text-sm">Please answer the question associated with your account.</p>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-start gap-3 animate-in shake-in duration-300">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold leading-tight">{error}</span>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl">
                <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Security Question
                </div>
                <p className="text-slate-900 font-bold text-sm leading-relaxed">
                  "{securityQuestion || 'What is the name of your first pet?'}"
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Answer</label>
                  <input 
                    type="text" 
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder="Enter answer..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-blue-600 transition-all placeholder:text-slate-300"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : "Recover Account"}
                </button>
              </form>

              <div className="pt-6 border-t border-slate-100 text-center flex flex-col gap-2">
                 <p className="text-[10px] text-slate-400 font-bold italic leading-relaxed">
                   💡 Tip: The CEO is Mark Becker (m.becker).
                 </p>
                 <a href="/labs/a06-1/about" target="_blank" className="text-[10px] text-blue-500 hover:underline font-bold">
                   View Company About Page
                 </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 flex flex-col items-center gap-6">
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Shield className="w-3.5 h-3.5" />
                PCI-DSS Compliant
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Database className="w-3.5 h-3.5" />
                Directory: CLUSTER-A
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
