"use client";

import { useState } from "react";
import { ShoppingCart, Wallet, Package, Send } from "lucide-react";

export default function TrustBoundaryLab() {
  const [balance] = useState(50);
  const [cart] = useState({
    id: "item_flag_ultimate",
    name: "The Ultimate CTF Flag",
    price: 1000000,
    image: "🚩",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState<string | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [flag, setFlag] = useState("");

  const handleCheckout = async () => {
    setIsLoading(true);
    setServerResponse(null);
    setStatusCode(null);

    try {
      const res = await fetch("/api/labs/a06-2/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: cart.id,
          quantity: 1,
          price: cart.price, // This is what the user should modify in Burp!
        }),
      });

      setStatusCode(res.status);
      const data = await res.json();
      setServerResponse(JSON.stringify(data, null, 2));

      if (data.success && data.flag) {
        setIsSuccess(true);
        setFlag(data.flag);
      }
    } catch (err) {
      setServerResponse("Network error: Could not reach the server.");
      setStatusCode(0);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 font-sans">
        <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl overflow-hidden text-center">
          <div className="bg-green-500 py-12 px-6 text-white">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-lg opacity-90">Thank you for your purchase.</p>
          </div>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">You successfully hacked the checkout!</h2>
            <p className="text-slate-600 mb-6">
              By modifying the <code className="bg-slate-100 px-1 rounded">price</code> field in
              the intercepted HTTP request, you exploited a Trust Boundary Violation.
              The server blindly trusted the client-supplied price!
            </p>
            <div className="bg-slate-900 text-green-400 p-4 rounded font-mono text-lg border border-slate-700 shadow-inner">
              {flag}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <header className="bg-indigo-600 text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl">
          <ShoppingCart className="w-6 h-6" /> FlagMart
        </div>
        <div className="flex items-center gap-2 bg-indigo-800 px-4 py-2 rounded-full font-mono text-sm border border-indigo-500">
          <Wallet className="w-4 h-4 text-green-400" />
          Balance: <span className="font-bold text-green-400">${balance.toLocaleString()}</span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Product Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-slate-100 flex items-center justify-center p-12 text-9xl">
            {cart.image}
          </div>
          <div className="p-8 flex flex-col justify-between flex-1">
            <div>
              <div className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Exclusive Item</div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">{cart.name}</h1>
              <p className="text-slate-500 mb-6 leading-relaxed">
                The most sought-after item on the platform. It contains the ultimate secret.
                Only the wealthiest hackers can afford this masterpiece.
              </p>
              <div className="text-4xl font-light text-slate-800 mb-8 font-mono">
                ${cart.price.toLocaleString()}
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-4 rounded-lg shadow-md transition-transform active:scale-95 flex justify-center items-center gap-2"
            >
              <Send className="w-5 h-5" />
              {isLoading ? "Processing..." : "Proceed to Checkout"}
            </button>
            <p className="text-xs text-slate-400 mt-3 text-center font-mono">
              💡 Intercept this request in Burp Suite and inspect the JSON body.
            </p>
          </div>
        </div>

        {/* Server Response Panel */}
        <div className="bg-slate-900 rounded-xl border border-slate-700 flex flex-col overflow-hidden min-h-[500px]">
          <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
            <span className="text-slate-400 text-sm font-mono">Server Response</span>
            {statusCode !== null && (
              <span className={`text-xs font-mono font-bold ${
                statusCode >= 200 && statusCode < 300 ? "text-green-400" : "text-red-400"
              }`}>
                HTTP {statusCode}
              </span>
            )}
          </div>

          <div className="p-4 flex-1 overflow-auto font-mono text-sm">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-slate-500 animate-pulse">
                Waiting for server response...
              </div>
            ) : serverResponse ? (
              <pre className={`whitespace-pre-wrap break-all ${
                statusCode && statusCode >= 200 && statusCode < 300 ? "text-green-400" : "text-red-400"
              }`}>
                {serverResponse}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-600 italic text-center">
                <div>
                  <p className="mb-2">Click &quot;Proceed to Checkout&quot; to send the request.</p>
                  <p className="text-xs text-slate-700">
                    The request will be a POST to <code>/api/labs/a06-2/checkout</code>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
