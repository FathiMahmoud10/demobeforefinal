import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: number;
  image: string;
  code: string;
  name: string;
  brand: string;
  agent: string;
  category: string;
  cost: string;
  price: string;
  quantity: string;
  unit: string;
  alertQuantity: string;
}

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: number) => void;
  deleteMultipleProducts: (ids: number[]) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('takamul_products');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 1,
        image: "https://picsum.photos/seed/abaya/50/50",
        code: "60990980",
        name: "عبايه كريب مع اكمام مموجه",
        brand: "",
        agent: "",
        category: "عبايات سوداء",
        cost: "150.00",
        price: "250.00",
        quantity: "6.00-",
        unit: "وحدة",
        alertQuantity: "5.00"
      },
      {
        id: 2,
        image: "",
        code: "6666",
        name: "صنف جديد",
        brand: "gen",
        agent: "",
        category: "عبايات سوداء",
        cost: "100.00",
        price: "150.00",
        quantity: "20.00",
        unit: "وحدة",
        alertQuantity: "0.00"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('takamul_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    setProducts([...products, { ...product, id: nextId }]);
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const deleteMultipleProducts = (ids: number[]) => {
    setProducts(products.filter(p => !ids.includes(p.id)));
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, deleteProduct, deleteMultipleProducts, updateProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
