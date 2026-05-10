"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.scenarios": "Scenarios",
    "nav.ranking": "Global Ranking",
    "nav.resources": "Resources",
    "hero.title1": "Master the Art of",
    "hero.title2": "Offensive Security",
    "hero.subtitle": "Experience real-world vulnerability scenarios designed by security experts. Challenge yourself with OWASP Top 10 2025 labs and elevate your penetration testing skills.",
    "hero.cta": "Start Training Now",
    "hero.explore": "Explore Labs",
    "hero.welcome": "Welcome to the most advanced security training platform",
    "dashboard.title": "Advanced Security Scenarios",
    "dashboard.subtitle": "Select a specialized training module below. Each lab simulates a real-world infrastructure with authentic vulnerabilities.",
    "lab.launch": "Launch Simulation",
    "lab.solved": "Completed",
    "lab.pts": "pts",
  },
  ar: {
    "nav.scenarios": "السيناريوهات",
    "nav.ranking": "الترتيب العالمي",
    "nav.resources": "المصادر",
    "hero.title1": "أتقن فن",
    "hero.title2": "الأمن الهجومي",
    "hero.subtitle": "خض تجربة سيناريوهات الثغرات الواقعية المصممة من قبل خبراء الأمن. تحد نفسك مع مختبرات OWASP Top 10 2025 وارفع مهاراتك في اختبار الاختراق.",
    "hero.cta": "ابدأ التدريب الآن",
    "hero.explore": "استكشف المختبرات",
    "hero.welcome": "مرحباً بك في منصة التدريب الأمنية الأكثر تطوراً",
    "dashboard.title": "سيناريوهات أمنية متقدمة",
    "dashboard.subtitle": "اختر وحدة تدريبية متخصصة أدناه. يحاكي كل مختبر بنية تحتية حقيقية مع ثغرات أصلية.",
    "lab.launch": "تشغيل المحاكاة",
    "lab.solved": "مكتمل",
    "lab.pts": "نقطة",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("platform_lang") as Language;
    if (saved && (saved === "en" || saved === "ar")) {
      setLanguageState(saved);
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = saved;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("platform_lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className={language === "ar" ? "font-sans-arabic" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
