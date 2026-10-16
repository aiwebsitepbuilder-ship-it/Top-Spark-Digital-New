import React from 'react';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div>
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </button>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Terms & Conditions (Draft)
        </h1>
        <p className="text-xs text-slate-400">
          Last updated: October 2026 · Top Spark Digital, 131/2 A, Mirpur-1, Dhaka, Bangladesh.
        </p>
      </div>

      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-300 text-xs flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          <strong>Notice:</strong> This draft terms agreement outlines general terms for agency service inquiries. Client service agreements are governed by individual signed contracts.
        </span>
      </div>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed bg-[#0E1017] p-8 sm:p-12 rounded-3xl border border-white/[0.08]">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Scope of Digital Services</h2>
          <p>
            Top Spark Digital delivers professional digital marketing, video production, photography, local SEO, Google Business Profile management, and bespoke technology solutions. Actual timelines, deliverable quantities, and retainer terms are executed under signed work orders.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Content & Intellectual Property</h2>
          <p>
            Original media, brand marks, and digital assets produced specifically for a client become client property upon full settlement of contracted invoices, subject to terms specified in individual service agreements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Governing Jurisdiction</h2>
          <p>
            These terms and related agency engagements are governed under the laws and courts of the People's Republic of Bangladesh.
          </p>
        </section>
      </div>
    </div>
  );
};
