"use client";

import { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Tag,
  Trash2,
  Package,
  Truck,
  ShieldCheck,
  Gift,
  ChevronRight,
  Info,
  ShoppingBag,
  ArrowLeft,
  Star,
  ExternalLink,
  Code2,
  Terminal,
  Zap
} from "lucide-react";
import clsx from "clsx";

interface CheckoutResult {
  success: boolean;
  message: string;
  orderId?: string;
  chargedAmount?: number;
  remainingBalance?: number;
  flag?: string;
  exploit?: string;
}

const PROMOS: Record<string, { type: "percent" | "fixed"; value: number; desc: string }> = {
  WELCOME20: { type: "percent", value: 20, desc: "20% New Customer Discount" },
  EMPLOYEE50: { type: "percent", value: 50, desc: "50% Staff Exclusive" },
  REWARD30: { type: "fixed", value: 30, desc: "$30 Loyalty Reward" },
};

const PRODUCTS = [
  { id: "item-1", name: "Sony WH-1000XM5 Headphones", price: 190.00, image: "/labs/a06-6/sony.png", rating: 4.8, cat: "Audio" },
  { id: "item-2", name: "Logitech MX Master 3S", price: 50.00, image: "/labs/a06-6/logitech.png", rating: 4.9, cat: "Input" },
  { id: "item-3", name: "Spark Buds Pro", price: 15.00, image: "/labs/a06-3/buds.png", rating: 4.7, cat: "Audio" },
  { id: "item-4", name: "Nova Gaming Mouse", price: 25.00, image: "/labs/a06-3/mouse.png", rating: 4.6, cat: "Input" },
];

type Step = 'SHOP' | 'CHECKOUT' | 'SUCCESS';

