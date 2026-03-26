import type { ReactNode } from 'react';

export interface ExpenseChartDatum {
  label: string;
  value: number;
  displayValue?: string;
  helper?: string;
}

interface ExpenseChartProps {
  title: string;
  subtitle?: string;
  tone?: 'ocean' | 'sunset';
  type?: 'line' | 'bar';
  data: ExpenseChartDatum[];
  totalDisplay?: string;
  peakDisplay?: string;
  footer?: ReactNode;
}

const chartPadding = 14;
const chartWidth = 320;
const chartHeight = 140;

const normalizeValue = (value: number) =>
  Number.isFinite(value) ? Math.max(value, 0) : 0;

const buildLinePath = (values: number[]) => {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const step = (chartWidth - chartPadding * 2) / (values.length - 1 || 1);

  const points = values.map((value, index) => {
    const x = chartPadding + index * step;
    const y =
      chartHeight -
      chartPadding -
      ((value - min) / range) * (chartHeight - chartPadding * 2);
    return { x, y };
  });

  const path = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
  const areaPath = [
    path,
    `L ${chartPadding + (values.length - 1 || 0) * step} ${chartHeight - chartPadding}`,
    `L ${chartPadding} ${chartHeight - chartPadding}`,
    'Z',
  ].join(' ');

  return { points, path, areaPath };
};

const buildBarPositions = (values: number[]) => {
  const max = Math.max(...values, 1);
  const barWidth = (chartWidth - chartPadding * 2) / (values.length || 1);
  return values.map((value, index) => {
    const height =
      ((value / max) * (chartHeight - chartPadding * 2)) || 0;
    const x = chartPadding + index * barWidth + barWidth * 0.15;
    const y = chartHeight - chartPadding - height;
    return {
      x,
      y,
      height,
      width: barWidth * 0.7,
    };
  });
};

const ExpenseChart = ({
  title,
  subtitle,
  tone = 'ocean',
  type = 'line',
  data,
  totalDisplay,
  peakDisplay,
  footer,
}: ExpenseChartProps) => {
  const values = data.map((item) => normalizeValue(item.value));
  const maxValue = Math.max(...values, 0);
  const sumValue = values.reduce((total, value) => total + value, 0);
  const primaryValue = Number.isFinite(sumValue) ? sumValue : 0;
  const gradientId = `chartGradient-${title.replace(/[^a-zA-Z0-9-]/g, '-')}`;
  const { points, path, areaPath } = buildLinePath(values);
  const bars = buildBarPositions(values);

  return (
    <article className={`expense-chart expense-chart--${tone}`}>
      <header className="expense-chart__header">
        <div>
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
        <div className="expense-chart__summary">
          <span>Total</span>
          <strong>{totalDisplay ?? primaryValue.toFixed(2)}</strong>
        </div>
      </header>

      <div className="expense-chart__canvas" role="img" aria-label={title}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line
            x1={chartPadding}
            y1={chartHeight - chartPadding}
            x2={chartWidth - chartPadding}
            y2={chartHeight - chartPadding}
            className="expense-chart__axis"
          />
          {type === 'line' && (
            <>
              <path d={areaPath} fill={`url(#${gradientId})`} />
              <path d={path} className="expense-chart__line" />
              {points.map((point, index) => (
                <circle
                  key={`${point.x}-${point.y}-${index}`}
                  cx={point.x}
                  cy={point.y}
                  r="3.5"
                  className="expense-chart__dot"
                />
              ))}
            </>
          )}
          {type === 'bar' &&
            bars.map((bar, index) => (
              <rect
                key={`${bar.x}-${bar.y}-${index}`}
                x={bar.x}
                y={bar.y}
                width={bar.width}
                height={bar.height}
                rx="6"
                className="expense-chart__bar"
              />
            ))}
        </svg>
      </div>

      <div className="expense-chart__labels">
        {data.map((item) => (
          <div key={item.label} className="expense-chart__label">
            <span>{item.label}</span>
            <strong>{item.displayValue ?? item.value.toFixed(2)}</strong>
            {item.helper && <em>{item.helper}</em>}
          </div>
        ))}
      </div>

      <div className="expense-chart__footer">
        <div>
          <span>Peak</span>
          <strong>{peakDisplay ?? maxValue.toFixed(2)}</strong>
        </div>
        {footer}
      </div>
    </article>
  );
};

export default ExpenseChart;
