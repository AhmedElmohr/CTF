"use client";

import { useEffect, useState } from "react";
import { 
  Building2, 
  Users2, 
  MapPin, 
  Calendar, 
  Mail, 
  Globe, 
  Link2, 
  ArrowLeft,
  UserCircle2,
  Briefcase
} from "lucide-react";
import Link from "next/link";

interface TeamMember {
  name: string;
  title: string;
  username: string;
  email: string;
  bio: string;
  socialMedia?: {
    twitter: string;
    linkedin: string;
  };
}

interface CompanyData {
  company: string;
  founded: number;
  headquarters: string;
  team: TeamMember[];
}

export default function CompanyAboutPage() {
  const [data, setData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/labs/a06-1/about")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight">{data?.company}</span>
          </div>
          <button 
            onClick={() => window.close()}
            className="text-xs font-black text-slate-500 hover:text-blue-600 flex items-center gap-2 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-xl shadow-slate-200/50 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                <Globe className="w-3.5 h-3.5" />
                Global HQ: {data?.headquarters}
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900">
                Building the future of <span className="text-blue-600">Secure Enterprise</span>.
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                Founded in {data?.founded}, {data?.company} has been at the forefront of digital transformation and security architecture for over a decade.
              </p>
              <div className="flex items-center gap-8 pt-4">
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-900">10+</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Years of Excellence</div>
                </div>
                <div className="w-px h-10 bg-slate-200"></div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-900">500+</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Clients</div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-slate-100 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-2xl rotate-3">
              <Building2 className="w-32 h-32 text-slate-300" />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <section className="space-y-8">
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <h2 className="text-4xl font-black tracking-tight">Meet our <span className="text-blue-600">Leadership</span></h2>
            <p className="text-slate-500 font-medium max-w-lg">
              The visionaries behind SecureCorp's industry-leading security platform and global operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.team.map((member, idx) => (
              <div key={idx} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 group">
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <UserCircle2 className="w-12 h-12 text-slate-300 group-hover:text-white" />
                    </div>
                    <div className="flex gap-2">
                      {member.socialMedia?.twitter && (
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                          <Globe className="w-4 h-4" />
                        </div>
                      )}
                      {member.socialMedia?.linkedin && (
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-700 hover:bg-blue-50 transition-all cursor-pointer">
                          <Link2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{member.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                      <Briefcase className="w-3.5 h-3.5" />
                      {member.title}
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-grow">
                    {member.bio}
                  </p>

                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-300" />
                      <span className="text-xs font-bold text-slate-400">{member.email}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">@{member.username}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-24 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 uppercase">{data?.company}</span>
          </div>
          <div className="flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <span>© 2024 Corporate Directory</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
