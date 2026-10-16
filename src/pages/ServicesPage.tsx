import React from 'react';
import { ArrowRight, CheckCircle2, MessageSquare, ArrowUpRight } from 'lucide-react';
import { ContentDatabase } from '../types';

interface ServicesPageProps {
  data: ContentDatabase;
  onNavigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ data, onNavigate }) => {
  const services = data?.services || [];

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
          What We Do
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Everything Your Digital Presence Needs.
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          Strategy, production, technology and daily execution under one team. We build sustainable digital systems that generate real inquiries and long-term brand equity for businesses in Bangladesh.
        </p>
      </div>

      {/* Deep-Dive Service Cards */}
      <div className="space-y-12">
        {services.map((service) => (
          <div
            id={service.slug}
            key={service.id}
            className="rounded-3xl border border-white/[0.08] bg-[#0E1017] p-8 sm:p-12 transition-all hover:border-purple-500/30 space-y-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-white/[0.06] pb-8">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-purple-400">
                    {service.number}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-slate-500">
                    Service Line
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {service.title}
                </h2>
                <p className="text-base text-slate-300 leading-relaxed">
                  {service.shortDescription}
                </p>
                {service.plainEnglishExplanation && (
                  <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-sm text-purple-200">
                    <strong className="text-white block mb-0.5">In Plain English:</strong>
                    {service.plainEnglishExplanation}
                  </div>
                )}
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => onNavigate(`/contact?service=${encodeURIComponent(service.title)}`)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] transition-all shadow-md shadow-purple-900/30 cursor-pointer"
                >
                  {service.ctaText}
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Deliverables Grid & Business Need */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  What Is Included
                </h3>
                <ul className="space-y-3">
                  {service.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Who This Is Built For
                </h3>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-sm text-slate-300 leading-relaxed">
                  {service.businessNeeds}
                </div>

                <div className="pt-2">
                  <p className="text-xs text-slate-500">
                    Pricing is customized based on production frequency, shoot requirements, and organizational scope.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Box */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#131620] p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Not sure which services your business needs right now?
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          Tell us where your business stands today and what challenges you're facing. We will review your digital footprint and propose an honest plan.
        </p>
        <button
          onClick={() => onNavigate('/contact')}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] transition-all cursor-pointer"
        >
          Schedule an Assessment
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
