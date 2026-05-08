export type PrometheusLabels = Record<string, string>;

export interface PrometheusSample {
  name: string;
  labels: PrometheusLabels;
  value: number;
}

const parseLabels = (raw: string): PrometheusLabels => {
  const labels: PrometheusLabels = {};
  const trimmed = raw.trim();
  if (!trimmed) return labels;

  // Minimal parser for Prometheus exposition labels.
  // Supports: key="value", separated by commas. Escapes are handled conservatively.
  const parts = trimmed.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g);
  for (const part of parts) {
    const [k, v] = part.split('=');
    if (!k || v === undefined) continue;
    const key = k.trim();
    let value = v.trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    value = value
      .replaceAll('\\n', '\n')
      .replaceAll('\\t', '\t')
      .replaceAll('\\"', '"')
      .replaceAll('\\\\', '\\');
    if (key) labels[key] = value;
  }
  return labels;
};

export const parsePrometheusText = (text: string): PrometheusSample[] => {
  const samples: PrometheusSample[] = [];
  const lines = text.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    // Format:
    // metric_name{label="value"} 123.4 [timestamp]
    // metric_name 123.4
    const match = line.match(
      /^([a-zA-Z_:][a-zA-Z0-9_:]*)(?:\{([^}]*)\})?\s+([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|NaN|[+-]?Inf)(?:\s+\d+)?$/
    );
    if (!match) continue;

    const name = match[1];
    const labels = match[2] ? parseLabels(match[2]) : {};
    const valueRaw = match[3];

    let value: number;
    if (valueRaw === 'NaN') value = Number.NaN;
    else if (valueRaw === 'Inf' || valueRaw === '+Inf') value = Number.POSITIVE_INFINITY;
    else if (valueRaw === '-Inf') value = Number.NEGATIVE_INFINITY;
    else value = Number(valueRaw);

    if (!Number.isFinite(value)) continue;
    samples.push({ name, labels, value });
  }

  return samples;
};

export const labelsToKey = (labels: PrometheusLabels, keys: string[]) => {
  const parts: string[] = [];
  for (const key of keys) {
    const value = labels[key];
    if (value) parts.push(`${key}=${value}`);
  }
  return parts.join('|') || 'default';
};

