"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  Server, 
  Shield, 
  RotateCcw, 
  HardDrive, 
  Cpu, 
  Database, 
  BookOpen, 
  LayoutDashboard,
  Settings,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  LogOut,
  AlertCircle
} from "lucide-react";
import clsx from "clsx";

export default function DefaultCredentialsLab() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/labs/a02-1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      
      if (data.success) {
        const dashRes = await fetch("/api/labs/a02-1/dashboard");
        const dashData = await dashRes.json();
        setDashboardData(dashData);
        setIsLoggedIn(true);
      } else {
        setError(data.message || "Invalid credentials. Please check your username and password.");
      }
    } catch {
      setError("Connection to authentication server failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDashboardData(null);
    setUsername("");
    setPassword("");
    setError("");
  };

  if (isLoggedIn && dashboardData) {
    const metrics = dashboardData.systemMetrics;
    const servers = dashboardData.servers || [];
    
    return (
      <div className="min-h-screen bg-[#0b0c10] text-slate-300 font-sans flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#111217] border-r border-white/5 flex flex-col hidden lg:flex">
          <div className="p-6 flex items-center gap-3 border-b border-white/5">
            <Activity className="w-6 h-6 text-orange-500" />
            <span className="font-black text-xl text-white tracking-tight">Grafana<span className="text-orange-500">Board</span></span>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {[
              { label: "Dashboard", icon: LayoutDashboard, active: true },
              { label: "Alerts", icon: Bell, count: 3 },
              { label: "Data Sources", icon: Database },
              { label: "Infrastructure", icon: Server },
              { label: "Configuration", icon: Settings },
            ].map((item) => (
              <button 
                key={item.label}
                className={clsx(
                  "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                  item.active ? "bg-orange-600/10 text-orange-500" : "hover:bg-white/5 text-slate-400"
                )}
              >
                <div className="flex items-center gap-3 font-bold text-sm">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
                {item.count && <span className="bg-orange-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{item.count}</span>}
              </button>
            ))}
          </nav>
          <div className="p-4 mt-auto">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 transition-all font-bold text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-auto bg-[#16171d]">
          <header className="h-16 bg-[#111217] border-b border-white/5 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Home / Dashboard</span>
              <div className="h-4 w-px bg-white/5 mx-2"></div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                System Overview <ChevronDown className="w-3 h-3 text-slate-500" />
              </h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input type="text" placeholder="Search metrics..." className="bg-black/20 border border-white/5 rounded-lg pl-9 pr-4 py-1.5 text-xs outline-none focus:border-orange-500 transition-all w-64" />
              </div>
              <div className="flex items-center gap-3 border-l border-white/5 pl-6">
                <div className="w-8 h-8 rounded-lg bg-orange-600/20 flex items-center justify-center text-xs font-bold text-orange-500">AD</div>
                <div className="text-xs font-bold text-white hidden sm:block">Administrator</div>
              </div>
            </div>
          </header>

          <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: "Total CPU Load", value: metrics.cpuUsage, icon: Cpu, color: "text-blue-400", sub: "8 nodes active" },
                { label: "Memory Usage", value: metrics.memoryUsage, icon: HardDrive, color: "text-emerald-400", sub: "92% optimization" },
                { label: "Storage Capacity", value: metrics.diskUsage, icon: Database, color: "text-amber-400", sub: "2.4 TB remaining" },
                { label: "Active Containers", value: metrics.activeContainers, icon: Server, color: "text-indigo-400", sub: "All clusters online" },
              ].map((m) => (
                <div key={m.label} className="bg-[#111217] rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-white/5 ${m.color}`}><m.icon className="w-5 h-5" /></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</span>
                  </div>
                  <div className="text-3xl font-black text-white mb-1 tracking-tight">{m.value}</div>
                  <div className="text-[10px] font-bold text-slate-500">{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Server Table */}
            <div className="bg-[#111217] rounded-3xl border border-white/5 shadow-xl overflow-hidden">
              <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-black text-white uppercase tracking-tighter flex items-center gap-3">
                  <Server className="w-5 h-5 text-orange-500" />
                  Cluster Node Status
                </h3>
                <button className="text-[10px] font-bold text-orange-500 hover:underline uppercase tracking-widest">Refresh Logs</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <tr>
                      <th className="px-8 py-4">Node Name</th>
                      <th className="px-8 py-4">CPU</th>
                      <th className="px-8 py-4">Memory</th>
                      <th className="px-8 py-4">Uptime</th>
                      <th className="px-8 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {servers.map((s: any) => (
                      <tr key={s.name} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-5 font-mono text-sm text-white group-hover:text-orange-500 transition-colors">{s.name}</td>
                        <td className="px-8 py-5 text-sm font-medium">{s.cpu}</td>
                        <td className="px-8 py-5 text-sm font-medium">{s.mem}</td>
                        <td className="px-8 py-5 text-xs text-slate-500 font-bold">14d 02h 11m</td>
                        <td className="px-8 py-5">
                          <span className={clsx(
                            "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                            s.status === "healthy" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          )}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Exposed Secrets (The Goal) */}
            {dashboardData.secrets && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-rose-950/20 border border-rose-500/30 rounded-3xl p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                  <div className="relative flex flex-col md:flex-row gap-8 items-start">
                    <div className="bg-rose-500/20 p-4 rounded-2xl">
                      <Shield className="w-8 h-8 text-rose-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight flex items-center gap-3">
                        Infrastructure Secrets Leak
                        <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">Critical</span>
                      </h3>
                      <p className="text-rose-200/60 text-sm font-medium mb-6 leading-relaxed max-w-2xl">
                        Warning: System diagnostic mode is enabled. Sensitive configuration data is currently being logged to the administrative dashboard. 
                        Please disable DEBUG mode in <code className="bg-black/30 px-1 rounded">/etc/grafanaboard/config.yaml</code> immediately.
                      </p>
                      <div className="bg-black/60 rounded-2xl p-6 border border-white/5 font-mono text-sm shadow-2xl">
                        <div className="text-slate-500 italic mb-3"># {dashboardData.secrets.note}</div>
                        <div className="flex items-center gap-4 py-1">
                          <span className="text-rose-400 font-bold w-40 shrink-0">DB_CONNECTION:</span>
                          <span className="text-rose-200/80 break-all">{dashboardData.secrets.dbConnectionString}</span>
                        </div>
                        <div className="flex items-center gap-4 py-1 border-t border-white/5 mt-2 pt-2">
                          <span className="text-orange-500 font-bold w-40 shrink-0">MISSION_FLAG:</span>
                          <span className="text-orange-200 font-black">{dashboardData.secrets.flag}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0c10] flex flex-col font-sans text-slate-300">
      {/* Auth Header */}
      <header className="px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-orange-500" />
          <span className="font-black text-2xl text-white tracking-tighter">Grafana<span className="text-orange-500">Board</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">Setup Guide</button>
          <div className="h-4 w-px bg-white/10 mx-2"></div>
          <button className="text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">API Docs</button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="bg-[#111217] rounded-[2.5rem] border border-white/5 p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.4)]"></div>
            
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">System Login</h2>
              <p className="text-slate-500 font-medium text-sm">Enter your administrative credentials to continue.</p>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl mb-8 flex items-start gap-3 animate-in shake-in duration-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold leading-tight">{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group/input">
                  <div className="absolute inset-0 bg-orange-600/5 rounded-2xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required
                    placeholder="e.g. admin"
                    className="relative w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-orange-600 transition-all placeholder:text-slate-700" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                  <button type="button" className="text-[10px] font-black text-orange-500 hover:underline uppercase tracking-widest">Forgot?</button>
                </div>
                <div className="relative group/input">
                  <div className="absolute inset-0 bg-orange-600/5 rounded-2xl blur-md opacity-0 group-focus-within/input:opacity-100 transition-opacity"></div>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                    placeholder="••••••••"
                    className="relative w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-orange-600 transition-all placeholder:text-slate-700" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="group relative w-full bg-orange-600 text-white font-black py-5 rounded-2xl transition-all hover:bg-orange-500 hover:shadow-[0_20px_40px_-10px_rgba(234,88,12,0.4)] disabled:opacity-50 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? "Authenticating..." : "Sign Into Dashboard"}
                  {!isLoading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                <Shield className="w-3.5 h-3.5" />
                Protected by Enterprise Auth v4.2
              </div>
              <p className="text-[9px] text-slate-700 text-center leading-relaxed">
                Unauthorized access to this system is strictly prohibited. <br />
                All connection attempts are logged and monitored.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-8 py-6 text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>&copy; 2025 GrafanaBoard Corp.</span>
          <span className="h-1 w-1 rounded-full bg-slate-800"></span>
          <span>Security Policy</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-orange-600/50">Node: Auth-Server-01</span>
        </div>
      </footer>
    </div>
  );
}
