export type PromotionStatus = "PENDING" | "ACTIVE" | "REJECTED" | "PAUSED";

export type Promotion = {
  id: number;
  name: string;
  code: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  quantity: number;
  isActive: boolean;
  status: PromotionStatus;
  priceOrderActive: number | null;
  createdById: number;
  createdByName: string;
  approvedById: number | null;
  approvedByName: string | null;
};

export type CreatePromotionRequest = {
  name: string;
  code: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  quantity: number;
  priceOrderActive?: number | null;
};

export type PromotionSearchParams = {
  name?: string;
  code?: string;
  status?: PromotionStatus;
  isActive?: boolean;
};