export default function CouponStackingLab() {
  const [currentStep, setCurrentStep] = useState<Step>('SHOP');
  const [cart, setCart] = useState<{id: string, qty: number}[]>([]);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [serverBalance, setServerBalance] = useState(60.00);

  // Fetch session data on mount
  useState(() => {
    fetch("/api/labs/a06-6/session")
      .then(res => res.json())
      .then(data => {
        if (data.balance !== undefined) setServerBalance(data.balance);
      })
      .catch(() => {});
  });

  const getProduct = (id: string) => PRODUCTS.find(p => p.id === id);

  const subtotal = cart.reduce((acc, item) => {
    const p = getProduct(item.id);
    return acc + (p ? p.price * item.qty : 0);
  }, 0);

  const shipping = 15.0;

  let couponDiscount = 0;
  let loyaltyCredit = 0;

  if (appliedPromo) {
    const promo = PROMOS[appliedPromo];
    if (promo) {
      if (promo.type === "percent") {
        couponDiscount = (subtotal * promo.value) / 100;
      } else {
        loyaltyCredit = promo.value;
      }
    }
  }

  const previewTotal = subtotal - couponDiscount - loyaltyCredit + shipping;

  const handleApplyPromo = async () => {
    setPromoError("");
    const code = promoInput.toUpperCase().trim();
    if (!code) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/labs/a06-6/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedPromo(data.code);
        setPromoInput("");
      } else {
        setPromoError(data.message || "Invalid promo code.");
      }
    } catch {
      setPromoError("Validation server is offline.");
    } finally {
      setIsLoading(false);
    }
  };

  const submitOrder = async () => {
    setIsLoading(true);
    setResult(null);

    // The UI only allows one, but the API accepts an array. This is the vulnerability.
    const promoCodes = appliedPromo ? [appliedPromo] : [];

    try {
      const res = await fetch("/api/labs/a06-6/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promoCodes, cart }),
      });

      const data = (await res.json()) as CheckoutResult;
      setResult(data);
      if (data.success) {
        setCurrentStep('SUCCESS');
        if (data.remainingBalance !== undefined) setServerBalance(data.remainingBalance);
      }
    } catch {
      setPromoError("Payment system is currently unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (id: string) => {
    // Send a mock validation request to the server so it's visible in Burp
    try {
      await fetch("/api/labs/a06-6/validate-coupon", {
        method: "OPTIONS", // Or a specific 'validate-item' endpoint
        headers: { "X-Validate-Item": id }
      });
    } catch {}

    setCart(prev => {
      const existing = prev.find(i => i.id === id);
      if (existing) return prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      if (!item) return prev;
      const newQty = item.qty + delta;
      if (newQty <= 0) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, qty: newQty } : i);
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/labs/a06-6/reset", { method: "POST" });
      setCart([]);
      setAppliedPromo(null);
      setResult(null);
      setCurrentStep('SHOP');
      setServerBalance(60.00);
    } catch {
      alert("Failed to reset lab.");
    } finally {
      setIsLoading(false);
    }
  };

  const exploited = Boolean(result?.flag);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentStep('SHOP')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <ShoppingBag size={22} />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">Tech<span className="text-indigo-600">Store</span></span>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={handleReset}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors"
            >
              <Zap size={18} /> Reset Lab
            </button>
            <button 
              onClick={() => setShowGuide(!showGuide)}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <Terminal size={18} /> Lab Guide
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
              <Wallet size={18} className="text-indigo-600" />
              <span className="text-sm font-black text-slate-900">${serverBalance.toFixed(2)}</span>
            </div>
            {currentStep === 'SHOP' && (
              <button 
                onClick={() => cart.length > 0 && setCurrentStep('CHECKOUT')}
                className="relative bg-slate-900 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-800 transition-all"
              >
                <ShoppingBag size={18} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {cart.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Lab Guide Sidebar */}
      {showGuide && (
        <aside className="fixed right-0 top-20 bottom-0 w-80 bg-white border-l border-slate-200 z-40 shadow-2xl p-8 overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-xl text-slate-900 flex items-center gap-2">
              <Terminal className="text-indigo-600" /> How to Solve
            </h3>
            <button onClick={() => setShowGuide(false)} className="text-slate-400 hover:text-slate-900">
              <Trash2 size={20} />
            </button>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Challenge</div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                The current balance is <strong className="text-slate-900">$60.00</strong>. 
                The total cost exceeds this. You need to apply multiple coupons to bypass the check.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">The Vulnerability</div>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                The UI only allows one coupon. However, the backend API for <code className="bg-slate-100 px-1 rounded">/checkout</code> accepts an **array** of promo codes and fails to validate stacking rules.
              </p>
            </div>

            <div className="space-y-3">
              <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Exploitation</div>
              <ol className="text-sm font-medium text-slate-600 space-y-4 list-decimal pl-4">
                <li>Capture the <code className="text-indigo-600">POST</code> request in Burp Suite.</li>
                <li>Modify the JSON body from:
                  <pre className="bg-slate-900 text-indigo-300 p-3 rounded-lg mt-2 text-xs font-mono">
                    {`{"promoCodes": ["WELCOME20"]}`}
                  </pre>
                </li>
                <li>Change it to stack all codes:
                  <pre className="bg-slate-900 text-indigo-300 p-3 rounded-lg mt-2 text-xs font-mono">
                    {`{"promoCodes": ["WELCOME20", "EMPLOYEE50", "REWARD30"]}`}
                  </pre>
                </li>
                <li>Forward the request to get the flag.</li>
              </ol>
            </div>
          </div>
        </aside>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        {currentStep === 'SHOP' && (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Latest Tech.</h1>
                <p className="text-slate-500 font-medium text-lg">Curated premium gear for your digital lifestyle.</p>
              </div>
              <div className="flex gap-4">
                <div className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-600">All Categories</div>
                <button 
                  onClick={() => setCurrentStep('CHECKOUT')}
                  disabled={cart.length === 0}
                  className="px-8 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  Checkout Now
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {PRODUCTS.map(product => (
                <div key={product.id} className="bg-white rounded-[2rem] border border-slate-200 p-2 group hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-square rounded-[1.5rem] bg-slate-50 overflow-hidden relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">{product.cat}</div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1 mb-2 text-amber-500">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-black text-slate-900">{product.rating}</span>
                    </div>
                    <h3 className="font-black text-slate-900 mb-1 leading-tight">{product.name}</h3>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-xl font-black text-indigo-600">${product.price.toFixed(2)}</div>
                      <button 
                        onClick={() => addToCart(product.id)}
                        className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        title="Add to Cart"
                      >
                        <ShoppingBag size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 'CHECKOUT' && (
          <div className="grid lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-8 space-y-8">
              <button onClick={() => setCurrentStep('SHOP')} className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                <ArrowLeft size={16} /> Back to Shop
              </button>
              
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Shipping Selection</h2>
                    <p className="text-sm font-medium text-slate-500">Choose your preferred delivery speed.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-indigo-600 bg-indigo-50/50 rounded-2xl p-6 relative cursor-pointer">
                    <div className="absolute top-6 right-6 text-indigo-600"><CheckCircle2 size={24} /></div>
                    <div className="font-black text-slate-900 text-lg mb-1">Standard Delivery</div>
                    <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-4">3-5 Business Days</div>
                    <div className="text-2xl font-black text-slate-900">$15.00</div>
                  </div>
                  <div className="border-2 border-slate-100 rounded-2xl p-6 opacity-40 cursor-not-allowed">
                    <div className="font-black text-slate-900 text-lg mb-1">Express Courier</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Next Day Delivery</div>
                    <div className="text-2xl font-black text-slate-900">$25.00</div>
                  </div>
                </div>

                <div className="h-px bg-slate-100"></div>

                <div className="space-y-6">
                   <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Tag size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900">Coupons & Credits</h2>
                      <p className="text-sm font-medium text-slate-500">Apply discounts to your order.</p>
                    </div>
                  </div>

                  {!appliedPromo ? (
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Enter promo code"
                          value={promoInput}
                          onChange={(e) => setPromoInput(e.target.value)}
                          className="w-full rounded-2xl border border-slate-200 pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all uppercase"
                        />
                      </div>
                      <button onClick={handleApplyPromo} className="bg-slate-900 text-white px-10 rounded-2xl font-black hover:bg-slate-800 transition-all">Apply</button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-emerald-50 border-2 border-emerald-100 p-6 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <p className="font-black text-emerald-900 leading-none mb-1">{appliedPromo} Applied</p>
                          <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{PROMOS[appliedPromo].desc}</p>
                        </div>
                      </div>
                      <button onClick={() => setAppliedPromo(null)} className="p-2 hover:bg-emerald-100 rounded-xl text-emerald-600 transition-colors"><Trash2 size={20} /></button>
                    </div>
                  )}
                  {promoError && <p className="text-rose-500 text-xs font-black flex items-center gap-2"><AlertCircle size={16} /> {promoError}</p>}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-900/20">
                <h3 className="text-xl font-black mb-8">Order Summary</h3>
                <div className="space-y-6 mb-8">
                  {cart.map(item => {
                    const p = getProduct(item.id);
                    if (!p) return null;
                    return (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl overflow-hidden shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold line-clamp-1">{p.name}</div>
                          <div className="flex items-center gap-3 mt-2">
                             <button 
                               onClick={() => updateQty(item.id, -1)}
                               className="w-5 h-5 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                             >
                               -
                             </button>
                             <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Qty: {item.qty}</span>
                             <button 
                               onClick={() => updateQty(item.id, 1)}
                               className="w-5 h-5 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                             >
                               +
                             </button>
                          </div>
                        </div>
                        <div className="font-black">${p.price.toFixed(2)}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-4 pt-8 border-t border-white/10 text-sm">
                  <div className="flex justify-between text-white/60 font-bold"><span>Subtotal</span><span className="text-white">${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-white/60 font-bold"><span>Shipping</span><span className="text-white">${shipping.toFixed(2)}</span></div>
                  {couponDiscount > 0 && <div className="flex justify-between text-emerald-400 font-bold"><span>Discount (Promo)</span><span>-${couponDiscount.toFixed(2)}</span></div>}
                  {loyaltyCredit > 0 && <div className="flex justify-between text-emerald-400 font-bold"><span>Loyalty Credit</span><span>-${loyaltyCredit.toFixed(2)}</span></div>}
                  
                  <div className="pt-8 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-black">Total</span>
                      <span className={clsx("text-3xl font-black", previewTotal <= serverBalance ? "text-emerald-400" : "text-white")}>${Math.max(previewTotal, 0).toFixed(2)}</span>
                    </div>
                    {previewTotal > serverBalance && <p className="text-[10px] text-rose-400 font-black uppercase tracking-widest text-right mt-4">Insufficient Balance (${serverBalance.toFixed(2)})</p>}
                  </div>
                </div>

                <button 
                  onClick={submitOrder}
                  disabled={isLoading || previewTotal > serverBalance || cart.length === 0}
                  className="w-full mt-10 bg-white text-slate-900 py-5 rounded-[1.5rem] font-black text-lg hover:bg-indigo-50 transition-all shadow-xl shadow-white/5 disabled:opacity-30"
                >
                  {isLoading ? "Processing..." : "Confirm Purchase"}
                </button>
              </div>

              {/* Promo Catalog organically integrated */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Gift size={14} className="text-indigo-600" /> Internal Member Promos
                </h4>
                <div className="space-y-4">
                  {Object.entries(PROMOS).map(([code, p]) => (
                    <div key={code} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <div className="text-xs font-black text-slate-900">{code}</div>
                        <div className="text-[10px] font-bold text-slate-500">{p.desc}</div>
                      </div>
                      <button onClick={() => {setPromoInput(code); handleApplyPromo();}} className="text-indigo-600"><ChevronRight size={18} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'SUCCESS' && result && (
          <div className="max-w-2xl mx-auto py-20 text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/10">
              <CheckCircle2 size={48} />
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-6">Order Confirmed!</h1>
            <p className="text-lg text-slate-500 font-medium mb-12">Your payment has been processed successfully. Your items will be shipped shortly.</p>
            
            <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm text-left space-y-6">
              <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Order Reference</span>
                <span className="font-mono font-bold text-slate-900">{result.orderId}</span>
              </div>
              <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Amount Charged</span>
                <span className="font-black text-indigo-600 text-xl">${result.chargedAmount?.toFixed(2)}</span>
              </div>
              
              {exploited && (
                <div className="bg-emerald-50 border-2 border-emerald-500/20 p-8 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-2 text-emerald-700 font-black text-sm uppercase tracking-widest">
                    <ShieldCheck size={20} /> Logic Bypass Detected
                  </div>
                  <p className="text-sm font-bold text-emerald-800">{result.exploit}</p>
                  <code className="block w-full bg-white px-6 py-4 rounded-xl text-emerald-600 text-xl font-mono font-black border border-emerald-100 shadow-sm">
                    {result.flag}
                  </code>
                </div>
              )}
            </div>

            <button onClick={() => {setCart([]); setCurrentStep('SHOP'); setResult(null); setAppliedPromo(null);}} className="mt-12 text-indigo-600 font-black uppercase tracking-widest hover:text-indigo-700 transition-colors">Return to Homepage</button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-12 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                <ShoppingBag size={16} />
              </div>
              <span className="font-black text-xl tracking-tighter text-slate-900">TechStore</span>
            </div>
            <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-indigo-600 transition-colors">Policy</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
            </div>
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            &copy; 2026 Spark Professional Services
          </div>
        </div>
      </footer>
    </div>
  );
}
