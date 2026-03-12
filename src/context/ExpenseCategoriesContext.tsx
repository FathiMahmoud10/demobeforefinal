import React, { createContext, useContext, useState, useEffect } from 'react';
import { ExpenseCategory } from '@/types';

interface ExpenseCategoriesContextType {
  categories: ExpenseCategory[];
  addCategory: (category: Omit<ExpenseCategory, 'id'>) => void;
  updateCategory: (id: string, category: Partial<ExpenseCategory>) => void;
  deleteCategory: (id: string) => void;
}

const ExpenseCategoriesContext = createContext<ExpenseCategoriesContextType | undefined>(undefined);

export const ExpenseCategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<ExpenseCategory[]>(() => {
    const saved = localStorage.getItem('takamul_expense_categories');
    return saved ? JSON.parse(saved) : [
      { id: '1', code: '001', name: 'كهرباء' },
      { id: '2', code: '002', name: 'رواتب' },
      { id: '3', code: '003', name: 'ايجارات' },
      { id: '4', code: '004', name: 'مصروفات نثرية' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('takamul_expense_categories', JSON.stringify(categories));
  }, [categories]);

  const addCategory = (newCategory: Omit<ExpenseCategory, 'id'>) => {
    const id = (categories.length > 0 ? Math.max(...categories.map(c => parseInt(c.id))) + 1 : 1).toString();
    setCategories([...categories, { ...newCategory, id }]);
  };

  const updateCategory = (id: string, updatedFields: Partial<ExpenseCategory>) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <ExpenseCategoriesContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
      {children}
    </ExpenseCategoriesContext.Provider>
  );
};

export const useExpenseCategories = () => {
  const context = useContext(ExpenseCategoriesContext);
  if (context === undefined) {
    throw new Error('useExpenseCategories must be used within an ExpenseCategoriesProvider');
  }
  return context;
};
