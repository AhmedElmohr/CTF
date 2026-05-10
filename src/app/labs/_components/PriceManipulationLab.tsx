"use client";

import { useState } from "react";
import { 
  ShoppingCart, 
  CreditCard, 
  ShieldCheck, 
  Trash2, 
  ChevronRight, 
  Package, 
  ArrowLeft,
  CheckCircle2,
  Lock,
  AlertCircle,
  Activity
} from "lucide-react";
import clsx from "clsx";

export default function PriceManipulationLab() {
  const [cart, setCart] = useState([
    { id: "item_flag_ultimate", name: "Premium Security Flag", price: 1000000, qty: 1, img: "🚩" }
  ]);
  const [step, setStep] = useState("cart"); // cart, checkout, success
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [finalOrder, setFinalOrder] = useState<any>(null);

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      setIsLoading(false);
      return;
    }

    // The vulnerability: We send the PRICE from the client!
    const item = cart[0];
    const orderData = {
      itemId: item.id,
      quantity: item.qty,
      price: item.price
    };

    try {
      // Simulate a request that Burp Suite can catch
      const res = await fetch("/api/labs/a06-2/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      
      const result = await res.json();
      
      setIsLoading(false);
      if (res.ok && result.success) {
        setFinalOrder(result);
        setStep("success");
      } else {
        setError(result.message || "Payment gateway connection error.");
      }
    } catch (err) {
      setIsLoading(false);
      setError("Payment gateway connection error.");
    }
  };

  if (step === "success" && finalOrder) {
    const isExploited = finalOrder.flag ? true : false;
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 font-sans">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-10 text-center border border-slate-100">
          <div className={clsx(
            "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500",
            isExploited ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
          )}>
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Order Confirmed!</h2>
          <p className="text-slate-500 font-medium mb-8">{finalOrder.message || "Thank you for your purchase. Your order has been processed."}</p>
          
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 text-left space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-bold">Order ID:</span>
              <span className="text-slate-900 font-black">{finalOrder.orderId || "#ORD-882193"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-bold">Total Charged:</span>
              <span className={clsx("font-black", isExploited ? "text-emerald-600" : "text-slate-900")}>
                ${finalOrder.chargedAmount?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-slate-200 pt-4">
              <span className="text-slate-500 font-bold">Remaining Balance:</span>
              <span className="font-black text-slate-900">
                ${finalOrder.remainingBalance?.toFixed(2) || "0.00"}
              </span>
            </div>
            {isExploited && (
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  Business Logic Exploited
                </div>
                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-center">
                  <code className="text-emerald-700 font-mono text-sm break-all font-black">
                    {finalOrder.flag}
                  </code>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => {
              setStep("cart");
              setFinalOrder(null);
            }}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all"
          >
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter">Secured<span className="text-indigo-600">Shop</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Lock className="w-4 h-4 text-emerald-500" />
            Secure Checkout
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <span className="text-xs font-bold text-slate-500">JD</span>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full px-8 py-12">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">
          
          {/* Cart Section */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black tracking-tight">Shopping Cart</h1>
              <span className="text-slate-400 font-bold">{cart.length} items</span>
            </div>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between group hover:border-indigo-600 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl">
                      {item.img}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{item.name}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Digital Delivery</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900">${item.price.toLocaleString()}</div>
                      <div className="text-[10px] font-bold text-slate-400">Qty: {item.qty}</div>
                    </div>
                    <button 
                      onClick={() => setCart(cart.filter(c => c.id !== item.id))}
                      className="text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="p-8 text-center text-slate-500 font-medium bg-white rounded-3xl border border-slate-200">
                  Your cart is empty.
                </div>
              )}
            </div>

            <button className="flex items-center gap-2 text-indigo-600 font-bold hover:underline">
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </button>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl sticky top-28">
              <h2 className="text-xl font-black mb-8 border-b border-slate-100 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-500 font-bold">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-bold">
                  <span>Tax (0%)</span>
                  <span>$0.00</span>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between">
                  <span className="text-slate-900 font-black text-lg">Total</span>
                  <span className="text-indigo-600 font-black text-xl">${total.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-2xl mb-6 text-xs font-bold flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <button 
                onClick={handleCheckout}
                disabled={isLoading || cart.length === 0}
                className="group relative w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-slate-800 transition-all overflow-hidden disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? "Processing..." : "Secure Checkout"}
                  {!isLoading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>

              <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <Package className="w-4 h-4 text-slate-400" />
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SSL Encrypted Transaction</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="px-8 py-6 bg-white border-t border-slate-200 mt-auto flex items-center justify-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          PCI-DSS Compliant
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-indigo-500" />
          API V2.4 Connected
        </div>
      </footer>
    </div>
  );
}
