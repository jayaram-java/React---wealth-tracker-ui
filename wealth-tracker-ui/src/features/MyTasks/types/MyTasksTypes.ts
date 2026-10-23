// Task model

export type TaskStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ON_HOLD'
  | 'CANCELLED';

export type IsActive = 'Y' | 'N';

export interface EmployeeTask {
  taskId: number;
  assignedTo: number;
  officeName: string;
  taskCategory: string;
  taskStatus: TaskStatus;
  isActive: IsActive;
  taskName: string;
  taskDescription: string;
  startDate: string;
  endDate: string;
  project: string;
}

export type TaskCreatePayload = Omit<EmployeeTask, 'taskId'>;
export type TaskUpdatePayload = Omit<EmployeeTask, 'taskId'>;

export interface TaskFormState {
  assignedTo: string;
  officeName: string;
  taskCategory: string;
  taskStatus: string;
  isActive: string;
  taskName: string;
  taskDescription: string;
  startDate: string;
  endDate: string;
  project: string;
}

export interface TaskFilters {
  statusFilter: string;
  employeeIdFilter: string;
  nameSearch: string;
  projectFilter: string;
}

export interface TaskSummary {
  total: number;
  inProgress: number;
  completed: number;
  active: number;
}
