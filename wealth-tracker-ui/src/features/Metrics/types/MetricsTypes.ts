export type ServiceKey = 'authService' | 'spendwiseService';

export interface ActuatorHealthResponse {
  status?: string;
  components?: Record<string, unknown>;
}

export interface ActuatorInfoResponse {
  [key: string]: unknown;
}

export interface ActuatorMetricsIndexResponse {
  names?: string[];
}

export interface ActuatorMetricResponse {
  name: string;
  measurements?: Array<{ statistic?: string; value?: number }>;
  availableTags?: Array<{ tag: string; values: string[] }>;
}

export interface UsageMetric {
  percent: number | null;
  detail?: string;
}

export interface MetricsSummary {
  cpu: UsageMetric;
  memory: UsageMetric;
  disk: UsageMetric;
}

export interface MetricsTableRow {
  name: string;
  cpuMean: number | null;
  cpuPercent: number | null;
  diskMean: number | null;
  diskPercent: number | null;
  memoryMean: number | null;
  memoryPercent: number | null;
}

export interface MetricsAverages {
  cpuAvg: number | null;
  memoryAvg: number | null;
  diskAvg: number | null;
}
