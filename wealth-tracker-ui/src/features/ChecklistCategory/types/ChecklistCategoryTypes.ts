export interface ChecklistCategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  isPrimary: boolean;
  userId: number;
  createdBy: string;
  createdDate?: string;
  modifiedBy?: string | null;
  modifiedDate?: string | null;
}

export interface ChecklistCategoryCreatePayload {
  name: string;
  description: string;
  isActive: boolean;
  isPrimary: boolean;
  userId: number;
  createdBy: string;
}

export interface ChecklistCategoryUpdatePayload {
  name: string;
  description: string;
  isActive: boolean;
  isPrimary: boolean;
  userId: number;
  modifiedBy: string;
}
