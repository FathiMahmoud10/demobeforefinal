import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense } from '@/types';

interface ExpensesContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdBy' | 'reference'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export const ExpensesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      date: '2026-02-25',
      reference: 'EXP-001',
      category: 'إيجار',
      amount: 5000.00,
      description: 'إيجار المكتب لشهر فبراير',
      createdBy: 'أدمن',
      hasAttachment: true
    },
    {
      id: '2',
      date: '2026-02-24',
      reference: 'EXP-002',
      category: 'كهرباء',
      amount: 450.50,
      description: 'فاتورة الكهرباء',
      createdBy: 'أدمن',
      hasAttachment: false
    }
  ]);

  const addExpense = (newExpense: Omit<Expense, 'id' | 'createdBy' | 'reference'>) => {
    const id = (expenses.length + 1).toString();
    const reference = `EXP-00${expenses.length + 1}`;
    const createdBy = 'أدمن';
    
    const expense: Expense = {
      ...newExpense,
      id,
      reference,
      createdBy
    };
    
    setExpenses([expense, ...expenses]);
  };

  const updateExpense = (id: string, updatedFields: Partial<Expense>) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, ...updatedFields } : e));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  return (
    <ExpensesContext.Provider value={{ expenses, addExpense, updateExpense, deleteExpense }}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
};
