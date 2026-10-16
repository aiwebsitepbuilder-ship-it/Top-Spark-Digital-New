import React from 'react';
import { ArrowRight, CheckCircle2, MapPin, Video, Award, Target, Eye } from 'lucide-react';
import { ContentDatabase } from '../types';
import { getAssetUrl } from '../utils/assetUrl';

interface AboutPageProps {
  data: ContentDatabase;
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ data, onNavigate }) => {
  const settings = data?.settings || {
    primaryPositioning: 'We Turn Businesses Into Digital Brands.',
    supportingPositioning: 'From content and social media to SEO, Google Business Profile and digital solutions — Top Spark helps businesses build, manage and grow their digital presence.',
  };
  const teamMembers = data?.teamMembers || [];
  const publishedTeam = teamMembers.filter((m) => m?.published);

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
          Agency Identity
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          A Digital Team Built Around Execution.
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          {settings.supportingPositioning}
        </p>
      </div>

      {/* Brand Story Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="p-8 sm:p-10 rounded-3xl border border-white/[0.08] bg-[#0E1017] space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              We Prefer Showing Our Work Over Talking About Ourselves.
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Top Spark is a Bangladesh-based digital agency focused on helping businesses build stronger digital presence through marketing, content production, technology and execution.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Too many businesses in Bangladesh find themselves caught between two extremes: traditional creative agencies that produce static strategy slides without delivering real daily output, and casual freelance services that lack technical accountability and business acumen.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Top Spark bridges this divide. We combine in-house video shooting rigs, sound engineering, multi-channel social management, technical SEO/AEO foundations, and software development into one unified growth partner.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-white/[0.08] bg-[#0E1017] overflow-hidden p-3 shadow-2xl">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-900 relative">
              <img
                src={getAssetUrl('/images/hero_production_agency.jpg')}
                alt="Top Spark digital media studio and production center in Dhaka"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold mb-1">
                  Dhaka Operations Base
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#6A22F2]" />
                  <span>131/2 A, Mirpur-1, Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <section className="space-y-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Our Operational Pillars
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#0E1017] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Studio-Grade Production</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We shoot on cinema-grade camera rigs with dedicated studio lighting and directional audio. We never rely on generic stock media to tell your brand story.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#0E1017] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">Accountable Execution</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We take ownership of weekly publishing calendars, comment monitoring, local search pin optimizations, and monthly analytics reports.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#0E1017] space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-white">AI Search & Modern AEO</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              As customer search behaviors evolve toward AI answer engines, we format your brand knowledge so answer platforms reference your business authoritative.
            </p>
          </div>
        </div>
      </section>

      {/* Team profiles section (conditional on verified members) */}
      {publishedTeam.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Our Core Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {publishedTeam.map((member) => (
              <div key={member.id} className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1017] space-y-4">
                <div className="aspect-square rounded-xl bg-slate-900 overflow-hidden">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 font-bold">
                      Top Spark
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{member.name}</h3>
                  <p className="text-xs text-purple-400">{member.role}</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ready to collaborate? */}
      <div className="rounded-3xl border border-white/[0.1] bg-[#131620] p-8 sm:p-14 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          Let's Build Something That Lasts.
        </h2>
        <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Whether you need a dedicated content team or an end-to-end digital overhaul, we're ready to review your goals.
        </p>
        <button
          onClick={() => onNavigate('/contact')}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] transition-all cursor-pointer shadow-lg shadow-purple-900/40"
        >
          Talk to Our Team
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
