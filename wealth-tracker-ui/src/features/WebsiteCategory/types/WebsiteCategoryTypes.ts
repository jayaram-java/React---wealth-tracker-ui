export interface WebsiteCategory {
  id: number;
  categoryName: string;
  description: string;
  isActive: boolean;
  createdBy: string;
  createdDate?: string;
  modifiedBy?: string | null;
  modifiedDate?: string | null;
}

export interface WebsiteCategoryCreatePayload {
  categoryName: string;
  description: string;
  isActive: boolean;
  createdBy: string;
}

export interface WebsiteCategoryUpdatePayload {
  categoryName: string;
  description: string;
  isActive: boolean;
  modifiedBy: string;
}
