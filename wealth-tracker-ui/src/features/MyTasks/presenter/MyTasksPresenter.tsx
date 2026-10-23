import '../styles/MyTasks.css';
import type { FormEvent } from 'react';
import {
  ArrowDownWideNarrow,
  CheckCircle2,
  CircleDotDashed,
  ClipboardList,
  ListChecks,
  Plus,
  RefreshCw,
} from 'lucide-react';
import TaskForm from '../components/TaskForm';
import TaskTable from '../components/TaskTable';
import TaskFiltersComponent from '../components/TaskFilters';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import TaskDetailsModal from '../components/TaskDetailsModal';
import type {
  EmployeeTask,
  TaskFormState,
  TaskFilters,
  TaskSummary,
} from '../types/MyTasksTypes';

// ─── Pagination component ─────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

const ROWS_OPTIONS = [5, 10, 25, 50];

const getPageNumbers = (current: number, total: number): (number | '…')[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | '…')[] = [];
  pages.push(1);
  if (current > 3) pages.push('…');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push('…');
  pages.push(total);
  return pages;
};

const Pagination = ({
  currentPage,
  totalPages,
  totalTasks,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: PaginationProps) => {
  const start = totalTasks === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, totalTasks);
  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="mytasks__pagination">
      {/* Left: rows-per-page selector */}
      <div className="mytasks__rows-per-page">
        <span>Rows per page:</span>
        <select
          className="mytasks__rows-select"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          aria-label="Rows per page"
        >
          {ROWS_OPTIONS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* Centre: page buttons */}
      <div className="mytasks__pagination-controls" role="navigation" aria-label="Pagination">
        <button
          type="button"
          className="mytasks__page-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          ‹
        </button>

        {pages.map((p, idx) =>
          p === '…' ? (
            <span
              key={`ellipsis-${idx}`}
              className="mytasks__page-btn"
              style={{ cursor: 'default', border: 'none', background: 'transparent' }}
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={`mytasks__page-btn${p === currentPage ? ' mytasks__page-btn--active' : ''}`}
              onClick={() => onPageChange(p as number)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          type="button"
          className="mytasks__page-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          ›
        </button>
      </div>

      {/* Right: record count */}
      <span className="mytasks__pagination-info">
        {totalTasks === 0 ? 'No tasks' : `${start}–${end} of ${totalTasks} tasks`}
      </span>
    </div>
  );
};

// ─── Presenter ────────────────────────────────────────────────────────────────

interface MyTasksPresenterProps {
  tasks: EmployeeTask[];
  isLoading: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  listError: string | null;
  formError: string | null;
  formState: TaskFormState;
  isEditing: boolean;
  filters: TaskFilters;
  dynamicStatuses: string[];
  deleteTarget: EmployeeTask | null;
  viewTarget: EmployeeTask | null;
  // pagination
  currentPage: number;
  totalPages: number;
  totalTasks: number;
  rowsPerPage: number;
  taskSummary: TaskSummary;
  // handlers
  onFilterChange: (field: keyof TaskFilters, value: string) => void;
  onClearFilters: () => void;
  onFormChange: (field: keyof TaskFormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancelEdit: () => void;
  onView: (task: EmployeeTask) => void;
  onCloseView: () => void;
  onEdit: (task: EmployeeTask) => void;
  onDeleteRequest: (task: EmployeeTask) => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
  onRefresh: () => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

const MyTasksPresenter = ({
  tasks,
  isLoading,
  isSubmitting,
  isDeleting,
  listError,
  formError,
  formState,
  isEditing,
  filters,
  dynamicStatuses,
  deleteTarget,
  viewTarget,
  currentPage,
  totalPages,
  totalTasks,
  rowsPerPage,
  taskSummary,
  onFilterChange,
  onClearFilters,
  onFormChange,
  onSubmit,
  onCancelEdit,
  onView,
  onCloseView,
  onEdit,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
  onRefresh,
  onPageChange,
  onRowsPerPageChange,
}: MyTasksPresenterProps) => (
  <main className="mytasks" data-testid="my-tasks-page">
    <section className="mytasks__hero" aria-labelledby="mytasks-title">
      <div className="mytasks__hero-copy">
        <div className="mytasks__hero-icon" aria-hidden="true">
          <ClipboardList size={26} strokeWidth={2.25} />
        </div>
        <div>
          <p className="mytasks__eyebrow">Task workspace</p>
          <h1 id="mytasks-title">My Tasks</h1>
          <p className="mytasks__subtitle">
            Plan work, monitor progress, and keep every employee task on track.
          </p>
        </div>
      </div>
      <div className="mytasks__hero-actions">
        <button
          type="button"
          className="ghost-button mytasks__refresh-button"
          onClick={onRefresh}
          disabled={isLoading}
          data-testid="tasks-refresh"
          aria-label="Refresh task list"
        >
          <RefreshCw size={16} aria-hidden="true" className={isLoading ? 'mytasks__spin' : undefined} />
          Refresh
        </button>
        <button
          type="button"
          className="primary-button mytasks__add-button"
          onClick={() => document.getElementById('mytasks-task-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          <Plus size={17} aria-hidden="true" />
          Add task
        </button>
      </div>
    </section>

    <section className="mytasks__summary" aria-label="Task summary">
      <article className="mytasks__summary-card">
        <span className="mytasks__summary-icon mytasks__summary-icon--blue" aria-hidden="true">
          <ListChecks size={20} />
        </span>
        <div>
          <p>Total tasks</p>
          <strong>{taskSummary.total}</strong>
        </div>
      </article>
      <article className="mytasks__summary-card">
        <span className="mytasks__summary-icon mytasks__summary-icon--amber" aria-hidden="true">
          <CircleDotDashed size={20} />
        </span>
        <div>
          <p>In progress</p>
          <strong>{taskSummary.inProgress}</strong>
        </div>
      </article>
      <article className="mytasks__summary-card">
        <span className="mytasks__summary-icon mytasks__summary-icon--green" aria-hidden="true">
          <CheckCircle2 size={20} />
        </span>
        <div>
          <p>Completed</p>
          <strong>{taskSummary.completed}</strong>
        </div>
      </article>
      <article className="mytasks__summary-card">
        <span className="mytasks__summary-icon mytasks__summary-icon--violet" aria-hidden="true">
          <ClipboardList size={20} />
        </span>
        <div>
          <p>Active tasks</p>
          <strong>{taskSummary.active}</strong>
        </div>
      </article>
    </section>

    <div className="mytasks__layout">
      <TaskForm
        formState={formState}
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        formError={formError}
        onChange={onFormChange}
        onSubmit={onSubmit}
        onCancel={onCancelEdit}
      />

      <section className="mytasks__card mytasks__table-card" aria-labelledby="all-tasks-heading">
        <div className="mytasks__table-header">
          <div>
            <p className="mytasks__section-kicker">Task directory</p>
            <h2 id="all-tasks-heading">All tasks</h2>
            <p>Search, review, and manage tasks from one place.</p>
          </div>
          <div className="mytasks__table-meta">
            <span className="mytasks__sort-note">
              <ArrowDownWideNarrow size={15} aria-hidden="true" />
              Latest first
            </span>
            <span className="mytasks__record-count">
              {totalTasks} {totalTasks === 1 ? 'record' : 'records'}
            </span>
          </div>
        </div>

        <TaskFiltersComponent
          filters={filters}
          dynamicStatuses={dynamicStatuses}
          onChange={onFilterChange}
          onClearFilters={onClearFilters}
        />

        {listError ? (
          <p className="mytasks__error" role="alert" aria-live="polite">
            {listError}
          </p>
        ) : null}

        <TaskTable
          tasks={tasks}
          isLoading={isLoading}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDeleteRequest}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalTasks={totalTasks}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </section>
    </div>

    <DeleteConfirmDialog
      open={deleteTarget !== null}
      taskName={deleteTarget?.taskName ?? ''}
      isLoading={isDeleting}
      onConfirm={onDeleteConfirm}
      onCancel={onDeleteCancel}
    />

    <TaskDetailsModal task={viewTarget} onClose={onCloseView} />
  </main>
);

export default MyTasksPresenter;
