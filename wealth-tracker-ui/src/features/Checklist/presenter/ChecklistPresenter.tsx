import type { FormEvent } from 'react';
import Header from '../../../components/Header';
import type { ChecklistItem, ChecklistStatus } from '../types/ChecklistTypes';
import type { ChecklistCategory } from '../../ChecklistCategory/types/ChecklistCategoryTypes';
import '../styles/Checklist.css';

interface ChecklistFormState {
  title: string;
  description: string;
  checklistCategoryId: string;
  userId: string;
  status: ChecklistStatus;
  referenceLink: string;
  completedAt: string;
  createdBy: string;
  modifiedBy: string;
}

interface ChecklistPresenterProps {
  items: ChecklistItem[];
  categories: ChecklistCategory[];
  isLoading: boolean;
  errorMessage: string | null;
  formState: ChecklistFormState;
  isEditing: boolean;
  onChange: (field: keyof ChecklistFormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEdit: (item: ChecklistItem) => void;
  onDelete: (id: number) => void;
  onCancelEdit: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

const ChecklistPresenter = ({
  items,
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
}: ChecklistPresenterProps) => {
  const getCategoryName = (categoryId: number) => {
    const match = categories.find((category) => category.id === categoryId);
    return match ? match.name : `#${categoryId}`;
  };

  return (
    <div className="checklist">
      <Header onLogout={onLogout} />

      <section className="checklist__hero">
        <div>
          <p className="checklist__eyebrow">Checklist Center</p>
          <h1>Checklists</h1>
          <p className="checklist__subtitle">
            Track task progress and keep your plans on schedule.
          </p>
        </div>
        <button className="ghost-button" onClick={onRefresh}>
          Refresh
        </button>
      </section>

      <section className="checklist__layout">
        <form className="checklist__card" onSubmit={onSubmit}>
          <h2>{isEditing ? 'Update Checklist Item' : 'Create Checklist Item'}</h2>
          <div className="checklist__grid">
            <label>
              Title
              <input
                type="text"
                value={formState.title}
                onChange={(event) => onChange('title', event.target.value)}
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
              Category
              <select
                value={formState.checklistCategoryId}
                onChange={(event) =>
                  onChange('checklistCategoryId', event.target.value)
                }
                required
                disabled={categories.length === 0}
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
              >
                <option value="PENDING">PENDING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </label>
            <label>
              Reference Link
              <input
                type="url"
                value={formState.referenceLink}
                onChange={(event) =>
                  onChange('referenceLink', event.target.value)
                }
                required
              />
            </label>
            <label>
              Completed At
              <input
                type="datetime-local"
                value={formState.completedAt}
                onChange={(event) => onChange('completedAt', event.target.value)}
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
          <div className="checklist__actions">
            <button className="primary-button" type="submit" disabled={isLoading}>
              {isEditing ? 'Update Checklist' : 'Create Checklist'}
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
          {errorMessage ? <p className="checklist__error">{errorMessage}</p> : null}
        </form>

        <div className="checklist__card checklist__table-card">
          <div className="checklist__table-header">
            <div>
              <h2>Saved Checklist Items</h2>
              <p>Review checklist items and keep them updated.</p>
            </div>
            {isLoading ? <span>Loading...</span> : null}
          </div>
          <div className="checklist__table">
            <div className="checklist__row checklist__row--head">
              <span>Title</span>
              <span>Description</span>
              <span>Status</span>
              <span>Category</span>
              <span>Actions</span>
            </div>
            {items.length === 0 ? (
              <div className="checklist__empty">
                No checklist items found. Create one to get started.
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="checklist__row">
                  <span>{item.title}</span>
                  <span>{item.description}</span>
                  <span>{item.status}</span>
                  <span>{getCategoryName(item.checklistCategoryId)}</span>
                  <span className="checklist__row-actions">
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="link-button link-button--danger"
                      onClick={() => onDelete(item.id)}
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

export default ChecklistPresenter;
