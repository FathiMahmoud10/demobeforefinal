import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// ✅ تم إضافة النوع الثالث 'sub' للأصناف المتفرعة
export interface Product {
    id: string;
    name: string;
    code: string;
    price: number;
    quantity: number;
    category: string;
    status: 'active' | 'inactive';
    productNature: 'basic' | 'prepared' | 'sub'| 'materials'; // ✅ تم التعديل
    description?: string;
    parentProductId?: number;
    selectedAddons?: string[];
    parentProductName?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface ProductsContextType {
    products: Product[];
    loading: boolean;
    error: string | null;
    addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<Product>;
    updateProduct: (product: Product) => Promise<Product>;
    deleteProduct: (id: string) => Promise<void>;
    getProductById: (id: string) => Product | undefined;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error('useProducts must be used within ProductsProvider');
    }
    return context;
};

interface ProductsProviderProps {
    children: ReactNode;
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProducts = () => {
            try {
                const stored = localStorage.getItem('products');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setProducts(parsed);
                }
            } catch (err) {
                console.error('Error loading products:', err);
                setError('فشل تحميل البيانات');
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const saveProducts = useCallback((newProducts: Product[]) => {
        setProducts(newProducts);
        localStorage.setItem('products', JSON.stringify(newProducts));
        window.dispatchEvent(new Event('products-updated'));
    }, []);

    const addProduct = async (newProduct: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
        const product: Product = {
            ...newProduct,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        saveProducts([...products, product]);
        return product;
    };

    const updateProduct = async (updatedProduct: Product): Promise<Product> => {
        const newProducts = products.map(p =>
            p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p
        );
        saveProducts(newProducts);
        return updatedProduct;
    };

    const deleteProduct = async (id: string): Promise<void> => {
        const newProducts = products.filter(p => p.id !== id);
        saveProducts(newProducts);
    };

    const getProductById = useCallback((id: string): Product | undefined => {
        return products.find(p => p.id === id);
    }, [products]);

    return (
        <ProductsContext.Provider value={{
            products,
            loading,
            error,
            addProduct,
            updateProduct,
            deleteProduct,
            getProductById
        }}>
            {children}
        </ProductsContext.Provider>
    );
};