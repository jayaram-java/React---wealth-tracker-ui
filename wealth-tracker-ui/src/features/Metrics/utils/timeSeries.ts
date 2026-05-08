import { nowMs } from './metricsHelpers';

export interface TimePoint {
  ts: number;
  value: number;
}

export interface Series {
  key: string;
  label: string;
  points: TimePoint[];
}

export const prunePoints = (points: TimePoint[], maxAgeMs: number, now: number) =>
  points.filter((p) => p.ts >= now - maxAgeMs);

export const upsertSeriesPoint = (
  seriesList: Series[],
  seriesKey: string,
  seriesLabel: string,
  point: TimePoint,
  maxAgeMs: number
) => {
  const now = nowMs();
  const next = [...seriesList];
  const idx = next.findIndex((s) => s.key === seriesKey);
  if (idx >= 0) {
    const existing = next[idx];
    const points = prunePoints([...existing.points, point], maxAgeMs, now);
    next[idx] = { ...existing, label: seriesLabel, points };
    return next;
  }
  return [...next, { key: seriesKey, label: seriesLabel, points: prunePoints([point], maxAgeMs, now) }];
};

