import type { FormEvent } from 'react';
import Header from '../../../components/Header';
import type { ExpenseDetails, ExpenseStatus } from '../types/ExpenseDetailsTypes';
import type { ExpenseCategory } from '../../ExpenseCategory/types/ExpenseCategoryTypes';
import '../styles/ExpenseDetails.css';

interface ExpenseDetailsPresenterProps {
  expenseDetails: ExpenseDetails[];
  categories: ExpenseCategory[];
  isLoading: boolean;
  errorMessage: string | null;
  formState: {
    expenseName: string;
    expenseDate: string;
    amount: string;
    description: string;
    paymentMethod: string;
    expenseCode: string;
    referenceNumber: string;
    receiptUrl: string;
    currency: string;
    userId: string;
    status: ExpenseStatus;
    categoryId: string;
    createdBy: string;
    modifiedBy: string;
  };
  isEditing: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEdit: (detail: ExpenseDetails) => void;
  onDelete: (id: number) => void;
  onCancelEdit: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

const ExpenseDetailsPresenter = ({
  expenseDetails,
  categories,
  isLoading,
  errorMessage,
  formState,
  isEditing,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancelEdit,
  onRefresh,
  onLogout,
}: ExpenseDetailsPresenterProps) => {
  return (
    <div className="expense-details">
      <Header onLogout={onLogout} />

      <section className="expense-details__hero">
        <div>
          <p className="expense-details__eyebrow">Expense Center</p>
          <h1>Expense Details</h1>
          <p className="expense-details__subtitle">
            Track every spend, update entries, and keep your ledger accurate.
          </p>
        </div>
        <button className="ghost-button" onClick={onRefresh}>
          Refresh
        </button>
      </section>

      <section className="expense-details__layout">
        <form className="expense-details__card" onSubmit={onSubmit}>
          <h2>{isEditing ? 'Update Expense' : 'Create Expense'}</h2>
          <div className="expense-details__grid">
            <label>
              Expense Name
              <input
                type="text"
                value={formState.expenseName}
                onChange={(event) => onChange('expenseName', event.target.value)}
                required
                disabled={isEditing}
              />
            </label>
            <label>
              Expense Date
              <input
                type="date"
                value={formState.expenseDate}
                onChange={(event) => onChange('expenseDate', event.target.value)}
                required
                disabled={isEditing}
              />
            </label>
            <label>
              Amount
              <input
                type="number"
                step="0.01"
                value={formState.amount}
                onChange={(event) => onChange('amount', event.target.value)}
                required
              />
            </label>
            <label>
              Payment Method
              <select
                value={formState.paymentMethod}
                onChange={(event) =>
                  onChange('paymentMethod', event.target.value)
                }
                required
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Credit card">Credit card</option>
                <option value="Debit card">Debit card</option>
                <option value="Net banking">Net banking</option>
              </select>
            </label>
            <label>
              Description
              <input
                type="text"
                value={formState.description}
                onChange={(event) => onChange('description', event.target.value)}
                required
              />
            </label>
            <label>
              Expense Code
              <input
                type="text"
                value={formState.expenseCode}
                onChange={(event) => onChange('expenseCode', event.target.value)}
                required
                disabled={isEditing}
              />
            </label>
            <label>
              Reference Number
              <input
                type="text"
                value={formState.referenceNumber}
                onChange={(event) =>
                  onChange('referenceNumber', event.target.value)
                }
                required
                disabled={isEditing}
              />
            </label>
            <label>
              Receipt URL
              <input
                type="url"
                value={formState.receiptUrl}
                onChange={(event) => onChange('receiptUrl', event.target.value)}
                required
                disabled={isEditing}
              />
            </label>
            <label>
              Currency
              <input
                type="text"
                value={formState.currency}
                onChange={(event) => onChange('currency', event.target.value)}
                required
                disabled={isEditing}
              />
            </label>
            <label>
              User Id
              <input
                type="number"
                value={formState.userId}
                onChange={(event) => onChange('userId', event.target.value)}
                required
                disabled
              />
            </label>
            <label>
              Category Id
              <select
                value={formState.categoryId}
                onChange={(event) => onChange('categoryId', event.target.value)}
                required
                disabled={isEditing || categories.length === 0}
              >
                {categories.length === 0 ? (
                  <option value="">No categories available</option>
                ) : (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </label>
            <label>
              Status
              <select
                value={formState.status}
                onChange={(event) => onChange('status', event.target.value)}
                disabled={isEditing}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </label>
            <label>
              Created By
              <input
                type="text"
                value={formState.createdBy}
                onChange={(event) => onChange('createdBy', event.target.value)}
                required
                disabled
              />
            </label>
            <label>
              Modified By
              <input
                type="text"
                value={formState.modifiedBy}
                onChange={(event) => onChange('modifiedBy', event.target.value)}
                required={isEditing}
                disabled
              />
            </label>
          </div>
          <div className="expense-details__actions">
            <button className="primary-button" type="submit" disabled={isLoading}>
              {isEditing ? 'Update Expense' : 'Create Expense'}
            </button>
            {isEditing ? (
              <button
                className="ghost-button"
                type="button"
                onClick={onCancelEdit}
              >
                Cancel
              </button>
            ) : null}
          </div>
          {errorMessage ? (
            <p className="expense-details__error">{errorMessage}</p>
          ) : null}
        </form>

        <div className="expense-details__card expense-details__table-card">
          <div className="expense-details__table-header">
            <div>
              <h2>Saved Expenses</h2>
              <p>Review and manage your expense entries.</p>
            </div>
            {isLoading ? <span>Loading...</span> : null}
          </div>
          <div className="expense-details__table">
            <div className="expense-details__row expense-details__row--head">
              <span>Expense Name</span>
              <span>Amount</span>
              <span>Payment Method</span>
              <span>Expense Date</span>
              <span>Actions</span>
            </div>
            {expenseDetails.length === 0 ? (
              <div className="expense-details__empty">
                No expenses found. Create one to get started.
              </div>
            ) : (
              expenseDetails.map((detail) => (
                <div key={detail.id} className="expense-details__row">
                  <span>{detail.expenseName}</span>
                  <span>{detail.amount.toFixed(2)}</span>
                  <span>{detail.paymentMethod}</span>
                  <span>{detail.expenseDate}</span>
                  <span className="expense-details__row-actions">
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => onEdit(detail)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="link-button link-button--danger"
                      onClick={() => onDelete(detail.id)}
                    >
                      Delete
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExpenseDetailsPresenter;
