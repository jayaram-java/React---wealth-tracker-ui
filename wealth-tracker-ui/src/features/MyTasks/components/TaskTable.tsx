import { Skeleton } from '@mui/material';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { STATUS_BADGE_COLORS } from '../constants';
import type { EmployeeTask } from '../types/MyTasksTypes';

interface TaskTableProps {
  tasks: EmployeeTask[];
  isLoading: boolean;
  onView: (task: EmployeeTask) => void;
  onEdit: (task: EmployeeTask) => void;
  onDelete: (task: EmployeeTask) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const color = STATUS_BADGE_COLORS[status] ?? '#475569';
  return (
    <span
      className="mytasks__badge"
      style={{
        background: `${color}18`,
        color,
        border: `1px solid ${color}40`,
      }}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
};

const SKELETON_ROWS = 6;
const COL_COUNT = 10;

const TaskTable = ({ tasks, isLoading, onView, onEdit, onDelete }: TaskTableProps) => (
  <div className="mytasks__table-wrapper" role="region" aria-label="Tasks table">
    <table className="mytasks__table" aria-label="Employee tasks">
      <thead className="mytasks__table-head">
        <tr className="mytasks__row mytasks__row--head">
          <th className="mytasks__th" scope="col">Task ID</th>
          <th className="mytasks__th" scope="col">Task Name</th>
          <th className="mytasks__th" scope="col">Project</th>
          <th className="mytasks__th" scope="col">Category</th>
          <th className="mytasks__th" scope="col">Office</th>
          <th className="mytasks__th" scope="col">Status</th>
          <th className="mytasks__th" scope="col">Active</th>
          <th className="mytasks__th" scope="col">Start Date</th>
          <th className="mytasks__th" scope="col">End Date</th>
          <th className="mytasks__th" scope="col">Actions</th>
        </tr>
      </thead>
      <tbody className="mytasks__table-body">
        {isLoading && tasks.length === 0 ? (
          Array.from({ length: SKELETON_ROWS }).map((_, idx) => (
            <tr key={`skel-${idx}`} className="mytasks__row">
              {Array.from({ length: COL_COUNT }).map((__, col) => (
                <td key={col} className="mytasks__td">
                  <Skeleton variant="text" width="80%" />
                </td>
              ))}
            </tr>
          ))
        ) : tasks.length === 0 ? (
          <tr className="mytasks__row">
            <td className="mytasks__td" colSpan={COL_COUNT} style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--muted)' }}>
              No tasks found. Create one to get started.
            </td>
          </tr>
        ) : (
          tasks.map((task) => (
            <tr key={task.taskId} className="mytasks__row">
              <td className="mytasks__td">{task.taskId}</td>
              <td className="mytasks__td mytasks__td--name" title={task.taskName}>
                {task.taskName}
              </td>
              <td className="mytasks__td">{task.project || '-'}</td>
              <td className="mytasks__td">{task.taskCategory}</td>
              <td className="mytasks__td">{task.officeName}</td>
              <td className="mytasks__td">
                <StatusBadge status={task.taskStatus} />
              </td>
              <td className="mytasks__td">{task.isActive === 'Y' ? 'Yes' : 'No'}</td>
              <td className="mytasks__td" style={{ whiteSpace: 'nowrap' }}>{task.startDate}</td>
              <td className="mytasks__td" style={{ whiteSpace: 'nowrap' }}>{task.endDate}</td>
              <td className="mytasks__td mytasks__td--actions">
                <div className="mytasks__row-actions">
                  <button
                    type="button"
                    className="mytasks__icon-button"
                    onClick={() => onView(task)}
                    data-testid={`task-view-${task.taskId}`}
                    aria-label={`View ${task.taskName}`}
                    title="View task"
                  >
                    <Eye size={16} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="mytasks__icon-button"
                    onClick={() => onEdit(task)}
                    data-testid={`task-edit-${task.taskId}`}
                    aria-label={`Edit ${task.taskName}`}
                    title="Edit task"
                  >
                    <Pencil size={15} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="mytasks__icon-button mytasks__icon-button--danger"
                    onClick={() => onDelete(task)}
                    data-testid={`task-delete-${task.taskId}`}
                    aria-label={`Delete ${task.taskName}`}
                    title="Delete task"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default TaskTable;
