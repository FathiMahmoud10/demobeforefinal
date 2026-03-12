import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Customer {
  id: number;
  code: string;
  name: string;
  email: string;
  phone: string;
  pricingGroup: string;
  customerGroup: string;
  taxNumber: string;
  actualBalance: number;
  totalPoints: number;
  commercialRegister?: string;
  creditLimit?: number;
  stopSellingOverdue?: boolean;
  isTaxable?: boolean;
}

interface CustomersContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'code'>) => void;
  deleteCustomer: (id: number) => void;
  updateCustomer: (id: number, updates: Partial<Customer>) => void;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export const CustomersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('takamul_customers');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        code: "1",
        name: "عميل افتراضي",
        email: "info@posit.sa",
        phone: "00",
        pricingGroup: "عام",
        customerGroup: "عام",
        taxNumber: "",
        actualBalance: 0.00,
        totalPoints: 0.00
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('takamul_customers', JSON.stringify(customers));
  }, [customers]);

  const addCustomer = (customer: Omit<Customer, 'id' | 'code'>) => {
    const nextId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    setCustomers([...customers, { ...customer, id: nextId, code: nextId.toString() }]);
  };

  const deleteCustomer = (id: number) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const updateCustomer = (id: number, updates: Partial<Customer>) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  return (
    <CustomersContext.Provider value={{ customers, addCustomer, deleteCustomer, updateCustomer }}>
      {children}
    </CustomersContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomersContext);
  if (context === undefined) {
    throw new Error('useCustomers must be used within a CustomersProvider');
  }
  return context;
};
