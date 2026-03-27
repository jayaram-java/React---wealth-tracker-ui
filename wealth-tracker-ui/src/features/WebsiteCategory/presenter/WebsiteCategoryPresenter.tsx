import type { FormEvent } from 'react';
import Header from '../../../components/Header';
import type { WebsiteCategory } from '../types/WebsiteCategoryTypes';
import '../styles/WebsiteCategory.css';

interface WebsiteCategoryPresenterProps {
  categories: WebsiteCategory[];
  isLoading: boolean;
  errorMessage: string | null;
  formState: {
    categoryName: string;
    description: string;
    isActive: boolean;
    createdBy: string;
    modifiedBy: string;
  };
  isEditing: boolean;
  onChange: (field: keyof WebsiteCategoryPresenterProps['formState'], value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEdit: (category: WebsiteCategory) => void;
  onDelete: (id: number) => void;
  onCancelEdit: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

const WebsiteCategoryPresenter = ({
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
}: WebsiteCategoryPresenterProps) => {
  return (
    <div className="website-category">
      <Header onLogout={onLogout} />

      <section className="website-category__hero">
        <div>
          <p className="website-category__eyebrow">Website Center</p>
          <h1>Website Categories</h1>
          <p className="website-category__subtitle">
            Maintain the website categories used across your expense tracker.
          </p>
        </div>
        <button className="ghost-button" onClick={onRefresh}>
          Refresh
        </button>
      </section>

      <section className="website-category__layout">
        <form className="website-category__card" onSubmit={onSubmit}>
          <h2>{isEditing ? 'Update Category' : 'Create Category'}</h2>
          <div className="website-category__grid">
            <label>
              Category Name
              <input
                type="text"
                value={formState.categoryName}
                onChange={(event) => onChange('categoryName', event.target.value)}
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
              Active
              <select
                value={String(formState.isActive)}
                onChange={(event) => onChange('isActive', event.target.value)}
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
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
          <div className="website-category__actions">
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
            <p className="website-category__error">{errorMessage}</p>
          ) : null}
        </form>

        <div className="website-category__card website-category__table-card">
          <div className="website-category__table-header">
            <div>
              <h2>Saved Categories</h2>
              <p>View and manage your website categories.</p>
            </div>
            {isLoading ? <span>Loading...</span> : null}
          </div>
          <div className="website-category__table">
            <div className="website-category__row website-category__row--head">
              <span>Category Name</span>
              <span>Description</span>
              <span>Active</span>
              <span>Actions</span>
            </div>
            {categories.length === 0 ? (
              <div className="website-category__empty">
                No categories found. Create one to get started.
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="website-category__row">
                  <span>{category.categoryName}</span>
                  <span>{category.description}</span>
                  <span>{category.isActive ? 'Yes' : 'No'}</span>
                  <span className="website-category__row-actions">
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

export default WebsiteCategoryPresenter;
