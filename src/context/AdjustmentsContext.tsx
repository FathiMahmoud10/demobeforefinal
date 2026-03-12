import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Adjustment {
  id: number;
  date: string;
  refNo: string;
  branch: string;
  entry: string;
  note: string;
  items: {
    id: number;
    name: string;
    code: string;
    availableQty: string;
    type: string;
    qty: string;
    cost: string;
    serial: string;
  }[];
}

interface AdjustmentsContextType {
  adjustments: Adjustment[];
  addAdjustment: (adjustment: Omit<Adjustment, 'id'>) => void;
  updateAdjustment: (id: number, updates: Partial<Adjustment>) => void;
  deleteAdjustment: (id: number) => void;
}

const AdjustmentsContext = createContext<AdjustmentsContextType | undefined>(undefined);

export const AdjustmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adjustments, setAdjustments] = useState<Adjustment[]>(() => {
    const saved = localStorage.getItem('takamul_adjustments');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        date: "19:41:00 19/02/2026",
        refNo: "5556565",
        branch: "شركة دقة الحلول",
        entry: "Admin",
        note: "يسيل",
        items: [
          {
            id: 1,
            name: "عبايه كريب مع اكمام مموجه",
            code: "60990980",
            availableQty: "6.0000-",
            type: "طرح",
            qty: "23",
            cost: "150",
            serial: "سلسيل"
          }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('takamul_adjustments', JSON.stringify(adjustments));
  }, [adjustments]);

  const addAdjustment = (adjustment: Omit<Adjustment, 'id'>) => {
    const nextId = adjustments.length > 0 ? Math.max(...adjustments.map(a => a.id)) + 1 : 1;
    setAdjustments([...adjustments, { ...adjustment, id: nextId }]);
  };

  const updateAdjustment = (id: number, updates: Partial<Adjustment>) => {
    setAdjustments(adjustments.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAdjustment = (id: number) => {
    setAdjustments(adjustments.filter(a => a.id !== id));
  };

  return (
    <AdjustmentsContext.Provider value={{ adjustments, addAdjustment, updateAdjustment, deleteAdjustment }}>
      {children}
    </AdjustmentsContext.Provider>
  );
};

export const useAdjustments = () => {
  const context = useContext(AdjustmentsContext);
  if (context === undefined) {
    throw new Error('useAdjustments must be used within a AdjustmentsProvider');
  }
  return context;
};
