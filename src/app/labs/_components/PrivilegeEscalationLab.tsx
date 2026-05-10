"use client";

import { useState } from "react";
import { 
  User, 
  Settings, 
  Shield, 
  Mail, 
  Lock, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  LayoutDashboard,
  Bell,
  Search,
  Key,
  BadgeCheck,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import clsx from "clsx";

export default function PrivilegeEscalationLab() {
  const [step, setStep] = useState<"register" | "dashboard">("register");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [sessionData, setSessionData] = useState<any>(null);
  const [adminData, setAdminData] = useState<any>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const payload = { username, password };

    try {
      const res = await fetch("/api/labs/a06-4/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      setIsSubmitting(false);
      
      if (res.ok && result.success) {
        setSessionData(result.user);
        setStep("dashboard");
      } else {
        setMessage({ type: 'error', text: result.message || "Registration failed." });
      }
    } catch (err) {
      setIsSubmitting(false);
      setMessage({ type: 'error', text: "Failed to connect to registration service." });
    }
  };

  const handleAccessAdmin = async () => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/labs/a06-4/admin", {
        method: "GET"
      });
      
      const result = await res.json();
      setIsSubmitting(false);
      
      if (res.ok && result.success) {
        setAdminData(result.adminPanel);
        setSessionData(result.user); // Update role if it changed
      } else {
        setMessage({ type: 'error', text: result.message || "Access denied." });
      }
    } catch (err) {
      setIsSubmitting(false);
      setMessage({ type: 'error', text: "Failed to connect to admin service." });
    }
  };

  if (step === "register") {
    return (
      <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 flex flex-col items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mb-4 shadow-xl shadow-blue-600/20">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Corp<span className="text-blue-600">Portal</span></h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">New Employee Registration</p>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-10">
            {message && (
              <div className="mb-6 bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-start gap-3 text-xs font-bold leading-tight">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {message.text}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold outline-none focus:border-blue-600 transition-all"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
              >
                {isSubmitting ? "Registering..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-800">Corp<span className="text-blue-600">Portal</span></span>
        </div>
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right mr-2">
            <div className="text-sm font-bold">{sessionData?.username}</div>
            <div className="text-[10px] font-black uppercase text-blue-600 tracking-widest">{sessionData?.role}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center overflow-hidden">
            <User className="w-5 h-5 text-blue-600" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden lg:flex">
          <nav className="flex-1 p-6 space-y-2">
            <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm bg-slate-50 text-slate-500 hover:bg-slate-100">
              <div className="flex items-center gap-3"><LayoutDashboard className="w-4 h-4" /> Dashboard</div>
            </button>
            <button 
              onClick={handleAccessAdmin}
              className={clsx(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm group",
                adminData ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-slate-50 hover:bg-slate-100 text-slate-700"
              )}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4" /> Admin Console
              </div>
              {!adminData && <Lock className="w-3 h-3 text-slate-400" />}
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Dashboard</h1>
                <p className="text-slate-500 font-medium">Welcome to the corporate portal.</p>
              </div>
            </div>

            {message && (
              <div className={clsx(
                "p-4 rounded-2xl border flex items-start gap-4 animate-in slide-in-from-top-2 duration-300",
                message.type === 'success' ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"
              )}>
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <p className="text-sm font-bold leading-tight">{message.text}</p>
              </div>
            )}

            {adminData ? (
              <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">Admin Control Panel</h2>
                    <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest">Classified Access Granted</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Users</div>
                    <div className="text-3xl font-black text-white">{adminData.totalUsers}</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Server Status</div>
                    <div className="text-3xl font-black text-emerald-400 capitalize">{adminData.serverStatus}</div>
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl">
                  <h3 className="text-emerald-400 font-black mb-3">Logic-Based Privilege Escalation Success</h3>
                  <p className="text-sm text-slate-300 mb-4">
                    By injecting the `role` parameter during registration, you exploited a mass assignment vulnerability to gain administrative privileges.
                  </p>
                  <code className="block bg-black/40 border border-emerald-500/20 p-4 rounded-xl text-emerald-400 font-mono text-lg font-black text-center break-all">
                    {adminData.flag}
                  </code>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[2rem] border border-slate-200 shadow-sm text-center">
                <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black mb-2">Standard User Account</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Your account has limited permissions. Certain areas of the portal, such as the Admin Console, are restricted.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

