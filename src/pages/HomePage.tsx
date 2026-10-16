import React from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle,
  Play,
  Layers,
  Sparkles,
  Camera,
  Search,
  Globe,
  Share2,
  Video,
  ExternalLink,
} from 'lucide-react';
import { ContentDatabase, CaseStudy } from '../types';
import { initialData } from '../data/initialData';
import { getAssetUrl } from '../utils/assetUrl';

interface HomePageProps {
  data: ContentDatabase;
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ data, onNavigate }) => {
  const settings = data?.settings || initialData.settings;
  const services = data?.services || initialData.services;
  const caseStudies = data?.caseStudies || initialData.caseStudies;
  const products = data?.products || initialData.products;
  const clients = data?.clients || initialData.clients;

  const publishedCaseStudies = caseStudies.filter((c) => c.status === 'published');
  const featuredCaseStudies = publishedCaseStudies.slice(0, 4);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* SECTION 1: HERO */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 overflow-hidden">
        {/* Subtle Brand Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
              We Turn Businesses Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-[#8B5CF6] to-[#6A22F2]">Digital Brands.</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed text-balance">
              From content and social media to SEO, Google Business Profile and digital solutions — Top Spark helps businesses build, manage and grow their digital presence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('/contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-sm font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] active:scale-[0.98] transition-all shadow-xl shadow-purple-900/40 cursor-pointer"
              >
                Start a Project
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('work-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onNavigate('/case-studies');
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition-all cursor-pointer"
              >
                See Our Work
              </button>
            </div>
          </div>

          {/* Hero Visual Studio Showcase */}
          <div className="mt-14 sm:mt-20 relative rounded-2xl sm:rounded-3xl border border-white/[0.1] bg-[#0E1017] p-2 sm:p-3 shadow-2xl overflow-hidden group">
            <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={getAssetUrl('/images/hero_production_agency.jpg')}
                alt="Top Spark digital production studio with cameras and editing stations"
                className="w-full h-full object-cover object-center transform group-hover:scale-[1.01] transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F]/90 via-transparent to-transparent" />

              {/* Verified Capability Badges on Studio Asset */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold">
                    Studio & Digital Operations
                  </div>
                  <div className="text-base sm:text-xl font-bold text-white">
                    Mirpur-1 Studio & Production Team
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-lg border border-white/10">
                  <Video className="w-3.5 h-3.5 text-purple-400" />
                  <span>Video Production · Social · Tech</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CLIENT & TRUST STRIP */}
      <section className="border-y border-white/[0.06] bg-white/[0.01] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-8">
            Trusted to build, manage and grow digital brands
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-14">
            {clients.filter(c => c.published).map((client) => (
              <div
                key={client.id}
                className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl hover:bg-white/[0.03] transition-colors"
              >
                <span className="text-lg sm:text-xl font-bold text-slate-300 group-hover:text-white transition-colors tracking-tight">
                  {client.name}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  {client.industry}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: SERVICES OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6] mb-2">
            Integrated Agency Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
            Everything Your Digital Presence Needs.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            You don't need five different agencies for content, social media, Google, SEO and digital solutions. Top Spark brings these capabilities together under one team.
          </p>
        </div>

        {/* 6 Visually Distinctive Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl border border-white/[0.08] bg-[#0E1017] p-8 flex flex-col justify-between hover:border-purple-500/40 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs font-semibold text-purple-400 tracking-wider">
                    {service.number}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-slate-400 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-colors">
                    {service.number === '01' && <Share2 className="w-4 h-4" />}
                    {service.number === '02' && <Video className="w-4 h-4" />}
                    {service.number === '03' && <Camera className="w-4 h-4" />}
                    {service.number === '04' && <Search className="w-4 h-4" />}
                    {service.number === '05' && <Sparkles className="w-4 h-4" />}
                    {service.number === '06' && <Globe className="w-4 h-4" />}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {service.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {service.shortDescription}
                </p>

                {service.plainEnglishExplanation && (
                  <div className="mb-6 p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 leading-relaxed">
                    <strong>In plain English:</strong> {service.plainEnglishExplanation}
                  </div>
                )}

                <ul className="space-y-2 mb-8">
                  {service.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6A22F2] mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <button
                  onClick={() => onNavigate(`/contact?service=${encodeURIComponent(service.title)}`)}
                  className="text-xs font-semibold text-purple-400 group-hover:text-white inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {service.ctaText}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigate('/services')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition-all cursor-pointer"
          >
            Explore All Services & Deliverables
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SECTION 4: FEATURED CASE STUDIES */}
      <section id="work-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6] mb-2">
              Execution Evidence
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
              Work That Speaks For Us.
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
              We believe the best way to understand an agency is to see what it actually does.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/case-studies')}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            View All Case Studies <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Editorial Case Study Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredCaseStudies.map((cs) => (
            <div
              key={cs.id}
              className="rounded-2xl border border-white/[0.08] bg-[#0E1017] overflow-hidden flex flex-col justify-between group hover:border-purple-500/40 transition-all"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={getAssetUrl(cs.image)}
                    alt={cs.altText}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-medium px-3 py-1 rounded-md bg-black/60 backdrop-blur-md text-slate-200 border border-white/10">
                      {cs.industry}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <div className="text-xs uppercase tracking-wider font-semibold text-purple-400">
                    {cs.client}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                    {cs.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {cs.challenge}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {cs.services.slice(0, 4).map((s, idx) => (
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

              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2">
                <button
                  onClick={() => onNavigate(`/case-studies/${cs.slug}`)}
                  className="w-full inline-flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-[#6A22F2] text-xs font-semibold text-slate-200 hover:text-white transition-all cursor-pointer"
                >
                  <span>View Case Study Breakdown</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: WHY TOP SPARK */}
      <section className="border-y border-white/[0.06] bg-gradient-to-b from-white/[0.01] to-transparent py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <div className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6] mb-2">
              Agency Principles
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
              Why Businesses Work With Top Spark
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
              We position Top Spark as a hands-on digital growth partner, not simply a social media posting agency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'One Team, Multiple Capabilities',
                desc: 'Marketing, video production, local search, SEO and custom digital solutions under one roof. No juggling multiple disjointed freelancers.',
              },
              {
                title: 'We Actually Execute',
                desc: 'We don’t just write strategies or advisory slides. We shoot, edit, design thumbnails, schedule, optimize and maintain your channels.',
              },
              {
                title: 'Content First',
                desc: 'Continuous, high-grade visual and video production forms the bedrock of organic reach, community confidence and brand authority.',
              },
              {
                title: 'Business-Focused',
                desc: 'Every video, post, and campaign is aligned directly with business revenue, qualified inquiries, and tangible commercial goals.',
              },
              {
                title: 'Real Projects & Evidence',
                desc: 'We showcase actual studio shoots, deployed digital systems, and genuine client partnerships rather than fabricated vanity statistics.',
              },
              {
                title: 'Long-Term Partnership',
                desc: 'We operate as an extension of your company, taking ownership of your digital evolution through persistent monthly iteration.',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl border border-white/[0.08] bg-[#0E1017] space-y-3">
                <div className="w-8 h-8 rounded-lg bg-[#6A22F2]/10 border border-[#6A22F2]/30 flex items-center justify-center text-[#8B5CF6] mb-4">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: DIGITAL PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6] mb-2">
            Technology & Products
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
            Practical digital solutions built for growing businesses.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            Alongside marketing services, we develop purpose-built digital products and web solutions that automate operations and expand commercial reach.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.filter(p => p.status === 'published').map((product) => (
            <div
              key={product.id}
              className="rounded-2xl border border-white/[0.08] bg-[#0E1017] p-8 flex flex-col justify-between group hover:border-purple-500/40 transition-all"
            >
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-slate-900 border border-white/10">
                  <img
                    src={getAssetUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1017] via-transparent to-transparent" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-xs font-medium text-purple-400 mb-4">{product.shortTagline}</p>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">{product.description}</p>

                <div className="space-y-2 mb-8">
                  {product.features.slice(0, 4).map((f, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6A22F2] mt-1.5 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <button
                  onClick={() => onNavigate(product.ctaDestination)}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] transition-all cursor-pointer"
                >
                  {product.ctaLabel}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: HOW WE WORK (4-STEP PROCESS) */}
      <section className="border-y border-white/[0.06] bg-white/[0.01] py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <div className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6] mb-2">
              Our Methodology
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 text-balance">
              How We Work
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
              A dependable four-step execution model designed to eliminate ambiguity and deliver consistent results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Understand',
                desc: 'We learn about your business, audience, competitive landscape and tangible commercial goals.',
              },
              {
                step: '02',
                title: 'Plan',
                desc: 'We build the right digital and content strategy with calendar pipelines and production requirements.',
              },
              {
                step: '03',
                title: 'Create',
                desc: 'Our team produces the videos, photography, graphics, campaigns and digital web assets.',
              },
              {
                step: '04',
                title: 'Grow',
                desc: 'We publish, optimize, measure performance and continuously improve reach and lead volume.',
              },
            ].map((stepItem) => (
              <div
                key={stepItem.step}
                className="p-8 rounded-2xl border border-white/[0.08] bg-[#0E1017] flex flex-col justify-between space-y-6"
              >
                <div>
                  <div className="font-mono text-2xl font-extrabold text-purple-400 mb-4">
                    {stepItem.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{stepItem.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{stepItem.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <button
              onClick={() => onNavigate('/contact')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] transition-all shadow-lg shadow-purple-900/30 cursor-pointer"
            >
              Let's Talk About Your Business
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8: SELECTED RESULTS / QUALITATIVE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/[0.08] bg-[#0E1017] p-8 sm:p-14 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
              Execution Over Talk
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              A Digital Team Built Around Execution.
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Top Spark is a Bangladesh-based digital agency focused on helping businesses build stronger digital presence through marketing, content production, technology and execution. We prefer showing our work over talking about ourselves.
            </p>
            <div className="pt-4 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
              <span className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                Studio in Mirpur-1, Dhaka
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                Multidisciplinary Crew
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                B2B & Commercial Focus
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12: FINAL CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 sm:p-16 rounded-3xl border border-white/[0.1] bg-gradient-to-b from-[#131620] to-[#0A0C12] space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#6A22F2]/20 rounded-full blur-[80px] pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight text-balance">
            Have a Business to Grow? Let's Talk.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed text-balance">
            Tell us about your brand, what you're trying to achieve, and where you need support. No high-pressure sales pitches — just honest, actionable advice on what makes sense.
          </p>

          <div className="pt-4 flex items-center justify-center">
            <button
              onClick={() => onNavigate('/contact')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] transition-all shadow-xl shadow-purple-900/40 cursor-pointer"
            >
              Start a Project
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
