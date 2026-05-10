"use client";

import { ShieldAlert, Lock, LogOut, Menu, Bell, User } from "lucide-react";

export default function BankLocalPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Navbar */}
      <nav className="bg-blue-800 text-white px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-yellow-400" />
          <span className="text-xl font-bold tracking-tight">BANK.LOCAL <span className="font-light text-blue-200">| ADMIN</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Bell className="w-5 h-5 text-blue-200 cursor-pointer hover:text-white" />
          <div className="flex items-center gap-2 bg-blue-700 px-3 py-1 rounded-full border border-blue-600">
            <User className="w-4 h-4 text-blue-200" />
            <span className="text-sm font-medium">Administrator</span>
          </div>
          <LogOut className="w-5 h-5 text-blue-200 cursor-pointer hover:text-white" />
        </div>
      </nav>

      {/* Sidebar & Content Layout */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 min-h-[calc(100vh-56px)] text-slate-300 p-4">
          <div className="space-y-1">
            <div className="p-3 bg-blue-600 text-white rounded font-medium flex items-center gap-3">
              <Menu className="w-4 h-4" /> Dashboard
            </div>
            <div className="p-3 hover:bg-slate-700 rounded transition-colors flex items-center gap-3 cursor-pointer">
              <Lock className="w-4 h-4" /> Security Settings
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10 bg-slate-100">
          <div className="max-w-4xl mx-auto">
            <header className="mb-10">
              <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
              <p className="text-slate-500 mt-2">Manage system-wide administrative actions and security overrides.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Total Assets</h3>
                <div className="text-4xl font-black text-slate-800">$1,248,392.00</div>
                <div className="text-green-500 text-sm mt-2 font-medium">↑ 12% from last month</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4">Security Status</h3>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-xl font-bold text-slate-700">Audit Required</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 italic">Last scan: 48 hours ago</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border-2 border-red-100 overflow-hidden">
              <div className="bg-red-50 px-8 py-6 border-b border-red-100">
                <h2 className="text-xl font-bold text-red-800 flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6" /> Critical Actions
                </h2>
              </div>
              <div className="p-10 text-center">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Delete Admin Account</h3>
                <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
                  Warning: This action will immediately terminate your session and delete all associated administrative credentials. This cannot be undone.
                </p>
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95"
                  onClick={() => alert("Success: Account Deleted. Flag: flag{cl1ckj4ck1ng_w1th_n0_x_fr4m3}")}
                >
                  Confirm Account Deletion
                </button>
                <p className="text-xs text-slate-400 mt-6 font-mono">
                  ACTION_ID: 9982-XLR-DESTRUCT
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
