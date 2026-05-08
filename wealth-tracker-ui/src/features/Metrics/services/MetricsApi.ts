import { getRequest } from '../../../serviceconfigs/AxiosAPI';
import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import type {
  ActuatorHealthResponse,
  ActuatorInfoResponse,
  ActuatorMetricResponse,
  ActuatorMetricsIndexResponse,
  ServiceKey,
} from '../types/MetricsTypes';

type ServiceConfig = {
  baseUrl: string;
  health: string;
  prometheus: string;
  info?: string;
  metricsIndex?: string;
};

const serviceConfig = (service: ServiceKey): ServiceConfig => {
  if (service === 'authService') {
    const cfg = API_ENDPOINTS.actuator.authService;
    return {
      baseUrl: cfg.baseUrl,
      health: cfg.health,
      prometheus: cfg.prometheus,
      info: cfg.info,
      metricsIndex: cfg.metricsIndex,
    };
  }
  const cfg = API_ENDPOINTS.actuator.spendwiseService;
  return { baseUrl: cfg.baseUrl, health: cfg.health, prometheus: cfg.prometheus };
};

export const MetricsApi = {
  async health(service: ServiceKey, headers?: Record<string, string>) {
    const cfg = serviceConfig(service);
    return getRequest<ActuatorHealthResponse>(cfg.health, { headers });
  },

  async info(service: ServiceKey, headers?: Record<string, string>) {
    const cfg = serviceConfig(service);
    if (!cfg.info) {
      return {} as ActuatorInfoResponse;
    }
    return getRequest<ActuatorInfoResponse>(cfg.info, { headers });
  },

  async metricsIndex(service: ServiceKey, headers?: Record<string, string>) {
    const cfg = serviceConfig(service);
    if (!cfg.metricsIndex) {
      return { names: [] } as ActuatorMetricsIndexResponse;
    }
    return getRequest<ActuatorMetricsIndexResponse>(cfg.metricsIndex, { headers });
  },

  async metric(service: ServiceKey, metricName: string, headers?: Record<string, string>) {
    const cfg = serviceConfig(service);
    const url = `${cfg.baseUrl}/actuator/metrics/${encodeURIComponent(metricName)}`;
    return getRequest<ActuatorMetricResponse>(url, { headers });
  },

  async prometheusText(service: ServiceKey, headers?: Record<string, string>) {
    const cfg = serviceConfig(service);
    const response = await fetch(cfg.prometheus, {
      method: 'GET',
      headers: {
        ...(headers ?? {}),
      },
    });
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(text || `Prometheus scrape failed (${response.status}).`);
    }
    return response.text();
  },
};
