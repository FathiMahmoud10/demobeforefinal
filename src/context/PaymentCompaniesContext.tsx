import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PaymentCompany } from '../types';

interface PaymentCompaniesContextType {
  paymentCompanies: PaymentCompany[];
  addPaymentCompany: (company: Omit<PaymentCompany, 'id'>) => void;
  updatePaymentCompany: (company: PaymentCompany) => void;
  deletePaymentCompany: (id: string) => void;
}

const PaymentCompaniesContext = createContext<PaymentCompaniesContextType | undefined>(undefined);

export const PaymentCompaniesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [paymentCompanies, setPaymentCompanies] = useState<PaymentCompany[]>([
    { id: '1', code: 'Neo_leap', name: 'NeoLeap' },
    { id: '2', code: 'Sure_pay', name: 'SurePay' },
    { id: '3', code: 'Softpos_nearpay', name: 'Softpos nearpay' },
  ]);

  const addPaymentCompany = (company: Omit<PaymentCompany, 'id'>) => {
    const newCompany = { ...company, id: Math.random().toString(36).substr(2, 9) };
    setPaymentCompanies([...paymentCompanies, newCompany]);
  };

  const updatePaymentCompany = (company: PaymentCompany) => {
    setPaymentCompanies(paymentCompanies.map(c => c.id === company.id ? company : c));
  };

  const deletePaymentCompany = (id: string) => {
    setPaymentCompanies(paymentCompanies.filter(c => c.id !== id));
  };

  return (
    <PaymentCompaniesContext.Provider value={{
      paymentCompanies,
      addPaymentCompany,
      updatePaymentCompany,
      deletePaymentCompany
    }}>
      {children}
    </PaymentCompaniesContext.Provider>
  );
};

export const usePaymentCompanies = () => {
  const context = useContext(PaymentCompaniesContext);
  if (context === undefined) {
    throw new Error('usePaymentCompanies must be used within a PaymentCompaniesProvider');
  }
  return context;
};
