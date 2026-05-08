export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const calculatePercentage = (numerator?: number | null, denominator?: number | null) => {
  if (typeof numerator !== 'number' || typeof denominator !== 'number') {
    return null;
  }
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) {
    return null;
  }
  return (numerator / denominator) * 100;
};

export const formatNumber = (value: number | null | undefined, options?: Intl.NumberFormatOptions) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '--';
  }
  try {
    return new Intl.NumberFormat('en-US', options).format(value);
  } catch {
    return String(value);
  }
};

export const formatPercent = (value: number | null | undefined) =>
  formatNumber(value, { maximumFractionDigits: 1 });

export const formatBytes = (bytes: number | null | undefined) => {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes)) {
    return '--';
  }
  const absolute = Math.abs(bytes);
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let index = 0;
  let value = absolute;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  const sign = bytes < 0 ? '-' : '';
  const formatted = index === 0 ? value.toFixed(0) : value.toFixed(1);
  return `${sign}${formatted} ${units[index]}`;
};

export const getUsageColor = (percent: number | null | undefined) => {
  if (typeof percent !== 'number' || !Number.isFinite(percent)) {
    return 'neutral';
  }
  if (percent < 60) return 'good';
  if (percent <= 80) return 'warn';
  return 'bad';
};

export const mean = (values: Array<number | null | undefined>) => {
  const nums = values.filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  if (nums.length === 0) return null;
  return nums.reduce((sum, v) => sum + v, 0) / nums.length;
};

export const nowMs = () => Date.now();

