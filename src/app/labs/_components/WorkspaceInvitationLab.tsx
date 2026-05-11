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
  ShieldAlert,
  Send,
  Loader2,
  Activity,
  CreditCard,
  Settings,
  Bell,
  Search,
  Plus,
  UserPlus,
  Lock,
  Terminal,
  List,
  Fingerprint,
  Key,
  Globe,
  Database,
  Eye,
  EyeOff,
  FileText,
  Unlock
} from "lucide-react";
import clsx from "clsx";

const MOCK_MEMBERS = [
  { id: 1, name: "Sarah Jenkins", email: "sarah.j@company.com", role: "Manager", status: "Active" },
  { id: 2, name: "David Chen", email: "d.chen@company.com", role: "Developer", status: "Active" },
  { id: 3, name: "Elena Rodriguez", email: "elena.r@company.com", role: "Designer", status: "Offline" },
  { id: 4, name: "Michael Chang", email: "m.chang@company.com", role: "Contractor", status: "Invited" },
  { id: 5, name: "Jessica Smith", email: "jsmith@company.com", role: "Viewer", status: "Active" },
];

const MOCK_AUDIT_LOGS = [
  { id: 101, action: "User Login", user: "system_admin", ip: "192.168.1.45", time: "2 mins ago", status: "Success" },
  { id: 102, action: "API Key Generated", user: "sarah.j", ip: "10.0.0.12", time: "15 mins ago", status: "Success" },
  { id: 103, action: "Failed Login Attempt", user: "unknown", ip: "45.22.11.99", time: "1 hour ago", status: "Failed" },
  { id: 104, action: "Workspace Policy Updated", user: "system_admin", ip: "192.168.1.45", time: "3 hours ago", status: "Success" },
  { id: 105, action: "Data Export Requested", user: "d.chen", ip: "10.0.0.15", time: "1 day ago", status: "Success" },
];

type TabType = "dashboard" | "directory" | "audit" | "invitations" | "security" | "admin";

