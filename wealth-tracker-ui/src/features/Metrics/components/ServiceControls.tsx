import type { ServiceKey } from '../types/MetricsTypes';

interface ServiceControlsProps {
  service: ServiceKey;
  onServiceChange: (service: ServiceKey) => void;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  onRefreshNow: () => void;
}

const ServiceControls = ({
  service,
  onServiceChange,
  autoRefresh,
  onToggleAutoRefresh,
  onRefreshNow,
}: ServiceControlsProps) => {
  return (
    <div className="metricsControls">
      <label className="metricsControl">
        <span className="metricsMuted">Service</span>
        <select
          className="metricsSelect"
          value={service}
          onChange={(e) => onServiceChange(e.target.value as ServiceKey)}
        >
          <option value="authService">Auth Service</option>
          <option value="spendwiseService">Spendwise Service</option>
        </select>
      </label>

      <button className="metricsButton" type="button" onClick={onRefreshNow}>
        Refresh
      </button>

      <label className="metricsToggle">
        <input type="checkbox" checked={autoRefresh} onChange={onToggleAutoRefresh} />
        <span>Auto-refresh</span>
      </label>
    </div>
  );
};

export default ServiceControls;

