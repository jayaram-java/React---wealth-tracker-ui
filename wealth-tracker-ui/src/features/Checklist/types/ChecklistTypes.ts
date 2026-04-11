export type ChecklistStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface ChecklistItem {
  id: number;
  title: string;
  description: string;
  checklistCategoryId: number;
  userId: number;
  status: ChecklistStatus;
  referenceLink: string;
  completedAt?: string | null;
  createdBy: string;
  createdDate?: string;
  modifiedBy?: string | null;
  modifiedDate?: string | null;
}

export interface ChecklistCreatePayload {
  title: string;
  description: string;
  checklistCategoryId: number;
  userId: number;
  status: ChecklistStatus;
  referenceLink: string;
  completedAt: string | null;
  createdBy: string;
}

export interface ChecklistUpdatePayload {
  title: string;
  description: string;
  checklistCategoryId: number;
  userId: number;
  status: ChecklistStatus;
  referenceLink: string;
  completedAt: string | null;
  modifiedBy: string;
}
