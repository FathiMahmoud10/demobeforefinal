import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PaymentMethod } from '../types';

interface PaymentMethodsContextType {
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (method: PaymentMethod) => void;
  deletePaymentMethod: (id: string) => void;
}

const PaymentMethodsContext = createContext<PaymentMethodsContextType | undefined>(undefined);

export const PaymentMethodsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', code: 'replace', name: 'استبدال', status: 'available', image: 'https://picsum.photos/seed/replace/40/40' },
    { id: '2', code: 'gift_card', name: 'بطاقة هدايا', status: 'available', image: 'https://picsum.photos/seed/gift/40/40' },
    { id: '3', code: 'transfer_net', name: 'تحويل بنكي', status: 'available', image: 'https://picsum.photos/seed/bank/40/40' },
    { id: '4', code: 'deposit', name: 'رصيد العميل', status: 'available', image: 'https://picsum.photos/seed/deposit/40/40' },
    { id: '5', code: 'CC', name: 'شبكة', status: 'available', image: 'https://picsum.photos/seed/cc/40/40' },
    { id: '6', code: 'points', name: 'نقاطي', status: 'available', image: 'https://picsum.photos/seed/points/40/40' },
    { id: '7', code: 'cash', name: 'نقدي', status: 'available', image: 'https://picsum.photos/seed/cash/40/40' },
  ]);

  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod = { ...method, id: Math.random().toString(36).substr(2, 9) };
    setPaymentMethods([...paymentMethods, newMethod]);
  };

  const updatePaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods(paymentMethods.map(m => m.id === method.id ? method : m));
  };

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(m => m.id !== id));
  };

  return (
    <PaymentMethodsContext.Provider value={{
      paymentMethods,
      addPaymentMethod,
      updatePaymentMethod,
      deletePaymentMethod
    }}>
      {children}
    </PaymentMethodsContext.Provider>
  );
};

export const usePaymentMethods = () => {
  const context = useContext(PaymentMethodsContext);
  if (context === undefined) {
    throw new Error('usePaymentMethods must be used within a PaymentMethodsProvider');
  }
  return context;
};
