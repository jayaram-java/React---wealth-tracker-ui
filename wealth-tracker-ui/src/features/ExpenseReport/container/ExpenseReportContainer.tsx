import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequest } from '../../../serviceconfigs/AxiosAPI';
import { API_ENDPOINTS } from '../../../serviceconfigs/ApiEndpoints';
import { useAuth } from '../../login/context/useAuth';
import { decodeJwtPayload } from '../../../utils/jwt';
import type { ExpenseCategory } from '../../ExpenseCategory/types/ExpenseCategoryTypes';
import ExpenseReportPresenter from '../presenter/ExpenseReportPresenter';
import {
  downloadExpensePdf,
  fetchExpenseReportDetails,
  sendExpenseReportEmail,
} from '../service/expenseReportService';
import type {
  ExpenseReportFilters,
  ExpenseReportItem,
  ExpenseReportSortField,
  ExpenseReportSortOrder,
} from '../types/ExpenseReportTypes';

interface JwtPayload {
  userId?: number;
}

const buildDefaultEmailSubject = (startDate: string, endDate: string) =>
  `Expense report (${startDate} to ${endDate})`;

const buildDefaultEmailBody = (startDate: string, endDate: string) =>
  `Please find the expense report PDF attached for ${startDate} to ${endDate}.`;

const formatDateForInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeEmailRecipient = (to: string) => {
  const mailtoMatch = to.match(/mailto:([^)\s]+)/i);
  if (mailtoMatch?.[1]) {
    return mailtoMatch[1];
  }

  const bracketMatch = to.match(/\[([^\]]+)\]/);
  if (bracketMatch?.[1]) {
    return bracketMatch[1];
  }

  return to;
};

const buildDefaultFilters = (): ExpenseReportFilters => {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  return {
    startDate: formatDateForInput(monthStart),
    endDate: formatDateForInput(today),
    categoryId: 'ALL',
  };
};

