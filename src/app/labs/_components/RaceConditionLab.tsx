"use client";

import { useState, useEffect } from "react";
import { 
  Trophy, 
  CreditCard, 
  Gift, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Zap,
  Activity,
  User,
  ShieldCheck,
  ChevronRight,
  ShoppingBag,
  Star,
  Search,
  Wallet,
  ArrowUpRight,
  Sparkles,
  History,
  Tag
} from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

const PRODUCTS = [
  {
    id: "buds",
    name: "Spark Buds Pro",
    description: "Active noise cancellation and spatial audio.",
    price: 15.00,
    image: "/labs/a06-3/buds.png",
    rating: 4.8,
    reviews: 124
  },
  {
    id: "mouse",
    name: "Nova Gaming Mouse",
    description: "Ultra-lightweight with 26K DPI sensor.",
    price: 25.00,
    image: "/labs/a06-3/mouse.png",
    rating: 4.9,
    reviews: 89
  },
  {
    id: "keyboard",
    name: "Tactile MX Keyboard",
    description: "Hot-swappable mechanical switches.",
    price: 40.00,
    image: "/labs/a06-3/keyboard.png",
    rating: 4.7,
    reviews: 215
  },
  {
    id: "flag",
    name: "Cyber Flag X",
    description: "The ultimate hardware security collectible.",
    price: 50.00,
    image: "/labs/a06-3/flag.png",
    rating: 5.0,
    reviews: 1,
    isTarget: true
  }
];

