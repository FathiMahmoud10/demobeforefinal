import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Category {
  id: number;
  image?: string;
  code: string;
  name: string;
  slug: string;
  mainCategory?: string;
  description?: string;
  showInPOS: boolean;
  branchAvailability: { branchName: string; status: boolean }[];
}

interface CategoriesContextType {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: number) => void;
  updateCategory: (id: number, category: Partial<Category>) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('takamul_categories');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        code: 'c003', 
        name: 'عام', 
        slug: 'c003', 
        mainCategory: '-', 
        showInPOS: true,
        branchAvailability: [{ branchName: 'تجريبي', status: true }]
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('takamul_categories', JSON.stringify(categories));
  }, [categories]);

  const addCategory = (category: Omit<Category, 'id'>) => {
    const nextId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    setCategories([...categories, { ...category, id: nextId }]);
  };

  const deleteCategory = (id: number) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const updateCategory = (id: number, updatedFields: Partial<Category>) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  return (
    <CategoriesContext.Provider value={{ categories, addCategory, deleteCategory, updateCategory }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
};
