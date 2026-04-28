import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../login/context/useAuth';
import ServiceHealthDashboardPresenter from '../presenter/ServiceHealthDashboardPresenter';
import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import type {
  MonitoredService,
  ServiceDetailsState,
  ServiceHealthSummary,
} from '../types/ServiceHealthDashboardTypes';
import { getServiceDetails, getServiceSummary } from '../services/serviceHealthApi';

const POLL_INTERVAL_MS = 30_000;

const monitoredServices: MonitoredService[] = [
  {
    id: 'auth',
    name: 'Auth Service',
    baseUrl: '',
    endpoints: {
      health: API_ENDPOINTS.actuator.authService.health,
      info: API_ENDPOINTS.actuator.authService.info,
      metricsIndex: API_ENDPOINTS.actuator.authService.metricsIndex,
      prometheus: API_ENDPOINTS.actuator.authService.prometheus,
      customMetrics: {
        apiRequestsTotal: API_ENDPOINTS.actuator.authService.customMetrics.apiRequestsTotal,
        apiRequestDuration: API_ENDPOINTS.actuator.authService.customMetrics.apiRequestDuration,
      },
    },
  },
  {
    id: 'spendwise',
    name: 'Spendwise Service',
    baseUrl: '',
    endpoints: {
      health: API_ENDPOINTS.actuator.spendwiseService.health,
      prometheus: API_ENDPOINTS.actuator.spendwiseService.prometheus,
      customMetrics: {
        apiRequestsTotal:
          API_ENDPOINTS.actuator.spendwiseService.customMetrics.apiRequestsTotal,
        apiRequestDuration:
          API_ENDPOINTS.actuator.spendwiseService.customMetrics.apiRequestDuration,
      },
    },
  },
  {
    id: 'reportAutomation',
    name: 'Report Automation Service',
    baseUrl: '',
    endpoints: {
      health: API_ENDPOINTS.actuator.reportAutomationService.health,
      prometheus: API_ENDPOINTS.actuator.reportAutomationService.prometheus,
      customMetrics: {
        apiRequestsTotal:
          API_ENDPOINTS.actuator.reportAutomationService.customMetrics.apiRequestsTotal,
        apiRequestDuration:
          API_ENDPOINTS.actuator.reportAutomationService.customMetrics.apiRequestDuration,
      },
    },
  },
];

const initDetailsState = (): ServiceDetailsState => ({
  isLoading: false,
  errorMessage: null,
  details: null,
});

const ServiceHealthDashboardContainer = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();

  const [services, setServices] = useState<ServiceHealthSummary[]>([]);
  const [detailsById, setDetailsById] = useState<
    Partial<Record<ServiceHealthSummary['id'], ServiceDetailsState>>
  >({});
  const [expandedIds, setExpandedIds] = useState<
    Set<ServiceHealthSummary['id']>
  >(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pollTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
    }
  }, [accessToken, navigate]);

  const serviceIndex = useMemo(() => {
    return monitoredServices.reduce<Record<string, MonitoredService>>((acc, svc) => {
      acc[svc.id] = svc;
      return acc;
    }, {});
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const summaries = await Promise.all(
        monitoredServices.map((svc) => getServiceSummary(svc))
      );
      setServices(summaries);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to refresh services.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshOne = useCallback(
    async (serviceId: ServiceHealthSummary['id']) => {
      const svc = serviceIndex[serviceId];
      if (!svc) {
        return;
      }
      const summary = await getServiceSummary(svc);
      setServices((prev) => {
        const next = prev.length ? [...prev] : monitoredServices.map((s) => ({
          id: s.id,
          name: s.name,
          status: 'UNKNOWN' as const,
          responseTimeMs: null,
          lastCheckedAt: null,
          errorMessage: null,
        }));
        const idx = next.findIndex((item) => item.id === serviceId);
        if (idx >= 0) {
          next[idx] = summary;
          return next;
        }
        return [...next, summary];
      });
    },
    [serviceIndex]
  );

  const loadDetails = useCallback(
    async (serviceId: ServiceHealthSummary['id']) => {
      const svc = serviceIndex[serviceId];
      if (!svc) {
        return;
      }

      setDetailsById((prev) => ({
        ...prev,
        [serviceId]: { ...(prev[serviceId] ?? initDetailsState()), isLoading: true, errorMessage: null },
      }));

      try {
        const details = await getServiceDetails(svc);
        setDetailsById((prev) => ({
          ...prev,
          [serviceId]: { isLoading: false, errorMessage: null, details },
        }));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unable to load details.';
        setDetailsById((prev) => ({
          ...prev,
          [serviceId]: { isLoading: false, errorMessage: message, details: prev[serviceId]?.details ?? null },
        }));
      }
    },
    [serviceIndex]
  );

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  useEffect(() => {
    pollTimerRef.current = window.setInterval(() => {
      refreshAll();
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollTimerRef.current) {
        window.clearInterval(pollTimerRef.current);
      }
    };
  }, [refreshAll]);

  const handleToggleDetails = (serviceId: ServiceHealthSummary['id']) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(serviceId)) {
        next.delete(serviceId);
      } else {
        next.add(serviceId);
      }
      return next;
    });

    const existing = detailsById[serviceId]?.details;
    if (!existing) {
      loadDetails(serviceId);
    }
  };

  const handleRefresh = () => {
    refreshAll();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <ServiceHealthDashboardPresenter
      services={services}
      detailsById={detailsById}
      expandedIds={expandedIds}
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRefresh={handleRefresh}
      onLogout={handleLogout}
      onToggleDetails={handleToggleDetails}
      onRetryServiceHealth={refreshOne}
    />
  );
};

export default ServiceHealthDashboardContainer;
