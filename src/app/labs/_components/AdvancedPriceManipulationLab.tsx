"use client";

import { useState } from "react";
import { 
  ChevronRight, 
  ShieldCheck, 
  Zap, 
  Star,
  ArrowLeft,
  ShoppingBag,
  Loader2,
  Gauge,
  Key,
  Shield,
  CreditCard,
  CheckCircle2,
  Trophy,
  History
} from "lucide-react";
import clsx from "clsx";

interface Car {
  id: string;
  name: string;
  price: number;
  image: string;
  specs: {
    topSpeed: string;
    zeroToSixty: string;
    power: string;
  };
}

const CARS: Car[] = [
  {
    id: "veneno-v12",
    name: "Spark Veneno V12",
    price: 120000.00,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=1000",
    specs: {
      topSpeed: "355 km/h",
      zeroToSixty: "2.8s",
      power: "740 HP"
    }
  },
  {
    id: "phantom-gt",
    name: "Phantom GT Black Edition",
    price: 85000.00,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000",
    specs: {
      topSpeed: "320 km/h",
      zeroToSixty: "3.2s",
      power: "620 HP"
    }
  },
  {
    id: "apex-p1",
    name: "Apex P1 Hybrid",
    price: 98500.00,
    image: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1000",
    specs: {
      topSpeed: "340 km/h",
      zeroToSixty: "3.0s",
      power: "680 HP"
    }
  }
];

type Step = 'SHOWROOM' | 'CHECKOUT' | 'SUCCESS';

