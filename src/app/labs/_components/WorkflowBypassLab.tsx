"use client";

import { useState } from "react";
import { Mail, CheckCircle2, Shield, RotateCcw } from "lucide-react";

export default function WorkflowBypassLab() {
  const [step, setStep] = useState<"signup" | "verify" | "dashboard">("signup");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [flag, setFlag] = useState("");
  const [serverResponse, setServerResponse] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/labs/a06-5/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "password123" }),
      });
      const data = await res.json();
      setServerResponse(JSON.stringify(data, null, 2));
      setStatusCode(res.status);
      if (data.success) setStep("verify");
    } catch { setErrorMsg("Network error"); }
    finally { setIsLoading(false); }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/labs/a06-5/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      setServerResponse(JSON.stringify(data, null, 2));
      setStatusCode(res.status);
      if (!data.success) setErrorMsg(data.message);
    } catch { setErrorMsg("Network error"); }
    finally { setIsLoading(false); }
  };

  const handleCheckDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/labs/a06-5/dashboard");
      const data = await res.json();
      setServerResponse(JSON.stringify(data, null, 2));
      setStatusCode(res.status);
      if (data.success && data.confidentialData?.flag) {
        setFlag(data.confidentialData.flag);
        setStep("dashboard");
      }
    } catch { setErrorMsg("Network error"); }
    finally { setIsLoading(false); }
  };

  const handleReset = () => {
    document.cookie = "lab-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setStep("signup"); setEmail(""); setOtp(""); setErrorMsg("");
    setFlag(""); setServerResponse(null); setStatusCode(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Step Indicator */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-slate-200 -z-10 -translate-y-1/2" />
          {["Register", "Verify Email", "Dashboard"].map((label, i) => {
            const stepNames = ["signup", "verify", "dashboard"];
            const active = step === stepNames[i];
            return (
              <div key={label} className={`flex flex-col items-center bg-white px-4 ${active ? "text-blue-600" : "text-slate-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 border-2 ${active ? "border-blue-600 bg-blue-50" : "border-slate-300 bg-white"}`}>
                  {i + 1}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Left: App UI */}
        <div className="flex items-start justify-center">
          {step === "signup" && (
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-200">
              <h2 className="text-2xl font-bold mb-2 text-center">Create Corporate Account</h2>
              <p className="text-slate-500 text-sm text-center mb-8">Access the secure employee intranet.</p>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Corporate Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="name@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
                  <input type="password" required className="w-full border border-slate-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" />
                </div>
                <button type="submit" disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-50">
                  {isLoading ? "Signing up..." : "Continue"}
                </button>
              </form>
            </div>
          )}

          {step === "verify" && (
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-200 text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
              <p className="text-slate-500 text-sm mb-6">
                We sent a 6-digit OTP to <strong className="text-slate-800">{email}</strong>.
              </p>
              {errorMsg && (
                <div className="mb-6 bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">{errorMsg}</div>
              )}
              <form onSubmit={handleVerify} className="space-y-6">
                <input type="text" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)}
                  className="w-32 mx-auto block text-center text-2xl tracking-widest border border-slate-300 rounded py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="000000" />
                <button type="submit" disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg disabled:opacity-50">
                  {isLoading ? "Verifying..." : "Verify & Enter"}
                </button>
              </form>
              <p className="mt-6 text-xs text-slate-400">
                As an attacker, you do NOT have access to this email inbox.
              </p>
              <p className="mt-2 text-xs text-slate-400 font-mono">
                💡 Try sending <code>GET /api/labs/a06-5/dashboard</code> directly from Burp Repeater
              </p>
            </div>
          )}

          {step === "dashboard" && (
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-green-600 p-6 flex items-center gap-4 text-white">
                <CheckCircle2 className="w-10 h-10" />
                <div>
                  <h2 className="text-2xl font-bold">Secure Dashboard</h2>
                  <p className="opacity-90 text-sm">Access granted without verification!</p>
                </div>
              </div>
              <div className="p-8">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8 text-center">
                  <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Workflow Bypassed!</h3>
                  <p className="text-slate-600 text-sm">
                    The server only checked if you had a session, NOT if you verified your email.
                    This is a classic Force Browsing vulnerability.
                  </p>
                </div>
                <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-center text-lg border border-slate-700">
                  {flag}
                </div>
                <button onClick={handleReset} className="mt-6 text-blue-600 hover:underline text-sm flex items-center gap-1 mx-auto">
                  <RotateCcw className="w-3 h-3" /> Reset Lab
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Server Response */}
        <div className="bg-slate-900 rounded-xl border border-slate-700 flex flex-col overflow-hidden min-h-[500px]">
          <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
            <span className="text-slate-400 text-sm font-mono">Server Response</span>
            {statusCode !== null && (
              <span className={`text-xs font-mono font-bold ${statusCode < 300 ? "text-green-400" : "text-red-400"}`}>
                HTTP {statusCode}
              </span>
            )}
          </div>
          <div className="p-4 flex-1 overflow-auto font-mono text-sm">
            {serverResponse ? (
              <pre className={`whitespace-pre-wrap break-all ${statusCode && statusCode < 300 ? "text-green-400" : "text-red-400"}`}>
                {serverResponse}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-600 italic text-center">
                <div>
                  <p className="mb-2">Interact with the app to see server responses.</p>
                  <p className="text-xs text-slate-700">All requests go to <code>/api/labs/a06-5/*</code></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
