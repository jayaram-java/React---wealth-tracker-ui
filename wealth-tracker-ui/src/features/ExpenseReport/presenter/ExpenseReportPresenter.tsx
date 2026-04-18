import Header from '../../../components/Header';
import type { ExpenseCategory } from '../../ExpenseCategory/types/ExpenseCategoryTypes';
import type {
  ExpenseReportFilters,
  ExpenseReportItem,
  ExpenseReportSortField,
  ExpenseReportSortOrder,
} from '../types/ExpenseReportTypes';
import '../styles/ExpenseReport.css';

interface ExpenseReportPresenterProps {
  filters: ExpenseReportFilters;
  categories: ExpenseCategory[];
  reportRows: ExpenseReportItem[];
  isLoading: boolean;
  isPdfLoading: boolean;
  errorMessage: string | null;
  currentPage: number;
  totalPages: number;
  sortField: ExpenseReportSortField;
  sortOrder: ExpenseReportSortOrder;
  onFilterChange: (field: keyof ExpenseReportFilters, value: string) => void;
  onApplyFilters: () => void;
  onRefresh: () => void;
  onViewPdf: () => void;
  onDownloadPdf: () => void;
  onSortChange: (field: ExpenseReportSortField) => void;
  onPageChange: (page: number) => void;
  onLogout: () => void;
}

const dateFormatter = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const amountFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
});

const formatDate = (value: string) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return dateFormatter.format(parsed);
};

const getSortLabel = (
  field: ExpenseReportSortField,
  activeField: ExpenseReportSortField,
  activeOrder: ExpenseReportSortOrder
) => {
  if (field !== activeField) {
    return '';
  }
  return activeOrder === 'asc' ? ' (Asc)' : ' (Desc)';
};

const ExpenseReportPresenter = ({
  filters,
  categories,
  reportRows,
  isLoading,
  isPdfLoading,
  errorMessage,
  currentPage,
  totalPages,
  sortField,
  sortOrder,
  onFilterChange,
  onApplyFilters,
  onRefresh,
  onViewPdf,
  onDownloadPdf,
  onSortChange,
  onPageChange,
  onLogout,
}: ExpenseReportPresenterProps) => {
  return (
    <div className="expense-report">
      <Header onLogout={onLogout} />

      <section className="expense-report__hero">
        <div>
          <p className="expense-report__eyebrow">Report Center</p>
          <h1>Expense Report</h1>
          <p className="expense-report__subtitle">
            Filter by date and category to analyze your spending quickly.
          </p>
        </div>
        <button className="ghost-button" onClick={onRefresh}>
          Refresh
        </button>
      </section>

      <section className="expense-report__card expense-report__filters">
        <label>
          From Date
          <input
            type="date"
            value={filters.startDate}
            onChange={(event) => onFilterChange('startDate', event.target.value)}
          />
        </label>

        <label>
          To Date
          <input
            type="date"
            value={filters.endDate}
            onChange={(event) => onFilterChange('endDate', event.target.value)}
          />
        </label>

        <label>
          Category
          <select
            value={filters.categoryId}
            onChange={(event) => onFilterChange('categoryId', event.target.value)}
          >
            <option value="ALL">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="expense-report__filter-actions">
          <button className="primary-button" onClick={onApplyFilters}>
            Apply Filters
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={onViewPdf}
            disabled={isPdfLoading}
          >
            {isPdfLoading ? 'Preparing PDF...' : 'View PDF'}
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={onDownloadPdf}
            disabled={isPdfLoading}
          >
            {isPdfLoading ? 'Preparing PDF...' : 'Download PDF'}
          </button>
        </div>
      </section>

      {errorMessage ? <p className="expense-report__error">{errorMessage}</p> : null}

      <section className="expense-report__card expense-report__table-card">
        <div className="expense-report__table-header">
          <h2>Expense Details</h2>
          {isLoading ? <span>Loading...</span> : null}
        </div>

        <div className="expense-report__table-actions">
          <button
            type="button"
            className="link-button"
            onClick={() => onSortChange('expenseDate')}
          >
            Sort Date{getSortLabel('expenseDate', sortField, sortOrder)}
          </button>
          <button
            type="button"
            className="link-button"
            onClick={() => onSortChange('amount')}
          >
            Sort Amount{getSortLabel('amount', sortField, sortOrder)}
          </button>
        </div>

        <div className="expense-report__table">
          <div className="expense-report__row expense-report__row--head">
            <span>Expense Name</span>
            <span>Expense Date</span>
            <span>Amount</span>
            <span>Receipt URL</span>
            <span>Payment Method</span>
          </div>

          {reportRows.length === 0 && !isLoading ? (
            <div className="expense-report__empty">
              No expenses found for the selected filters.
            </div>
          ) : (
            reportRows.map((row) => (
              <div key={row.id} className="expense-report__row">
                <span>{row.expenseName}</span>
                <span>{formatDate(row.expenseDate)}</span>
                <span>{amountFormatter.format(row.amount)}</span>
                <span>
                  {row.receiptUrl ? (
                    <a
                      href={row.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="expense-report__receipt-link"
                    >
                      Open Receipt
                    </a>
                  ) : (
                    '-'
                  )}
                </span>
                <span>{row.paymentMethod}</span>
              </div>
            ))
          )}
        </div>

        <div className="expense-report__pagination">
          <button
            type="button"
            className="link-button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            className="link-button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default ExpenseReportPresenter;
