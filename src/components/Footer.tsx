import React from 'react';
import { Phone, Mail, MapPin, Facebook } from 'lucide-react';
import { TopSparkLogo } from './TopSparkLogo';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (path: string) => {
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const services = [
    { label: 'Social Media Management', path: '/services#social-media-management' },
    { label: 'Content Creation & Video', path: '/services#content-creation' },
    { label: 'Photography & Videography', path: '/services#photography-videography' },
    { label: 'Google Business Profile', path: '/services#google-business-profile' },
    { label: 'SEO & AEO Visibility', path: '/services#seo-aeo' },
    { label: 'Digital Solutions & Web', path: '/services#digital-solutions' },
  ];

  return (
    <footer className="border-t border-white/[0.08] bg-[#07080B] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Info & Mission (Col 1-4) */}
          <div className="lg:col-span-4 space-y-6">
            <button
              onClick={() => handleNav('/')}
              className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded cursor-pointer"
            >
              <TopSparkLogo size="lg" />
            </button>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              Digital marketing, content production, and technology for growing businesses in Bangladesh.
              We turn businesses into digital brands through execution.
            </p>

            {/* Social Media Link */}
            <div className="pt-1 flex items-center gap-3">
              <a
                href="https://www.facebook.com/topsparkdigital"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Top Spark Digital on Facebook"
                className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-purple-500/50 hover:bg-purple-950/30 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200"
              >
                <Facebook className="w-5 h-5 fill-current" />
              </a>
            </div>
          </div>

          {/* Quick Navigation (Col 5-6) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold tracking-wider text-white uppercase">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => handleNav('/')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/case-studies')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Case Studies
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/products')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Digital Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('/contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Services Links (Col 7-9) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold tracking-wider text-white uppercase">Core Capabilities</h4>
            <ul className="space-y-2.5 text-sm">
              {services.map((srv, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleNav(srv.path)}
                    className="hover:text-white transition-colors text-left cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{srv.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Contact & Location (Col 10-12) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold tracking-wider text-white uppercase">Dhaka Office</h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#6A22F2] shrink-0 mt-0.5" />
                <span>131/2 A, Mirpur-1, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#6A22F2] shrink-0" />
                <a href="tel:+8801674451806" className="hover:text-white transition-colors">
                  +8801674451806
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#6A22F2] shrink-0" />
                <a href="mailto:info@topsparkdigital.com" className="hover:text-white transition-colors">
                  info@topsparkdigital.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Top Spark. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNav('/privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy (Draft)
            </button>
            <button
              onClick={() => handleNav('/terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms of Service (Draft)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
