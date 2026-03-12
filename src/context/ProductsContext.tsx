import React, { createContext, useContext, useState, useEffect } from 'react';
import { AUTH_API_BASE } from '@/lib/utils';

export interface Product {
  // The context uses a numeric id internally. Some APIs may not return one,
  // so we coerce from productCode or barcode.
  id: number;
  image: string;
  // For listing the product we treat barcode as the code field.
  code: string;
  name: string;
  brand: string;
  agent: string;
  category: string;
  // Not all APIs have a numeric category id; it's optional.
  categoryId?: number;
  cost: string;
  price: string;
  quantity: string;
  unit: string;
  alertQuantity: string;
}

interface AddProductParams extends Omit<Product, 'id'> {
  nameAr?: string;
  nameEn?: string;
  nameUr?: string;
  description?: string;
  productType?: string;
}

interface ProductsContextType {
  products: Product[];
  addProduct: (product: AddProductParams) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  deleteMultipleProducts: (ids: number[]) => Promise<void>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// convert a raw API product object into the shape used by the UI
// the API sample provided by the user looks like:
// {
//   "productCode": 1,
//   "productNameAr": "",
//   "productNameEn": "",
//   "productNameUr": "زيت عباد الشمس 1 لتر",
//   "categoryName": "",
//   "barcode": "6223001234567",
//   "sellingPrice": 55,
//   "costPrice": 45,
//   "isActive": true,
//   "imageUrl": ""
// }
const mapApiProduct = (p: any, index: number): Product => {
  const id = Number(p?.productCode ?? p?.id ?? p?.productId ?? index + 1);
  return {
    id,
    image: String(p?.imageUrl ?? ''),
    code: String(p?.barcode ?? p?.productCode ?? id),
    name: String(
      p?.productNameAr || p?.productNameEn || p?.productNameUr || ''
    ),
    brand: String(p?.brand ?? ''),
    agent: '',
    category: String(p?.categoryName ?? ''),
    categoryId: p?.categoryId ?? undefined,
    cost: String(p?.costPrice ?? p?.cost ?? '0'),
    price: String(p?.sellingPrice ?? p?.price ?? '0'),
    quantity: String(p?.quantity ?? '0'),
    unit: String(p?.unit ?? 'وحدة'),
    alertQuantity: String(p?.minStockLevel ?? p?.alertQuantity ?? '0'),
  };
};

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  // some environments use a proxy (dev) resulting in AUTH_API_BASE == ''.
  // when that's the case we fall back to the public API host supplied by the user.
const API_BASE = "/api";
  // دالة موحدة لتحميل المنتجات من الـ API (GET /Products)
  const loadFromApi = async () => {
    try {
      const token = localStorage.getItem('takamul_token');
      const res = await fetch(`${API_BASE}/Products`, {
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        console.warn('Failed to fetch products from API, status:', res.status);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        const mapped = data.map((p: any, idx: number) => mapApiProduct(p, idx));
        setProducts(mapped);
      }
    } catch (err) {
      console.error('Error loading products from API', err);
    }
  };

  useEffect(() => {
    loadFromApi();
  }, []);

  const addProduct = async (product: AddProductParams) => {
    // بناء payload جديد متوافق مع API الذي أرسلته
    const token = localStorage.getItem('takamul_token');
    const payload: any = {
      Barcode: product.code,
      ProductNameAr: product.nameAr ?? product.name,
      ProductNameEn: product.nameEn ?? product.name,
      ProductNameUr: product.nameUr ?? product.name,
      Description: product.description ?? '',
      CategoryName: product.category || '',
      CostPrice: Number(product.cost || '0'),
      SellingPrice: Number(product.price || '0'),
      MinStockLevel: Number(product.alertQuantity || '0'),
      ParentProductId: 0,
      producttype: product.productType ?? '1',
      Image: '', // TODO: support uploading image if needed
    };

    try {
      const res = await fetch(`${API_BASE}/Products/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error('Failed to add product via API, status:', res.status);
      }
      await loadFromApi();
    } catch (err) {
      console.error('Failed to add product via API', err);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const token = localStorage.getItem('takamul_token');
      const res = await fetch(`${AUTH_API_BASE}/Products/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        console.error('Failed to delete product via API, status:', res.status);
      }
      await loadFromApi();
    } catch (err) {
      console.error('Failed to delete product via API', err);
    }
  };

  const deleteMultipleProducts = async (ids: number[]) => {
    try {
      const token = localStorage.getItem('takamul_token');
      await Promise.all(
        ids.map((id) =>
          fetch(`${AUTH_API_BASE}/Products/${id}`, {
            method: 'DELETE',
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          })
        )
      );
      await loadFromApi();
    } catch (err) {
      console.error('Failed to delete products via API', err);
    }
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    // إرسال التعديلات للـ API ثم إعادة تحميل القائمة
    try {
      const token = localStorage.getItem('takamul_token');
      const payload: any = {};
      if (updates.code !== undefined) payload.Barcode = updates.code;
      if (updates.name !== undefined) {
        payload.ProductNameAr = updates.name;
        payload.ProductNameEn = updates.name;
        payload.ProductNameUr = updates.name;
      }
      if (updates.category !== undefined) payload.CategoryName = updates.category;
      if (updates.cost !== undefined) payload.CostPrice = Number(updates.cost || '0');
      if (updates.price !== undefined) payload.SellingPrice = Number(updates.price || '0');
      if (updates.alertQuantity !== undefined) payload.MinStockLevel = Number(updates.alertQuantity || '0');
      // other fields as needed

      const res = await fetch(`${AUTH_API_BASE}/Products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error('Failed to update product via API, status:', res.status);
      }
      await loadFromApi();
    } catch (err) {
      console.error('Error updating product', err);
    }
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
