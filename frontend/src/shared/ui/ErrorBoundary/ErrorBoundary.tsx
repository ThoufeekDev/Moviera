import { Component, type ErrorInfo, type ReactNode } from 'react';
import MovieraLogo from '@/shared/ui/MovieraLogo/MovieraLogo';
import { Button } from '@/shared/ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
  copied: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
    copied: false,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Unhandled React error:', error);
    console.error('Component stack:', errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    });
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  handleCopyError = () => {
    const { error, errorInfo } = this.state;
    const textToCopy = `Moviera Error Report:\nError: ${error?.name || 'Unknown'} - ${error?.message || 'No message'}\n\nStack:\n${error?.stack || 'No stack'}\n\nComponent Stack:\n${errorInfo?.componentStack || 'No component stack'}`;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2500);
      })
      .catch((err) => {
        console.error('Failed to copy error details:', err);
      });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, showDetails, copied } = this.state;

      return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-page px-4 py-8 font-sans text-ink selection:bg-brand-600 selection:text-white">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full bg-brand-600/10 blur-[100px]" />

          <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
            {/* Moviera Brand Header */}
            <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between w-full px-2">
              <MovieraLogo size="md" showText={true} subtitle="Theatre Engine" />
              <div className="inline-flex items-center gap-2 rounded-full border border-danger-600/30 bg-danger-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-danger-600">
                <span className="h-2 w-2 rounded-full bg-danger-600 animate-pulse" aria-hidden="true" />
                <span>SCENE INTERRUPTED • 500</span>
              </div>
            </div>

            {/* Main Error Card */}
            <div className="w-full rounded-lg border border-border bg-surface p-6 shadow-float sm:p-10">
              {/* Theatretic Animated Film Reel Emblem */}
              <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-brand-500/20 blur-xl animate-pulse" />
                <svg
                  className="relative h-20 w-20 animate-spin-slow"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle cx="60" cy="60" r="52" stroke="var(--color-brand-600)" strokeWidth="4" strokeDasharray="8 4" />
                  <circle cx="60" cy="60" r="44" stroke="rgba(217, 48, 79, 0.3)" strokeWidth="2" />
                  <g>
                    <circle cx="60" cy="32" r="10" fill="var(--color-brand-600)" fillOpacity="0.15" stroke="var(--color-brand-600)" strokeWidth="2" />
                    <circle cx="60" cy="88" r="10" fill="var(--color-brand-600)" fillOpacity="0.15" stroke="var(--color-brand-600)" strokeWidth="2" />
                    <circle cx="32" cy="60" r="10" fill="var(--color-brand-600)" fillOpacity="0.15" stroke="var(--color-brand-600)" strokeWidth="2" />
                    <circle cx="88" cy="60" r="10" fill="var(--color-brand-600)" fillOpacity="0.15" stroke="var(--color-brand-600)" strokeWidth="2" />
                    <path d="M60 20 L60 100 M20 60 L100 60" stroke="var(--color-brand-600)" strokeWidth="1.5" strokeOpacity="0.4" />
                  </g>
                  <circle cx="60" cy="60" r="18" fill="var(--color-surface)" stroke="var(--color-brand-600)" strokeWidth="3" />
                  <path d="M60 48 V64 M60 72 H60.01" stroke="var(--color-brand-600)" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Error Information */}
              <div className="text-center">
                <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                  Cut! We Hit an Unexpected Snag
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  The reel encountered a sudden technical glitch while executing this scene. Don&apos;t worry, your session data and theatre preferences are safe.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button variant="primary" size="md" onClick={this.handleReload} className="gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6" />
                    <path d="M21.5 12a9 9 0 0 1-15.55 6.36L2.5 16M2.5 12a9 9 0 0 1 15.55-6.36L21.5 8" />
                  </svg>
                  <span>Reload Scene</span>
                </Button>

                <Button variant="secondary" size="md" onClick={this.handleReset} className="gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1 4v6h6" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  <span>Try Again</span>
                </Button>

                <Button variant="ghost" size="md" onClick={this.handleGoHome} className="gap-2 text-ink-muted hover:text-ink">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>Back to Home</span>
                </Button>
              </div>

              {/* Technical Details Accordion */}
              <div className="mt-8 border-t border-border pt-6">
                <button
                  type="button"
                  className="flex min-h-[44px] w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 rounded-md px-1"
                  onClick={this.toggleDetails}
                  aria-expanded={showDetails}
                >
                  <span className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                    <span>Technical Details</span>
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className={`transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {showDetails && (
                  <div className="mt-4 rounded-md border border-border bg-surface-muted p-4 font-mono text-xs">
                    <div className="mb-3 flex items-center justify-between gap-4 border-b border-border pb-2">
                      <span className="font-semibold text-danger-600 truncate">
                        {error?.name || 'Error'}: {error?.message || 'An unhandled exception occurred'}
                      </span>
                      <button
                        type="button"
                        onClick={this.handleCopyError}
                        className="inline-flex min-h-[36px] shrink-0 items-center gap-1 rounded-md px-2 text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
                        title="Copy diagnostic logs"
                      >
                        {copied ? (
                          <span className="text-success-700 font-medium">Copied!</span>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            <span>Copy Log</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="max-h-60 overflow-auto whitespace-pre-wrap text-[11px] leading-relaxed text-ink-muted">
                      {error?.stack || 'No error stack trace available.'}
                      {errorInfo?.componentStack && (
                        <>
                          {'\n\nComponent Stack:\n'}
                          {errorInfo.componentStack}
                        </>
                      )}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Brand Note */}
            <div className="mt-6 text-xs text-ink-muted">
              <span>Powered by Moviera Theatre Engine</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
