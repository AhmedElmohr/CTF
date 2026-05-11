"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Shield, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  LayoutDashboard,
  Building2,
  ChevronRight,
  ShieldAlert,
  Send,
  Loader2,
  Activity,
  HardDrive,
  CreditCard,
  Settings,
  Bell,
  Search,
  Plus,
  ArrowUpRight,
  UserPlus
} from "lucide-react";
import clsx from "clsx";

export default function WorkspaceInvitationLab() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "invitations" | "admin">("dashboard");
  const [emailToInvite, setEmailToInvite] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const [sessionData, setSessionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const res = await fetch("/api/labs/a06-9/me");
      const data = await res.json();
      if (data.success) {
        setSessionData(data);
        if (data.user.workspaces.length > 0 && !selectedWorkspace) {
          setSelectedWorkspace(data.user.workspaces[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const payload = { 
      email: emailToInvite, 
      workspace_id: selectedWorkspace 
    };

    try {
      const res = await fetch("/api/labs/a06-9/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const result = await res.json();
      setIsSubmitting(false);
      
      if (res.ok && result.success) {
        setMessage({ type: 'success', text: result.message });
        setEmailToInvite("");
        fetchSession();
      } else {
        setMessage({ type: 'error', text: result.message || "Invitation failed." });
      }
    } catch (err) {
      setIsSubmitting(false);
      setMessage({ type: 'error', text: "Failed to connect to API." });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const userInitial = sessionData?.user?.email ? sessionData.user.email.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-300 font-sans flex overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-72 bg-[#121214] border-r border-white/5 flex flex-col hidden lg:flex relative z-20">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight text-white">
              B2B<span className="text-indigo-500">Sync</span>
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-4">Overview</div>
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className={clsx(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm",
                    activeTab === "dashboard" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  <LayoutDashboard className="w-4 h-4" /> Workspace Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab("invitations")}
                  className={clsx(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm",
                    activeTab === "invitations" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  )}
                >
                  <UserPlus className="w-4 h-4" /> Team Invitations
                </button>
              </nav>
            </div>

            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-4">Settings</div>
              <nav className="space-y-1">
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-500 font-bold text-sm cursor-not-allowed">
                  <div className="flex items-center gap-3"><CreditCard className="w-4 h-4" /> Billing</div>
                  <Lock className="w-3 h-3 opacity-50" />
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-500 font-bold text-sm cursor-not-allowed">
                  <div className="flex items-center gap-3"><Settings className="w-4 h-4" /> Organization</div>
                  <Lock className="w-3 h-3 opacity-50" />
                </button>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Restricted Area</div>
            <button 
              onClick={() => setActiveTab("admin")}
              className={clsx(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm group",
                activeTab === "admin" 
                  ? (sessionData?.user?.isAdmin ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/20" : "bg-white/5 text-slate-300") 
                  : "bg-black/20 border border-white/5 text-slate-400 hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4" /> System Admin
              </div>
              {!sessionData?.user?.isAdmin && <Shield className="w-3 h-3 text-slate-500" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-[#121214]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96 hidden md:block">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search workspaces, members, or settings..." 
                className="w-full bg-white/5 border border-white/5 rounded-full pl-12 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#121214]"></span>
            </button>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-white">{sessionData?.user?.email}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                  {sessionData?.user?.isAdmin ? "Administrator" : "Standard User"}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-black">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
            
            {/* Global Messages */}
            {message && activeTab === "invitations" && (
              <div className={clsx(
                "mb-8 p-4 rounded-2xl border flex items-center gap-4 animate-in slide-in-from-top-4 duration-500 backdrop-blur-md",
                message.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
              )}>
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <p className="text-sm font-bold">{message.text}</p>
              </div>
            )}

            {/* DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex items-end justify-between">
                  <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">Welcome back, {userInitial}</h1>
                    <p className="text-slate-400 font-medium">Here's what's happening across your connected workspaces today.</p>
                  </div>
                  <button onClick={() => setActiveTab("invitations")} className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20">
                    <Plus className="w-4 h-4" /> Invite Member
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#121214] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-all"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                        <Building2 className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="text-4xl font-black text-white mb-2">{sessionData?.user?.workspaces.length || 0}</div>
                      <div className="text-sm font-bold text-slate-500">Active Workspaces</div>
                    </div>
                  </div>

                  <div className="bg-[#121214] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                        <Users className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="text-4xl font-black text-white mb-2">1,248</div>
                      <div className="text-sm font-bold text-slate-500">Total Network Members</div>
                    </div>
                  </div>

                  <div className="bg-[#121214] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-amber-500/20 transition-all"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                        <Activity className="w-6 h-6 text-amber-400" />
                      </div>
                      <div className="text-4xl font-black text-white mb-2">99.9%</div>
                      <div className="text-sm font-bold text-slate-500">System Uptime</div>
                    </div>
                  </div>
                </div>

                {/* Workspace List */}
                <div>
                  <h3 className="text-lg font-black text-white mb-6">Your Accessible Workspaces</h3>
                  <div className="bg-[#121214] rounded-[2rem] border border-white/5 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <tr>
                          <th className="px-6 py-4">Workspace ID</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-sm">
                        {sessionData?.user?.workspaces.map((ws: string) => (
                          <tr key={ws} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-5 font-bold text-white flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs">
                                WS
                              </div>
                              {ws}
                            </td>
                            <td className="px-6 py-5">
                              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">Active</span>
                            </td>
                            <td className="px-6 py-5 text-slate-400">
                              {ws === "WS_ADMIN_SECRET_999" ? "System Admin" : "Guest Viewer"}
                            </td>
                            <td className="px-6 py-5 text-right">
                              <button className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Enter Portal</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* INVITATIONS TAB */}
            {activeTab === "invitations" && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight mb-2">Team Invitations</h1>
                  <p className="text-slate-400 font-medium">Provision access for new team members to your workspaces.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Form Column */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#121214] rounded-[2rem] border border-white/5 p-8 relative overflow-hidden">
                      {/* Decorative Background Element */}
                      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                      
                      <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                          <Mail className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-white">Send New Invite</h2>
                          <p className="text-xs text-slate-500 font-medium">Configure access level and workspace targeting.</p>
                        </div>
                      </div>
                      
                      <form onSubmit={handleInvite} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Colleague Email</label>
                          <input 
                            type="email" 
                            value={emailToInvite}
                            onChange={(e) => setEmailToInvite(e.target.value)}
                            placeholder="colleague@company.com"
                            required
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Workspace</label>
                          <select 
                            value={selectedWorkspace}
                            onChange={(e) => setSelectedWorkspace(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none"
                          >
                            {sessionData?.user?.workspaces.map((ws: string) => (
                              <option key={ws} value={ws} className="bg-[#121214]">{ws}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="pt-4">
                          <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-indigo-600 text-white font-black px-8 py-4 rounded-2xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                          >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            Dispatch Invitation
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Info Column */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-[#121214] to-black p-6 rounded-[2rem] border border-white/5">
                      <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-slate-400" /> Developer API Hub
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium">
                        The B2BSync platform utilizes a RESTful API. To automate invitations, you may submit a POST request containing a JSON payload directly to our secure endpoint.
                      </p>
                      <div className="space-y-3">
                        <div className="bg-black/50 border border-white/5 rounded-xl p-3">
                          <div className="text-[10px] font-black uppercase text-indigo-400 mb-1 tracking-widest">Endpoint</div>
                          <code className="text-xs text-slate-300 font-mono">POST /api/labs/a06-9/invite</code>
                        </div>
                        <div className="bg-black/50 border border-white/5 rounded-xl p-3">
                          <div className="text-[10px] font-black uppercase text-rose-400 mb-1 tracking-widest">Target Configuration</div>
                          <code className="text-xs text-slate-300 font-mono break-all">
                            "workspace_id": "{sessionData?.adminWorkspaceId || "WS_ADMIN_SECRET_999"}"
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-[2rem] p-6 text-amber-500/80">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0 text-amber-500" />
                        <div>
                          <h4 className="font-bold text-sm text-amber-500 mb-1">Security Notice</h4>
                          <p className="text-xs font-medium leading-relaxed">
                            Middleware validation strictly enforces that users may only invite colleagues to workspaces they currently reside in. Cross-workspace assignments are blocked at the proxy layer.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN TAB */}
            {activeTab === "admin" && (
              <div className="animate-in fade-in duration-500">
                {sessionData?.user?.isAdmin ? (
                  <div className="bg-[#121214] p-10 lg:p-16 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none"></div>
                    <div className="relative z-10 max-w-2xl">
                      <div className="flex items-center gap-6 mb-10">
                        <div className="w-20 h-20 bg-rose-500/20 border border-rose-500/30 rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-500/20">
                          <ShieldAlert className="w-10 h-10 text-rose-500" />
                        </div>
                        <div>
                          <h2 className="text-4xl font-black text-white tracking-tight">System Admin</h2>
                          <p className="text-rose-400 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                            Maximum Privilege Level Granted
                          </p>
                        </div>
                      </div>

                      <div className="bg-black/40 border border-white/5 p-8 rounded-[2rem] backdrop-blur-sm mb-8">
                        <h3 className="text-white font-black text-xl mb-4">Vulnerability Details: Type Confusion</h3>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                          You successfully bypassed the B2BSync authorization controls. The middleware filter expected a string and verified only <code className="text-rose-400 bg-rose-500/10 px-1 py-0.5 rounded">workspace_id[0]</code>, which passed the check. However, the database execution layer accepted the full array, assigning you to the restricted admin workspace.
                        </p>
                        
                        <div className="space-y-3">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mission Objective Flag</div>
                          <div className="bg-gradient-to-r from-rose-500/20 to-black border border-rose-500/30 p-6 rounded-2xl">
                            <code className="text-rose-400 font-mono text-xl font-black break-all shadow-inner block text-center select-all">
                              {sessionData?.flag}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-20 px-4">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-2xl"></div>
                      <div className="w-32 h-32 bg-[#121214] border border-white/5 text-slate-500 rounded-[2.5rem] flex items-center justify-center relative z-10 rotate-12 shadow-2xl">
                        <Lock className="w-12 h-12" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Access Restricted</h3>
                    <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed font-medium">
                      Your current security clearance is insufficient. The System Administration console is strictly limited to authorized personnel within the administrative workspace.
                    </p>
                    <button onClick={() => setActiveTab("dashboard")} className="mt-10 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/5 text-white font-bold rounded-xl transition-all">
                      Return to Dashboard
                    </button>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}

// Additional icons required for the UI
function Lock(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}

function Terminal(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>;
}
