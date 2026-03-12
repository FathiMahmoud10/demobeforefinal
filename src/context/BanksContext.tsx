import React, { createContext, useContext, useState } from 'react';
import { Bank } from '@/types';

interface BanksContextType {
  banks: Bank[];
  addBank: (bank: Omit<Bank, 'id' | 'currentBalance'>) => void;
  updateBank: (id: string, bank: Partial<Bank>) => void;
  deleteBank: (id: string) => void;
}

const BanksContext = createContext<BanksContextType | undefined>(undefined);

export const BanksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [banks, setBanks] = useState<Bank[]>([
    {
      id: '1',
      code: '001',
      name: 'البنك الافتراضي',
      openingBalance: 0,
      currentBalance: 0,
      notes: ''
    }
  ]);

  const addBank = (newBank: Omit<Bank, 'id' | 'currentBalance'>) => {
    const bank: Bank = {
      ...newBank,
      id: Math.random().toString(36).substr(2, 9),
      currentBalance: newBank.openingBalance
    };
    setBanks(prev => [...prev, bank]);
  };

  const updateBank = (id: string, updatedBank: Partial<Bank>) => {
    setBanks(prev => prev.map(bank => bank.id === id ? { ...bank, ...updatedBank } : bank));
  };

  const deleteBank = (id: string) => {
    setBanks(prev => prev.filter(bank => bank.id !== id));
  };

  return (
    <BanksContext.Provider value={{ banks, addBank, updateBank, deleteBank }}>
      {children}
    </BanksContext.Provider>
  );
};

export const useBanks = () => {
  const context = useContext(BanksContext);
  if (context === undefined) {
    throw new Error('useBanks must be used within a BanksProvider');
  }
  return context;
};
