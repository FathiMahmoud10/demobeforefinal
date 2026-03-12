import React, { createContext, useContext, useState, useEffect } from 'react';
import { Sale } from '@/types';

interface SalesContextType {
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id'>) => void;
  updateSale: (id: string, updates: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

const mockSales: Sale[] = [
  { id: '1', invoiceNo: '506', date: '23/02/2026 02:59:57', refNo: 'SALE/POS2026/02/0611', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'returned', grandTotal: -500.00, paid: -500.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '2', invoiceNo: '505', date: '23/02/2026 02:58:48', refNo: 'SALE/POS2026/02/0611', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 500.00, paid: 500.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '3', invoiceNo: '504', date: '16/02/2026 20:39:44', refNo: 'SALE/POS2026/02/0610', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 150.00, paid: 150.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '4', invoiceNo: '503', date: '16/02/2026 20:39:34', refNo: 'SALE/POS2026/02/0609', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 400.00, paid: 400.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '5', invoiceNo: '502', date: '16/02/2026 20:25:58', refNo: 'SALE/POS2026/02/0608', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 500.00, paid: 500.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '6', invoiceNo: '501', date: '16/02/2026 20:24:03', refNo: 'SALE/POS2026/02/0607', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 500.00, paid: 500.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '7', invoiceNo: '500', date: '16/02/2026 19:13:23', refNo: 'SALE/POS2026/02/0606', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 250.00, paid: 250.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '8', invoiceNo: '499', date: '12/02/2026 17:39:53', refNo: 'SALE/POS2026/02/0605', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 250.00, paid: 250.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '9', invoiceNo: '498', date: '11/02/2026 20:13:04', refNo: 'SALE/POS2026/02/0604', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 250.00, paid: 250.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '10', invoiceNo: '497', date: '11/02/2026 20:12:54', refNo: 'SALE/POS2026/02/0603', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 250.00, paid: 250.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
];

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('takamul_sales');
    return saved ? JSON.parse(saved) : mockSales;
  });

  useEffect(() => {
    localStorage.setItem('takamul_sales', JSON.stringify(sales));
  }, [sales]);

  const addSale = (sale: Omit<Sale, 'id'>) => {
    const newSale = { ...sale, id: Date.now().toString() };
    setSales([newSale, ...sales]);
  };

  const updateSale = (id: string, updates: Partial<Sale>) => {
    setSales(sales.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSale = (id: string) => {
    setSales(sales.filter(s => s.id !== id));
  };

  return (
    <SalesContext.Provider value={{ sales, addSale, updateSale, deleteSale }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};
