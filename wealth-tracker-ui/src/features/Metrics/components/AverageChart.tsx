import type { MetricsAverages } from '../types/MetricsTypes';
import { formatPercent } from '../utils/metricsHelpers';
import { BarChartSvg } from './charts/ChartPrimitives';

interface AverageChartProps {
  averages: MetricsAverages;
  isLoading?: boolean;
}

const AverageChart = ({ averages, isLoading }: AverageChartProps) => {
  const items = [
    { label: 'CPU', value: averages.cpuAvg },
    { label: 'Memory', value: averages.memoryAvg },
    { label: 'Disk', value: averages.diskAvg },
  ];

  return (
    <div className="metricsCard metricsCard--padded">
      <div className="metricsCardHead">
        <div>
          <div className="metricsSectionTitle">Averages (Last 24h)</div>
          <div className="metricsMuted">Client-side rolling window (10s refresh)</div>
        </div>
        {isLoading ? <div className="metricsPill">Refreshing…</div> : null}
      </div>
      <BarChartSvg items={items} />
      <div className="metricsAveragesRow">
        {items.map((i) => (
          <div key={i.label} className="metricsAvgItem">
            <div className="metricsMuted">{i.label}</div>
            <div className="metricsAvgValue">{i.value === null ? '--' : `${formatPercent(i.value)}%`}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AverageChart;

