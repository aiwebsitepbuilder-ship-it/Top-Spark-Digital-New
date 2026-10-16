import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { ContentDatabase } from '../types';
import { getAssetUrl } from '../utils/assetUrl';

interface ProductsPageProps {
  data: ContentDatabase;
  onNavigate: (path: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ data, onNavigate }) => {
  const products = data?.products || [];
  const publishedProducts = products.filter((p) => p && p.status === 'published');

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
          Digital Solutions & Tools
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          Practical Digital Solutions Built for Growing Businesses.
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          Beyond marketing services, Top Spark engineers specialized digital software tools and web architectures engineered to solve specific operational and commercial challenges in Bangladesh.
        </p>
      </div>

      {/* Products Showcase */}
      <div className="space-y-16">
        {publishedProducts.map((product, idx) => (
          <div
            key={product.id}
            className="rounded-3xl border border-white/[0.08] bg-[#0E1017] p-8 sm:p-14 shadow-2xl space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Product Visual Mockup (Cols 1-6) */}
              <div className={`lg:col-span-6 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="rounded-2xl border border-white/10 bg-slate-900 overflow-hidden shadow-2xl aspect-video relative group">
                  <img
                    src={getAssetUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              </div>

              {/* Product Details (Cols 7-12) */}
              <div className={`lg:col-span-6 space-y-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                    Product Solution
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {product.name}
                  </h2>
                  <p className="text-sm font-medium text-slate-300">
                    {product.shortTagline}
                  </p>
                </div>

                <p className="text-base text-slate-300 leading-relaxed">
                  {product.description}
                </p>

                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Core Capabilities & Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {product.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => onNavigate(product.ctaDestination)}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] transition-all shadow-md shadow-purple-900/30 cursor-pointer"
                  >
                    {product.ctaLabel}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Need custom digital software? */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#131620] p-8 sm:p-12 text-center space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Need a Custom Digital Product or Integration?
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          From custom booking workflows and client portals to automated communication pipelines, we architect software tailored to your company's workflow.
        </p>
        <button
          onClick={() => onNavigate('/contact?service=Digital%20Product')}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] transition-all cursor-pointer"
        >
          Discuss Custom Solution
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
