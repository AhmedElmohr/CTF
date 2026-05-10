"use client";

import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import ChallengeCard from "@/components/ChallengeCard";
import Leaderboard from "@/components/Leaderboard";
import { initialChallenges } from "@/lib/challenges";
import { useLanguage } from "@/components/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const a02Challenges = initialChallenges.filter(c => c.category === "A02:2025");
  const a06Challenges = initialChallenges.filter(c => c.category === "A06:2025");

  return (
    <div className="min-h-screen bg-surface-darkest text-slate-200 pb-20">
      
      <div id="categories" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>


        <div className="space-y-16">
          <CategorySection
            id="category-a02"
            title="Security Misconfiguration"
            description="Exploit misconfigured systems, exposed defaults, and weak infrastructure hardening."
            colorTheme="green"
          >
            {a02Challenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </CategorySection>

          <CategorySection
            id="category-a06"
            title="Insecure Design"
            description="Identify and exploit architectural flaws and broken business logic implementations."
            colorTheme="cyan"
          >
            {a06Challenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </CategorySection>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <Leaderboard />
      </div>
    </div>
  );
}
