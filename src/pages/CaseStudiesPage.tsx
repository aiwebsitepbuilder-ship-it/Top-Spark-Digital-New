import React, { useState } from 'react';
import { ArrowUpRight, Filter } from 'lucide-react';
import { ContentDatabase } from '../types';
import { getAssetUrl } from '../utils/assetUrl';

interface CaseStudiesPageProps {
  data: ContentDatabase;
  onNavigate: (path: string) => void;
}

export const CaseStudiesPage: React.FC<CaseStudiesPageProps> = ({ data, onNavigate }) => {
  const caseStudies = data?.caseStudies || [];
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const publishedStudies = caseStudies.filter((c) => c && c.status === 'published');

  // Extract distinct industries for filter tabs
  const industries = ['all', ...Array.from(new Set(publishedStudies.map((c) => c.industry)))];

  const filteredStudies =
    selectedIndustry === 'all'
      ? publishedStudies
      : publishedStudies.filter((c) => c.industry === selectedIndustry);

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
          Selected Client Work
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Work That Speaks For Us.
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          We believe the best way to evaluate an agency is to examine what it actually executes. Review our video production pipelines, content strategies, and digital platforms across Bangladeshi businesses.
        </p>
      </div>

      {/* Interactive Industry Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs text-slate-500 flex items-center gap-1.5 mr-2 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </span>
        {industries.map((ind) => (
          <button
            key={ind}
            onClick={() => setSelectedIndustry(ind)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
              selectedIndustry === ind
                ? 'bg-[#6A22F2] text-white shadow-md shadow-purple-900/30'
                : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {ind === 'all' ? 'All Case Studies' : ind}
          </button>
        ))}
      </div>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredStudies.map((study) => (
          <div
            key={study.id}
            className="rounded-3xl border border-white/[0.08] bg-[#0E1017] overflow-hidden flex flex-col justify-between group hover:border-purple-500/40 transition-all shadow-xl"
          >
            <div>
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <img
                  src={getAssetUrl(study.image)}
                  alt={study.altText}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-md bg-black/60 backdrop-blur-md text-slate-200 border border-white/10">
                    {study.industry}
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-4">
                <div className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-400">
                  {study.client}
                </div>
                <h2 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                  {study.title}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                  {study.challenge}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {study.services.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 rounded bg-white/[0.03] text-slate-400 border border-white/[0.06]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 pt-0">
              <button
                onClick={() => onNavigate(`/case-studies/${study.slug}`)}
                className="w-full inline-flex items-center justify-between p-4 rounded-xl bg-white/[0.03] group-hover:bg-[#6A22F2] text-xs font-semibold uppercase tracking-wider text-slate-200 group-hover:text-white transition-all cursor-pointer"
              >
                <span>Read Full Case Study</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredStudies.length === 0 && (
        <div className="text-center py-16 text-slate-500 text-sm">
          No case studies found for the selected category.
        </div>
      )}
    </div>
  );
};
