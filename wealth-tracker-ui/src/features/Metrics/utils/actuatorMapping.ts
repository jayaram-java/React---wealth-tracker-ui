import type { ActuatorMetricResponse } from '../types/MetricsTypes';

export const metricValueFromActuator = (metric: ActuatorMetricResponse | null | undefined) => {
  const measurements = metric?.measurements ?? [];
  const preferred =
    measurements.find((m) => String(m.statistic).toUpperCase() === 'VALUE') ??
    measurements.find((m) => String(m.statistic).toUpperCase() === 'TOTAL') ??
    measurements[0];
  return typeof preferred?.value === 'number' && Number.isFinite(preferred.value)
    ? preferred.value
    : null;
};

