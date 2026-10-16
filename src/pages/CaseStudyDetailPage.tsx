import React from 'react';
import { ArrowLeft, ArrowUpRight, CheckCircle2, Building2, Briefcase } from 'lucide-react';
import { ContentDatabase, CaseStudy } from '../types';
import { getAssetUrl } from '../utils/assetUrl';

interface CaseStudyDetailPageProps {
  slug: string;
  data: ContentDatabase;
  onNavigate: (path: string) => void;
}

export const CaseStudyDetailPage: React.FC<CaseStudyDetailPageProps> = ({ slug, data, onNavigate }) => {
  const caseStudies = data?.caseStudies || [];
  const study = caseStudies.find((c) => c && c.slug === slug);

  if (!study) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-4">Case Study Not Found</h1>
        <p className="text-sm text-slate-400 mb-8">
          The requested case study could not be located or may currently be in draft status.
        </p>
        <button
          onClick={() => onNavigate('/case-studies')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Case Studies
        </button>
      </div>
    );
  }

  // Related studies
  const relatedStudies = caseStudies
    .filter((c) => c.slug !== slug && c.status === 'published')
    .slice(0, 2);

  return (
    <article className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Navigation Breadcrumb */}
      <div>
        <button
          onClick={() => onNavigate('/case-studies')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Case Studies
        </button>
      </div>

      {/* Case Study Header */}
      <header className="space-y-6 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="font-mono font-bold uppercase tracking-wider text-purple-400">
            {study.client}
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{study.industry}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
          {study.title}
        </h1>

        <div className="flex flex-wrap gap-2 pt-2">
          {study.services.map((srv, idx) => (
            <span
              key={idx}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.08]"
            >
              {srv}
            </span>
          ))}
        </div>
      </header>

      {/* Featured Media Showcase */}
      <div className="rounded-3xl border border-white/[0.1] bg-[#0E1017] overflow-hidden shadow-2xl">
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
          <img
            src={getAssetUrl(study.image)}
            alt={study.altText}
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Structured Case Study Content Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6">
        {/* Main Content (Cols 1-8) */}
        <div className="lg:col-span-8 space-y-12">
          {/* Section: Challenge */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400">
              The Challenge
            </h2>
            <div className="text-base sm:text-lg text-slate-200 leading-relaxed bg-[#0E1017] p-8 rounded-2xl border border-white/[0.08]">
              {study.challenge}
            </div>
          </section>

          {/* Section: Our Approach */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Our Strategic Approach
            </h2>
            <div className="text-base text-slate-300 leading-relaxed bg-[#0E1017] p-8 rounded-2xl border border-white/[0.08]">
              {study.approach}
            </div>
          </section>

          {/* Section: Execution & Deliverables */}
          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400">
              How Top Spark Executed
            </h2>
            <div className="text-base text-slate-300 leading-relaxed bg-[#0E1017] p-8 rounded-2xl border border-white/[0.08] space-y-6">
              <p>{study.execution}</p>

              <div className="pt-4 border-t border-white/[0.06] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Actual Deliverables Produced
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {study.deliverables.map((del, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section: Verified Business Outcome */}
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Business Outcome
            </h2>
            <div className="text-base text-slate-200 leading-relaxed bg-purple-950/20 p-8 rounded-2xl border border-purple-500/20">
              {study.outcome}
            </div>
          </section>
        </div>

        {/* Sidebar Project Summary & CTA (Cols 9-12) */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#0E1017] space-y-6 sticky top-28">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Project Meta
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-1">Client Partner</span>
                <span className="font-semibold text-white text-sm">{study.client}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Industry Sector</span>
                <span className="font-medium text-slate-200">{study.industry}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Capabilities Applied</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {study.services.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white/[0.04] text-slate-300 text-[11px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.06] space-y-3">
              <div className="text-xs font-semibold text-white">
                Want results like this for your business?
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                We can formulate an execution plan tailored to your audience and operational capacity.
              </p>
              <button
                onClick={() => onNavigate('/contact')}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] transition-all cursor-pointer shadow-md shadow-purple-900/40"
              >
                Start a Project
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Related Projects Section */}
      {relatedStudies.length > 0 && (
        <section className="pt-16 border-t border-white/[0.08] space-y-8">
          <h2 className="text-2xl font-bold text-white">Related Client Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedStudies.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onNavigate(`/case-studies/${rel.slug}`)}
                className="p-6 rounded-2xl border border-white/[0.08] bg-[#0E1017] hover:border-purple-500/40 cursor-pointer transition-all group"
              >
                <div className="text-xs font-mono font-semibold text-purple-400 mb-1">
                  {rel.client}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                  {rel.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-4">{rel.challenge}</p>
                <div className="text-xs font-semibold text-purple-400 inline-flex items-center gap-1 group-hover:underline">
                  View Case Study <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
