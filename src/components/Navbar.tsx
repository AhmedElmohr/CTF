"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Trophy, Menu, X, Bell, LayoutDashboard, Globe, Languages } from "lucide-react";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { useLanguage } from "./LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("nav.scenarios"), href: "/#categories", icon: LayoutDashboard },
    { name: t("nav.ranking"), href: "/#leaderboard", icon: Trophy },
  ];

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <nav 
      className={clsx(
        "sticky top-0 z-50 w-full transition-all duration-300 border-b",
        scrolled 
          ? "bg-surface-darkest/80 backdrop-blur-xl border-white/10 py-2" 
          : "bg-transparent border-transparent py-4"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-black text-2xl tracking-tighter">
                Secured<span className="text-brand-primary">Labs</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (pathname === '/' && link.href.startsWith('/#'));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={clsx(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                      isActive
                        ? "text-brand-primary bg-brand-primary/10"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-slate-400 hover:text-white transition-all"
            >
              <Languages className="w-4 h-4" />
              {language === "en" ? "العربية" : "English"}
            </button>
            <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-accent rounded-full border-2 border-surface-darkest"></span>
            </button>
            <div className="h-8 w-px bg-white/10 mx-2"></div>
            <Link 
              href="/profile"
              className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-xs font-bold text-white shadow-lg">
                JD
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-black text-white group-hover:text-brand-primary transition-colors">John Doe</div>
                <div className="text-[10px] text-slate-500 font-bold">1,250 pts</div>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none transition-all"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={clsx(
          "md:hidden transition-all duration-500 ease-in-out border-b border-white/10 overflow-hidden",
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pt-4 pb-8 space-y-2 bg-surface-darker/95 backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <button 
              onClick={toggleLanguage}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-slate-300"
            >
              <Languages className="w-5 h-5" />
              {language === "en" ? "العربية" : "English"}
            </button>
            <Link 
              href="/profile"
              className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/20"
            >
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold">
                JD
              </div>
              <div>
                <div className="text-sm font-black text-white">John Doe</div>
                <div className="text-xs text-brand-primary font-bold">1,250 pts</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
