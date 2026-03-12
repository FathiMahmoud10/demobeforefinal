import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Addition {
  id: string;
  name: string;
}

interface AdditionsContextType {
  additions: Addition[];
  addAddition: (addition: Omit<Addition, 'id'>) => void;
  updateAddition: (addition: Addition) => void;
  deleteAddition: (id: string) => void;
}

const AdditionsContext = createContext<AdditionsContextType | undefined>(undefined);

export const AdditionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [additions, setAdditions] = useState<Addition[]>(() => {
    const saved = localStorage.getItem('pos_additions');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'بدون مخلل' },
      { id: '2', name: 'كاتشاب زيادة' },
      { id: '3', name: 'مايونيز زيادة' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('pos_additions', JSON.stringify(additions));
  }, [additions]);

  const addAddition = (addition: Omit<Addition, 'id'>) => {
    const newAddition = { ...addition, id: Date.now().toString() };
    setAdditions(prev => [...prev, newAddition]);
  };

  const updateAddition = (updatedAddition: Addition) => {
    setAdditions(prev => prev.map(a => a.id === updatedAddition.id ? updatedAddition : a));
  };

  const deleteAddition = (id: string) => {
    setAdditions(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AdditionsContext.Provider value={{ additions, addAddition, updateAddition, deleteAddition }}>
      {children}
    </AdditionsContext.Provider>
  );
};

export const useAdditions = () => {
  const context = useContext(AdditionsContext);
  if (context === undefined) {
    throw new Error('useAdditions must be used within a AdditionsProvider');
  }
  return context;
};
