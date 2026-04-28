import type { ServiceHealthStatus } from '../types/ServiceHealthDashboardTypes';

interface StatusBadgeProps {
  status: ServiceHealthStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span className={`service-health__status service-health__status--${status}`}>
      {status}
    </span>
  );
};

export default StatusBadge;

