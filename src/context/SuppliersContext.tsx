import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  taxNumber: string;
  commercialRegistration?: string;
  openingBalance?: number;
  address?: string;
}

interface SuppliersContextType {
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  deleteSupplier: (id: number) => void;
  updateSupplier: (id: number, updates: Partial<Supplier>) => void;
}

const SuppliersContext = createContext<SuppliersContextType | undefined>(undefined);

export const SuppliersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('takamul_suppliers');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        name: "مورد عام",
        email: "general@example.com",
        phone: "966500000000",
        taxNumber: "1234567890",
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('takamul_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const nextId = suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1;
    setSuppliers([...suppliers, { ...supplier, id: nextId }]);
  };

  const deleteSupplier = (id: number) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
  };

  const updateSupplier = (id: number, updates: Partial<Supplier>) => {
    setSuppliers(suppliers.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  return (
    <SuppliersContext.Provider value={{ suppliers, addSupplier, deleteSupplier, updateSupplier }}>
      {children}
    </SuppliersContext.Provider>
  );
};

export const useSuppliers = () => {
  const context = useContext(SuppliersContext);
  if (context === undefined) {
    throw new Error('useSuppliers must be used within a SuppliersProvider');
  }
  return context;
};
