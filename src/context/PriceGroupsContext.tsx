import React, { createContext, useContext, useState, useEffect } from 'react';
import { PriceGroup } from '@/types';

interface PriceGroupsContextType {
  priceGroups: PriceGroup[];
  addPriceGroup: (group: Omit<PriceGroup, 'id'>) => void;
  updatePriceGroup: (id: string, group: Partial<PriceGroup>) => void;
  deletePriceGroup: (id: string) => void;
}

const PriceGroupsContext = createContext<PriceGroupsContextType | undefined>(undefined);

export function PriceGroupsProvider({ children }: { children: React.ReactNode }) {
  const [priceGroups, setPriceGroups] = useState<PriceGroup[]>(() => {
    const saved = localStorage.getItem('priceGroups');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'عام' },
      { id: '2', name: 'جملة' },
      { id: '3', name: 'تجزئة' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('priceGroups', JSON.stringify(priceGroups));
  }, [priceGroups]);

  const addPriceGroup = (group: Omit<PriceGroup, 'id'>) => {
    const newGroup = {
      ...group,
      id: Math.random().toString(36).substr(2, 9),
    };
    setPriceGroups(prev => [...prev, newGroup]);
  };

  const updatePriceGroup = (id: string, group: Partial<PriceGroup>) => {
    setPriceGroups(prev => prev.map(g => g.id === id ? { ...g, ...group } : g));
  };

  const deletePriceGroup = (id: string) => {
    setPriceGroups(prev => prev.filter(g => g.id !== id));
  };

  return (
    <PriceGroupsContext.Provider value={{ priceGroups, addPriceGroup, updatePriceGroup, deletePriceGroup }}>
      {children}
    </PriceGroupsContext.Provider>
  );
}

export function usePriceGroups() {
  const context = useContext(PriceGroupsContext);
  if (context === undefined) {
    throw new Error('usePriceGroups must be used within a PriceGroupsProvider');
  }
  return context;
}
