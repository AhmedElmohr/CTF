"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Smartphone, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Shield,
  Key,
  Database
} from "lucide-react";
import clsx from "clsx";

export default function MFABypassLab() {
  const [step, setStep] = useState("signup"); // signup, mfa, dashboard
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState<any>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/labs/a06-5/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const result = await res.json();
      
      setIsLoading(false);
      if (res.ok && result.success) {
        setStep("mfa");
      } else {
        setError(result.message || "Registration failed.");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Connection error.");
    }
  };

  const handleVerifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/labs/a06-5/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: mfaCode })
      });
      const result = await res.json();
      
      if (res.ok && result.success) {
        await simulateDirectAccess();
      } else {
        setIsLoading(false);
        setError(result.message || "Invalid verification code.");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Connection error.");
    }
  };

  // The Bypass Trick: This function simulates a "Force Browse" or "Logic Jump"
  // In a real attack, the user would just type the URL in the browser.
  const simulateDirectAccess = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/labs/a06-5/dashboard");
      const result = await res.json();
      
      setIsLoading(false);
      if (res.ok && result.success) {
        setDashboardData(result);
        setStep("dashboard");
      } else {
        setError(result.message || "Unauthorized access.");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Connection error.");
    }
  };

  const handleReset = async () => {
    setStep("signup");
    setEmail("");
    setPassword("");
    setMfaCode("");
    setDashboardData(null);
  };

  if (step === "dashboard" && dashboardData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 font-sans">
        <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl p-12 border border-slate-100 flex flex-col md:flex-row gap-12 animate-in zoom-in-95 duration-700">
          <div className="flex-1 space-y-8">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                Administrative <br />
                <span className="text-emerald-500">Access Granted</span>
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Welcome back. You are now connected to the secure governance portal. 
                All system operations are currently at full capacity.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">User Email</div>
                <div className="text-xs font-bold text-slate-800 break-all">{dashboardData.user?.email}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verified Status</div>
                <div className="text-xs font-bold text-slate-800">{dashboardData.user?.verified ? "True" : "False"}</div>
              </div>
            </div>
          </div>

          <div className="w-px bg-slate-100 hidden md:block"></div>

          <div className="flex-1 space-y-8 flex flex-col justify-center">
             <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8">
                <h3 className="text-emerald-900 font-black mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  MFA Bypass Success
                </h3>
                <p className="text-emerald-800/70 text-sm font-bold leading-relaxed mb-6">
                  {dashboardData.confidentialData?.internalNote || "You successfully subverted the authentication workflow."}
                </p>
                {dashboardData.confidentialData?.flag && (
                  <div className="bg-white rounded-2xl p-4 border border-emerald-500/20 shadow-sm text-center">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Internal Flag</p>
                    <code className="text-emerald-600 font-mono text-lg break-all font-black">
                      {dashboardData.confidentialData.flag}
                    </code>
                  </div>
                )}
             </div>
             <button onClick={handleReset} className="text-slate-400 text-sm font-bold hover:text-slate-900 transition-colors flex items-center justify-center gap-2">
               Log Out and Reset Environment
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Branding */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-14 h-14 rounded-[1.25rem] bg-slate-900 flex items-center justify-center mb-4 shadow-xl shadow-slate-900/20">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Corp<span className="text-blue-600">Secure</span> ID</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Registration & Gateway</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden relative p-10">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>

          {step === "signup" && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-900 mb-2">Create Account</h2>
                <p className="text-slate-500 font-medium text-sm">Step 1: Primary Registration</p>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-start gap-3 animate-in shake-in duration-300">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold leading-tight">{error}</span>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. user@corp.local"
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-blue-600 transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-blue-600 transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="group relative w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 overflow-hidden disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isLoading ? "Processing..." : "Continue to MFA"}
                    {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </span>
                  <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </form>
            </div>
          )}

          {step === "mfa" && (
            <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100">
                  <Smartphone className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Identity Verification</h2>
                <p className="text-slate-500 font-medium text-sm">Step 2: Multi-Factor Authentication</p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  <Mail className="w-3 h-3" />
                  Code sent to {email}
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-start gap-3 animate-in shake-in duration-300">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-xs font-bold leading-tight">{error}</span>
                </div>
              )}

              <form onSubmit={handleVerifyMFA} className="space-y-6">
                <div className="space-y-2 text-center">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enter 6-digit Code</label>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    placeholder="000000"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-center text-3xl font-black tracking-[0.5em] outline-none focus:border-blue-600 transition-all placeholder:text-slate-200"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                >
                  {isLoading ? "Verifying..." : "Verify & Sign In"}
                </button>
              </form>

              <div className="pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
                 <button className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors">Resend Verification Code</button>
                 <div className="h-4 w-px bg-slate-100"></div>
                 {/* The "Normal Website" way to bypass: Direct navigation simulator */}
                 <button 
                  onClick={simulateDirectAccess}
                  className="text-[10px] font-black text-slate-500 hover:text-slate-900 flex items-center gap-2 group transition-colors uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-lg border border-slate-200"
                 >
                   Force Browse to /dashboard (Bypass Test)
                   <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Security Info */}
        <div className="mt-12 flex flex-col items-center gap-6">
           <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Shield className="w-3.5 h-3.5" />
                End-to-End Encryption
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <Clock className="w-3.5 h-3.5" />
                Session: 15m
              </div>
           </div>
           <div className="bg-slate-200/50 p-4 rounded-3xl border border-slate-200/80 flex items-center gap-3">
              <Database className="w-4 h-4 text-slate-400" />
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
                Node ID: AUTH-V4-SIM
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
