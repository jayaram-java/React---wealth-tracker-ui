import type {
  MetricResponse,
  MetricsIndexResponse,
  MonitoredService,
  ServiceHealthDetails,
  ServiceHealthStatus,
  ServiceHealthSummary,
} from '../types/ServiceHealthDashboardTypes';

const joinUrl = (baseUrl: string, path: string) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};

const nowMs = () => {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
};

export class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

const fetchWithTimeout = async (
  url: string,
  init: RequestInit,
  timeoutMs: number
) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
};

const parseJsonOrText = async (response: Response) => {
  const raw = await response.text();
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object';

export const timedGetJson = async <T,>(
  url: string,
  options?: { timeoutMs?: number }
): Promise<{ data: T; durationMs: number }> => {
  const start = nowMs();
  const response = await fetchWithTimeout(
    url,
    { method: 'GET', headers: { Accept: 'application/json' } },
    options?.timeoutMs ?? 8000
  );
  const durationMs = Math.round(nowMs() - start);
  const data = (await parseJsonOrText(response)) as T;

  if (!response.ok) {
    const message = isRecord(data) && typeof data.message === 'string' && data.message
      ? data.message
      : `Request failed (${response.status})`;
    throw new HttpError(message, response.status);
  }

  return { data, durationMs };
};

export const getText = async (
  url: string,
  options?: { timeoutMs?: number }
): Promise<string> => {
  const response = await fetchWithTimeout(
    url,
    { method: 'GET', headers: { Accept: 'text/plain,*/*' } },
    options?.timeoutMs ?? 12000
  );
  const raw = await response.text();
  if (!response.ok) {
    throw new HttpError(raw || `Request failed (${response.status})`, response.status);
  }
  return raw;
};

export const deriveHealthStatus = (healthPayload: unknown): ServiceHealthStatus => {
  if (!isRecord(healthPayload)) {
    return 'UNKNOWN';
  }
  const status = healthPayload.status;
  if (typeof status !== 'string' || !status) {
    return 'UNKNOWN';
  }
  if (status === 'UP') {
    return 'UP';
  }
  if (status === 'DOWN') {
    return 'DOWN';
  }
  return 'DEGRADED';
};

export const getServiceSummary = async (
  service: MonitoredService
): Promise<ServiceHealthSummary> => {
  const healthUrl = joinUrl(service.baseUrl, service.endpoints.health);

  try {
    const { data, durationMs } = await timedGetJson<unknown>(healthUrl, {
      timeoutMs: 6000,
    });

    return {
      id: service.id,
      name: service.name,
      status: deriveHealthStatus(data),
      responseTimeMs: durationMs,
      lastCheckedAt: new Date().toISOString(),
      errorMessage: null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load health.';
    return {
      id: service.id,
      name: service.name,
      status: 'DOWN',
      responseTimeMs: null,
      lastCheckedAt: new Date().toISOString(),
      errorMessage: message,
    };
  }
};

export const getServiceDetails = async (
  service: MonitoredService
): Promise<ServiceHealthDetails> => {
  const healthUrl = joinUrl(service.baseUrl, service.endpoints.health);
  const infoUrl = service.endpoints.info
    ? joinUrl(service.baseUrl, service.endpoints.info)
    : null;
  const metricsIndexUrl = service.endpoints.metricsIndex
    ? joinUrl(service.baseUrl, service.endpoints.metricsIndex)
    : null;
  const prometheusUrl = joinUrl(service.baseUrl, service.endpoints.prometheus);

  const customTotalUrl = service.endpoints.customMetrics?.apiRequestsTotal
    ? joinUrl(service.baseUrl, service.endpoints.customMetrics.apiRequestsTotal)
    : null;
  const customDurationUrl = service.endpoints.customMetrics?.apiRequestDuration
    ? joinUrl(service.baseUrl, service.endpoints.customMetrics.apiRequestDuration)
    : null;

  const [health, info, metricsIndex, totalMetric, durationMetric, prometheus] =
    await Promise.all([
      timedGetJson<unknown>(healthUrl).then((result) => result.data),
      infoUrl ? timedGetJson<unknown>(infoUrl).then((result) => result.data) : null,
      metricsIndexUrl
        ? timedGetJson<MetricsIndexResponse>(metricsIndexUrl).then(
            (result) => result.data
          )
        : null,
      customTotalUrl
        ? timedGetJson<MetricResponse>(customTotalUrl).then((result) => result.data)
        : null,
      customDurationUrl
        ? timedGetJson<MetricResponse>(customDurationUrl).then(
            (result) => result.data
          )
        : null,
      getText(prometheusUrl),
    ]);

  const details: ServiceHealthDetails = {
    health: health ?? undefined,
    info: info ?? undefined,
    metricsIndex: (metricsIndex ?? undefined) as MetricsIndexResponse | undefined,
    customMetrics:
      totalMetric || durationMetric
        ? {
            ...(totalMetric ? { app_api_requests_total: totalMetric } : {}),
            ...(durationMetric ? { app_api_request_duration: durationMetric } : {}),
          }
        : undefined,
    prometheus,
    lastFetchedAt: new Date().toISOString(),
  };

  return details;
};
