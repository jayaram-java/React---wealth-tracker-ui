import type { FormEvent } from 'react';
import { CalendarDays, CheckCircle2, Save, X } from 'lucide-react';
import {
  TASK_STATUS_OPTIONS,
  TASK_CATEGORY_OPTIONS,
  IS_ACTIVE_OPTIONS,
  PROJECT_OPTIONS,
  MAX_TEXT_LENGTH,
} from '../constants';
import type { TaskFormState } from '../types/MyTasksTypes';

interface TaskFormProps {
  formState: TaskFormState;
  isEditing: boolean;
  isSubmitting: boolean;
  formError: string | null;
  onChange: (field: keyof TaskFormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const TaskForm = ({
  formState,
  isEditing,
  isSubmitting,
  formError,
  onChange,
  onSubmit,
  onCancel,
}: TaskFormProps) => (
  <form
    id="mytasks-task-form"
    className="mytasks__card"
    onSubmit={onSubmit}
    noValidate
    data-testid="task-form"
    aria-label={isEditing ? 'Edit task form' : 'Create task form'}
  >
    <header className="mytasks__form-header">
      <div>
        <p className="mytasks__section-kicker">
          {isEditing ? 'Update workspace' : 'New task'}
        </p>
        <h2>{isEditing ? 'Edit task' : 'Create task'}</h2>
        <p>
          {isEditing
            ? 'Keep the task details accurate and up to date.'
            : 'Add the essential details, then track progress from the task directory.'}
        </p>
      </div>
      <span className="mytasks__form-status">
        <CheckCircle2 size={16} aria-hidden="true" />
        {isEditing ? 'Editing task' : 'Ready to create'}
      </span>
    </header>

    {/* 4-column grid across the full card width */}
    <div className="mytasks__form-grid">

      {/* Row 1 */}
      <label htmlFor="tf-taskName" className="mytasks__form-label">
        <span>Task Name <span aria-hidden="true" className="mytasks__required">*</span></span>
        <input
          id="tf-taskName"
          type="text"
          className="mytasks__form-input"
          value={formState.taskName}
          onChange={(e) => onChange('taskName', e.target.value)}
          maxLength={MAX_TEXT_LENGTH}
          required
          aria-required="true"
          placeholder="Enter task name"
          data-testid="tf-taskName"
        />
      </label>

      <label htmlFor="tf-project" className="mytasks__form-label">
        <span>Project <span aria-hidden="true" className="mytasks__required">*</span></span>
        <select
          id="tf-project"
          className="mytasks__form-input"
          value={formState.project}
          onChange={(e) => onChange('project', e.target.value)}
          required
          aria-required="true"
          data-testid="tf-project"
        >
          {PROJECT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>

      <label htmlFor="tf-officeName" className="mytasks__form-label">
        <span>Office Name <span aria-hidden="true" className="mytasks__required">*</span></span>
        <input
          id="tf-officeName"
          type="text"
          className="mytasks__form-input"
          value={formState.officeName}
          onChange={(e) => onChange('officeName', e.target.value)}
          maxLength={MAX_TEXT_LENGTH}
          required
          aria-required="true"
          placeholder="Enter office name"
          data-testid="tf-officeName"
        />
      </label>

      <label htmlFor="tf-taskCategory" className="mytasks__form-label">
        <span>Category <span aria-hidden="true" className="mytasks__required">*</span></span>
        <select
          id="tf-taskCategory"
          className="mytasks__form-input"
          value={formState.taskCategory}
          onChange={(e) => onChange('taskCategory', e.target.value)}
          required
          aria-required="true"
          data-testid="tf-taskCategory"
        >
          <option value="">Select.</option>
          {TASK_CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>

      {/* Row 2 */}
      <label htmlFor="tf-taskStatus" className="mytasks__form-label">
        <span>Status <span aria-hidden="true" className="mytasks__required">*</span></span>
        <select
          id="tf-taskStatus"
          className="mytasks__form-input"
          value={formState.taskStatus}
          onChange={(e) => onChange('taskStatus', e.target.value)}
          required
          aria-required="true"
          data-testid="tf-taskStatus"
        >
          <option value="">Select.</option>
          {TASK_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>

      <label htmlFor="tf-isActive" className="mytasks__form-label">
        Active
        <select
          id="tf-isActive"
          className="mytasks__form-input"
          value={formState.isActive}
          onChange={(e) => onChange('isActive', e.target.value)}
          data-testid="tf-isActive"
        >
          {IS_ACTIVE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </label>

      <label htmlFor="tf-startDate" className="mytasks__form-label">
        <span className="mytasks__field-label-with-icon">
          <CalendarDays size={15} aria-hidden="true" />
          Start Date <span aria-hidden="true" className="mytasks__required">*</span>
        </span>
        <input
          id="tf-startDate"
          type="date"
          className="mytasks__form-input"
          value={formState.startDate}
          onChange={(e) => onChange('startDate', e.target.value)}
          required
          aria-required="true"
          data-testid="tf-startDate"
        />
      </label>

      <label htmlFor="tf-endDate" className="mytasks__form-label">
        <span className="mytasks__field-label-with-icon">
          <CalendarDays size={15} aria-hidden="true" />
          End Date <span aria-hidden="true" className="mytasks__required">*</span>
        </span>
        <input
          id="tf-endDate"
          type="date"
          className="mytasks__form-input"
          value={formState.endDate}
          onChange={(e) => onChange('endDate', e.target.value)}
          min={formState.startDate || undefined}
          required
          aria-required="true"
          data-testid="tf-endDate"
        />
      </label>

      {/* Row 3 - Description full width */}
      <label
        htmlFor="tf-taskDescription"
        className="mytasks__form-label mytasks__form-label--full"
      >
        Description
        <textarea
          id="tf-taskDescription"
          className="mytasks__form-input mytasks__form-textarea"
          value={formState.taskDescription}
          onChange={(e) => onChange('taskDescription', e.target.value)}
          maxLength={MAX_TEXT_LENGTH}
          rows={2}
          placeholder="Optional description."
          data-testid="tf-taskDescription"
        />
      </label>
    </div>

    {formError ? (
      <p className="mytasks__error" role="alert" aria-live="polite">
        {formError}
      </p>
    ) : null}

    <div className="mytasks__form-actions">
      <p className="mytasks__form-hint">
        <span className="mytasks__required">*</span> Required fields. Status and start date are prefilled.
      </p>
      <button
        type="submit"
        className="primary-button"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        data-testid="task-submit"
      >
        <Save size={16} aria-hidden="true" />
        {isSubmitting
          ? isEditing ? 'Updating...' : 'Creating...'
          : isEditing ? 'Update Task' : 'Create Task'}
      </button>
      {isEditing ? (
        <button
          type="button"
          className="ghost-button"
          onClick={onCancel}
          disabled={isSubmitting}
          data-testid="task-cancel"
        >
          <X size={16} aria-hidden="true" />
          Cancel
        </button>
      ) : null}
    </div>
  </form>
);

export default TaskForm;
