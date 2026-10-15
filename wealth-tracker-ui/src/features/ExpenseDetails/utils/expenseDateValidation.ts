/**
 * Utilities and validation for Expense Details dates.
 */

export const FUTURE_EXPENSE_DATE_ERROR = 'Expense date cannot be in the future.';

/**
 * Returns today's date in local timezone formatted as YYYY-MM-DD.
 * Ensures timezone differences do not cause today's date to be misidentified.
 */
export const getTodayLocalDateString = (referenceDate: Date = new Date()): string => {
  const year = referenceDate.getFullYear();
  const month = String(referenceDate.getMonth() + 1).padStart(2, '0');
  const day = String(referenceDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Checks if the given date string (YYYY-MM-DD) is in the future
 * relative to the current local date.
 */
export const isFutureExpenseDate = (
  dateStr: string,
  referenceDate: Date = new Date()
): boolean => {
  if (!dateStr || typeof dateStr !== 'string') {
    return false;
  }
  const trimmed = dateStr.trim();
  if (!trimmed) {
    return false;
  }
  const todayStr = getTodayLocalDateString(referenceDate);
  return trimmed > todayStr;
};

/**
 * Validates an expense date string.
 * Returns an error message string if invalid, or null if valid.
 */
export const validateExpenseDate = (
  dateStr: string,
  referenceDate: Date = new Date()
): string | null => {
  if (!dateStr || !dateStr.trim()) {
    return 'Expense date is required.';
  }
  if (isFutureExpenseDate(dateStr, referenceDate)) {
    return FUTURE_EXPENSE_DATE_ERROR;
  }
  return null;
};
