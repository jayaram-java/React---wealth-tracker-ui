import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { X } from 'lucide-react';
import { STATUS_BADGE_COLORS } from '../constants';
import type { EmployeeTask } from '../types/MyTasksTypes';

interface TaskDetailsModalProps {
  task: EmployeeTask | null;
  onClose: () => void;
}

const DetailRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="mytasks__detail-row">
    <span className="mytasks__detail-label">{label}</span>
    <span className="mytasks__detail-value">{value}</span>
  </div>
);

const TaskDetailsModal = ({ task, onClose }: TaskDetailsModalProps) => {
  if (!task) return null;
  const badgeColor = STATUS_BADGE_COLORS[task.taskStatus] ?? '#475569';

  return (
    <Dialog
      open={Boolean(task)}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="task-details-title"
    >
      <DialogTitle
        id="task-details-title"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        Task Details
        <IconButton onClick={onClose} size="small" aria-label="Close task details">
          <X size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <div className="mytasks__detail-grid">
          <DetailRow label="Task ID" value={task.taskId} />
          <DetailRow label="Task Name" value={task.taskName} />
          <DetailRow label="Project" value={task.project || '-'} />
          <DetailRow label="Assigned To" value={task.assignedTo} />
          <DetailRow label="Office" value={task.officeName} />
          <DetailRow label="Category" value={task.taskCategory} />
          <div className="mytasks__detail-row">
            <span className="mytasks__detail-label">Status</span>
            <span
              className="mytasks__badge"
              style={{
                background: `${badgeColor}18`,
                color: badgeColor,
                border: `1px solid ${badgeColor}40`,
              }}
            >
              {task.taskStatus.replace('_', ' ')}
            </span>
          </div>
          <DetailRow label="Active" value={task.isActive === 'Y' ? 'Yes' : 'No'} />
          <DetailRow label="Start Date" value={task.startDate} />
          <DetailRow label="End Date" value={task.endDate} />
          <div className="mytasks__detail-row mytasks__detail-row--full">
            <span className="mytasks__detail-label">Description</span>
            <span className="mytasks__detail-value">{task.taskDescription || '-'}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsModal;
