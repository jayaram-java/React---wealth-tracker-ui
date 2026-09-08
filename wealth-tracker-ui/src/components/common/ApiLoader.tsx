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

  if (!isLoading && activeCount === 0) {
    return null;
  }

  return (
    <div
      className={`wt-api-loader-overlay ${isLoading ? 'active' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy={isLoading}
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
