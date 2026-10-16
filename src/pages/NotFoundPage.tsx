import React from 'react';
import { ArrowLeft, Home, Compass } from 'lucide-react';
import { TopSparkLogo } from '../components/TopSparkLogo';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md space-y-6">
        <TopSparkLogo size="lg" className="mx-auto" />

        <div className="space-y-2">
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-purple-400">
            Error 404
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The page you are looking for does not exist or has been relocated within the Top Spark Digital directory.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Return Home
          </button>
          <button
            onClick={() => onNavigate('/services')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            Explore Services
          </button>
        </div>
      </div>
    </div>
  );
};
