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
  Loader2
} from "lucide-react";
import clsx from "clsx";

export default function WorkspaceInvitationLab() {
  const [activeTab, setActiveTab] = useState<"workspaces" | "admin">("workspaces");
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
        // Refresh session to see if we gained new workspaces (simulating the exploit)
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
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-800">
            B2B<span className="text-indigo-600">Sync</span>
          </span>
        </div>
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right mr-2">
            <div className="text-sm font-bold">{sessionData?.user?.email}</div>
            <div className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">
              {sessionData?.user?.isAdmin ? "Administrator" : "Standard User"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden lg:flex">
          <nav className="flex-1 p-6 space-y-2">
            <button 
              onClick={() => setActiveTab("workspaces")}
              className={clsx(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm",
                activeTab === "workspaces" ? "bg-indigo-50 text-indigo-700" : "bg-white text-slate-500 hover:bg-slate-50"
              )}
            >
              <div className="flex items-center gap-3"><LayoutDashboard className="w-4 h-4" /> My Workspaces</div>
            </button>
            
            <div className="pt-4 mt-4 border-t border-slate-100">
              <div className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Restricted Area</div>
              <button 
                onClick={() => setActiveTab("admin")}
                className={clsx(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm group",
                  activeTab === "admin" ? (sessionData?.user?.isAdmin ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20" : "bg-slate-100 text-slate-700") : "bg-white text-slate-500 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert className="w-4 h-4" /> System Admin
                </div>
                {!sessionData?.user?.isAdmin && <Shield className="w-3 h-3 text-slate-300" />}
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {message && (
              <div className={clsx(
                "p-4 rounded-2xl border flex items-start gap-4 animate-in slide-in-from-top-2 duration-300",
                message.type === 'success' ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"
              )}>
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <p className="text-sm font-bold leading-tight">{message.text}</p>
              </div>
            )}

            {activeTab === "workspaces" && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">Workspace Management</h1>
                  <p className="text-slate-500 font-medium">Invite colleagues to collaborate in your accessible workspaces.</p>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-xl font-black">Send Invitation</h2>
                  </div>
                  
                  <form onSubmit={handleInvite} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Colleague Email</label>
                        <input 
                          type="email" 
                          value={emailToInvite}
                          onChange={(e) => setEmailToInvite(e.target.value)}
                          placeholder="colleague@company.com"
                          required
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-600 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Workspace</label>
                        <select 
                          value={selectedWorkspace}
                          onChange={(e) => setSelectedWorkspace(e.target.value)}
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-600 transition-all appearance-none"
                        >
                          {sessionData?.user?.workspaces.map((ws: string) => (
                            <option key={ws} value={ws}>{ws}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-indigo-600 text-white font-black px-8 py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Send Invite
                    </button>
                  </form>
                </div>
                
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-400" /> API Documentation
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    The invitation API accepts POST requests to <code>/api/labs/a06-9/invite</code> with a JSON body containing <code>email</code> and <code>workspace_id</code>.
                    <br/><br/>
                    <span className="font-mono bg-slate-200 px-1 py-0.5 rounded text-slate-700">target_workspace: {sessionData?.adminWorkspaceId || "WS_ADMIN_SECRET_999"}</span>
                  </p>
                </div>
              </div>
            )}

            {activeTab === "admin" && (
              <div className="animate-in fade-in duration-300">
                {sessionData?.user?.isAdmin ? (
                  <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-600/20">
                        <ShieldAlert className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black tracking-tight">System Admin</h2>
                        <p className="text-rose-400 font-bold text-xs uppercase tracking-widest mt-1">Maximum Privilege Level</p>
                      </div>
                    </div>

                    <div className="bg-rose-500/10 border border-rose-500/30 p-8 rounded-3xl backdrop-blur-sm">
                      <h3 className="text-rose-400 font-black text-xl mb-3">Data Binding Vulnerability Exploited</h3>
                      <p className="text-sm text-slate-300 mb-6 leading-relaxed">
                        By submitting an array for the <code>workspace_id</code> parameter, you bypassed the middleware authorization check which only verified the first element <code>workspace_id[0]</code>. The underlying logic iterated over the entire array, granting you access to the administrative workspace.
                      </p>
                      
                      <div className="space-y-2">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Administrative Flag</div>
                        <code className="block bg-black/50 border border-rose-500/20 p-5 rounded-2xl text-rose-400 font-mono text-xl font-black text-center break-all shadow-inner">
                          {sessionData?.flag}
                        </code>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-16 rounded-[2.5rem] border border-slate-200 shadow-sm text-center">
                    <div className="w-24 h-24 bg-slate-50 border border-slate-100 text-slate-300 rounded-[2rem] flex items-center justify-center mx-auto mb-8 rotate-12">
                      <Shield className="w-12 h-12" />
                    </div>
                    <h3 className="text-2xl font-black mb-3 text-slate-800">Access Denied</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                      You do not have permission to access the System Admin portal. Only members of the administrative workspace can view this page.
                    </p>
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
