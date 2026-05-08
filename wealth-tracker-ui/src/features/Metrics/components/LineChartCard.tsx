import type { Series } from '../utils/timeSeries';
import { LineChartSvg, SERIES_COLORS } from './charts/ChartPrimitives';

interface LineChartCardProps {
  title: string;
  subtitle?: string;
  series: Series[];
  isLoading?: boolean;
}

const LineChartCard = ({ title, subtitle, series, isLoading }: LineChartCardProps) => {
  return (
    <div className="metricsCard metricsCard--padded">
      <div className="metricsCardHead">
        <div>
          <div className="metricsSectionTitle">{title}</div>
          {subtitle ? <div className="metricsMuted">{subtitle}</div> : null}
        </div>
        {isLoading ? <div className="metricsPill">Refreshing…</div> : null}
      </div>
      <LineChartSvg series={series} />
      {series.length > 1 ? (
        <div className="metricsLegend">
          {series.slice(0, 6).map((s, idx) => (
            <div key={s.key} className="metricsLegendItem">
              <span
                className="metricsLegendSwatch"
                style={{ background: SERIES_COLORS[idx % SERIES_COLORS.length] }}
              />
              <span className="metricsMuted">{s.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default LineChartCard;
