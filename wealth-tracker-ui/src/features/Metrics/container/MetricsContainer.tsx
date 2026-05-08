import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../login/context/useAuth';
import { decodeJwtPayload } from '../../../utils/jwt';
import MetricsPresenter from '../presenter/MetricsPresenter';
import { MetricsApi } from '../services/MetricsApi';
import type { MetricsAverages, MetricsSummary, MetricsTableRow, ServiceKey } from '../types/MetricsTypes';
import { calculatePercentage, formatBytes, mean, nowMs } from '../utils/metricsHelpers';
import { parsePrometheusText, labelsToKey } from '../utils/prometheusParser';
import type { Series } from '../utils/timeSeries';
import { upsertSeriesPoint } from '../utils/timeSeries';

interface JwtPayload {
  roles?: string[] | string;
  authorities?: Array<{ authority?: string }> | string[];
}

const SERIES_LABEL_KEYS = ['instance', 'application', 'job', 'service', 'pod'];

const toServiceLabel = (service: ServiceKey) =>
  service === 'authService' ? 'Auth Service' : 'Spendwise Service';

const isAdmin = (payload: JwtPayload | null) => {
  if (!payload) return true; // keep page usable if roles aren't embedded in JWT
  const rolesFromRoles =
    typeof payload.roles === 'string'
      ? [payload.roles]
      : Array.isArray(payload.roles)
        ? payload.roles
        : [];
  const rolesFromAuthorities = Array.isArray(payload.authorities)
    ? payload.authorities
        .map((a) => (typeof a === 'string' ? a : a?.authority))
        .filter((a): a is string => Boolean(a))
    : [];
  const all = [...rolesFromRoles, ...rolesFromAuthorities].map((r) => r.toUpperCase());
  return all.some((r) => r.includes('ADMIN'));
};

const buildSeriesLabel = (seriesKey: string) => {
  if (seriesKey === 'default') return 'Service';
  // prefer instance=... if present
  const parts = seriesKey.split('|').map((p) => p.split('='));
  const asMap = new Map(parts.map(([k, v]) => [k, v]));
  return (
    asMap.get('instance') ||
    asMap.get('pod') ||
    asMap.get('application') ||
    asMap.get('job') ||
    seriesKey
  );
};

const MAX_AGE_MS_24H = 24 * 60 * 60 * 1000;
const REFRESH_MS = 10_000;

