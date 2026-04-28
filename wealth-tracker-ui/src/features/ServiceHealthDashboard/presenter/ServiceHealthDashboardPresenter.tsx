import Header from '../../../components/Header';
import ServiceCard from '../components/ServiceCard';
import type {
  ServiceDetailsState,
  ServiceHealthSummary,
} from '../types/ServiceHealthDashboardTypes';
import '../styles/ServiceHealthDashboard.css';

interface ServiceHealthDashboardPresenterProps {
  services: ServiceHealthSummary[];
  detailsById: Partial<Record<ServiceHealthSummary['id'], ServiceDetailsState>>;
  expandedIds: Set<ServiceHealthSummary['id']>;
  isLoading: boolean;
  errorMessage: string | null;
  onRefresh: () => void;
  onLogout: () => void;
  onToggleDetails: (serviceId: ServiceHealthSummary['id']) => void;
  onRetryServiceHealth: (serviceId: ServiceHealthSummary['id']) => void;
}

const ServiceHealthDashboardPresenter = ({
  services,
  detailsById,
  expandedIds,
  isLoading,
  errorMessage,
  onRefresh,
  onLogout,
  onToggleDetails,
  onRetryServiceHealth,
}: ServiceHealthDashboardPresenterProps) => {
  return (
    <div className="service-health">
      <Header onLogout={onLogout} />

      <section className="service-health__hero">
        <div>
          <p className="service-health__eyebrow">Admin Tools</p>
          <h1>Service Health Dashboard</h1>
          <p className="service-health__subtitle">
            Monitor actuator health, custom metrics, and Prometheus exports across
            services.
          </p>
        </div>
        <button className="ghost-button" onClick={onRefresh} disabled={isLoading}>
          {isLoading ? 'Refreshing…' : 'Refresh'}
        </button>
      </section>

      {errorMessage ? (
        <div className="service-health__banner" role="alert">
          {errorMessage}
        </div>
      ) : null}

      <section className="service-health__list" aria-busy={isLoading}>
        {services.length === 0 ? (
          <div className="service-health__empty">
            No services configured for monitoring.
          </div>
        ) : (
          services.map((service) => (
            <ServiceCard
              key={service.id}
              summary={service}
              isExpanded={expandedIds.has(service.id)}
              detailsState={detailsById[service.id]}
              onToggleDetails={onToggleDetails}
              onRetryHealth={onRetryServiceHealth}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default ServiceHealthDashboardPresenter;