const ExpenseReportContainer = () => {
  const navigate = useNavigate();
  const { accessToken, tokenType, logout } = useAuth();

  const initialFilters = useMemo(() => buildDefaultFilters(), []);

  const [filters, setFilters] = useState<ExpenseReportFilters>(() => initialFilters);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [reportRows, setReportRows] = useState<ExpenseReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] =
    useState<ExpenseReportSortField>('expenseDate');
  const [sortOrder, setSortOrder] = useState<ExpenseReportSortOrder>('desc');
  const [emailSubject, setEmailSubject] = useState(() =>
    buildDefaultEmailSubject(initialFilters.startDate, initialFilters.endDate)
  );
  const [emailBody, setEmailBody] = useState(() =>
    buildDefaultEmailBody(initialFilters.startDate, initialFilters.endDate)
  );
  const [isEmailSubjectDirty, setIsEmailSubjectDirty] = useState(false);
  const [isEmailBodyDirty, setIsEmailBodyDirty] = useState(false);

  const pageSize = 10;

  const authHeader = useMemo<Record<string, string> | undefined>(() => {
    if (!accessToken) {
      return undefined;
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

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getRequest<ExpenseCategory[]>(
        API_ENDPOINTS.expense.categories,
        { headers: authHeader }
      );
      setCategories(response);
    } catch {
      setCategories([]);
    }
  }, [authHeader]);

  const fetchReportData = useCallback(
    async (nextFilters: ExpenseReportFilters) => {
      if (userId === null) {
        setErrorMessage('Unable to read userId from access token.');
        setReportRows([]);
        return;
      }

      if (nextFilters.startDate > nextFilters.endDate) {
        setErrorMessage('From Date cannot be after To Date.');
        setReportRows([]);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const rows = await fetchExpenseReportDetails({
          userId,
          startDate: nextFilters.startDate,
          endDate: nextFilters.endDate,
          authHeader,
        });

        const filteredRows =
          nextFilters.categoryId === 'ALL'
            ? rows
            : rows.filter(
                (row) => String(row.categoryId) === nextFilters.categoryId
              );

        setReportRows(filteredRows);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unable to load expense report.';
        setErrorMessage(message);
        setReportRows([]);
      } finally {
        setIsLoading(false);
      }
    },
    [authHeader, userId]
  );

  useEffect(() => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    fetchCategories();
    fetchReportData(filters);
  }, [accessToken, fetchCategories, fetchReportData, navigate]);

  useEffect(() => {
    if (!isEmailSubjectDirty) {
      setEmailSubject(buildDefaultEmailSubject(filters.startDate, filters.endDate));
    }
    if (!isEmailBodyDirty) {
      setEmailBody(buildDefaultEmailBody(filters.startDate, filters.endDate));
    }
  }, [filters.endDate, filters.startDate, isEmailBodyDirty, isEmailSubjectDirty]);

  const sortedRows = useMemo(() => {
    const rows = [...reportRows];

    rows.sort((left, right) => {
      let compareValue = 0;

      if (sortField === 'amount') {
        compareValue = left.amount - right.amount;
      } else {
        compareValue =
          new Date(left.expenseDate).getTime() -
          new Date(right.expenseDate).getTime();
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return rows;
  }, [reportRows, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));

  const pagedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedRows.slice(startIndex, startIndex + pageSize);
  }, [currentPage, sortedRows]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleFilterChange = (field: keyof ExpenseReportFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setSuccessMessage(null);
    fetchReportData(filters);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    setSuccessMessage(null);
    fetchCategories();
    fetchReportData(filters);
  };

  const getValidatedDateRange = () => {
    if (filters.startDate > filters.endDate) {
      setErrorMessage('From Date cannot be after To Date.');
      return null;
    }

    return {
      startDate: filters.startDate,
      endDate: filters.endDate,
    };
  };

  const handleViewPdf = async () => {
    if (userId === null) {
      setErrorMessage('Unable to read userId from access token.');
      return;
    }

    const dateRange = getValidatedDateRange();
    if (!dateRange) {
      return;
    }

    setIsPdfLoading(true);
    setErrorMessage(null);

    try {
      const pdfBlob = await downloadExpensePdf(
        userId,
        dateRange.startDate,
        dateRange.endDate,
        authHeader
      );

      const pdfUrl = URL.createObjectURL(pdfBlob);
      const openedTab = window.open(pdfUrl, '_blank', 'noopener,noreferrer');

      if (!openedTab) {
        URL.revokeObjectURL(pdfUrl);
        throw new Error(
          'Unable to open PDF in a new tab. Please allow popups and try again.'
        );
      }

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 60000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to view expense PDF.';
      setErrorMessage(message);
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (userId === null) {
      setErrorMessage('Unable to read userId from access token.');
      return;
    }

    const dateRange = getValidatedDateRange();
    if (!dateRange) {
      return;
    }

    setIsPdfLoading(true);
    setErrorMessage(null);

    try {
      const pdfBlob = await downloadExpensePdf(
        userId,
        dateRange.startDate,
        dateRange.endDate,
        authHeader
      );

      const pdfUrl = URL.createObjectURL(pdfBlob);
      const anchor = document.createElement('a');
      anchor.href = pdfUrl;
      anchor.download = 'expense-report.pdf';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(pdfUrl);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to download expense PDF.';
      setErrorMessage(message);
    } finally {
      setIsPdfLoading(false);
    }
  };

  const handleSendEmail = async () => {
    if (userId === null) {
      setErrorMessage('Unable to read userId from access token.');
      setSuccessMessage(null);
      return;
    }

    const dateRange = getValidatedDateRange();
    if (!dateRange) {
      setSuccessMessage(null);
      return;
    }

    const confirmed = window.confirm(
      `Send expense report email for ${dateRange.startDate} to ${dateRange.endDate}?`
    );
    if (!confirmed) {
      return;
    }

    setIsEmailSending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await sendExpenseReportEmail(
        {
          userId,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          subject: emailSubject.trim()
            ? emailSubject.trim()
            : buildDefaultEmailSubject(dateRange.startDate, dateRange.endDate),
          body: emailBody.trim()
            ? emailBody.trim()
            : buildDefaultEmailBody(dateRange.startDate, dateRange.endDate),
        },
        authHeader
      );

      const recipient = normalizeEmailRecipient(response.to);
      setSuccessMessage(
        `${response.message}. To: ${recipient}. Attachment: ${response.attachmentFileName}`
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to send expense report email.';
      setErrorMessage(message);
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleSortChange = (field: ExpenseReportSortField) => {
    setCurrentPage(1);
    setSortField((prevField) => {
      if (prevField === field) {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
        return prevField;
      }

      setSortOrder('asc');
      return field;
    });
  };

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(nextPage);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEmailSubjectChange = (value: string) => {
    setIsEmailSubjectDirty(true);
    setEmailSubject(value);
  };

  const handleEmailBodyChange = (value: string) => {
    setIsEmailBodyDirty(true);
    setEmailBody(value);
  };

  return (
    <ExpenseReportPresenter
      filters={filters}
      categories={categories}
      reportRows={pagedRows}
      isLoading={isLoading}
      isPdfLoading={isPdfLoading}
      isEmailSending={isEmailSending}
      errorMessage={errorMessage}
      successMessage={successMessage}
      currentPage={currentPage}
      totalPages={totalPages}
      sortField={sortField}
      sortOrder={sortOrder}
      emailSubject={emailSubject}
      emailBody={emailBody}
      onFilterChange={handleFilterChange}
      onApplyFilters={handleApplyFilters}
      onRefresh={handleRefresh}
      onViewPdf={handleViewPdf}
      onDownloadPdf={handleDownloadPdf}
      onSendEmail={handleSendEmail}
      onEmailSubjectChange={handleEmailSubjectChange}
      onEmailBodyChange={handleEmailBodyChange}
      onSortChange={handleSortChange}
      onPageChange={handlePageChange}
      onLogout={handleLogout}
    />
  );
};

export default ExpenseReportContainer;
