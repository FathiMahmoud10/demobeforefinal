import React, { createContext, useContext, useState, useEffect } from 'react';

export interface QuoteRecord {
  id: string;
  quoteNo: string;
  date: string;
  refNo: string;
  cashier: string;
  customer: string;
  total: number;
  status: 'pending' | 'completed';
  products?: any[];
  note?: string;
  discount?: string;
  shipping?: string;
  branch?: string;
}

interface QuotesContextType {
  quotes: QuoteRecord[];
  addQuote: (quote: Omit<QuoteRecord, 'id' | 'quoteNo'>) => void;
  deleteQuote: (id: string) => void;
}

const QuotesContext = createContext<QuotesContextType | undefined>(undefined);

export const QuotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quotes, setQuotes] = useState<QuoteRecord[]>(() => {
    const saved = localStorage.getItem('takamul_quotes');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', quoteNo: '3', date: '22/09/2025 20:21:00', refNo: 'QUOTE2025/09/0003', cashier: 'شركة فن الفيصلية التجارية', customer: 'التوفيق', total: 24.25, status: 'pending' },
      { id: '2', quoteNo: '2', date: '14/09/2025 19:58:00', refNo: 'QUOTE2025/09/0002', cashier: 'شركة فن الفيصلية التجارية', customer: 'شخص عام', total: 2500.00, status: 'pending' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('takamul_quotes', JSON.stringify(quotes));
  }, [quotes]);

  const addQuote = (quote: Omit<QuoteRecord, 'id' | 'quoteNo'>) => {
    const nextId = quotes.length > 0 ? (Math.max(...quotes.map(q => parseInt(q.id))) + 1).toString() : '1';
    const nextQuoteNo = quotes.length > 0 ? (Math.max(...quotes.map(q => parseInt(q.quoteNo))) + 1).toString() : '1';
    
    const newQuote: QuoteRecord = {
      ...quote,
      id: nextId,
      quoteNo: nextQuoteNo,
    };
    
    setQuotes([newQuote, ...quotes]);
  };

  const deleteQuote = (id: string) => {
    setQuotes(quotes.filter(q => q.id !== id));
  };

  return (
    <QuotesContext.Provider value={{ quotes, addQuote, deleteQuote }}>
      {children}
    </QuotesContext.Provider>
  );
};

export const useQuotes = () => {
  const context = useContext(QuotesContext);
  if (context === undefined) {
    throw new Error('useQuotes must be used within a QuotesProvider');
  }
  return context;
};
