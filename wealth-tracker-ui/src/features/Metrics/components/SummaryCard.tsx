import { formatPercent, getUsageColor } from '../utils/metricsHelpers';

interface SummaryCardProps {
  title: string;
  percent: number | null;
  detail?: string;
  isLoading?: boolean;
}

const SummaryCard = ({ title, percent, detail, isLoading }: SummaryCardProps) => {
  const color = getUsageColor(percent);
  const display = isLoading ? '--' : `${formatPercent(percent)}%`;
  const statusClass = `metricsStatus metricsStatus--${color}`;

  return (
    <div className="metricsCard">
      <div className="metricsCardTitle">{title}</div>
      <div className="metricsCardValueRow">
        <div className="metricsCardValue">{display}</div>
        <span className={statusClass} aria-label={`${color} indicator`} />
      </div>
      {detail ? <div className="metricsCardHint">{detail}</div> : null}
    </div>
  );
};

export default SummaryCard;

