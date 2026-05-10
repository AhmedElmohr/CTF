"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Layers, Box } from "lucide-react";
import clsx from "clsx";

interface CategorySectionProps {
  id: string;
  title: string;
  description: string;
  colorTheme: "green" | "cyan";
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export default function CategorySection({
  id,
  title,
  description,
  colorTheme,
  children,
  defaultExpanded = true,
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Map old themes to new professional themes
  const themeClasses = {
    green: "text-brand-accent border-brand-accent/20 bg-brand-accent/5",
    cyan: "text-brand-primary border-brand-primary/20 bg-brand-primary/5",
  };

  const themeIcon = {
    green: Layers,
    cyan: Box,
  };

  const Icon = themeIcon[colorTheme];

  return (
    <div id={id} className="mb-12 rounded-3xl overflow-hidden glass-dark border border-white/5 shadow-2xl transition-all">
      {/* Header (Collapsible Toggle) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-8 py-8 flex items-center justify-between text-left transition-all hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-6">
          <div className={clsx("p-4 rounded-2xl border flex items-center justify-center", themeClasses[colorTheme])}>
            <Icon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">{title}</h2>
            <p className="text-slate-500 mt-1 text-base font-medium">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 bg-white/5 px-4 py-2 rounded-xl border border-white/5 uppercase tracking-widest">
            {isExpanded ? "Collapse" : "Expand"}
          </div>
          <div className={clsx("p-2 rounded-full transition-transform duration-300", isExpanded ? "rotate-180" : "")}>
            <ChevronDown className="w-6 h-6 text-slate-400" />
          </div>
        </div>
      </button>

      {/* Content */}
      <div
        className={clsx(
          "transition-all duration-700 ease-in-out",
          isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        <div className="px-8 pb-10 pt-4 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
