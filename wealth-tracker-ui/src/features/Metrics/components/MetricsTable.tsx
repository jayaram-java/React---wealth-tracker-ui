import { formatPercent } from '../utils/metricsHelpers';
import type { MetricsTableRow } from '../types/MetricsTypes';

interface MetricsTableProps {
  rows: MetricsTableRow[];
  isLoading?: boolean;
}

const cell = (value: number | null) => (value === null ? '--' : `${formatPercent(value)}%`);

const MetricsTable = ({ rows, isLoading }: MetricsTableProps) => {
  if (isLoading && rows.length === 0) {
    return (
      <div className="metricsCard metricsCard--padded">
        <div className="metricsSkeletonRow" />
        <div className="metricsSkeletonRow" />
        <div className="metricsSkeletonRow" />
      </div>
    );
  }

  return (
    <div className="metricsCard metricsCard--padded">
      <div className="metricsSectionTitle">Total Values</div>
      <div className="metricsTableWrap">
        <table className="metricsTableEl">
          <thead>
            <tr>
              <th>Name</th>
              <th>CPU Mean</th>
              <th>CPU %</th>
              <th>Disk Mean</th>
              <th>Disk %</th>
              <th>Memory Mean</th>
              <th>Memory %</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="metricsMuted">
                  No samples yet. Wait for the next refresh.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.name}>
                  <td className="metricsMono">{row.name}</td>
                  <td>{cell(row.cpuMean)}</td>
                  <td>{cell(row.cpuPercent)}</td>
                  <td>{cell(row.diskMean)}</td>
                  <td>{cell(row.diskPercent)}</td>
                  <td>{cell(row.memoryMean)}</td>
                  <td>{cell(row.memoryPercent)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricsTable;

