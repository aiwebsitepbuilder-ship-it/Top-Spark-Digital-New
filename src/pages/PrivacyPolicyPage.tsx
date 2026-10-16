import React from 'react';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
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
          Privacy Policy (Draft)
        </h1>
        <p className="text-xs text-slate-400">
          Last updated: October 2026 · Official business entity: Top Spark Digital, 131/2 A, Mirpur-1, Dhaka, Bangladesh.
        </p>
      </div>

      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-300 text-xs flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          <strong>Notice:</strong> This document represents an initial operational draft provided for application structure. It must be reviewed and customized by qualified legal counsel prior to formal legal reliance.
        </span>
      </div>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed bg-[#0E1017] p-8 sm:p-12 rounded-3xl border border-white/[0.08]">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p>
            When you interact with Top Spark Digital through our website (https://topsparkdigital.com/) or project inquiry forms, we collect information you voluntarily provide, including:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400 text-xs">
            <li>Contact details (Full Name, Business Name, Telephone / WhatsApp number, Email address).</li>
            <li>Project specifics, scope details, and budget allocations.</li>
            <li>Technical metadata (IP addresses, browser headers for rate limiting and spam prevention).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. How We Use Your Data</h2>
          <p>
            We use your data solely to communicate regarding requested digital marketing services, formulate commercial proposals, manage client contracts, and ensure system security. We do not sell or rent your personal contact information to third-party brokers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Data Storage & Security</h2>
          <p>
            Inquiry records are stored securely on our protected server infrastructure. Administrative access requires authenticated session credentials and password hashing.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Contact Information</h2>
          <p>
            For questions regarding this privacy policy or to request deletion of your inquiry data, contact:
          </p>
          <p className="text-xs text-slate-400">
            Top Spark Digital<br />
            131/2 A, Mirpur-1, Dhaka, Bangladesh<br />
            Email: <a href="mailto:info@topsparkdigital.com" className="text-purple-400 hover:underline">info@topsparkdigital.com</a><br />
            Phone: <a href="tel:+8801674451806" className="text-purple-400 hover:underline">+8801674451806</a>
          </p>
        </section>
      </div>
    </div>
  );
};