export default function WorkspaceInvitationLab() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
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
  const handleUpdateSettings = async (e?: any) => {
    if (e && e.preventDefault) e.preventDefault();
    alert("Transmission Sequence Initiated! Check your HTTP Interception proxy now.");
    setIsSubmitting(true);
    setMessage(null);
    try {
      console.log("[SYS] Dispatching configuration payload...");
      const res = await fetch("/api/labs/a06-9/settings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json" 
        },
        body: JSON.stringify({ 
          theme: "dark", 
          layout: "grid", 
          isVaultUnlocked: false 
        })
      });
      const result = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: "Application configuration pushed to server." });
        fetchSession();
      } else {
        setMessage({ type: 'error', text: result.message || "Update failed." });
      }
    } catch (err) {
      setMessage({ type: 'error', text: "Network propagation error." });
    } finally {
      setIsSubmitting(false);
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

          <div className="space-y-8">
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-4">Overview</div>
              <nav className="space-y-1">
                <button onClick={() => setActiveTab("dashboard")} className={clsx("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm", activeTab === "dashboard" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-white/5 hover:text-slate-200")}>
                  <LayoutDashboard className="w-4 h-4" /> Workspace Dashboard
                </button>
                <button onClick={() => setActiveTab("directory")} className={clsx("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm", activeTab === "directory" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-white/5 hover:text-slate-200")}>
                  <Users className="w-4 h-4" /> Members Directory
                </button>
                <button onClick={() => setActiveTab("audit")} className={clsx("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm", activeTab === "audit" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-white/5 hover:text-slate-200")}>
                  <List className="w-4 h-4" /> Audit Logs
                </button>
              </nav>
            </div>

            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-4">Management</div>
              <nav className="space-y-1">
                <button onClick={() => setActiveTab("invitations")} className={clsx("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm", activeTab === "invitations" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-white/5 hover:text-slate-200")}>
                  <UserPlus className="w-4 h-4" /> Team Invitations
                </button>
                <button onClick={() => setActiveTab("security")} className={clsx("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm", activeTab === "security" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:bg-white/5 hover:text-slate-200")}>
                  <Shield className="w-4 h-4" /> Security Settings
                </button>
                <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-500 font-bold text-sm cursor-not-allowed">
                  <div className="flex items-center gap-3"><CreditCard className="w-4 h-4" /> Billing</div>
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
              {!sessionData?.user?.isAdmin && <Lock className="w-3 h-3 text-slate-500" />}
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                      <div className="text-sm font-bold text-slate-500">Network Members</div>
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

                  <div className="bg-[#121214] p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all"></div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6">
                        <Database className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="text-4xl font-black text-white mb-2">45<span className="text-2xl text-slate-500">TB</span></div>
                      <div className="text-sm font-bold text-slate-500">Storage Used</div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Workspace List */}
                  <div className="lg:col-span-2">
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

                  {/* Storage Usage Visual */}
                  <div>
                    <h3 className="text-lg font-black text-white mb-6">Storage Allocation</h3>
                    <div className="bg-[#121214] rounded-[2rem] border border-white/5 p-8">
                      <div className="mb-6">
                        <div className="flex justify-between text-sm font-bold mb-2">
                          <span className="text-white">Workspace Data</span>
                          <span className="text-slate-500">85%</span>
                        </div>
                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                          <div className="w-[85%] h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                        </div>
                      </div>
                      <div className="mb-6">
                        <div className="flex justify-between text-sm font-bold mb-2">
                          <span className="text-white">Media Assets</span>
                          <span className="text-slate-500">42%</span>
                        </div>
                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                          <div className="w-[42%] h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-bold mb-2">
                          <span className="text-white">Archived Logs</span>
                          <span className="text-slate-500">12%</span>
                        </div>
                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                          <div className="w-[12%] h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DIRECTORY TAB */}
            {activeTab === "directory" && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex items-end justify-between">
                  <div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">Members Directory</h1>
                    <p className="text-slate-400 font-medium">Browse active personnel across your assigned workspaces.</p>
                  </div>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="text" placeholder="Search members..." className="bg-[#121214] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MOCK_MEMBERS.map(member => (
                    <div key={member.id} className="bg-[#121214] border border-white/5 rounded-[2rem] p-6 flex items-center gap-4 hover:border-white/10 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-black shadow-inner">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-sm">{member.name}</h4>
                        <p className="text-slate-500 text-xs">{member.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-black uppercase text-indigo-400 mb-1">{member.role}</div>
                        <div className={clsx("w-2 h-2 rounded-full ml-auto", member.status === 'Active' ? "bg-emerald-500" : member.status === 'Offline' ? "bg-slate-500" : "bg-amber-500")}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AUDIT LOGS TAB */}
            {activeTab === "audit" && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight mb-2">Security Audit Logs</h1>
                  <p className="text-slate-400 font-medium">Immutable record of critical system and security events.</p>
                </div>

                <div className="bg-[#121214] rounded-[2.5rem] border border-white/5 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-white/[0.02] border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <tr>
                        <th className="px-8 py-5">Event ID</th>
                        <th className="px-8 py-5">Action</th>
                        <th className="px-8 py-5">Initiator</th>
                        <th className="px-8 py-5">IP Address</th>
                        <th className="px-8 py-5">Timestamp</th>
                        <th className="px-8 py-5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {MOCK_AUDIT_LOGS.map(log => (
                        <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-8 py-4 font-mono text-xs text-slate-500">#{log.id}</td>
                          <td className="px-8 py-4 font-bold text-white">{log.action}</td>
                          <td className="px-8 py-4 text-slate-400">{log.user}</td>
                          <td className="px-8 py-4 font-mono text-xs text-slate-500">{log.ip}</td>
                          <td className="px-8 py-4 text-slate-400">{log.time}</td>
                          <td className="px-8 py-4">
                            <span className={clsx("px-3 py-1 rounded-full text-[10px] font-bold border", log.status === 'Success' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20")}>
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SECURITY SETTINGS TAB */}
            {activeTab === "security" && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight mb-2">Security Settings</h1>
                  <p className="text-slate-400 font-medium">Manage your personal security protocols and access keys.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-[#121214] p-8 rounded-[2.5rem] border border-white/5 flex items-start gap-6 opacity-75">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 shrink-0">
                      <Fingerprint className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-slate-400 mb-6 leading-relaxed">Require a cryptographic token from an authenticator app when signing in to B2BSync.</p>
                      <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-slate-300 cursor-not-allowed">Enable 2FA (Locked)</button>
                    </div>
                  </div>

                  <div className="bg-[#121214] p-8 rounded-[2.5rem] border border-white/5 flex items-start gap-6 opacity-75">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 shrink-0">
                      <Key className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Developer API Keys</h3>
                      <p className="text-sm text-slate-400 mb-6 leading-relaxed">Generate secret keys to programmatically interact with the B2BSync API endpoints.</p>
                      <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-slate-300 cursor-not-allowed">Generate Key (Locked)</button>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 bg-indigo-500/5 border border-indigo-500/20 p-6 rounded-2xl flex gap-4">
                    <AlertCircle className="w-6 h-6 text-indigo-400 shrink-0" />
                    <div>
                      <h4 className="text-indigo-400 font-bold mb-1">Notice</h4>
                      <p className="text-sm text-slate-400">Security modifications are restricted to Organization Administrators. If you require changes to your authentication protocols, please contact your workspace owner.</p>
                    </div>
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
                    <div className="bg-[#121214] rounded-[2.5rem] border border-white/5 p-8 relative overflow-hidden">
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
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
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
              <div className="animate-in fade-in duration-500 space-y-10">
                {sessionData?.user?.isAdmin ? (
                  sessionData?.user?.isVaultUnlocked ? (
                    // Case 1: VAULT UNLOCKED - SHOW FLAG
                    <div className="bg-[#121214] p-10 lg:p-16 rounded-[3rem] border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none animate-pulse"></div>
                      <div className="relative z-10 max-w-3xl">
                        <div className="flex items-center gap-6 mb-10">
                          <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/40 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                            <Unlock className="w-10 h-10 text-emerald-400" />
                          </div>
                          <div>
                            <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                              Central Data Vault <span className="text-emerald-400 bg-emerald-500/10 text-xs font-black uppercase px-3 py-1 rounded-full border border-emerald-500/20">Open</span>
                            </h2>
                            <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                              Privileged Decryption Successful
                            </p>
                          </div>
                        </div>

                        <div className="bg-black/60 border border-emerald-500/20 p-8 rounded-[2.5rem] backdrop-blur-md mb-8 relative group">
                          <div className="absolute -top-3 right-8 bg-emerald-500 text-black text-[10px] font-black px-3 py-1 rounded-full">DECRYPTED PAYLOAD</div>
                          <div className="space-y-6">
                            <p className="text-sm text-slate-400 leading-relaxed">
                              Congratulations. You chained <strong>Type Confusion</strong> to bypass access control, followed by <strong>Mass Assignment</strong> to overwrite persistent object variables in the application context.
                            </p>
                            <div className="bg-gradient-to-r from-emerald-900/20 to-black border border-emerald-500/30 p-8 rounded-3xl">
                              <code className="text-emerald-400 font-mono text-2xl font-black break-all shadow-inner block text-center select-all tracking-wider">
                                {sessionData?.flag}
                              </code>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Case 2: ADMIN LOGGED IN BUT VAULT IS LOCKED (NEEDS MASS ASSIGNMENT)
                    <div className="space-y-8">
                      <div className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center shrink-0">
                            <ShieldAlert className="w-6 h-6 text-rose-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-white tracking-tight">Access Phase 1 Completed</h3>
                            <p className="text-sm text-slate-400">You are inside the Admin Dashboard. However, critical assets are in a second-layer cold storage lockbox.</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-full">Security Stage: Partial Access</span>
                        </div>
                      </div>

                      <div className="grid lg:grid-cols-5 gap-8">
                        {/* Main Locked Vault Area */}
                        <div className="lg:col-span-3 bg-[#121214] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] shadow-2xl">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
                          
                          <div className="relative mb-8 flex flex-col items-center">
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[60px]"></div>
                            <div className="w-32 h-32 bg-black border-4 border-slate-800/50 rounded-full flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative z-10 group overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-indigo-900/20 opacity-50 group-hover:opacity-80 transition-opacity"></div>
                              <Lock className="w-12 h-12 text-slate-600 z-20" />
                            </div>
                          </div>

                          <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Secure Key Vault Locked</h3>
                          <p className="text-slate-400 text-center max-w-md text-sm mb-8 leading-relaxed font-medium">
                            Organization Root Access required to view underlying secrets. 
                            Current decryption routine reports: <code>ERR_INSUFFICIENT_CLEARANCE</code>.
                          </p>

                          <div className="w-full bg-black/50 border border-white/5 p-6 rounded-2xl mb-6">
                             <div className="flex justify-between items-center mb-3 text-xs font-black text-slate-500 uppercase tracking-widest">
                               <span>Cipher Blob</span>
                               <span className="flex items-center gap-2 text-rose-500 animate-pulse"><div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div> LOCKED</span>
                             </div>
                             <div className="font-mono text-slate-600 text-sm blur-[2px] select-none line-clamp-1 break-all bg-white/5 p-3 rounded-lg border border-white/5">
                               {sessionData?.flag || "ENCRYPTED_HEX_PAYLOAD_DUMMY_DATA_19284712947129"}
                             </div>
                          </div>

                          {/* Dynamic Feature to update preferences */}
                          <div className="w-full border-t border-white/5 pt-6">
                             <p className="text-[10px] font-black uppercase text-slate-500 mb-4 text-center">Active UI Deployment Control</p>
                             <div className="flex items-center justify-center gap-4">
                                <div className="text-xs text-slate-300 bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 font-bold flex items-center gap-2">
                                   <Settings className="w-3 h-3 opacity-50" /> State: Normal
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => handleUpdateSettings()}
                                  disabled={isSubmitting}
                                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                                >
                                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3 h-3" />}
                                  Propagate System Settings
                                </button>
                             </div>
                             {message && activeTab === "admin" && (
                               <div className={clsx(
                                 "mt-4 text-center text-xs font-bold flex items-center justify-center gap-2 py-2 rounded-xl animate-in zoom-in-95 duration-200 border",
                                 message.type === 'success' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                               )}>
                                 {message.type === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                 {message.text}
                               </div>
                             )}
                          </div>
                        </div>

                        {/* Hints / API docs Area */}
                        <div className="lg:col-span-2 space-y-6">
                          <div className="bg-gradient-to-br from-[#121214] to-[#0f0f10] p-8 rounded-[2.5rem] border border-white/5 h-full flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                                <Terminal className="w-5 h-5" />
                              </div>
                              <h4 className="font-black text-white text-lg">API Introspection</h4>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6">
                              The developer endpoint for user customization writes raw configuration properties directly into the persistent session context.
                            </p>
                            
                            <div className="space-y-4 mt-auto">
                              <div className="bg-black/50 p-4 rounded-xl border border-white/5">
                                <div className="text-[10px] font-black uppercase text-emerald-400 mb-1 tracking-widest">Target Endpoint</div>
                                <code className="text-xs text-slate-300 font-mono font-bold">POST /api/labs/a06-9/settings</code>
                              </div>
                              <div className="bg-black/50 p-4 rounded-xl border border-white/5 relative group">
                                <div className="text-[10px] font-black uppercase text-indigo-400 mb-2 tracking-widest flex justify-between">
                                  <span>Schema Inspector</span>
                                  <FileText className="w-3 h-3 opacity-50" />
                                </div>
                                <pre className="text-[11px] text-slate-500 font-mono leading-tight">
                                  {`{\n  "theme": "string",\n  "layout": "string",\n  "isVaultUnlocked": "boolean" // Internal Only\n}`}
                                </pre>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-[10px] bg-slate-800 text-white px-2 py-1 rounded font-bold border border-white/10 shadow-xl">Hidden Properties Detected</span>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
                               <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                               <p className="text-xs text-amber-500/80 leading-normal font-medium">
                                 Note: The backend uses blind Object Merger to map incoming keys to the cloud session bucket. Ensure strict input sanitation is ignored.
                               </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  // Case 3: NOT AN ADMIN AT ALL
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
