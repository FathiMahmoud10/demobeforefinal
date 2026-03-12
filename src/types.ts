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

export interface Bank {
  id: string;
  code: string;
  name: string;
  openingBalance: number;
  currentBalance: number;
  notes?: string;
}

export interface ExternalTransfer {
  id: string;
  date: string;
  bankId: string;
  amount: number;
  notes?: string;
}

export interface InternalTransfer {
  id: string;
  date: string;
  type: string;
  from: string;
  to: string;
  amount: number;
  notes?: string;
}

export interface PaymentCompany {
  id: string;
  code: string;
  name: string;
}

export interface PaymentMethod {
  id: string;
  image?: string;
  code: string;
  name: string;
  status: 'available' | 'unavailable';
}

export interface SpecialPromotion {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  basicItem: string;
  basicItemQty: number;
  freeItem: string;
  freeItemQty: number;
  discount: number;
  policy: string;
  details: string;
}

export interface GeneralPromotion {
  id: string;
  startDate: string;
  endDate: string;
  discount: number;
  branch: string;
}

export interface Expense {
  id: string;
  date: string;
  reference: string;
  category: string;
  amount: number;
  description: string;
  createdBy: string;
  hasAttachment: boolean;
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

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  company: string;
  phone: string;
  email: string;
  usernameEmail: string;
  status: 'active' | 'inactive';
  group: string;
  defaultPaymentMethod: string;
  defaultPaymentCompany: string;
  defaultInvoiceType: string;
  notifyEmail: boolean;
  createdAt: string;
}

export interface PriceGroup {
  id: string;
  name: string;
}

export interface ExpenseCategory {
  id: string;
  code: string;
  name: string;
}

export interface Bond {
  id: string;
  type: 'receipt' | 'payment' | 'deposit' | 'withdrawal';
  date: string;
  beneficiary?: string;
  branch: string;
  bank?: string;
  amount: number;
  notes?: string;
}
