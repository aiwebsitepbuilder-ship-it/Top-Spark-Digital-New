import React, { Component, ErrorInfo, ReactNode } from 'react';
import { TopSparkLogo } from './TopSparkLogo';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('[Top Spark Digital] Fatal React Render Error Caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-[#6A22F2] selection:text-white">
          <div className="max-w-md w-full bg-[#0E1017] border border-white/[0.08] rounded-2xl p-6 sm:p-8 text-center shadow-2xl space-y-6">
            {/* Brand Logo */}
            <div className="flex justify-center">
              <TopSparkLogo size="md" />
            </div>

            {/* Error Icon */}
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            {/* Explanatory Copy */}
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Rendering Issue Encountered
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                The application encountered an unexpected display error. Reloading the page or returning home usually resolves this immediately.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-[#6A22F2] hover:bg-[#591bd4] transition-all shadow-md shadow-purple-900/30 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] transition-all cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                Go to Home
              </button>
            </div>

            {/* Developer Diagnostic Collapsible */}
            {this.state.error && (
              <details className="text-left pt-4 border-t border-white/[0.06] text-xs text-slate-500">
                <summary className="cursor-pointer hover:text-slate-400 font-mono text-[11px]">
                  Technical Details (Click to inspect)
                </summary>
                <div className="mt-2 p-3 bg-black/40 rounded-lg overflow-x-auto text-red-300 font-mono text-[10px] space-y-1">
                  <div><strong>Error:</strong> {this.state.error.message}</div>
                  {this.state.error.stack && (
                    <pre className="text-slate-400 whitespace-pre-wrap text-[9px] mt-1">
                      {this.state.error.stack}
                    </pre>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
