"use client";

import { useState } from "react";
import { UserPlus, Settings, Shield, KeyRound, RotateCcw } from "lucide-react";

export default function IDORLogicLab() {
  const [view, setView] = useState<"register" | "dashboard" | "success">("register");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [flag, setFlag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setIsLoading(true);
    setServerResponse(null);

    try {
      const res = await fetch("/api/labs/a06-4/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      setStatusCode(res.status);
      const data = await res.json();
      setServerResponse(JSON.stringify(data, null, 2));

      if (data.success) {
        setUserRole(data.user?.role || "user");
        setView("dashboard");
      }
    } catch {
      setServerResponse("Network error");
      setStatusCode(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessAdmin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/labs/a06-4/admin");
      setStatusCode(res.status);
      const data = await res.json();
      setServerResponse(JSON.stringify(data, null, 2));

      if (data.success && data.adminPanel?.flag) {
        setFlag(data.adminPanel.flag);
        setView("success");
      }
    } catch {
      setServerResponse("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    document.cookie = "lab-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setView("register"); setUsername(""); setPassword("");
    setUserRole(""); setFlag(""); setServerResponse(null); setStatusCode(null);
  };

  if (view === "success") {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white">
        <Shield className="w-24 h-24 text-green-500 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Admin Access Granted</h1>
        <p className="text-slate-400 mb-8 max-w-lg text-center">
          You escalated privileges by injecting <code className="bg-slate-800 px-1 rounded">&quot;role&quot;: &quot;admin&quot;</code> into
          the registration API request via Burp Suite. The server performed mass assignment!
        </p>
        <div className="bg-black border border-green-500 p-6 rounded-lg font-mono text-xl text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          {flag}
        </div>
        <button onClick={handleReset} className="mt-6 text-slate-500 hover:text-white underline">Reset Lab</button>
      </div>
    );
  }

  if (view === "dashboard") {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <header className="bg-white border-b border-slate-200 p-4 px-8 flex justify-between items-center shadow-sm">
          <div className="font-bold text-xl text-blue-700">AppDash</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Logged in as <strong className="text-slate-800">{username}</strong></span>
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${userRole === "admin" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}>
              Role: {userRole}
            </span>
          </div>
        </header>
        <main className="max-w-4xl mx-auto p-8 mt-8">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-lg mb-2 flex items-center gap-2"><UserPlus className="w-5 h-5 text-blue-500" /> My Profile</h2>
              <p className="text-slate-500 text-sm mb-4">Manage your basic account settings.</p>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded text-sm font-medium">Edit Profile</button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h2 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Settings className="w-5 h-5 text-red-500" /> Admin Controls
              </h2>
              <p className="text-slate-500 text-sm mb-4">Manage system settings and view confidential data.</p>
              {userRole === "admin" ? (
                <button onClick={handleAccessAdmin} disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-bold shadow-md disabled:opacity-50">
                  {isLoading ? "Loading..." : "Access Admin Panel"}
                </button>
              ) : (
                <button disabled className="bg-slate-100 text-slate-400 px-4 py-2 rounded text-sm font-medium cursor-not-allowed flex items-center gap-2">
                  <KeyRound className="w-4 h-4" /> Permission Denied
                </button>
              )}
            </div>
          </div>
          {serverResponse && (
            <div className="mt-8 bg-slate-900 rounded-lg border border-slate-700 p-4">
              <div className="flex justify-between mb-2">
                <span className="text-slate-400 text-xs font-mono">Server Response</span>
                {statusCode && <span className={`text-xs font-mono ${statusCode < 300 ? "text-green-400" : "text-red-400"}`}>HTTP {statusCode}</span>}
              </div>
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{serverResponse}</pre>
            </div>
          )}
          <div className="mt-12 text-center">
            <button onClick={handleReset} className="text-blue-600 hover:underline text-sm flex items-center gap-1 mx-auto">
              <RotateCcw className="w-3 h-3" /> Log out & Reset
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="opacity-80 text-sm">Sign up for the AppDash portal.</p>
        </div>
        <div className="p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-slate-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md disabled:opacity-50">
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>
          <p className="text-xs text-slate-400 mt-4 text-center font-mono">
            💡 Intercept this POST request in Burp Suite. Try adding a hidden parameter.
          </p>
        </div>
      </div>
    </div>
  );
}
