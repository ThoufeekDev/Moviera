import { Component, type ErrorInfo, type ReactNode } from "react";
import MovieraLogo from "../moviera-logo/MovieraLogo";
import styles from "./ErrorBoundary.module.css";

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
    console.error("Unhandled React error:", error);
    console.error("Component stack:", errorInfo.componentStack);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
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
    const textToCopy = `Moviera Error Report:\nError: ${error?.name || "Unknown"} - ${error?.message || "No message"}\n\nStack:\n${error?.stack || "No stack"}\n\nComponent Stack:\n${errorInfo?.componentStack || "No component stack"}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2500);
    }).catch((err) => {
      console.error("Failed to copy error details:", err);
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, showDetails, copied } = this.state;

      return (
        <div className={styles.errorContainer}>
          {/* Animated Background Lights & Film Grid */}
          <div className={styles.bgGlow1} />
          <div className={styles.bgGlow2} />
          <div className={styles.filmGridOverlay} />

          <div className={styles.contentWrapper}>
            {/* Moviera Brand Header */}
            <div className={styles.brandHeader}>
              <MovieraLogo size="md" showText={true} subtitle="Cinema Engine" />
              <div className={styles.errorBadge}>
                <span className={styles.badgeDot} />
                <span>SCENE INTERRUPTED • 500</span>
              </div>
            </div>

            {/* Main Error Glass Card */}
            <div className={styles.errorCard}>
              {/* Cinematic Animated Film Reel Emblem */}
              <div className={styles.emblemContainer}>
                <div className={styles.reelGlowRing} />
                <div className={styles.reelIllustration}>
                  <svg
                    className={styles.reelSvg}
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Outer Reel Frame */}
                    <circle cx="60" cy="60" r="52" stroke="#f84464" strokeWidth="4" strokeDasharray="8 4" className={styles.spinningOuterReel} />
                    <circle cx="60" cy="60" r="44" stroke="rgba(248, 68, 100, 0.3)" strokeWidth="2" />

                    {/* Inner Spokes */}
                    <g className={styles.spinningSpokes}>
                      <circle cx="60" cy="32" r="10" fill="#f84464" fillOpacity="0.15" stroke="#f84464" strokeWidth="2" />
                      <circle cx="60" cy="88" r="10" fill="#f84464" fillOpacity="0.15" stroke="#f84464" strokeWidth="2" />
                      <circle cx="32" cy="60" r="10" fill="#f84464" fillOpacity="0.15" stroke="#f84464" strokeWidth="2" />
                      <circle cx="88" cy="60" r="10" fill="#f84464" fillOpacity="0.15" stroke="#f84464" strokeWidth="2" />
                      <path d="M60 20 L60 100 M20 60 L100 60" stroke="#f84464" strokeWidth="1.5" strokeOpacity="0.4" />
                    </g>

                    {/* Center Core with Warning Badge */}
                    <circle cx="60" cy="60" r="18" fill="#111524" stroke="#f84464" strokeWidth="3" />

                    {/* Exclamation Warning Mark */}
                    <path d="M60 48 V64 M60 72 H60.01" stroke="#f84464" strokeWidth="3.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Floating ambient particles */}
                <div className={styles.sparkle1} />
                <div className={styles.sparkle2} />
              </div>

              {/* Error Information */}
              <div className={styles.textContent}>
                <h1 className={styles.title}>Cut! We Hit an Unexpected Snag</h1>
                <p className={styles.description}>
                  The reel encountered a sudden technical glitch while executing this scene. 
                  Don&apos;t worry, your session data and cinema preferences are safe.
                </p>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionGroup}>
                <button
                  type="button"
                  onClick={this.handleReload}
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.btnIcon}>
                    <path d="M21.5 2v6h-6M2.5 22v-6h6" />
                    <path d="M21.5 12a9 9 0 0 1-15.55 6.36L2.5 16M2.5 12a9 9 0 0 1 15.55-6.36L21.5 8" />
                  </svg>
                  <span>Reload Scene</span>
                </button>

                <button
                  type="button"
                  onClick={this.handleReset}
                  className={`${styles.btn} ${styles.btnSecondary}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={styles.btnIcon}>
                    <path d="M1 4v6h6" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  <span>Try Again</span>
                </button>

                <button
                  type="button"
                  onClick={this.handleGoHome}
                  className={`${styles.btn} ${styles.btnOutline}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.btnIcon}>
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>Back to Home</span>
                </button>
              </div>

              {/* Technical Details Accordion */}
              <div className={styles.detailsContainer}>
                <button
                  type="button"
                  className={styles.detailsToggle}
                  onClick={this.toggleDetails}
                  aria-expanded={showDetails}
                >
                  <span className={styles.detailsToggleLabel}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                    <span>Technical Details</span>
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`${styles.chevronIcon} ${showDetails ? styles.chevronOpen : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {showDetails && (
                  <div className={styles.detailsBody}>
                    <div className={styles.detailsHeader}>
                      <span className={styles.errorType}>
                        {error?.name || "Error"}: {error?.message || "An unhandled exception occurred"}
                      </span>
                      <button
                        type="button"
                        onClick={this.handleCopyError}
                        className={styles.copyBtn}
                        title="Copy diagnostic logs"
                      >
                        {copied ? (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span style={{ color: "#22c55e" }}>Copied!</span>
                          </>
                        ) : (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            <span>Copy Log</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className={styles.stackTrace}>
                      {error?.stack || "No error stack trace available."}
                      {errorInfo?.componentStack && (
                        <>
                          {"\n\nComponent Stack:\n"}
                          {errorInfo.componentStack}
                        </>
                      )}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Brand Note */}
            <div className={styles.footerNote}>
              <span>Powered by Moviera Cinema Engine</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;