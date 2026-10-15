import React from 'react';
import './ApiLoader.css';
import { useApiLoader } from './useApiLoader';

export interface ApiLoaderProps {
  /** Optional custom text. Defaults to 'Loading...' */
  label?: string;
}

/**
 * Clean, lightweight global API loader overlay for WealthTracker.
 * Features a simple circular spinner with #00a67e accent, small loading text,
 * and smooth fade in/out transitions.
 */
export const ApiLoader: React.FC<ApiLoaderProps> = ({
  label = 'Loading...',
}) => {
  const { isLoading, activeCount } = useApiLoader();
  const [visible, setVisible] = React.useState(false);

  const shownTimestampRef = React.useRef<number | null>(null);
  const showTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    // If loading is active
    if (isLoading) {
      // Clear any pending hide timer since we are loading again
      if (hideTimerRef.current !== null) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }

      // If already visible, maintain visibility
      if (visible) {
        return;
      }

      // If not yet visible and not already scheduled to show, schedule show after ~300ms
      if (showTimerRef.current === null) {
        showTimerRef.current = setTimeout(() => {
          showTimerRef.current = null;
          shownTimestampRef.current = Date.now();
          setVisible(true);
        }, 300);
      }
    } else {
      // Loading finished
      // 1. If showTimer is pending, loading finished before 300ms -> cancel it
      if (showTimerRef.current !== null) {
        clearTimeout(showTimerRef.current);
        showTimerRef.current = null;
      }

      // 2. If it is currently visible, ensure it remains visible for at least ~400ms
      if (visible) {
        const timeShown = shownTimestampRef.current ? Date.now() - shownTimestampRef.current : 400;
        const remainingTime = Math.max(0, 400 - timeShown);

        if (hideTimerRef.current !== null) {
          clearTimeout(hideTimerRef.current);
        }

        hideTimerRef.current = setTimeout(() => {
          hideTimerRef.current = null;
          shownTimestampRef.current = null;
          setVisible(false);
        }, remainingTime);
      }
    }

    return () => {
      // Do not leave timers running on unmount
    };
  }, [isLoading, visible]);

  // Clean up all timers on unmount
  React.useEffect(() => {
    return () => {
      if (showTimerRef.current !== null) {
        clearTimeout(showTimerRef.current);
      }
      if (hideTimerRef.current !== null) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  if (!visible && activeCount === 0) {
    return null;
  }

  return (
    <div
      className={`wt-api-loader-overlay ${visible ? 'active' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy={visible}
      aria-label="API loading indicator"
    >
      <div className="wt-api-loader-box">
        <div className="wt-api-loader-spinner" aria-hidden="true" />
        {label && <span className="wt-api-loader-text">{label}</span>}
      </div>
    </div>
  );
};

export default ApiLoader;
