import type { FormEvent } from 'react';
import Header from '../../../components/Header';
import type {
  ExpenseCategory,
  ExpenseCategoryStatus,
} from '../types/ExpenseCategoryTypes';
import '../styles/ExpenseCategory.css';

interface ExpenseCategoryPresenterProps {
  categories: ExpenseCategory[];
  isLoading: boolean;
  errorMessage: string | null;
  formState: {
    name: string;
    description: string;
    userId: string;
    permissionId: string;
    status: ExpenseCategoryStatus;
    createdBy: string;
    modifiedBy: string;
  };
  isEditing: boolean;
  onChange: (field: string, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEdit: (category: ExpenseCategory) => void;
  onDelete: (id: number) => void;
  onCancelEdit: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

const ExpenseCategoryPresenter = ({
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
}: ExpenseCategoryPresenterProps) => {
  return (
    <div className="expense-category">
      <Header onLogout={onLogout} />

      <section className="expense-category__hero">
        <div>
          <p className="expense-category__eyebrow">Expense Center</p>
          <h1>Expense Categories</h1>
          <p className="expense-category__subtitle">
            Create, update, and manage your spending categories in one place.
          </p>
        </div>
        <button className="ghost-button" onClick={onRefresh}>
          Refresh
        </button>
      </section>

      <section className="expense-category__layout">
        <form className="expense-category__card" onSubmit={onSubmit}>
          <h2>{isEditing ? 'Update Category' : 'Create Category'}</h2>
          <div className="expense-category__grid">
            <label>
              Name
              <input
                type="text"
                value={formState.name}
                onChange={(event) => onChange('name', event.target.value)}
                required
              />
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
              User Id
              <input
                type="number"
                value={formState.userId}
                onChange={(event) => onChange('userId', event.target.value)}
                required
                disabled={isEditing}
              />
            </label>
            <label>
              Permission Id
              <input
                type="number"
                value={formState.permissionId}
                onChange={(event) => onChange('permissionId', event.target.value)}
                required
                disabled={isEditing}
              />
            </label>
            <label>
              Status
              <select
                value={formState.status}
                onChange={(event) => onChange('status', event.target.value)}
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
          <div className="expense-category__actions">
            <button className="primary-button" type="submit" disabled={isLoading}>
              {isEditing ? 'Update Category' : 'Create Category'}
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
            <p className="expense-category__error">{errorMessage}</p>
          ) : null}
        </form>

        <div className="expense-category__card expense-category__table-card">
          <div className="expense-category__table-header">
            <div>
              <h2>Saved Categories</h2>
              <p>Manage existing categories and keep them up to date.</p>
            </div>
            {isLoading ? <span>Loading...</span> : null}
          </div>
          <div className="expense-category__table">
            <div className="expense-category__row expense-category__row--head">
              <span>Name</span>
              <span>Description</span>
              <span>Status</span>
              <span>Created By</span>
              <span>Actions</span>
            </div>
            {categories.length === 0 ? (
              <div className="expense-category__empty">
                No categories found. Create one to get started.
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="expense-category__row">
                  <span>{category.name}</span>
                  <span>{category.description}</span>
                  <span>{category.status}</span>
                  <span>{category.createdBy}</span>
                  <span className="expense-category__row-actions">
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => onEdit(category)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="link-button link-button--danger"
                      onClick={() => onDelete(category.id)}
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

export default ExpenseCategoryPresenter;
