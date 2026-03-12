import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: string;
  autoUpdate: boolean;
}

interface CurrenciesContextType {
  currencies: Currency[];
  addCurrency: (currency: Omit<Currency, 'id'>) => void;
  updateCurrency: (id: number, currency: Omit<Currency, 'id'>) => void;
  deleteCurrency: (id: number) => void;
}

const CurrenciesContext = createContext<CurrenciesContextType | undefined>(undefined);

const STORAGE_KEY = 'currencies_data';

const initialCurrencies: Currency[] = [
  {
    id: 1,
    code: 'SR',
    name: 'Saudi Riyal',
    symbol: 'ر.س',
    exchangeRate: '1.0000',
    autoUpdate: false
  }
];

export function CurrenciesProvider({ children }: { children: React.ReactNode }) {
  const [currencies, setCurrencies] = useState<Currency[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialCurrencies;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currencies));
  }, [currencies]);

  const addCurrency = (currency: Omit<Currency, 'id'>) => {
    const newCurrency = {
      ...currency,
      id: Date.now()
    };
    setCurrencies([...currencies, newCurrency]);
  };

  const updateCurrency = (id: number, updatedCurrency: Omit<Currency, 'id'>) => {
    setCurrencies(currencies.map(c => c.id === id ? { ...updatedCurrency, id } : c));
  };

  const deleteCurrency = (id: number) => {
    setCurrencies(currencies.filter(c => c.id !== id));
  };

  return (
    <CurrenciesContext.Provider value={{ currencies, addCurrency, updateCurrency, deleteCurrency }}>
      {children}
    </CurrenciesContext.Provider>
  );
}

export function useCurrencies() {
  const context = useContext(CurrenciesContext);
  if (context === undefined) {
    throw new Error('useCurrencies must be used within a CurrenciesProvider');
  }
  return context;
}
