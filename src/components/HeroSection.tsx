"use client";

import { Shield, Zap, ArrowRight, Lock, Globe } from "lucide-react";
import TypingEffect from "./TypingEffect";
import { useLanguage } from "./LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center py-20 mesh-gradient">
      {/* Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-brand-secondary/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark border border-white/10 text-brand-primary mb-8 text-sm font-semibold tracking-wide uppercase animate-float">
          <Shield className="w-4 h-4" />
          <span>Next-Gen Security Simulation v2.0</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-8 leading-tight">
          <span className="text-white">{t("hero.title1")}</span><br />
          <span className="text-gradient">{t("hero.title2")}</span>
        </h1>

        <p className="mt-4 text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
          {t("hero.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <a
            href="#categories"
            className="group relative inline-flex items-center gap-3 bg-brand-primary text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-brand-secondary hover:shadow-[0_20px_40px_-10px_rgba(99,102,241,0.5)] overflow-hidden"
          >
            <span className="relative z-10">{t("hero.cta")}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </a>
          
          <button
            className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-bold text-lg text-white border border-white/10 glass hover:bg-white/10 transition-all"
          >
            <Globe className="w-5 h-5" />
            {t("hero.explore")}
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { label: "Active Scenarios", value: "10+", icon: Lock, color: "text-brand-primary" },
            { label: "Learning Path", value: "OWASP '25", icon: Shield, color: "text-brand-accent" },
            { label: "Difficulty", value: "Beginner to Pro", icon: Zap, color: "text-brand-secondary" },
          ].map((stat, idx) => (
            <div key={idx} className="p-6 rounded-2xl glass-dark border border-white/5 flex flex-col items-center">
              <stat.icon className={`w-8 h-8 mb-4 ${stat.color}`} />
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Welcome Text */}
        <div className="mt-16 text-slate-500 font-bold text-sm flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-white/10"></div>
          <span className="dir-rtl uppercase tracking-widest">{t("hero.welcome")}</span>
          <div className="h-px w-8 bg-white/10"></div>
        </div>
      </div>
    </section>
  );
}
