import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardPresenter from '../presenter/DashboardPresenter';
import { useAuth } from '../../login/context/useAuth';
import { getRequest } from '../../../serviceconfigs/AxiosAPI';
import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import type { ExpenseReportSummary } from '../types/ExpenseSummaryTypes';
import type { ExpenseReportTrends } from '../types/ExpenseTrendTypes';
import { decodeJwtPayload } from '../../../utils/jwt';

interface JwtPayload {
  userId?: number;
}

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

const DashboardContainer = () => {
  const navigate = useNavigate();
  const { accessToken, tokenType, logout } = useAuth();
  const [monthSummary, setMonthSummary] = useState<ExpenseReportSummary | null>(
    null
  );
  const [todaySummary, setTodaySummary] = useState<ExpenseReportSummary | null>(
    null
  );
  const [overallSummary, setOverallSummary] =
    useState<ExpenseReportSummary | null>(null);
  const [trends, setTrends] = useState<ExpenseReportTrends | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isTrendsLoading, setIsTrendsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const authHeader = useMemo(() => {
    if (!accessToken) {
      return {};
    }
    const prefix = tokenType ? tokenType : 'Bearer';
    return { Authorization: `${prefix} ${accessToken}` };
  }, [accessToken, tokenType]);

  const userId = useMemo(() => {
    if (!accessToken) {
      return null;
    }
    const payload = decodeJwtPayload<JwtPayload>(accessToken);
    return typeof payload?.userId === 'number' ? payload.userId : null;
  }, [accessToken]);

  const buildSummaryUrl = (options?: { startDate?: string; endDate?: string }) => {
    const url = new URL(API_ENDPOINTS.expense.summary);
    if (userId !== null) {
      url.searchParams.set('userId', String(userId));
    }
    if (options?.startDate) {
      url.searchParams.set('startDate', options.startDate);
    }
    if (options?.endDate) {
      url.searchParams.set('endDate', options.endDate);
    }
    return url.toString();
  };

  const buildTrendsUrl = () => {
    const url = new URL(API_ENDPOINTS.expense.trends);
    if (userId !== null) {
      url.searchParams.set('userId', String(userId));
    }
    return url.toString();
  };

  const fetchSummaries = useCallback(async () => {
    if (userId === null) {
      setErrorMessage('Unable to read userId from access token.');
      return;
    }
    setIsSummaryLoading(true);
    setErrorMessage(null);
    try {
      const today = new Date();
      const todayIso = toIsoDate(today);
      const monthStartIso = toIsoDate(
        new Date(today.getFullYear(), today.getMonth(), 1)
      );

      const [overall, month, todaySummary] = await Promise.all([
        getRequest<ExpenseReportSummary>(buildSummaryUrl(), {
          headers: authHeader,
        }),
        getRequest<ExpenseReportSummary>(
          buildSummaryUrl({ startDate: monthStartIso, endDate: todayIso }),
          { headers: authHeader }
        ),
        getRequest<ExpenseReportSummary>(
          buildSummaryUrl({ startDate: todayIso, endDate: todayIso }),
          { headers: authHeader }
        ),
      ]);

      setOverallSummary(overall);
      setMonthSummary(month);
      setTodaySummary(todaySummary);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to load summary data.';
      setErrorMessage(message);
    } finally {
      setIsSummaryLoading(false);
    }
  }, [authHeader, userId]);

  const fetchTrends = useCallback(async () => {
    if (userId === null) {
      return;
    }
    setIsTrendsLoading(true);
    try {
      const trendData = await getRequest<ExpenseReportTrends>(buildTrendsUrl(), {
        headers: authHeader,
      });
      setTrends(trendData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to load trend data.';
      setErrorMessage(message);
    } finally {
      setIsTrendsLoading(false);
    }
  }, [authHeader, userId]);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    fetchSummaries();
    fetchTrends();
  }, [accessToken, fetchSummaries, fetchTrends, navigate]);

  const isLoading = isSummaryLoading || isTrendsLoading;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DashboardPresenter
      onLogout={handleLogout}
      isLoading={isLoading}
      errorMessage={errorMessage}
      monthSummary={monthSummary}
      todaySummary={todaySummary}
      overallSummary={overallSummary}
      trends={trends}
    />
  );
};

export default DashboardContainer;
