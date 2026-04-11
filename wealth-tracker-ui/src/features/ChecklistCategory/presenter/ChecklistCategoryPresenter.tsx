import type { FormEvent } from 'react';
import Header from '../../../components/Header';
import type { ChecklistCategory } from '../types/ChecklistCategoryTypes';
import '../styles/ChecklistCategory.css';

interface ChecklistCategoryFormState {
  name: string;
  description: string;
  userId: string;
  isActive: boolean;
  isPrimary: boolean;
  createdBy: string;
  modifiedBy: string;
}

interface ChecklistCategoryPresenterProps {
  categories: ChecklistCategory[];
  isLoading: boolean;
  errorMessage: string | null;
  formState: ChecklistCategoryFormState;
  isEditing: boolean;
  onChange: (field: keyof ChecklistCategoryFormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEdit: (category: ChecklistCategory) => void;
  onDelete: (id: number) => void;
  onCancelEdit: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

const ChecklistCategoryPresenter = ({
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
}: ChecklistCategoryPresenterProps) => {
  return (
    <div className="checklist-category">
      <Header onLogout={onLogout} />

      <section className="checklist-category__hero">
        <div>
          <p className="checklist-category__eyebrow">Checklist Center</p>
          <h1>Checklist Categories</h1>
          <p className="checklist-category__subtitle">
            Organize move-in, travel, or life-event checklists with ease.
          </p>
        </div>
        <button className="ghost-button" onClick={onRefresh}>
          Refresh
        </button>
      </section>

      <section className="checklist-category__layout">
        <form className="checklist-category__card" onSubmit={onSubmit}>
          <h2>{isEditing ? 'Update Checklist Category' : 'Create Checklist Category'}</h2>
          <div className="checklist-category__grid">
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
                disabled
              />
            </label>
            <label>
              Active
              <select
                value={String(formState.isActive)}
                onChange={(event) => onChange('isActive', event.target.value)}
              >
                <option value="true">ACTIVE</option>
                <option value="false">INACTIVE</option>
              </select>
            </label>
            <label>
              Primary
              <select
                value={String(formState.isPrimary)}
                onChange={(event) => onChange('isPrimary', event.target.value)}
              >
                <option value="true">YES</option>
                <option value="false">NO</option>
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
          <div className="checklist-category__actions">
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
            <p className="checklist-category__error">{errorMessage}</p>
          ) : null}
        </form>

        <div className="checklist-category__card checklist-category__table-card">
          <div className="checklist-category__table-header">
            <div>
              <h2>Saved Categories</h2>
              <p>Review checklist categories and keep them current.</p>
            </div>
            {isLoading ? <span>Loading...</span> : null}
          </div>
          <div className="checklist-category__table">
            <div className="checklist-category__row checklist-category__row--head">
              <span>Name</span>
              <span>Description</span>
              <span>Primary</span>
              <span>Actions</span>
            </div>
            {categories.length === 0 ? (
              <div className="checklist-category__empty">
                No checklist categories found. Create one to get started.
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="checklist-category__row">
                  <span>{category.name}</span>
                  <span>{category.description}</span>
                  <span>{category.isPrimary ? 'YES' : 'NO'}</span>
                  <span className="checklist-category__row-actions">
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

export default ChecklistCategoryPresenter;
