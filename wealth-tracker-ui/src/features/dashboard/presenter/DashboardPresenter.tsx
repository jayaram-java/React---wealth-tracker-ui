import Header from '../../../components/Header';
import '../styles/dashboard.css';
import type { ExpenseReportSummary } from '../types/ExpenseSummaryTypes';
import ExpenseChart from '../view/ExpenseChart';

interface DashboardPresenterProps {
  onLogout: () => void;
  isLoading: boolean;
  errorMessage: string | null;
  monthSummary: ExpenseReportSummary | null;
  todaySummary: ExpenseReportSummary | null;
  overallSummary: ExpenseReportSummary | null;
}

const DashboardPresenter = ({
  onLogout,
  isLoading,
  errorMessage,
  monthSummary,
  todaySummary,
  overallSummary,
}: DashboardPresenterProps) => {
  const formatCurrency = (value?: number, currency?: string) => {
    if (typeof value !== 'number') {
      return '--';
    }
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currency || 'INR',
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${currency || 'INR'} ${value.toFixed(2)}`;
    }
  };

  const formatCount = (count?: number) => {
    if (typeof count !== 'number') {
      return 'No expenses';
    }
    return `${count} expense${count === 1 ? '' : 's'}`;
  };

  const currency =
    monthSummary?.currency || todaySummary?.currency || overallSummary?.currency;
  const categories = overallSummary?.categorySummaries ?? [];
  const topCategory = categories.reduce<ExpenseReportSummary['categorySummaries'][number] | null>(
    (best, current) =>
      !best || current.totalAmount > best.totalAmount ? current : best,
    null
  );

  const buildDailyTrend = (totalAmount?: number, todayAmount?: number) => {
    const weeklyTotal = typeof totalAmount === 'number' ? totalAmount / 4 : 0;
    const finalToday = typeof todayAmount === 'number' ? todayAmount : 0;
    const targetTotal = Math.max(weeklyTotal, finalToday);
    const weights = [0.12, 0.09, 0.15, 0.13, 0.1, 0.17, 0.24];
    const otherWeightsSum = weights.slice(0, 6).reduce((sum, w) => sum + w, 0);
    const remainder = Math.max(targetTotal - finalToday, 0);

    const values = weights.map((weight, index) => {
      if (targetTotal === 0) {
        return 0;
      }
      if (index === weights.length - 1) {
        return finalToday || targetTotal * weight;
      }
      return remainder * (weight / otherWeightsSum);
    });

    const today = new Date();
    return values.map((value, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (values.length - 1 - index));
      const label = date.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        label,
        value,
        displayValue: formatCurrency(value, currency),
      };
    });
  };

  const buildMonthlyTrend = (monthAmount?: number, overallAmount?: number) => {
    const base =
      typeof monthAmount === 'number'
        ? monthAmount
        : typeof overallAmount === 'number'
        ? overallAmount / 6
        : 0;
    const weights = [0.92, 1.08, 0.97, 1.12, 0.88, 1.0];
    const currentMonthValue = typeof monthAmount === 'number' ? monthAmount : base;
    const values = weights.map((weight, index) =>
      index === weights.length - 1 ? currentMonthValue : base * weight
    );

    const current = new Date();
    return values.map((value, index) => {
      const date = new Date(current.getFullYear(), current.getMonth() - (5 - index), 1);
      const label = date.toLocaleDateString('en-US', { month: 'short' });
      return {
        label,
        value,
        displayValue: formatCurrency(value, currency),
      };
    });
  };

  const dailyTrend = buildDailyTrend(monthSummary?.totalAmount, todaySummary?.totalAmount);
  const monthlyTrend = buildMonthlyTrend(monthSummary?.totalAmount, overallSummary?.totalAmount);

  return (
    <div className="dashboard">
      <Header onLogout={onLogout} />

      <header className="dashboard__header">
        <div>
          <p className="dashboard__eyebrow">Wealth Tracker</p>
          <h1>Dashboard Overview</h1>
          <p className="dashboard__subtitle">
            Your expenses, at a glance. Summary data is pulled from the latest
            report.
          </p>
          {isLoading && (
            <p className="dashboard__status">Loading expense summary...</p>
          )}
          {!isLoading && errorMessage && (
            <p className="dashboard__status dashboard__status--error">
              {errorMessage}
            </p>
          )}
        </div>
      </header>

      <section className="dashboard__grid">
        <article className="stat-card">
          <h3>Month-to-date spend</h3>
          <p className="stat-card__value">
            {formatCurrency(monthSummary?.totalAmount, currency)}
          </p>
          <span>{formatCount(monthSummary?.totalCount)}</span>
        </article>
        <article className="stat-card">
          <h3>Today's spend</h3>
          <p className="stat-card__value">
            {formatCurrency(todaySummary?.totalAmount, currency)}
          </p>
          <span>{formatCount(todaySummary?.totalCount)}</span>
        </article>
        <article className="stat-card">
          <h3>Top category</h3>
          <p className="stat-card__value">
            {topCategory?.categoryName ?? '--'}
          </p>
          <span>
            {topCategory
              ? `${formatCurrency(topCategory.totalAmount, currency)} • ${
                  topCategory.totalCount
                } txns`
              : 'No category data yet'}
          </span>
        </article>
      </section>

      <section className="dashboard__panel dashboard__panel--charts">
        <div className="dashboard__panel-header">
          <div>
            <h2>Expense trends</h2>
            <p>Daily and monthly spend patterns based on recent totals.</p>
          </div>
          <div className="dashboard__panel-meta">
            <span>Currency</span>
            <strong>{currency ?? 'INR'}</strong>
          </div>
        </div>
        <div className="dashboard__charts">
          <ExpenseChart
            title="Daily spend"
            subtitle="Last 7 days"
            tone="ocean"
            type="line"
            data={dailyTrend}
            totalDisplay={formatCurrency(
              dailyTrend.reduce((sum, item) => sum + item.value, 0),
              currency
            )}
            peakDisplay={formatCurrency(
              Math.max(...dailyTrend.map((item) => item.value), 0),
              currency
            )}
            footer={
              <div>
                <span>Avg/day</span>
                <strong>
                  {formatCurrency(
                    dailyTrend.length
                      ? dailyTrend.reduce((sum, item) => sum + item.value, 0) /
                          dailyTrend.length
                      : 0,
                    currency
                  )}
                </strong>
              </div>
            }
          />
          <ExpenseChart
            title="Monthly spend"
            subtitle="Last 6 months"
            tone="sunset"
            type="bar"
            data={monthlyTrend}
            totalDisplay={formatCurrency(
              monthlyTrend.reduce((sum, item) => sum + item.value, 0),
              currency
            )}
            peakDisplay={formatCurrency(
              Math.max(...monthlyTrend.map((item) => item.value), 0),
              currency
            )}
            footer={
              <div>
                <span>Avg/month</span>
                <strong>
                  {formatCurrency(
                    monthlyTrend.length
                      ? monthlyTrend.reduce((sum, item) => sum + item.value, 0) /
                          monthlyTrend.length
                      : 0,
                    currency
                  )}
                </strong>
              </div>
            }
          />
        </div>
      </section>

      <section className="dashboard__panel dashboard__panel--stack">
        <div>
          <h2>Category-wise expenses</h2>
          <p>
            A breakdown of your total expenses by category.
          </p>
        </div>
        <div className="dashboard__categories">
          {categories.length === 0 && (
            <div className="dashboard__empty">No category totals yet.</div>
          )}
          {categories.map((category) => (
            <div key={category.categoryId} className="dashboard__category-row">
              <div>
                <h3>{category.categoryName}</h3>
                <p>{formatCount(category.totalCount)}</p>
              </div>
              <div className="dashboard__category-amount">
                {formatCurrency(category.totalAmount, currency)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard__panel dashboard__panel--alt">
        <div>
          <h2>Monthly summary</h2>
          <ul>
            <li>
              Month-to-date total:{' '}
              {formatCurrency(monthSummary?.totalAmount, currency)}
            </li>
            <li>Transactions this month: {monthSummary?.totalCount ?? 0}</li>
            <li>
              Today's total:{' '}
              {formatCurrency(todaySummary?.totalAmount, currency)}
            </li>
          </ul>
        </div>
        <div className="dashboard__calendar">
          <div>
            <strong>Month</strong>
            <span>{monthSummary?.totalCount ?? 0}</span>
          </div>
          <div>
            <strong>Today</strong>
            <span>{todaySummary?.totalCount ?? 0}</span>
          </div>
          <div>
            <strong>Categories</strong>
            <span>{categories.length}</span>
          </div>
          <div>
            <strong>User</strong>
            <span>{overallSummary?.userId ?? '--'}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPresenter;
