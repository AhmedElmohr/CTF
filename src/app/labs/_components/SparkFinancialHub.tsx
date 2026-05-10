"use client";

import { useState, useEffect } from "react";
import { 
  Wallet, 
  ArrowRightLeft, 
  TrendingUp, 
  Gift, 
  ShieldAlert,
  History,
  LayoutDashboard,
  UserPlus,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Search,
  Settings,
  CreditCard,
  Building2,
  DollarSign,
  LogIn,
  User,
  Lock,
  Mail,
  Copy,
  LogOut,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import clsx from "clsx";

type Tab = 'DASHBOARD' | 'TRANSFER' | 'EXCHANGE' | 'REWARDS' | 'ADMIN';
type View = 'AUTH' | 'APP';

export default function SparkFinancialHub() {
  const [view, setView] = useState<View>('AUTH');
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [autoSync, setAutoSync] = useState(false);
  
  // Auth Form
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authName, setAuthName] = useState("");

  // Transfer Form
  const [transferAmount, setTransferAmount] = useState("");
  const [transferCurrency, setTransferCurrency] = useState("EGP");
  const [transferTarget, setTransferTarget] = useState(""); 
  const [targetCurrency, setTargetCurrency] = useState("USD");
  
  const [exchangeAmount, setExchangeAmount] = useState("");
  const [tradeDirection, setTradeDirection] = useState<'USD_TO_SPC' | 'SPC_TO_USD'>('USD_TO_SPC');
  const [gcAmount, setGcAmount] = useState("100");

  const syncUser = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/labs/a06-8/main?email=${user.email}`);
      const data = await res.json();
      if (data.user) setUser(data.user);
    } catch {}
  };

  useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(syncUser, 10000); 
    return () => clearInterval(interval);
  }, [user, autoSync]);

  useEffect(() => {
    // Default target currency logic
    setTargetCurrency(transferCurrency === 'EGP' ? 'USD' : 'EGP');
  }, [transferCurrency]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const endpoint = authMode === 'LOGIN' ? '/api/labs/a06-8/auth/login' : '/api/labs/a06-8/auth/signup';
    const payload = authMode === 'LOGIN' ? { email: authEmail, password: authPass } : { email: authEmail, password: authPass, name: authName };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setView('APP');
        setSuccess(`Welcome back, ${data.user.full_name}`);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Connection to bank failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action: string, body: any) => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/labs/a06-8/main", {
        method: action === 'EXCHANGE' ? 'PUT' : (action === 'REDEEM' ? 'DELETE' : 'POST'),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, action, userId: user.id, email: user.email })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setSuccess(data.message || "Operation successful.");
        if (action === 'TRANSFER') setTransferAmount("");
        if (action === 'EXCHANGE') setExchangeAmount("");
      } else {
        setError(data.error);
      }
    } catch {
      setError("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkFlag = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/labs/a06-8/main?email=${user.email}`, { method: "OPTIONS" });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`ACCESS GRANTED: ${data.flag}`);
      } else {
        const val = data.currentValue || 0;
        setError(`Threshold not met: $${val.toLocaleString()} / $1,000,000`);
      }
    } catch {
      setError("Admin error.");
    } finally {
      setIsLoading(false);
    }
  };

  if (view === 'AUTH') {
    return (
      <div className="min-h-screen bg-[#0B0E11] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
           <div className="text-center mb-10">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-indigo-600/20">
                <Building2 size={32} />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">Spark<span className="text-indigo-500">Global</span></h1>
              <p className="text-[#848E9C] font-medium text-sm mt-2">Next-Generation Secure Banking Simulation</p>
           </div>

           <div className="bg-[#181A20] rounded-[2.5rem] border border-[#2B2F36] p-10 shadow-2xl">
              <div className="flex gap-4 mb-8 p-1 bg-[#0B0E11] rounded-2xl border border-[#2B2F36]">
                <button 
                  onClick={() => setAuthMode('LOGIN')}
                  className={clsx("flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all", authMode === 'LOGIN' ? "bg-indigo-600 text-white shadow-lg" : "text-[#848E9C] hover:text-white")}
                >
                  Login
                </button>
                <button 
                  onClick={() => setAuthMode('SIGNUP')}
                  className={clsx("flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all", authMode === 'SIGNUP' ? "bg-indigo-600 text-white shadow-lg" : "text-[#848E9C] hover:text-white")}
                >
                  Join
                </button>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
                {authMode === 'SIGNUP' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#848E9C] uppercase tracking-widest">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848E9C]" size={18} />
                      <input 
                        required 
                        value={authName} 
                        onChange={e => setAuthName(e.target.value)}
                        placeholder="John Doe" 
                        className="w-full bg-[#0B0E11] border border-[#2B2F36] rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:border-indigo-600" 
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#848E9C] uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848E9C]" size={18} />
                    <input 
                      required 
                      type="email" 
                      value={authEmail}
                      onChange={e => setAuthEmail(e.target.value)}
                      placeholder="name@company.com" 
                      className="w-full bg-[#0B0E11] border border-[#2B2F36] rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:border-indigo-600" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#848E9C] uppercase tracking-widest">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#848E9C]" size={18} />
                    <input 
                      required 
                      type="password" 
                      value={authPass}
                      onChange={e => setAuthPass(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-[#0B0E11] border border-[#2B2F36] rounded-xl pl-12 pr-4 py-4 text-sm font-bold focus:outline-none focus:border-indigo-600" 
                    />
                  </div>
                </div>

                {error && <p className="text-rose-500 text-xs font-black flex items-center gap-2"><AlertCircle size={14} /> {error}</p>}

                <button 
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <LogIn size={18} />}
                  {authMode === 'LOGIN' ? 'Access Vault' : 'Create Account'}
                </button>
              </form>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0E11] min-h-screen text-[#EAECEF] font-sans flex animate-in fade-in duration-700">
      {/* Sidebar */}
      <aside className="w-72 bg-[#181A20] border-r border-[#2B2F36] flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Building2 size={24} />
            </div>
            <span className="font-black text-xl tracking-tighter">Spark<span className="text-indigo-500">Bank</span></span>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'DASHBOARD', icon: LayoutDashboard, label: 'Vault Overview' },
              { id: 'TRANSFER', icon: ArrowRightLeft, label: 'Move Capital' },
              { id: 'EXCHANGE', icon: TrendingUp, label: 'Global Trade' },
              { id: 'REWARDS', icon: Gift, label: 'Privileges' },
              { id: 'ADMIN', icon: ShieldAlert, label: 'Governance' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={clsx(
                  "w-full flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-black transition-all",
                  activeTab === item.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-[#848E9C] hover:bg-[#2B2F36] hover:text-white"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-[#2B2F36] space-y-6">
          <div className="flex items-center justify-between p-3 bg-[#0B0E11] rounded-xl border border-[#2B2F36]">
             <div className="flex items-center gap-2">
               <RefreshCw size={12} className={clsx("text-indigo-500", isLoading && "animate-spin")} />
               <span className="text-[9px] font-black uppercase text-[#848E9C]">Auto-Sync</span>
             </div>
             <button 
               onClick={() => setAutoSync(!autoSync)}
               className={clsx(
                 "w-8 h-4 rounded-full relative transition-all",
                 autoSync ? "bg-indigo-600" : "bg-[#2B2F36]"
               )}
             >
               <div className={clsx(
                 "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all",
                 autoSync ? "right-0.5" : "left-0.5"
               )} />
             </button>
          </div>

          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-black">
               {user.full_name[0]}
             </div>
             <div>
               <div className="text-xs font-black text-white">{user.full_name}</div>
               <div className="text-[9px] font-bold text-[#848E9C] uppercase">Platinum Client</div>
             </div>
          </div>
          <button onClick={() => setView('AUTH')} className="w-full flex items-center gap-2 text-[10px] font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest">
            <LogOut size={14} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex justify-between items-end mb-16">
          <div>
            <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-2">Authenticated Session</div>
            <h1 className="text-4xl font-black italic tracking-tighter">System Console.</h1>
          </div>
          <div className="flex items-center gap-4 bg-[#181A20] px-6 py-3 rounded-2xl border border-[#2B2F36]">
            <div className="text-right">
              <div className="text-[8px] font-black text-[#848E9C] uppercase tracking-widest">Account Number</div>
              <div className="text-sm font-mono font-bold text-white">{user.account_number}</div>
            </div>
            <button 
              onClick={() => {navigator.clipboard.writeText(user.account_number); setSuccess("Account number copied!");}}
              className="p-2 hover:bg-[#2B2F36] rounded-lg text-indigo-500 transition-all"
            >
              <Copy size={16} />
            </button>
          </div>
        </header>

        {/* Global Alerts */}
        {error && (
          <div className="mb-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-500 text-sm font-black animate-in slide-in-from-top-4">
            <AlertCircle size={20} /> {error}
          </div>
        )}
        {success && (
          <div className="mb-8 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-500 text-sm font-black animate-in slide-in-from-top-4">
            <CheckCircle2 size={20} /> {success}
          </div>
        )}

        {/* Tabs Content */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-12">
            <div className="bg-gradient-to-br from-[#181A20] to-[#0B0E11] p-12 rounded-[4rem] border border-indigo-500/20 relative overflow-hidden">
               <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                  <div className="text-center lg:text-left">
                    <div className="text-[11px] font-black uppercase tracking-[0.5em] text-indigo-500 mb-4">Total Liquidity</div>
                    <div className="flex items-center justify-center lg:justify-start gap-4">
                      <div className="text-7xl font-black tracking-tighter text-white">
                        ${(Number(user.usd_balance) + (Number(user.egp_balance) / 50) + (Number(user.spc_balance) * 50000)).toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </div>
                      <button 
                        onClick={syncUser}
                        className="p-2 hover:bg-white/10 rounded-full text-indigo-400 transition-all active:rotate-180 duration-500"
                        title="Refresh Balances"
                      >
                        <RefreshCw size={24} className={isLoading ? "animate-spin" : ""} />
                      </button>
                    </div>
                    <div className="text-[9px] font-bold text-indigo-500/60 mt-2 uppercase tracking-widest flex gap-3">
                      <span>USD: ${Number(user.usd_balance).toLocaleString()}</span>
                      <span>•</span>
                      <span>EGP: ${(Number(user.egp_balance)/50).toLocaleString()}</span>
                      <span>•</span>
                      <span>SPC: ${(Number(user.spc_balance)*50000).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 text-center min-w-[160px]">
                       <TrendingUp className="mx-auto mb-3 text-emerald-500" size={24} />
                       <div className="text-[9px] font-black text-[#848E9C] uppercase tracking-widest">Growth</div>
                       <div className="text-xl font-black text-white">+12.4%</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 text-center min-w-[160px]">
                       <ShieldAlert className="mx-auto mb-3 text-indigo-500" size={24} />
                       <div className="text-[9px] font-black text-[#848E9C] uppercase tracking-widest">Safety Score</div>
                       <div className="text-xl font-black text-white">AAA+</div>
                    </div>
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
                 <div className="bg-[#181A20] p-10 rounded-[3rem] border border-emerald-500/20 hover:border-emerald-500/40 transition-all group">
                    <div className="flex justify-between items-start mb-12">
                      <div className="w-14 h-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center font-black text-2xl">£</div>
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-4 py-1 rounded-full">Egypt</span>
                    </div>
                    <div className="text-5xl font-black mb-2 tracking-tighter">£{user.egp_balance.toLocaleString()}</div>
                    <div className="text-xs font-bold text-[#848E9C]">Egyptian Pounds (Savings)</div>
                 </div>

                 <div className="bg-[#181A20] p-10 rounded-[3rem] border border-blue-500/20 hover:border-blue-500/40 transition-all group">
                    <div className="flex justify-between items-start mb-12">
                      <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center font-black">
                        <DollarSign size={28} />
                      </div>
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/5 px-4 py-1 rounded-full">Global</span>
                    </div>
                    <div className="text-5xl font-black mb-2 tracking-tighter">${user.usd_balance.toLocaleString()}</div>
                    <div className="text-xs font-bold text-[#848E9C]">US Dollar (Current)</div>
                 </div>

                 <div className="md:col-span-2 bg-[#181A20] p-12 rounded-[4rem] border border-amber-500/20 hover:border-amber-500/40 transition-all relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                       <div className="w-24 h-24 bg-amber-500/10 text-amber-500 rounded-[2.5rem] flex items-center justify-center">
                          <TrendingUp size={48} />
                       </div>
                       <div className="text-center md:text-left">
                          <div className="text-[11px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2">Blockchain Assets</div>
                          <div className="flex items-end gap-3 justify-center md:justify-start">
                             <div className="text-6xl font-black text-white leading-none">{user.spc_balance.toFixed(6)}</div>
                             <div className="text-2xl font-bold text-amber-500 mb-1">SPC</div>
                          </div>
                       </div>
                       <div className="md:ml-auto p-6 bg-white/5 rounded-3xl border border-white/10 text-center min-w-[200px]">
                          <div className="text-[9px] font-black text-[#848E9C] uppercase tracking-widest mb-1">Live Market Value</div>
                          <div className="text-3xl font-black text-white">${(user.spc_balance * 50000).toLocaleString()}</div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-[#181A20] rounded-[3rem] p-10 border border-[#2B2F36]">
                 <div className="flex items-center justify-between mb-10">
                    <h3 className="text-sm font-black uppercase tracking-widest italic flex items-center gap-2">
                       <ArrowRightLeft size={18} className="text-indigo-500" /> Fast Transfer
                    </h3>
                 </div>
                 <div className="space-y-6">
                    <div className="p-6 bg-[#0B0E11] rounded-2xl border border-[#2B2F36]">
                       <div className="text-[9px] font-black text-[#848E9C] uppercase tracking-widest mb-2">Internal Wallet Swap</div>
                       <div className="flex justify-between items-center">
                          <button onClick={() => handleAction('CONVERT', { amount: 100, fromCurrency: 'EGP', toAccount: 'USD' })} className="text-[10px] font-black text-indigo-500 hover:underline">100 EGP → USD</button>
                          <button onClick={() => handleAction('CONVERT', { amount: 10, fromCurrency: 'USD', toAccount: 'EGP' })} className="text-[10px] font-black text-indigo-500 hover:underline">10 USD → EGP</button>
                       </div>
                    </div>
                    <div className="p-6 bg-indigo-600/10 rounded-2xl border border-indigo-600/20">
                       <div className="text-[10px] font-black text-indigo-500 uppercase mb-4">Multi-Browser Sync</div>
                       <p className="text-[10px] text-[#848E9C] font-medium leading-relaxed">
                         Open this lab in another browser, create a second account, and transfer money between them using account numbers.
                       </p>
                    </div>
                    <button onClick={() => setActiveTab('TRANSFER')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20">New External Transfer</button>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'TRANSFER' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4">
             <div className="text-center">
                <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-4">Capital <span className="text-indigo-500">Movements.</span></h2>
                <p className="text-[#848E9C] font-medium text-lg">Send capital to any Spark Global account instantly via IBAN.</p>
             </div>

             <div className="bg-[#181A20] rounded-[4rem] border border-[#2B2F36] p-16 shadow-2xl relative">
                <div className="grid md:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <div>
                         <label className="text-[10px] font-black text-[#848E9C] uppercase tracking-[0.3em] mb-4 block">Source Currency</label>
                         <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setTransferCurrency('EGP')} className={clsx("p-6 rounded-3xl border-2 transition-all text-left", transferCurrency === 'EGP' ? "border-emerald-500 bg-emerald-500/5" : "border-[#2B2F36] bg-[#0B0E11]")}>
                               <div className="font-black text-white text-lg">EGP</div>
                               <div className="text-[10px] text-[#848E9C] font-bold">Egyptian Pound</div>
                            </button>
                            <button onClick={() => setTransferCurrency('USD')} className={clsx("p-6 rounded-3xl border-2 transition-all text-left", transferCurrency === 'USD' ? "border-blue-500 bg-blue-500/5" : "border-[#2B2F36] bg-[#0B0E11]")}>
                               <div className="font-black text-white text-lg">USD</div>
                               <div className="text-[10px] text-[#848E9C] font-bold">US Dollar</div>
                            </button>
                         </div>
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-[#848E9C] uppercase tracking-[0.3em] mb-4 block">Recipient Account Number</label>
                         <input 
                           placeholder="SPARK-XXXXXX"
                           value={transferTarget}
                           onChange={e => setTransferTarget(e.target.value)}
                           className="w-full bg-[#0B0E11] border border-[#2B2F36] rounded-2xl px-6 py-5 font-mono font-bold text-white focus:outline-none focus:border-indigo-600"
                         />
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-4 block underline">Destination Wallet Type (Trusted by Backend)</label>
                         <select 
                           value={targetCurrency}
                           onChange={e => setTargetCurrency(e.target.value)}
                           className="w-full bg-[#0B0E11] border border-amber-500/30 rounded-2xl px-6 py-5 text-sm font-black text-white focus:outline-none"
                         >
                            <option value="USD">International Wallet (USD)</option>
                            <option value="EGP">Local Wallet (EGP)</option>
                            <option value="SPC">Crypto Vault (SPC)</option>
                         </select>
                         <p className="text-[9px] text-amber-500 mt-2 font-medium italic">Hint: Try to trick the backend into depositing the source amount into a stronger currency wallet.</p>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div>
                         <label className="text-[10px] font-black text-[#848E9C] uppercase tracking-[0.3em] mb-4 block">Amount to Transmit</label>
                         <div className="relative">
                            <input 
                              type="number"
                              placeholder="0.00"
                              value={transferAmount}
                              onChange={e => setTransferAmount(e.target.value)}
                              className="w-full bg-[#0B0E11] border border-[#2B2F36] rounded-2xl px-8 py-10 text-6xl font-black text-white focus:outline-none focus:border-indigo-600"
                            />
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-2xl font-black text-indigo-500">{transferCurrency}</div>
                         </div>
                         <div className="mt-4 flex justify-between items-center px-2">
                            <div className="text-[10px] font-black text-[#848E9C] uppercase tracking-widest">Available Balance:</div>
                            <div className="text-sm font-black text-white">
                               {transferCurrency === 'EGP' ? `£${Number(user.egp_balance).toLocaleString()}` : `$${Number(user.usd_balance).toLocaleString()}`}
                            </div>
                         </div>
                      </div>
                      <div className="p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-[2.5rem]">
                         <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black text-[#848E9C] uppercase tracking-widest">Total Deduction</span>
                            <span className="text-2xl font-black text-white">{transferAmount || "0.00"} {transferCurrency}</span>
                         </div>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => handleAction('TRANSFER', { 
                    amount: parseFloat(transferAmount), 
                    fromCurrency: transferCurrency, 
                    toAccount: transferTarget,
                    targetCurrency: targetCurrency
                  })}
                  disabled={isLoading || !transferAmount || !transferTarget}
                  className="w-full mt-16 bg-indigo-600 text-white py-8 rounded-[2rem] font-black text-2xl uppercase tracking-tighter hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-6"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <ArrowUpRight size={32} />}
                  Execute Transaction
                </button>
             </div>
           </div>
        )}

        {activeTab === 'EXCHANGE' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center">
                <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-4 text-amber-500">Global <span className="text-white">Trade.</span></h2>
                <p className="text-[#848E9C] font-medium text-lg">
                  {tradeDirection === 'USD_TO_SPC' ? 'Convert USD into SparkCoin (SPC) at real-time market rates.' : 'Sell your SparkCoin (SPC) and receive USD instantly.'}
                </p>
              </div>

              <div className="relative grid md:grid-cols-2 gap-10">
                 {/* Source Card */}
                 <div className="bg-[#181A20] p-10 rounded-[3rem] border border-[#2B2F36]">
                    <div className="flex items-center gap-4 mb-8">
                       <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center", tradeDirection === 'USD_TO_SPC' ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500")}>
                          {tradeDirection === 'USD_TO_SPC' ? <DollarSign size={24} /> : <TrendingUp size={24} />}
                       </div>
                       <div>
                          <div className="text-[10px] font-black text-[#848E9C] uppercase tracking-widest">Source</div>
                          <div className="text-lg font-black">{tradeDirection === 'USD_TO_SPC' ? 'US Dollar' : 'SparkCoin (SPC)'}</div>
                       </div>
                    </div>
                    <input 
                      type="number"
                      value={exchangeAmount}
                      onChange={e => setExchangeAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#0B0E11] border border-[#2B2F36] rounded-2xl p-6 text-3xl font-black text-white focus:border-indigo-600 outline-none"
                    />
                    <div className="mt-4 flex justify-between items-center px-2">
                       <div className="text-[10px] font-black text-[#848E9C] uppercase tracking-widest">Available:</div>
                       <div className="text-sm font-black text-white">
                          {tradeDirection === 'USD_TO_SPC' ? `$${Number(user.usd_balance).toLocaleString()}` : `${Number(user.spc_balance).toFixed(6)} SPC`}
                       </div>
                    </div>
                 </div>

                 {/* Swap Button (Absolute) */}
                 <button 
                   onClick={() => {
                     setTradeDirection(tradeDirection === 'USD_TO_SPC' ? 'SPC_TO_USD' : 'USD_TO_SPC');
                     setExchangeAmount("");
                   }}
                   className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-indigo-600 rounded-full border-4 border-[#0B0E11] flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-all z-20"
                 >
                   <ArrowRightLeft size={24} className={clsx("transition-all", tradeDirection === 'SPC_TO_USD' && "rotate-180")} />
                 </button>

                 {/* Receive Card */}
                 <div className={clsx("bg-[#181A20] p-10 rounded-[3rem] border transition-all", tradeDirection === 'USD_TO_SPC' ? "border-amber-500/20" : "border-blue-500/20")}>
                    <div className="flex items-center gap-4 mb-8">
                       <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center", tradeDirection === 'USD_TO_SPC' ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500")}>
                          {tradeDirection === 'USD_TO_SPC' ? <TrendingUp size={24} /> : <DollarSign size={24} />}
                       </div>
                       <div>
                          <div className={clsx("text-[10px] font-black uppercase tracking-widest", tradeDirection === 'USD_TO_SPC' ? "text-amber-500" : "text-blue-500")}>Receive</div>
                          <div className="text-lg font-black text-white">{tradeDirection === 'USD_TO_SPC' ? 'SparkCoin (SPC)' : 'US Dollar'}</div>
                       </div>
                    </div>
                    <div className="bg-[#0B0E11] border border-[#2B2F36] rounded-2xl p-6 text-3xl font-black">
                       {exchangeAmount ? (
                         tradeDirection === 'USD_TO_SPC' 
                         ? Math.abs(parseFloat(exchangeAmount) / 50000).toFixed(8)
                         : `$${Math.abs(parseFloat(exchangeAmount) * 50000).toLocaleString()}`
                       ) : tradeDirection === 'USD_TO_SPC' ? "0.00000000" : "$0.00"}
                    </div>
                    <div className="mt-4 text-[10px] font-bold text-[#848E9C]">1 SPC = $50,000.00</div>
                 </div>
              </div>

              <button 
                onClick={() => handleAction('EXCHANGE', { 
                  amount: parseFloat(exchangeAmount),
                  fromCurrency: tradeDirection === 'USD_TO_SPC' ? 'USD' : 'SPC',
                  toCurrency: tradeDirection === 'USD_TO_SPC' ? 'SPC' : 'USD'
                })}
                disabled={isLoading || !exchangeAmount}
                className="w-full py-6 bg-amber-500 text-black rounded-2xl font-black text-xl uppercase tracking-widest hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20"
              >
                {tradeDirection === 'USD_TO_SPC' ? 'Buy SparkCoin' : 'Sell SparkCoin'}
              </button>
           </div>
        )}

        {activeTab === 'REWARDS' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center">
                <h2 className="text-5xl font-black italic tracking-tighter uppercase mb-4 text-emerald-500">Vault <span className="text-white">Privileges.</span></h2>
                <p className="text-[#848E9C] font-medium text-lg">Purchase and redeem high-value gift cards with exclusive bonuses.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                 <div className="bg-[#181A20] p-12 rounded-[4rem] border border-[#2B2F36] flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mb-6">
                       <CreditCard size={32} />
                    </div>
                    <h3 className="text-2xl font-black mb-2">Purchase Card</h3>
                    <p className="text-sm text-[#848E9C] mb-8">Buy a generic gift card for yourself or a friend.</p>
                    <input 
                      type="number"
                      value={gcAmount}
                      onChange={e => setGcAmount(e.target.value)}
                      className="w-full bg-[#0B0E11] border border-[#2B2F36] rounded-xl p-4 text-center text-xl font-black mb-4"
                    />
                    <button className="w-full py-4 bg-[#2B2F36] text-white rounded-xl font-black uppercase text-xs tracking-widest opacity-50 cursor-not-allowed">Insufficient Clearance</button>
                 </div>

                 <div className="bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 p-12 rounded-[4rem] border border-emerald-500/20 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                       <RefreshCw size={32} />
                    </div>
                    <h3 className="text-2xl font-black mb-2">Quick Redeem</h3>
                    <p className="text-sm text-[#848E9C] mb-8">Redeem an active card and receive a 5% system bonus.</p>
                    <div className="w-full bg-white/5 p-6 rounded-2xl border border-white/10 mb-6">
                       <div className="text-[10px] font-black text-[#848E9C] uppercase tracking-widest mb-1">Active Card Value</div>
                       <div className="text-3xl font-black text-white">$100.00</div>
                    </div>
                    <button 
                      onClick={() => handleAction('REDEEM', { action: 'REDEEM', amount: 100 })}
                      className="w-full py-4 bg-emerald-500 text-black rounded-xl font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-all"
                    >
                      Redeem + $5.00 Bonus
                    </button>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'ADMIN' && (
           <div className="h-96 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-20 h-20 bg-indigo-600/10 text-indigo-500 rounded-full flex items-center justify-center border border-indigo-500/20">
                 <ShieldAlert size={32} />
              </div>
              <div>
                 <h3 className="text-2xl font-black uppercase italic tracking-tighter">Governance Protocol.</h3>
                 <p className="text-[#848E9C] text-sm mt-2">Administrative access requires a verified net worth of $1,000,000.00 USD.</p>
              </div>
              <button 
                onClick={checkFlag}
                className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-indigo-500 transition-all"
              >
                Request Access Flag
              </button>
           </div>
        )}
      </main>
    </div>
  );
}