export default function RaceConditionLab() {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [flag, setFlag] = useState("");
  const [activities, setActivities] = useState<{msg: string, type: 'success' | 'error', time: string}[]>([]);
  const [showWallet, setShowWallet] = useState(false);

  const fetchBalance = async () => {
    try {
      const res = await fetch("/api/labs/a06-3/balance");
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance);
      }
    } catch (err) {
      console.error("Failed to fetch balance");
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const addActivity = (msg: string, type: 'success' | 'error') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setActivities(prev => [{ msg, type, time }, ...prev]);
  };

  const handleRedeem = async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/labs/a06-3/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      const result = await res.json();
      
      setIsLoading(false);
      if (res.ok && result.success) {
        setBalance(result.balance);
        addActivity(`Redeemed PROMO-10-FREE (+$10.00)`, 'success');
      } else {
        const msg = result.message || "Redemption failed.";
        setError(msg);
        addActivity(`Failed: ${msg}`, 'error');
      }
    } catch (err) {
      setIsLoading(false);
      setError("System connection error.");
    }
  };

  const handleBuy = async (productId: string, price: number) => {
    if (productId !== 'flag') {
      // For demo products, we just simulate the purchase if balance is enough
      if (balance < price) {
        setError(`Insufficient funds for ${productId}.`);
        addActivity(`Failed: Insufficient funds for ${productId}`, 'error');
        return;
      }
      setBalance(prev => prev - price);
      addActivity(`Purchased ${productId} (-$${price.toFixed(2)})`, 'success');
      return;
    }

    // For the flag, we call the actual API
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/labs/a06-3/buy-flag", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      const result = await res.json();
      
      setIsLoading(false);
      if (res.ok && result.success) {
        setBalance(result.remainingBalance);
        setFlag(result.flag);
        addActivity(`Purchased Cyber Flag X (-$50.00)`, 'success');
      } else {
        const msg = result.message || "Purchase failed.";
        setError(msg);
        addActivity(`Failed: ${msg}`, 'error');
      }
    } catch (err) {
      setIsLoading(false);
      setError("System connection error.");
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/labs/a06-3/reset", { method: "POST" });
      if (res.ok) {
        setBalance(0);
        setFlag("");
        setActivities([{ msg: "Lab session reset.", type: 'success', time: new Date().toLocaleTimeString() }]);
        setError("");
      }
    } catch (err) {
      console.error("Reset failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col pb-20">
      {/* Premium Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">Spark<span className="text-indigo-600">Gadgets</span></span>
          </div>
          
          <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-full border border-slate-200 w-96">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search premium tech..." 
              className="bg-transparent border-none outline-none text-sm font-medium w-full text-slate-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleReset}
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors mr-2"
          >
            Reset Lab
          </button>
          <button 
            onClick={() => setShowWallet(!showWallet)}
            className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-2xl hover:border-indigo-600 transition-all group"
          >
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Your Wallet</span>
              <span className="text-lg font-black text-emerald-600">${balance.toFixed(2)}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
              <Wallet className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
            </div>
          </button>
          
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-black">
            JD
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full px-6 pt-10">
        {/* Hero Section */}
        <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 h-[400px] mb-16 group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-transparent z-10"></div>
          <img 
            src="/labs/a06-3/keyboard.png" 
            alt="Hero" 
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="relative z-20 h-full flex flex-col justify-center px-16 max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-[0.2em] mb-4">
              <Star className="w-4 h-4 fill-current" />
              Editor's Choice
            </div>
            <h1 className="text-6xl font-black text-white leading-tight mb-6">
              The Next Gen of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Tactile Precision.</span>
            </h1>
            <p className="text-slate-300 text-lg font-medium mb-10 leading-relaxed">
              Experience the unmatched feel of our custom mechanical switches. 
              Limited edition batch now available for pre-order.
            </p>
            <button className="w-fit bg-white text-slate-900 px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-indigo-50 transition-all">
              Explore Collection <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Products */}
          <div className="flex-1 space-y-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-900">Featured Products</h2>
                <p className="text-slate-500 font-medium">Curated high-performance gear for professionals.</p>
              </div>
              <div className="flex gap-2">
                {['All', 'Audio', 'Input', 'Security'].map(cat => (
                  <button key={cat} className="px-4 py-2 rounded-full text-xs font-black bg-white border border-slate-200 hover:bg-slate-50 transition-all uppercase tracking-widest">
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl flex items-center gap-3 animate-in shake-in duration-300 font-bold text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PRODUCTS.map(product => (
                <div key={product.id} className={clsx(
                  "group bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-indigo-600/5 hover:-translate-y-1 transition-all duration-300",
                  product.isTarget && "ring-2 ring-indigo-600 ring-offset-4 ring-offset-slate-50"
                )}>
                  <div className="aspect-[4/3] overflow-hidden bg-slate-50 relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                        <span className="text-xs font-black">{product.rating}</span>
                      </div>
                      {product.isTarget && (
                        <div className="bg-indigo-600 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-indigo-600/20">
                          <Tag className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Exclusive</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 mb-1">{product.name}</h3>
                        <p className="text-slate-500 text-sm font-medium">{product.description}</p>
                      </div>
                      <div className="text-2xl font-black text-indigo-600">${product.price.toFixed(2)}</div>
                    </div>

                    <button 
                      onClick={() => handleBuy(product.id, product.price)}
                      disabled={isLoading}
                      className={clsx(
                        "w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group/btn",
                        product.isTarget 
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20" 
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      )}
                    >
                      {isLoading && product.isTarget ? "Processing..." : "Add to Cart"}
                      <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {flag && (
               <div className="mt-12 animate-in slide-in-from-bottom-8">
                  <div className="flex items-center gap-2 text-emerald-600 font-black text-sm uppercase mb-4">
                    <ShieldCheck className="w-6 h-6" />
                    Security Key Unlocked
                  </div>
                  <div className="bg-emerald-50 border-2 border-emerald-500/30 p-10 rounded-[3rem] text-center shadow-xl shadow-emerald-500/5">
                    <p className="text-lg text-emerald-800 font-bold mb-6">
                      System Breached: Concurrent race condition confirmed.
                    </p>
                    <div className="flex flex-col items-center">
                      <code className="text-emerald-700 bg-white px-8 py-4 rounded-2xl font-mono text-2xl font-black border border-emerald-200 shadow-sm mb-4">
                        {flag}
                      </code>
                      <span className="text-xs text-emerald-600/60 font-black uppercase tracking-widest">Flag Identification Token</span>
                    </div>
                  </div>
               </div>
             )}
          </div>

          {/* Right: Wallet & Transactions */}
          <div className="lg:w-80 space-y-8">
            {/* Promo Section */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative z-10">
                <Gift className="w-10 h-10 mb-6 text-indigo-200" />
                <h4 className="text-2xl font-black mb-2">Claim Reward</h4>
                <p className="text-indigo-100 text-sm font-medium mb-8 leading-relaxed">
                  Redeem your sign-up bonus to start shopping.
                </p>
                <div className="bg-indigo-700/50 rounded-xl p-4 mb-8 border border-white/10">
                  <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest block mb-2">Voucher Code</span>
                  <code className="text-lg font-black font-mono">PROMO-10-FREE</code>
                </div>
                <button 
                  onClick={handleRedeem}
                  disabled={isLoading}
                  className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? "Processing..." : "Redeem $10"}
                </button>
              </div>
            </div>

            {/* History Section */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                Wallet Activity
              </h4>
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {activities.length === 0 ? (
                  <div className="text-slate-400 text-sm font-medium italic text-center py-12">
                    No transactions yet.
                  </div>
                ) : (
                  activities.map((act, i) => (
                    <div key={i} className="flex gap-4 items-start group">
                      <div className={clsx(
                        "w-2 h-2 rounded-full mt-2 shrink-0 shadow-[0_0_8px_rgba(0,0,0,0.1)]",
                        act.type === 'error' ? "bg-rose-500 shadow-rose-500/20" : "bg-emerald-500 shadow-emerald-500/20"
                      )}></div>
                      <div>
                        <div className="text-xs font-black text-slate-800 leading-tight mb-1">
                          {act.msg}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 font-mono">
                          {act.time}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Support Box */}
            <div className="p-8 rounded-[2.5rem] bg-slate-100 border border-slate-200 text-center">
              <User className="w-8 h-8 text-slate-400 mx-auto mb-4" />
              <h5 className="text-sm font-black text-slate-800 mb-1">Need help?</h5>
              <p className="text-xs font-medium text-slate-500 mb-6">Our support team is available 24/7 for premium members.</p>
              <button className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:text-indigo-700">Contact Support</button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-12 mt-auto border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="font-black text-lg tracking-tighter">Spark Gadgets</span>
          </div>
          <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Shipping</a>
          </div>
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            Systems Online
          </div>
          <span>&copy; 2026 Spark Professional Services</span>
        </div>
      </footer>
    </div>
  );
}
