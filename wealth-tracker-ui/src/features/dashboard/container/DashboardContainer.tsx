import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardPresenter from '../presenter/DashboardPresenter';
import { useAuth } from '../../login/context/AuthProvider';
import { getRequest } from '../../../serviceconfigs/AxiosAPI';
import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import type { ExpenseReportSummary } from '../types/ExpenseSummaryTypes';

interface JwtPayload {
  userId?: number;
}

const decodeJwtPayload = <T,>(token: string): T | null => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }
    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded = atob(padded);
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
};

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
  const [isLoading, setIsLoading] = useState(false);
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

  const fetchSummaries = useCallback(async () => {
    if (userId === null) {
      setErrorMessage('Unable to read userId from access token.');
      return;
    }
    setIsLoading(true);
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
      setIsLoading(false);
    }
  }, [authHeader, userId]);

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }
    fetchSummaries();
  }, [accessToken, fetchSummaries, navigate]);

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
    />
  );
};

export default DashboardContainer;
