import { TASK_STATUS_OPTIONS, PROJECT_OPTIONS } from '../constants';
import type { TaskFilters } from '../types/MyTasksTypes';

interface TaskFiltersProps {
  filters: TaskFilters;
  dynamicStatuses: string[];
  onChange: (field: keyof TaskFilters, value: string) => void;
  onClearFilters: () => void;
}

// Merge constant statuses with any extra statuses found in loaded data
const buildStatusOptions = (dynamicStatuses: string[]): { value: string; label: string }[] => {
  const base = TASK_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }));
  const known = new Set<string>(base.map((o) => o.value));
  const extra = dynamicStatuses
    .filter((s) => !known.has(s))
    .map((s) => ({ value: s, label: s }));
  return [...base, ...extra];
};

const TaskFiltersComponent = ({
  filters,
  dynamicStatuses,
  onChange,
  onClearFilters,
}: TaskFiltersProps) => {
  const statusOptions = buildStatusOptions(dynamicStatuses);
  const hasActiveFilter =
    filters.statusFilter !== '' ||
    filters.employeeIdFilter !== '' ||
    filters.nameSearch !== '' ||
    filters.projectFilter !== '';

  return (
    <div className="mytasks__filters" role="search" aria-label="Task filters">
      <label className="mytasks__filter-label" htmlFor="filter-name">
        Search by name
        <input
          id="filter-name"
          type="text"
          className="mytasks__filter-input"
          placeholder="Task name."
          value={filters.nameSearch}
          onChange={(e) => onChange('nameSearch', e.target.value)}
          aria-label="Search tasks by name"
        />
      </label>

      <label className="mytasks__filter-label" htmlFor="filter-project">
        Filter by project
        <select
          id="filter-project"
          className="mytasks__filter-input"
          value={filters.projectFilter}
          onChange={(e) => onChange('projectFilter', e.target.value)}
          aria-label="Filter by project"
        >
          <option value="">All projects</option>
          {PROJECT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="mytasks__filter-label" htmlFor="filter-status">
        Filter by status
        <select
          id="filter-status"
          className="mytasks__filter-input"
          value={filters.statusFilter}
          onChange={(e) => onChange('statusFilter', e.target.value)}
          aria-label="Filter by task status"
        >
          <option value="">All statuses</option>
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="mytasks__filter-label" htmlFor="filter-employee">
        Filter by employee ID
        <input
          id="filter-employee"
          type="number"
          className="mytasks__filter-input"
          placeholder="Employee ID."
          value={filters.employeeIdFilter}
          onChange={(e) => onChange('employeeIdFilter', e.target.value)}
          min={1}
          aria-label="Filter by employee ID"
        />
      </label>

      {hasActiveFilter ? (
        <button
          type="button"
          className="ghost-button"
          onClick={onClearFilters}
          data-testid="clear-filters"
          aria-label="Clear all filters"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
};

export default TaskFiltersComponent;
