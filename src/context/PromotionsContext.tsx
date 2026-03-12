import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SpecialPromotion, GeneralPromotion } from '../types';

interface PromotionsContextType {
  specialPromotions: SpecialPromotion[];
  generalPromotions: GeneralPromotion[];
  addSpecialPromotion: (promotion: Omit<SpecialPromotion, 'id'>) => void;
  updateSpecialPromotion: (promotion: SpecialPromotion) => void;
  deleteSpecialPromotion: (id: string) => void;
  addGeneralPromotion: (promotion: Omit<GeneralPromotion, 'id'>) => void;
  deleteGeneralPromotion: (id: string) => void;
}

const PromotionsContext = createContext<PromotionsContextType | undefined>(undefined);

export const PromotionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [specialPromotions, setSpecialPromotions] = useState<SpecialPromotion[]>([]);
  const [generalPromotions, setGeneralPromotions] = useState<GeneralPromotion[]>([]);

  const addSpecialPromotion = (promotion: Omit<SpecialPromotion, 'id'>) => {
    const newPromotion = { ...promotion, id: Math.random().toString(36).substr(2, 9) };
    setSpecialPromotions([...specialPromotions, newPromotion]);
  };

  const updateSpecialPromotion = (promotion: SpecialPromotion) => {
    setSpecialPromotions(specialPromotions.map(p => p.id === promotion.id ? promotion : p));
  };

  const deleteSpecialPromotion = (id: string) => {
    setSpecialPromotions(specialPromotions.filter(p => p.id !== id));
  };

  const addGeneralPromotion = (promotion: Omit<GeneralPromotion, 'id'>) => {
    const newPromotion = { ...promotion, id: Math.random().toString(36).substr(2, 9) };
    setGeneralPromotions([...generalPromotions, newPromotion]);
  };

  const deleteGeneralPromotion = (id: string) => {
    setGeneralPromotions(generalPromotions.filter(p => p.id !== id));
  };

  return (
    <PromotionsContext.Provider value={{
      specialPromotions,
      generalPromotions,
      addSpecialPromotion,
      updateSpecialPromotion,
      deleteSpecialPromotion,
      addGeneralPromotion,
      deleteGeneralPromotion
    }}>
      {children}
    </PromotionsContext.Provider>
  );
};

export const usePromotions = () => {
  const context = useContext(PromotionsContext);
  if (context === undefined) {
    throw new Error('usePromotions must be used within a PromotionsProvider');
  }
  return context;
};