const MetricsContainer = () => {
  const navigate = useNavigate();
  const { accessToken, tokenType, logout } = useAuth();

  const [service, setService] = useState<ServiceKey>('authService');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [summary, setSummary] = useState<MetricsSummary>({
    cpu: { percent: null },
    memory: { percent: null },
    disk: { percent: null },
  });
  const [tableRows, setTableRows] = useState<MetricsTableRow[]>([]);
  const [averages, setAverages] = useState<MetricsAverages>({
    cpuAvg: null,
    memoryAvg: null,
    diskAvg: null,
  });

  const [cpuSeries, setCpuSeries] = useState<Series[]>([]);
  const [memorySeries, setMemorySeries] = useState<Series[]>([]);
  const [diskSeries, setDiskSeries] = useState<Series[]>([]);

  const timerRef = useRef<number | null>(null);

  const authHeader = useMemo<Record<string, string> | undefined>(() => {
    if (!accessToken) return undefined;
    const prefix = tokenType ? tokenType : 'Bearer';
    return { Authorization: `${prefix} ${accessToken}` };
  }, [accessToken, tokenType]);

  const adminAllowed = useMemo(() => {
    if (!accessToken) return true;
    const payload = decodeJwtPayload<JwtPayload>(accessToken);
    return isAdmin(payload);
  }, [accessToken]);

  const fetchOnce = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const ts = nowMs();
    try {
      const text = await MetricsApi.prometheusText(service, authHeader);
      const samples = parsePrometheusText(text);

      // CPU: micrometer -> system_cpu_usage (0..1)
      const cpu = samples.filter((s) => s.name === 'system_cpu_usage');
      // Disk: disk_free_bytes, disk_total_bytes
      const diskFree = samples.filter((s) => s.name === 'disk_free_bytes');
      const diskTotal = samples.filter((s) => s.name === 'disk_total_bytes');
      // Memory: jvm_memory_used_bytes, jvm_memory_max_bytes (prefer area="heap")
      const memUsed = samples.filter((s) => s.name === 'jvm_memory_used_bytes');
      const memMax = samples.filter((s) => s.name === 'jvm_memory_max_bytes');

      const cpuBySeries = new Map<string, number>();
      for (const sample of cpu) {
        const key = labelsToKey(sample.labels, SERIES_LABEL_KEYS);
        cpuBySeries.set(key, sample.value * 100);
      }

      const diskFreeBySeries = new Map<string, number>();
      for (const sample of diskFree) {
        if (sample.labels.path && sample.labels.path !== '/') continue;
        const key = labelsToKey(sample.labels, SERIES_LABEL_KEYS);
        diskFreeBySeries.set(key, sample.value);
      }
      const diskTotalBySeries = new Map<string, number>();
      for (const sample of diskTotal) {
        if (sample.labels.path && sample.labels.path !== '/') continue;
        const key = labelsToKey(sample.labels, SERIES_LABEL_KEYS);
        diskTotalBySeries.set(key, sample.value);
      }

      const memUsedBySeries = new Map<string, number>();
      for (const sample of memUsed) {
        if (sample.labels.area && sample.labels.area !== 'heap') continue;
        const key = labelsToKey(sample.labels, SERIES_LABEL_KEYS);
        memUsedBySeries.set(key, (memUsedBySeries.get(key) ?? 0) + sample.value);
      }
      const memMaxBySeries = new Map<string, number>();
      for (const sample of memMax) {
        if (sample.labels.area && sample.labels.area !== 'heap') continue;
        const key = labelsToKey(sample.labels, SERIES_LABEL_KEYS);
        memMaxBySeries.set(key, (memMaxBySeries.get(key) ?? 0) + sample.value);
      }

      const allSeriesKeys = new Set<string>([
        ...cpuBySeries.keys(),
        ...diskFreeBySeries.keys(),
        ...diskTotalBySeries.keys(),
        ...memUsedBySeries.keys(),
        ...memMaxBySeries.keys(),
      ]);

      // Update time series in state via upserts
      setCpuSeries((prev) => {
        let updated = prev;
        for (const key of allSeriesKeys) {
          const v = cpuBySeries.get(key);
          if (typeof v !== 'number' || !Number.isFinite(v)) continue;
          const label = buildSeriesLabel(key);
          updated = upsertSeriesPoint(updated, key, label, { ts, value: v }, MAX_AGE_MS_24H);
        }
        return updated;
      });

      setDiskSeries((prev) => {
        let updated = prev;
        for (const key of allSeriesKeys) {
          const free = diskFreeBySeries.get(key);
          const total = diskTotalBySeries.get(key);
          const percent = calculatePercentage(total && free ? total - free : null, total);
          if (typeof percent !== 'number') continue;
          const label = buildSeriesLabel(key);
          updated = upsertSeriesPoint(updated, key, label, { ts, value: percent }, MAX_AGE_MS_24H);
        }
        return updated;
      });

      setMemorySeries((prev) => {
        let updated = prev;
        for (const key of allSeriesKeys) {
          const used = memUsedBySeries.get(key);
          const max = memMaxBySeries.get(key);
          const percent = calculatePercentage(used ?? null, max ?? null);
          if (typeof percent !== 'number') continue;
          const label = buildSeriesLabel(key);
          updated = upsertSeriesPoint(updated, key, label, { ts, value: percent }, MAX_AGE_MS_24H);
        }
        return updated;
      });

      // Derive summary + table + averages from the latest state we just computed from samples
      const cpuLatest = mean(Array.from(cpuBySeries.values()));
      const diskLatest = mean(
        Array.from(allSeriesKeys).map((key) => {
          const free = diskFreeBySeries.get(key);
          const total = diskTotalBySeries.get(key);
          return calculatePercentage(total && free ? total - free : null, total);
        })
      );
      const memLatest = mean(
        Array.from(allSeriesKeys).map((key) => calculatePercentage(memUsedBySeries.get(key) ?? null, memMaxBySeries.get(key) ?? null))
      );

      setSummary({
        cpu: { percent: cpuLatest, detail: cpuLatest !== null ? `${toServiceLabel(service)}` : undefined },
        memory: {
          percent: memLatest,
          detail:
            memLatest !== null && memUsedBySeries.size
              ? `${formatBytes(mean(Array.from(memUsedBySeries.values())))} / ${formatBytes(
                  mean(Array.from(memMaxBySeries.values()))
                )}`
              : undefined,
        },
        disk: { percent: diskLatest, detail: diskLatest !== null ? 'Used space' : undefined },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load metrics.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    fetchOnce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, service, navigate]);

  useEffect(() => {
    if (!autoRefresh) {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = window.setInterval(() => {
      fetchOnce();
    }, REFRESH_MS);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, service, accessToken]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleServiceChange = (next: ServiceKey) => {
    setService(next);
    setCpuSeries([]);
    setMemorySeries([]);
    setDiskSeries([]);
    setTableRows([]);
  };

  useEffect(() => {
    const byKey = (list: Series[]) =>
      new Map(list.map((s) => [s.key, { latest: s.points.at(-1)?.value ?? null, mean: mean(s.points.map((p) => p.value)) }]));

    const cpuMap = byKey(cpuSeries);
    const memMap = byKey(memorySeries);
    const diskMap = byKey(diskSeries);

    const keys = new Set<string>([...cpuMap.keys(), ...memMap.keys(), ...diskMap.keys()]);
    const rows: MetricsTableRow[] = Array.from(keys).map((key) => ({
      name: buildSeriesLabel(key),
      cpuMean: cpuMap.get(key)?.mean ?? null,
      cpuPercent: cpuMap.get(key)?.latest ?? null,
      diskMean: diskMap.get(key)?.mean ?? null,
      diskPercent: diskMap.get(key)?.latest ?? null,
      memoryMean: memMap.get(key)?.mean ?? null,
      memoryPercent: memMap.get(key)?.latest ?? null,
    }));

    setTableRows(rows.sort((a, b) => a.name.localeCompare(b.name)));

    const allCpu = cpuSeries.flatMap((s) => s.points.map((p) => p.value));
    const allMem = memorySeries.flatMap((s) => s.points.map((p) => p.value));
    const allDisk = diskSeries.flatMap((s) => s.points.map((p) => p.value));
    setAverages({
      cpuAvg: mean(allCpu),
      memoryAvg: mean(allMem),
      diskAvg: mean(allDisk),
    });
  }, [cpuSeries, memorySeries, diskSeries]);

  return (
    <MetricsPresenter
      onLogout={handleLogout}
      adminAllowed={adminAllowed}
      service={service}
      serviceLabel={toServiceLabel(service)}
      onServiceChange={handleServiceChange}
      autoRefresh={autoRefresh}
      onToggleAutoRefresh={() => setAutoRefresh((v) => !v)}
      onRefreshNow={fetchOnce}
      isLoading={isLoading}
      errorMessage={errorMessage}
      summary={summary}
      tableRows={tableRows}
      cpuSeries={cpuSeries}
      memorySeries={memorySeries}
      diskSeries={diskSeries}
      averages={averages}
    />
  );
};

export default MetricsContainer;
