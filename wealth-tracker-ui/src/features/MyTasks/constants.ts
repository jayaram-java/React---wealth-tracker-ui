export const TASK_STATUS_OPTIONS = [
  { value: 'PENDING',    label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED',  label: 'Completed' },
  { value: 'ON_HOLD',    label: 'On Hold' },
  { value: 'CANCELLED',  label: 'Cancelled' },
] as const;

export const TASK_CATEGORY_OPTIONS = [
  { value: 'FINANCE',      label: 'Finance' },
  { value: 'OPERATIONS',   label: 'Operations' },
  { value: 'HR',           label: 'HR' },
  { value: 'IT',           label: 'IT' },
  { value: 'MARKETING',    label: 'Marketing' },
  { value: 'LEGAL',        label: 'Legal' },
  { value: 'PROCUREMENT',  label: 'Procurement' },
  { value: 'GENERAL',      label: 'General' },
] as const;

export const IS_ACTIVE_OPTIONS = [
  { value: 'Y', label: 'Yes' },
  { value: 'N', label: 'No' },
] as const;

export const PROJECT_OPTIONS = [
  { value: 'ADB',                 label: 'ADB' },
  { value: 'FedMobile',           label: 'FedMobile' },
  { value: 'ASP-clientinterview', label: 'ASP - Client Interview' },
  { value: 'office-grooming',     label: 'Office Grooming' },
  { value: 'sinopac-taiwan',      label: 'Sinopac Taiwan' },
  { value: 'Banknxt-egypt',       label: 'Banknxt Egypt' },
] as const;

export const DEFAULT_PROJECT = 'ADB';

export const STATUS_BADGE_COLORS: Record<string, string> = {
  PENDING:     '#d97706',
  IN_PROGRESS: '#2563eb',
  COMPLETED:   '#16a34a',
  ON_HOLD:     '#7c3aed',
  CANCELLED:   '#dc2626',
};

export const MAX_TEXT_LENGTH = 255;
