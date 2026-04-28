export type ServiceHealthStatus = 'UP' | 'DOWN' | 'DEGRADED' | 'UNKNOWN';

export interface MonitoredService {
  id: 'auth' | 'spendwise' | 'reportAutomation';
  name: string;
  baseUrl: string;
  endpoints: {
    health: string;
    info?: string;
    metricsIndex?: string;
    prometheus: string;
    customMetrics?: {
      apiRequestsTotal: string;
      apiRequestDuration: string;
    };
  };
}

export interface ServiceHealthSummary {
  id: MonitoredService['id'];
  name: string;
  status: ServiceHealthStatus;
  responseTimeMs: number | null;
  lastCheckedAt: string | null;
  errorMessage?: string | null;
}

export interface MetricResponse {
  name?: string;
  description?: string;
  baseUnit?: string;
  measurements?: Array<{ statistic: string; value: number }>;
  availableTags?: Array<{ tag: string; values: string[] }>;
}

export interface MetricsIndexResponse {
  names: string[];
}

export interface ServiceHealthDetails {
  health?: unknown;
  info?: unknown;
  metricsIndex?: MetricsIndexResponse;
  customMetrics?: {
    app_api_requests_total?: MetricResponse;
    app_api_request_duration?: MetricResponse;
  };
  prometheus?: string;
  lastFetchedAt?: string;
}

export interface ServiceDetailsState {
  isLoading: boolean;
  errorMessage: string | null;
  details: ServiceHealthDetails | null;
}