export default function AdvancedPriceManipulationLab() {
  const [currentStep, setCurrentStep] = useState<Step>('SHOWROOM');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheckout = async () => {
    if (!selectedCar) return;
    
    setIsLoading(true);
    try {
      // VULNERABILITY: Sending the price from the client!
      const res = await fetch("/api/labs/a06-7/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: selectedCar.id,
          itemName: selectedCar.name,
          price: selectedCar.price, // This is what the hacker will modify in Burp
          currency: "$",
          paymentMethod: "Premium Crypto Transfer"
        }),
      });

      const data = await res.json();
      setResult(data);
      if (data.success && data.flag) {
        setCurrentStep('SUCCESS');
      } else if (data.success) {
        alert("Order received, but payment amount is being verified by human agents.");
      }
    } catch (err) {
      alert("System communication error.");
    } finally {
      setIsLoading(false);
    }
  };

  const Showroom = () => (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-gold-500/30">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-xl bg-black/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 to-yellow-600 rounded-full flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
              <Trophy size={28} />
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase italic">Spark<span className="text-amber-500">Motors</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
            <button className="hover:text-amber-500 transition-colors text-white">Showroom</button>
            <button className="hover:text-amber-500 transition-colors">Bespoke</button>
            <button className="hover:text-amber-500 transition-colors">Ownership</button>
            <button className="bg-amber-500 text-black px-6 py-2 rounded-full hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20">Client Portal</button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40 scale-110 blur-sm"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-[#050505]"></div>
        </div>
        <div className="relative z-10 text-center px-8">
          <h1 className="text-8xl font-black italic tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            EXCELLENCE <span className="text-amber-500">DEFINED.</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto uppercase tracking-widest font-medium">
            Handcrafted luxury. Unrivaled performance. <br />
            Experience the pinnacle of automotive engineering.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black italic tracking-tight uppercase">Current <span className="text-amber-500">Inventory</span></h2>
          <div className="flex gap-4">
            <button className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors">Filter</button>
            <button className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors">Sort</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {CARS.map(car => (
            <div key={car.id} className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2">
              <div className="h-64 relative overflow-hidden">
                <img src={car.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={car.name} />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[8px] font-black uppercase tracking-widest">
                  New Arrival
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-black italic mb-2 tracking-tight group-hover:text-amber-500 transition-colors">{car.name}</h3>
                <div className="text-amber-500 font-mono text-xl font-bold mb-6">${car.price.toLocaleString()}</div>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-[8px] text-white/40 uppercase font-black mb-1">Top Speed</div>
                    <div className="text-xs font-bold">{car.specs.topSpeed}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[8px] text-white/40 uppercase font-black mb-1">0-100 KM/H</div>
                    <div className="text-xs font-bold">{car.specs.zeroToSixty}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[8px] text-white/40 uppercase font-black mb-1">Power</div>
                    <div className="text-xs font-bold">{car.specs.power}</div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedCar(car);
                    setCurrentStep('CHECKOUT');
                  }}
                  className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                >
                  Configure & Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const Checkout = () => (
    <div className="bg-[#050505] min-h-screen text-white font-sans flex flex-col">
      <header className="border-b border-white/10 p-8 flex items-center justify-between">
        <button onClick={() => setCurrentStep('SHOWROOM')} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
          <ArrowLeft size={16} /> Return to Showroom
        </button>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Secure Checkout Gateway</div>
      </header>

      <div className="flex-1 max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 p-8 py-20">
        <div>
          <h2 className="text-4xl font-black italic mb-10 tracking-tight">Order <span className="text-amber-500">Configuration</span></h2>
          
          <div className="space-y-8">
            <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
              <div className="flex gap-6 mb-8">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                  <img src={selectedCar?.image} className="w-full h-full object-cover" alt="Car" />
                </div>
                <div>
                  <div className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Vehicle Selected</div>
                  <div className="text-xl font-black italic">{selectedCar?.name}</div>
                  <div className="text-amber-500 font-mono mt-1 text-sm font-bold tracking-tight">${selectedCar?.price.toLocaleString()}</div>
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40 uppercase font-black tracking-widest">Luxury Tax (Simulated)</span>
                  <span className="font-mono text-white/60">$0.00</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40 uppercase font-black tracking-widest">Delivery & Setup</span>
                  <span className="font-mono text-white/60">Included</span>
                </div>
                <div className="flex justify-between text-lg pt-4 border-t border-white/10">
                  <span className="font-black italic uppercase italic tracking-tight">Final Amount</span>
                  <span className="font-mono text-amber-500 font-bold">${selectedCar?.price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                <Shield size={20} className="text-amber-500" />
                <div className="text-[8px] font-black uppercase tracking-widest">Carbon Neutral <br /> <span className="text-white/40">Guaranteed</span></div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                <Key size={20} className="text-amber-500" />
                <div className="text-[8px] font-black uppercase tracking-widest">White Glove <br /> <span className="text-white/40">Handover</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-[40px] border border-white/10 p-10 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black uppercase tracking-widest mb-8 text-center italic">Payment Gateway</h3>
            <div className="space-y-6">
              <div className="bg-black/40 rounded-2xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Selected Method</div>
                  <div className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Verified</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                    <CreditCard size={18} />
                  </div>
                  <div className="text-sm font-bold tracking-widest font-mono uppercase">Premium Asset Transfer</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200/60 text-[10px] font-medium leading-relaxed">
                By clicking "Finalize Purchase", you authorize the transfer of funds for the selected vehicle. High-value transactions are monitored by Spark Motors Security Ops.
              </div>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full bg-amber-500 text-black h-20 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-amber-400 transition-all flex items-center justify-center gap-4 shadow-[0_0_50px_rgba(245,158,11,0.2)]"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <>Finalize Purchase <ChevronRight size={20} /></>}
          </button>
        </div>
      </div>
    </div>
  );

  const Success = () => (
    <div className="bg-[#050505] min-h-screen text-white font-sans flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-10 border border-emerald-500/30">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-5xl font-black italic tracking-tighter mb-4 uppercase">Transaction <span className="text-emerald-500">Confimed.</span></h1>
        <p className="text-white/40 uppercase tracking-[0.3em] font-black text-sm mb-12">Welcome to the inner circle of Spark Motors.</p>
        
        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 mb-10 text-left">
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div className="text-xs font-black uppercase tracking-widest text-white/40">Order Receipt</div>
            <div className="font-mono text-emerald-500 font-bold tracking-tighter">{result?.orderId}</div>
          </div>
          
          <div className="space-y-6 mb-10">
            <div className="flex justify-between">
              <span className="text-white/60 font-medium">Vehicle</span>
              <span className="font-bold">{result?.receipt?.item}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-medium">Amount Processed</span>
              <span className="font-mono text-amber-500 font-bold">{result?.receipt?.amount_paid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60 font-medium">Delivery Status</span>
              <span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest bg-emerald-500/10 px-2 py-1 rounded">Prioritized</span>
            </div>
          </div>

          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-3">System Authorization Token (Flag)</div>
            <div className="font-mono text-xl font-black tracking-tight text-white select-all">{result?.flag}</div>
          </div>
        </div>

        <button 
          onClick={() => setCurrentStep('SHOWROOM')}
          className="text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.4em]"
        >
          Return to Showroom
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      {currentStep === 'SHOWROOM' && <Showroom />}
      {currentStep === 'CHECKOUT' && <Checkout />}
      {currentStep === 'SUCCESS' && <Success />}
    </div>
  );
}
