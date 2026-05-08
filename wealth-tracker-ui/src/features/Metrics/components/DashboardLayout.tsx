import type { ReactNode } from 'react';
import '../styles/Metrics.css';

interface DashboardLayoutProps {
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  summaryCards?: ReactNode;
  totalsTable?: ReactNode;
  charts?: ReactNode;
  averages?: ReactNode;
}

const DashboardLayout = ({
  headerLeft,
  headerRight,
  summaryCards,
  totalsTable,
  charts,
  averages,
}: DashboardLayoutProps) => {
  return (
    <div className="metricsPage">
      <div className="metricsHeader">
        <div className="metricsHeaderLeft">{headerLeft}</div>
        <div className="metricsHeaderRight">{headerRight}</div>
      </div>

      <div className="metricsGrid">
        <section className="metricsSection metricsSummary">{summaryCards}</section>
        <section className="metricsSection metricsTable">{totalsTable}</section>
        <section className="metricsSection metricsCharts">{charts}</section>
        <section className="metricsSection metricsAverages">{averages}</section>
      </div>
    </div>
  );
};

export default DashboardLayout;

