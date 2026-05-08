import Header from '../../../components/Header';
import DashboardLayout from '../components/DashboardLayout';
import SummaryCard from '../components/SummaryCard';
import MetricsTable from '../components/MetricsTable';
import LineChartCard from '../components/LineChartCard';
import AverageChart from '../components/AverageChart';
import ServiceControls from '../components/ServiceControls';
import '../styles/Metrics.css';
import type { MetricsAverages, MetricsSummary, MetricsTableRow, ServiceKey } from '../types/MetricsTypes';
import type { Series } from '../utils/timeSeries';

interface MetricsPresenterProps {
  onLogout: () => void;
  adminAllowed: boolean;
  service: ServiceKey;
  serviceLabel: string;
  onServiceChange: (service: ServiceKey) => void;
  autoRefresh: boolean;
  onToggleAutoRefresh: () => void;
  onRefreshNow: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  summary: MetricsSummary;
  tableRows: MetricsTableRow[];
  cpuSeries: Series[];
  memorySeries: Series[];
  diskSeries: Series[];
  averages: MetricsAverages;
}

const MetricsPresenter = ({
  onLogout,
  adminAllowed,
  service,
  serviceLabel,
  onServiceChange,
  autoRefresh,
  onToggleAutoRefresh,
  onRefreshNow,
  isLoading,
  errorMessage,
  summary,
  tableRows,
  cpuSeries,
  memorySeries,
  diskSeries,
  averages,
}: MetricsPresenterProps) => {
  const headerLeft = <Header onLogout={onLogout} />;

  const headerRight = (
    <ServiceControls
      service={service}
      onServiceChange={onServiceChange}
      autoRefresh={autoRefresh}
      onToggleAutoRefresh={onToggleAutoRefresh}
      onRefreshNow={onRefreshNow}
    />
  );

  if (!adminAllowed) {
    return (
      <div className="metricsPage">
        {headerLeft}
        <div className="metricsCard metricsCard--padded metricsError">
          Access denied. This page is available only for admin users.
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      headerLeft={headerLeft}
      headerRight={headerRight}
      summaryCards={
        <div className="metricsSummaryGrid">
          <div className="metricsSectionTitle">Summary ({serviceLabel})</div>
          <div className="metricsSummaryCards">
            <SummaryCard title="CPU Usage" percent={summary.cpu.percent} detail={summary.cpu.detail} isLoading={isLoading} />
            <SummaryCard
              title="Memory Usage"
              percent={summary.memory.percent}
              detail={summary.memory.detail}
              isLoading={isLoading}
            />
            <SummaryCard title="Disk Usage" percent={summary.disk.percent} detail={summary.disk.detail} isLoading={isLoading} />
          </div>
          {errorMessage ? <div className="metricsError">{errorMessage}</div> : null}
        </div>
      }
      totalsTable={<MetricsTable rows={tableRows} isLoading={isLoading} />}
      charts={
        <div className="metricsChartsGrid">
          <LineChartCard title="CPU Usage" subtitle="/actuator/prometheus → system_cpu_usage" series={cpuSeries} isLoading={isLoading} />
          <LineChartCard
            title="Memory Usage"
            subtitle="/actuator/prometheus → jvm_memory_*_bytes (heap)"
            series={memorySeries}
            isLoading={isLoading}
          />
          <LineChartCard
            title="Disk Usage"
            subtitle="/actuator/prometheus → disk_*_bytes (path=/)"
            series={diskSeries}
            isLoading={isLoading}
          />
        </div>
      }
      averages={<AverageChart averages={averages} isLoading={isLoading} />}
    />
  );
};

export default MetricsPresenter;

