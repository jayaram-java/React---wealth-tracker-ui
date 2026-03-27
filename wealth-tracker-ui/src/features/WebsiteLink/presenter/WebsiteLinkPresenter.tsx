import type { FormEvent } from 'react';
import Header from '../../../components/Header';
import type { WebsiteLink } from '../types/WebsiteLinkTypes';
import type { WebsiteCategory } from '../../WebsiteCategory/types/WebsiteCategoryTypes';
import '../styles/WebsiteLink.css';

interface WebsiteLinkPresenterProps {
  links: WebsiteLink[];
  categories: WebsiteCategory[];
  isLoading: boolean;
  errorMessage: string | null;
  formState: {
    websiteLink: string;
    description: string;
    remarks: string;
    isActive: boolean;
    categoryId: string;
    createdBy: string;
    modifiedBy: string;
  };
  isEditing: boolean;
  filterCategoryId: string;
  currentPage: number;
  totalPages: number;
  onChange: (
    field: keyof WebsiteLinkPresenterProps['formState'],
    value: string
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onEdit: (link: WebsiteLink) => void;
  onDelete: (id: number) => void;
  onCancelEdit: () => void;
  onFilterChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onLogout: () => void;
}

const WebsiteLinkPresenter = ({
  links,
  categories,
  isLoading,
  errorMessage,
  formState,
  isEditing,
  filterCategoryId,
  currentPage,
  totalPages,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancelEdit,
  onFilterChange,
  onPageChange,
  onRefresh,
  onLogout,
}: WebsiteLinkPresenterProps) => {
  const categoryLookup = new Map(
    categories.map((category) => [category.id, category.categoryName])
  );

  return (
    <div className="website-link">
      <Header onLogout={onLogout} />

      <section className="website-link__hero">
        <div>
          <p className="website-link__eyebrow">Website Center</p>
          <h1>Website Links</h1>
          <p className="website-link__subtitle">
            Add and manage links grouped by website categories.
          </p>
        </div>
        <button className="ghost-button" onClick={onRefresh}>
          Refresh
        </button>
      </section>

      <section className="website-link__layout">
        <form className="website-link__card" onSubmit={onSubmit}>
          <h2>{isEditing ? 'Update Link' : 'Create Link'}</h2>
          <div className="website-link__grid">
            <label>
              Website Link
              <input
                type="url"
                value={formState.websiteLink}
                onChange={(event) => onChange('websiteLink', event.target.value)}
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
              Remarks
              <textarea
                value={formState.remarks}
                onChange={(event) => onChange('remarks', event.target.value)}
                required
              />
            </label>
            <label>
              Category
              <select
                value={formState.categoryId}
                onChange={(event) => onChange('categoryId', event.target.value)}
                required
                disabled={categories.length === 0}
              >
                {categories.length === 0 ? (
                  <option value="">No categories available</option>
                ) : (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))
                )}
              </select>
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
          <div className="website-link__actions">
            <button className="primary-button" type="submit" disabled={isLoading}>
              {isEditing ? 'Update Link' : 'Create Link'}
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
            <p className="website-link__error">{errorMessage}</p>
          ) : null}
        </form>

        <div className="website-link__card website-link__table-card">
          <div className="website-link__table-header">
            <div>
              <h2>Saved Links</h2>
              <p>Manage website links and their categories.</p>
            </div>
            <div className="website-link__table-controls">
              <label className="website-link__filter">
                Category
                <select
                  value={filterCategoryId}
                  onChange={(event) => onFilterChange(event.target.value)}
                >
                  <option value="all">All</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </label>
              {isLoading ? <span>Loading...</span> : null}
            </div>
          </div>
          <div className="website-link__table">
            <div className="website-link__row website-link__row--head">
              <span>Website Link</span>
              <span>Description</span>
              <span>Category</span>
              <span>Actions</span>
            </div>
            {links.length === 0 ? (
              <div className="website-link__empty">
                No links found. Create one to get started.
              </div>
            ) : (
              links.map((link) => (
                <div key={link.id} className="website-link__row">
                  <span>
                    <a
                      className="website-link__url"
                      href={link.websiteLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.websiteLink}
                    </a>
                  </span>
                  <span>{link.description}</span>
                  <span>{categoryLookup.get(link.categoryId) ?? '—'}</span>
                  <span className="website-link__row-actions">
                    <button
                      type="button"
                      className="link-button"
                      onClick={() => onEdit(link)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="link-button link-button--danger"
                      onClick={() => onDelete(link.id)}
                    >
                      Delete
                    </button>
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="website-link__pagination">
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
        </div>
      </section>
    </div>
  );
};

export default WebsiteLinkPresenter;
