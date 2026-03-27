export interface WebsiteLink {
  id: number;
  websiteLink: string;
  description: string;
  remarks: string;
  isActive: boolean;
  categoryId: number;
  createdBy: string;
  createdDate?: string;
  modifiedBy?: string | null;
  modifiedDate?: string | null;
}

export interface WebsiteLinkCreatePayload {
  websiteLink: string;
  description: string;
  remarks: string;
  isActive: boolean;
  categoryId: number;
  createdBy: string;
}

export interface WebsiteLinkUpdatePayload {
  websiteLink: string;
  description: string;
  remarks: string;
  isActive: boolean;
  categoryId: number;
  modifiedBy: string;
}
