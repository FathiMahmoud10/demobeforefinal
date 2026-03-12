import React, { createContext, useContext, useState } from 'react';
import { ExternalTransfer, InternalTransfer } from '@/types';

interface TransfersContextType {
  externalTransfers: ExternalTransfer[];
  internalTransfers: InternalTransfer[];
  addExternalTransfer: (transfer: Omit<ExternalTransfer, 'id' | 'date'>) => void;
  addInternalTransfer: (transfer: Omit<InternalTransfer, 'id' | 'date'>) => void;
  deleteExternalTransfer: (id: string) => void;
  deleteInternalTransfer: (id: string) => void;
}

const TransfersContext = createContext<TransfersContextType | undefined>(undefined);

export const TransfersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [externalTransfers, setExternalTransfers] = useState<ExternalTransfer[]>([]);
  const [internalTransfers, setInternalTransfers] = useState<InternalTransfer[]>([]);

  const addExternalTransfer = (newTransfer: Omit<ExternalTransfer, 'id' | 'date'>) => {
    const transfer: ExternalTransfer = {
      ...newTransfer,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    };
    setExternalTransfers(prev => [transfer, ...prev]);
  };

  const addInternalTransfer = (newTransfer: Omit<InternalTransfer, 'id' | 'date'>) => {
    const transfer: InternalTransfer = {
      ...newTransfer,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0]
    };
    setInternalTransfers(prev => [transfer, ...prev]);
  };

  const deleteExternalTransfer = (id: string) => {
    setExternalTransfers(prev => prev.filter(t => t.id !== id));
  };

  const deleteInternalTransfer = (id: string) => {
    setInternalTransfers(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TransfersContext.Provider value={{ 
      externalTransfers, 
      internalTransfers, 
      addExternalTransfer, 
      addInternalTransfer,
      deleteExternalTransfer,
      deleteInternalTransfer
    }}>
      {children}
    </TransfersContext.Provider>
  );
};

export const useTransfers = () => {
  const context = useContext(TransfersContext);
  if (context === undefined) {
    throw new Error('useTransfers must be used within a TransfersProvider');
  }
  return context;
};
