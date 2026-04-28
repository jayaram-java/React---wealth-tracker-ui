import StatusBadge from './StatusBadge';
import JsonBlock from './JsonBlock';
import type {
  ServiceDetailsState,
  ServiceHealthSummary,
} from '../types/ServiceHealthDashboardTypes';

interface ServiceCardProps {
  summary: ServiceHealthSummary;
  isExpanded: boolean;
  detailsState: ServiceDetailsState | undefined;
  onToggleDetails: (serviceId: ServiceHealthSummary['id']) => void;
  onRetryHealth: (serviceId: ServiceHealthSummary['id']) => void;
}

const formatTime = (iso: string | null) => {
  if (!iso) {
    return '—';
  }
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const ServiceCard = ({
  summary,
  isExpanded,
  detailsState,
  onToggleDetails,
  onRetryHealth,
}: ServiceCardProps) => {
  return (
    <article className="service-health__card">
      <header className="service-health__card-header">
        <div>
          <h3 className="service-health__card-title">{summary.name}</h3>
          <div className="service-health__card-meta">
            <StatusBadge status={summary.status} />
            <span className="service-health__meta-item">
              Response:{' '}
              {typeof summary.responseTimeMs === 'number'
                ? `${summary.responseTimeMs} ms`
                : '—'}
            </span>
            <span className="service-health__meta-item">
              Last checked: {formatTime(summary.lastCheckedAt)}
            </span>
          </div>
        </div>

        <div className="service-health__card-actions">
          <button
            type="button"
            className="ghost-button"
            onClick={() => onRetryHealth(summary.id)}
          >
            Retry
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => onToggleDetails(summary.id)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Hide Details' : 'View Details'}
          </button>
        </div>
      </header>

      {summary.errorMessage ? (
        <div className="service-health__card-error" role="alert">
          {summary.errorMessage}
        </div>
      ) : null}

      {isExpanded ? (
        <div className="service-health__card-details">
          {detailsState?.isLoading ? (
            <div className="service-health__details-loading">Loading details…</div>
          ) : null}
          {detailsState?.errorMessage ? (
            <div className="service-health__details-error" role="alert">
              {detailsState.errorMessage}
            </div>
          ) : null}

          {detailsState?.details ? (
            <div className="service-health__details-grid">
              {detailsState.details.health ? (
                <JsonBlock title="Health" value={detailsState.details.health} />
              ) : null}
              {detailsState.details.info ? (
                <JsonBlock title="Info" value={detailsState.details.info} />
              ) : null}
              {detailsState.details.metricsIndex ? (
                <JsonBlock
                  title="Metrics Index"
                  value={detailsState.details.metricsIndex}
                />
              ) : null}
              {detailsState.details.customMetrics ? (
                <JsonBlock
                  title="Custom Metrics"
                  value={detailsState.details.customMetrics}
                />
              ) : null}
              {typeof detailsState.details.prometheus === 'string' ? (
                <div className="service-health__json-block">
                  <h4>Prometheus</h4>
                  <pre className="service-health__prometheus">
                    {detailsState.details.prometheus}
                  </pre>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  );
};

export default ServiceCard;

