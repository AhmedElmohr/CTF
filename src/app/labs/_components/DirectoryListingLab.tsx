"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Folder, 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Globe, 
  ArrowLeft,
  Search,
  HardDrive,
  Loader2,
  Database,
  Lock,
  Cloud,
  Terminal,
  Activity,
  Box,
  MoreVertical,
  Download
} from "lucide-react";
import clsx from "clsx";

interface FileNode {
  name: string;
  type: "dir" | "file";
  size?: string;
  modified?: string;
  path?: string;
}

export default function DirectoryListingLab() {
  const [currentPath, setCurrentPath] = useState("/");
  const [showIndex, setShowIndex] = useState(false);
  const [viewingFile, setViewingFile] = useState<{name: string, content: string} | null>(null);
  const [currentDirFiles, setCurrentDirFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!showIndex || viewingFile) return;

    const fetchDirectory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/labs/a02-2/files?path=${encodeURIComponent(currentPath)}`);
        const contentType = res.headers.get("content-type");
        
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server returned ${res.status}: ${text.slice(0, 50)}...`);
        }

        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid server response: Expected JSON, received HTML. Check API route configuration.");
        }

        const data = await res.json();
        setCurrentDirFiles(data.contents || []);
      } catch (err: any) {
        setError(err.message);
        setCurrentDirFiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectory();
  }, [currentPath, showIndex, viewingFile]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  const handleFileClick = async (filename: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/labs/a02-2/files/download?file=${encodeURIComponent(filename)}`);
      if (!res.ok) {
         setViewingFile({
          name: filename,
          content: "Access Denied: Resource is encrypted or unavailable via this gateway."
        });
        return;
      }
      const text = await res.text();
      setViewingFile({
        name: filename,
        content: text
      });
    } catch (err: any) {
       setViewingFile({
        name: filename,
        content: "Traceback (most recent call last):\n  File \"cdn_handler.py\", line 42, in fetch\nConnectionError: Failed to establish a new connection."
      });
    } finally {
      setLoading(false);
    }
  };

  const LandingPage = () => (
    <div className="bg-[#0F172A] min-h-screen flex flex-col font-sans text-slate-300 overflow-hidden">
      {/* Animated Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <header className="relative z-10 border-b border-slate-800 bg-slate-950/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Cloud size={24} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white">Spark<span className="text-indigo-400">Assets</span></span>
          </div>
          <div className="flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-400">
            <button className="hover:text-white transition-colors">Infrastructure</button>
            <button className="hover:text-white transition-colors">Pricing</button>
            <button onClick={() => setShowIndex(true)} className="bg-white text-slate-950 px-6 py-2.5 rounded-lg hover:bg-indigo-50 transition-all">Console Login</button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] mb-8">
          <Activity size={14} /> System Status: Operational
        </div>
        <h1 className="text-7xl font-black text-white mb-8 tracking-tight leading-[1.1]">
          Global Asset <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">Deployment Engine</span>
        </h1>
        <p className="text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
          The next generation of static resource management. Ultra-fast, highly secure, and built for enterprise-scale DevOps workflows.
        </p>
        <div className="flex gap-6">
          <button 
            onClick={() => setShowIndex(true)}
            className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-indigo-600/20 flex items-center gap-3"
          >
            Launch Console <Terminal size={20} />
          </button>
          <button className="bg-slate-800 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-700 transition-all border border-slate-700">
            Developer Docs
          </button>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {[
            { title: "Edge Caching", desc: "100+ global points of presence for sub-10ms delivery.", icon: Zap },
            { title: "Smart Encryption", desc: "Military-grade AES-256 encryption for all data at rest.", icon: ShieldCheck },
            { title: "VPC Isolation", desc: "Private networking capabilities for internal resources.", icon: Lock },
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm text-left hover:border-indigo-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );

  const DirectoryIndex = () => {
    if (viewingFile) {
      return (
        <div className="min-h-screen bg-[#0F172A] text-slate-300 p-8 font-mono animate-in fade-in duration-500">
          <div className="max-w-5xl mx-auto">
            <button 
              onClick={() => setViewingFile(null)}
              className="mb-8 flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Console
            </button>
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-slate-950 px-8 py-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold text-white">{viewingFile.name}</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                </div>
              </div>
              <pre className="p-10 text-sm overflow-x-auto leading-relaxed text-indigo-100/80 selection:bg-indigo-500/30">
                {viewingFile.content}
              </pre>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-300 font-sans flex">
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-800 bg-slate-950/50 flex flex-col hidden lg:flex">
          <div className="p-8 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Cloud className="w-6 h-6 text-indigo-500" />
              <span className="font-black text-xl text-white">Spark<span className="text-indigo-400">Assets</span></span>
            </div>
          </div>
          <nav className="p-6 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold text-sm border border-indigo-500/20">
              <Box size={18} /> Storage Console
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white transition-colors font-bold text-sm">
              <Activity size={18} /> Edge Monitoring
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-white transition-colors font-bold text-sm">
               <ShieldCheck size={18} /> Access Logs
            </button>
          </nav>
          <div className="mt-auto p-6">
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Usage</p>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
                <div className="h-full w-2/3 bg-indigo-500"></div>
              </div>
              <p className="text-xs font-bold text-white">12.4 GB of 25 GB</p>
            </div>
          </div>
        </aside>

        {/* Main Console */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-20 border-b border-slate-800 px-10 flex items-center justify-between bg-slate-950/20">
            <div className="flex items-center gap-4">
               <button 
                onClick={() => setShowIndex(false)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">Index of {currentPath}</h1>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Static Asset Explorer Enabled
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3 text-slate-500 focus-within:border-indigo-500/50 transition-all">
                <Search className="w-4 h-4" />
                <input type="text" placeholder="Filter resources..." className="bg-transparent border-none outline-none text-xs font-bold text-white placeholder:text-slate-600" />
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-10">
            <div className="max-w-6xl mx-auto space-y-6">
              {error && (
                <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-4 text-rose-400 animate-in slide-in-from-top-4 duration-300">
                  <AlertCircle className="w-6 h-6 shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-widest mb-1">Deployment Error</h3>
                    <p className="text-xs font-mono opacity-80">{error}</p>
                  </div>
                </div>
              )}

              <div className="bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden shadow-xl relative backdrop-blur-md">
                {loading && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center z-10 animate-in fade-in duration-200">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                  </div>
                )}
                
                <table className="w-full text-left">
                  <thead className="bg-slate-950/50 text-slate-500 border-b border-slate-800">
                    <tr className="uppercase text-[10px] font-black tracking-widest">
                      <th className="px-8 py-5">Object Name</th>
                      <th className="px-8 py-5">Last Deployed</th>
                      <th className="px-8 py-5 text-right">Size</th>
                      <th className="px-8 py-5 w-20"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {currentDirFiles.map((file, idx) => (
                      <tr key={idx} className="group hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => {
                        if (file.type === 'dir' && file.path) handleNavigate(file.path);
                        else if (file.type === 'file') handleFileClick(file.name);
                      }}>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className={clsx(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110",
                              file.type === "dir" ? "bg-amber-500/10 text-amber-500" : "bg-indigo-500/10 text-indigo-400"
                            )}>
                              {file.type === "dir" ? <Folder size={20} fill="currentColor" fillOpacity={0.2} /> : <FileText size={20} />}
                            </div>
                            <span className="font-bold text-sm text-slate-200 group-hover:text-white transition-colors">{file.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-slate-500 font-mono text-xs">{file.modified || "-"}</td>
                        <td className="px-8 py-5 text-right text-slate-400 font-mono text-xs">{file.size || "-"}</td>
                        <td className="px-8 py-5 text-right">
                          <MoreVertical size={16} className="text-slate-600 group-hover:text-slate-400" />
                        </td>
                      </tr>
                    ))}
                    {currentDirFiles.length === 0 && !loading && !error && (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-30">
                            <Database size={48} />
                            <p className="text-sm font-bold uppercase tracking-widest">Bucket is Empty</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="flex items-center justify-between py-6 px-4">
                <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><Globe size={14} /> SparkEdge/4.2.1</div>
                  <div className="flex items-center gap-1.5"><Database size={14} /> ID: STATIC-SRV-992</div>
                </div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Spark Infrastructure &copy; 2026
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };

  return showIndex ? <DirectoryIndex /> : <LandingPage />;
}

// Sub-component for Alerts (missing in above imports)
function AlertCircle({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
