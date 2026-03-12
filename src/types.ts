export enum PurchaseStatus {
  RECEIVED = "RECEIVED",
  PENDING = "PENDING",
  ORDERED = "ORDERED",
}

export enum PaymentStatus {
  PAID = "PAID",
  PARTIAL = "PARTIAL",
  DUE = "DUE",
  OVERDUE = "OVERDUE",
}

export interface Purchase {
  id: string;
  date: string;
  reference: string;
  supplier: string;
  status: PurchaseStatus;
  total: number;
  paid: number;
  balance: number;   
  paymentStatus: PaymentStatus;
}
