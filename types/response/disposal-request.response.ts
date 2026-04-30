export type DisposalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface DisposalRequestItem {
  id: number;
  batchId: number;
  batchCode: string;
  bookTitle: string;
  variantFormat?: string | null;
  quantity: number;
  remainingQuantity: number;
}

export interface DisposalRequest {
  id: number;
  createdAt: string;
  approvedAt: string | null;
  note: string | null;
  responseNote: string | null;
  status: DisposalStatus;
  createdById: number;
  createdByName: string;
  approvedById: number | null;
  approvedByName: string | null;
  items: DisposalRequestItem[];
}
