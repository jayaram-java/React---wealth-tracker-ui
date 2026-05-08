import type { Series } from '../../utils/timeSeries';
import { clamp } from '../../utils/metricsHelpers';

export const SERIES_COLORS = ['#61dafb', '#a78bfa', '#34d399', '#fbbf24', '#fb7185', '#22c55e'];

const toPath = (points: Array<{ x: number; y: number }>) => {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  return `M ${first.x} ${first.y} ${rest.map((p) => `L ${p.x} ${p.y}`).join(' ')}`;
};

export const LineChartSvg = ({
  series,
  height = 220,
}: {
  series: Series[];
  height?: number;
}) => {
  const width = 640; // fixed viewBox for responsiveness
  const padding = 18;

  const allPoints = series.flatMap((s) => s.points);
  if (allPoints.length === 0) {
    return (
      <svg className="metricsChartSvg" viewBox={`0 0 ${width} ${height}`} role="img">
        <text x={padding} y={height / 2} className="metricsMuted">
          Waiting for data…
        </text>
      </svg>
    );
  }

  const minTs = Math.min(...allPoints.map((p) => p.ts));
  const maxTs = Math.max(...allPoints.map((p) => p.ts));
  const minV = 0;
  const maxV = Math.max(100, ...allPoints.map((p) => p.value));
  const xScale = (ts: number) => {
    if (maxTs === minTs) return padding;
    return padding + ((ts - minTs) / (maxTs - minTs)) * (width - padding * 2);
  };
  const yScale = (v: number) => {
    const t = (v - minV) / (maxV - minV || 1);
    return padding + (1 - t) * (height - padding * 2);
  };

  return (
    <svg className="metricsChartSvg" viewBox={`0 0 ${width} ${height}`} role="img">
      <g opacity={0.25}>
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} />
      </g>
      {series.map((s, idx) => {
        const pts = s.points
          .slice(-360) // last ~1h at 10s
          .map((p) => ({ x: xScale(p.ts), y: yScale(clamp(p.value, 0, 100)) }));
        const d = toPath(pts);
        const color = SERIES_COLORS[idx % SERIES_COLORS.length];
        return <path key={s.key} d={d} fill="none" stroke={color} strokeWidth={2} />;
      })}
    </svg>
  );
};

export const BarChartSvg = ({
  items,
  height = 220,
}: {
  items: Array<{ label: string; value: number | null }>;
  height?: number;
}) => {
  const width = 640;
  const padding = 18;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const maxV = Math.max(1, ...items.map((i) => (typeof i.value === 'number' ? i.value : 0)));
  const barW = innerW / Math.max(1, items.length) - 12;

  return (
    <svg className="metricsChartSvg" viewBox={`0 0 ${width} ${height}`} role="img">
      <g opacity={0.25}>
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} />
      </g>
      {items.map((item, idx) => {
        const v = typeof item.value === 'number' ? item.value : 0;
        const h = (v / maxV) * innerH;
        const x = padding + idx * (barW + 12) + 6;
        const y = padding + (innerH - h);
        const color = SERIES_COLORS[idx % SERIES_COLORS.length];
        return (
          <g key={item.label}>
            <rect x={x} y={y} width={barW} height={h} rx={8} fill={color} opacity={0.85} />
            <text x={x + barW / 2} y={height - 4} textAnchor="middle" className="metricsChartLabel">
              {item.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
