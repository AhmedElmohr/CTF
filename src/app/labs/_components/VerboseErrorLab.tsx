"use client";

import { useState } from "react";
import { 
  Search, 
  Shield, 
  AlertCircle, 
  ChevronRight, 
  Command, 
  Cpu, 
  Database, 
  Server,
  Terminal,
  Activity,
  User
} from "lucide-react";
export default function VerboseErrorLab() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [isError, setIsError] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setResponse(null);
    setIsError(false);

    try {
      const res = await fetch("/api/labs/a02-3/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query })
      });

      const data = await res.json();

      setIsSearching(false);
      if (!res.ok) {
        setIsError(true);
        const stackTrace = `${data.error}: ${data.message}
${data.stackTrace}

[ENVIRONMENT]
DB_HOST=${data.environment?.DB_HOST}
DB_USER=${data.environment?.DB_USER}
DB_PASS=${data.environment?.DB_PASS}
DEBUG=${data.environment?.DEBUG}`;
        setResponse(stackTrace);
      } else {
        setIsError(false);
        setResponse(data);
      }
    } catch {
      setIsSearching(false);
      setIsError(true);
      setResponse("Network error while connecting to internal search API.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Command className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight">Corp<span className="text-indigo-600">Search</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Activity className="w-4 h-4 text-emerald-500" />
            System Online
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center">
            <User className="w-4 h-4 text-slate-500" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-20">
        {/* Search Bar Area */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Internal Portal Search</h2>
          <p className="text-slate-500 font-medium">Search for documents, employee records, and internal technical documentation.</p>
        </div>

        <div className="max-w-2xl mx-auto mb-20">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-0 bg-indigo-600/10 rounded-[2rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center bg-white border-2 border-slate-200 rounded-[2rem] p-2 focus-within:border-indigo-600 transition-all shadow-lg">
              <Search className="w-6 h-6 text-slate-400 ml-4" />
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search resources, users, or system logs..."
                className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-lg font-medium placeholder:text-slate-400"
              />
              <button 
                type="submit"
                disabled={isSearching}
                className="bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>
          </form>
          <div className="mt-4 flex justify-center gap-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trending:</span>
            <button onClick={() => setQuery("security audit")} className="text-[10px] font-bold text-indigo-600 hover:underline">security audit</button>
            <button onClick={() => setQuery("api keys")} className="text-[10px] font-bold text-indigo-600 hover:underline">api keys</button>
            <button onClick={() => setQuery("server logs")} className="text-[10px] font-bold text-indigo-600 hover:underline">server logs</button>
          </div>
        </div>

        {/* Results Area */}
        <div className="min-h-[300px]">
          {isSearching && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-bold animate-pulse">Querying internal clusters...</p>
            </div>
          )}

          {isError && response && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-rose-50 border border-rose-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-rose-100 px-6 py-4 border-b border-rose-200 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <span className="font-black text-rose-900 uppercase tracking-tight">Critical System Error</span>
                </div>
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-black text-slate-900 mb-2">Internal Server Error (500)</h3>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      The search service encountered an unexpected condition while processing your request. 
                      A diagnostic trace has been generated for the engineering team.
                    </p>
                  </div>
                  <div className="bg-slate-900 rounded-2xl p-6 relative group">
                    <div className="flex items-center gap-2 mb-4 text-rose-400 font-bold text-[10px] uppercase tracking-widest">
                      <Terminal className="w-3 h-3" />
                      Server Stack Trace
                    </div>
                    <pre className="text-rose-200/80 font-mono text-xs overflow-auto leading-relaxed max-h-[400px] custom-scrollbar">
                      {response}
                    </pre>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all">
                        Report Issue
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isSearching && !isError && response && (
            <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {response.results.map((item: any) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-600 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <Search className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">Last updated: {item.date}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
                </div>
              ))}
            </div>
          )}

          {!isSearching && !response && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-400 mb-2">No active search</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">Use the search bar above to query the internal documentation portal.</p>
            </div>
          )}
        </div>
      </main>

      {/* Background Stats (Subtle) */}
      <footer className="fixed bottom-0 left-0 w-full px-8 py-4 bg-white/80 backdrop-blur-md border-t border-slate-200 flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Server className="w-3 h-3" />
            Node: Cluster-A
          </div>
          <div className="flex items-center gap-2">
            <Database className="w-3 h-3" />
            DB: Prod-Read-Only
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-indigo-600">
            <Cpu className="w-3 h-3" />
            Load: 12%
          </div>
          <div>
            Build: v1.4.2
          </div>
        </div>
      </footer>
    </div>
  );
}
