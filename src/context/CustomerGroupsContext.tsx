import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CustomerGroup {
  id: string;
  name: string;
  percentage: number;
  sellAtCost: boolean;
}

interface CustomerGroupsContextType {
  groups: CustomerGroup[];
  addGroup: (group: Omit<CustomerGroup, 'id'>) => void;
  updateGroup: (id: string, group: Omit<CustomerGroup, 'id'>) => void;
  deleteGroup: (id: string) => void;
}

const CustomerGroupsContext = createContext<CustomerGroupsContextType | undefined>(undefined);

export const CustomerGroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<CustomerGroup[]>(() => {
    const saved = localStorage.getItem('customer_groups');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'عام', percentage: 0, sellAtCost: false },
      { id: '2', name: 'خصم خاص 5 بالميه', percentage: -5, sellAtCost: false }
    ];
  });

  useEffect(() => {
    localStorage.setItem('customer_groups', JSON.stringify(groups));
  }, [groups]);

  const addGroup = (group: Omit<CustomerGroup, 'id'>) => {
    const newGroup = {
      ...group,
      id: Math.random().toString(36).substr(2, 9),
    };
    setGroups([...groups, newGroup]);
  };

  const updateGroup = (id: string, updatedGroup: Omit<CustomerGroup, 'id'>) => {
    setGroups(groups.map(g => g.id === id ? { ...updatedGroup, id } : g));
  };

  const deleteGroup = (id: string) => {
    setGroups(groups.filter(g => g.id !== id));
  };

  return (
    <CustomerGroupsContext.Provider value={{ groups, addGroup, updateGroup, deleteGroup }}>
      {children}
    </CustomerGroupsContext.Provider>
  );
};

export const useCustomerGroups = () => {
  const context = useContext(CustomerGroupsContext);
  if (!context) {
    throw new Error('useCustomerGroups must be used within a CustomerGroupsProvider');
  }
  return context;
};
