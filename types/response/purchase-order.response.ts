export interface PurchaseOrderItem {
  id: number;
  bookId: number;
  bookTitle: string;
  variantId?: number | null;
  variantFormat?: string | null;
  quantity: number;
  importPrice: number;
  sellingPrice?: number | null;
}

export interface PurchaseOrder {
  id: number;
  createdAt: string;
  approvedAt: string | null;
  note: string | null;
  cancelReason: string | null;
  status: string;
  supplierId: number;
  supplierName: string;
  createdById: number;
  createdByName: string;
  approvedById: number | null;
  approvedByName: string | null;
  items: PurchaseOrderItem[];
}

export type PurchaseOrdersApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: PurchaseOrder[];
};

export type PurchaseOrderApiResponse = {
  error: string | null;
  message: string;
  statusCode: number;
  data: PurchaseOrder;
};
