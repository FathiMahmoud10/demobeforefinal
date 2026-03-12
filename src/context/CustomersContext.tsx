import React, { createContext, useContext, useEffect, useState } from 'react';
import { AUTH_API_BASE } from '@/lib/utils';

export interface Customer {
  id: number;            // DB id (used for PUT/DELETE)
  customerCode: number;  // display code
  customerName: string;

  email?: string;
  phone?: string;
  mobile?: string;

  address: string;
  city: string;
  state: string;
  postalCode?: string;
  taxNumber?: string;

  isActive: boolean;
  createdAt?: string;

  // UI-only (optional)
  pricingGroup?: string;
  customerGroup?: string;
  actualBalance?: number;
  totalPoints?: number;
  creditLimit?: number;
  stopSellingOverdue?: boolean;
  isTaxable?: boolean;
}

type ApiResult = { ok: boolean; message?: string };

interface CustomersContextType {
  customers: Customer[];
  loading: boolean;
  reload: () => Promise<void>;

  addCustomer: (payload: Omit<Customer, 'id' | 'customerCode' | 'createdAt'>) => Promise<ApiResult>;
  deleteCustomer: (id: number) => Promise<ApiResult>;
  updateCustomer: (id: number, updates: Partial<Customer>) => Promise<ApiResult>;

  getCustomerById: (id: number) => Customer | undefined;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export const CustomersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const API_BASE = AUTH_API_BASE || 'http://takamulerp.runasp.net';

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ always read token fresh (don’t memo it once)
  const authHeaders = () => {
    const token = localStorage.getItem('takamul_token');
    return {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const parseApiError = async (res: Response) => {
    let msg = `status ${res.status}`;
    try {
      const j = await res.json();
      if (j?.errors) {
        const lines = Object.entries(j.errors)
          .map(([k, v]: any) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join(' | ');
        msg = `${msg} - ${lines}`;
      } else if (j?.title) {
        msg = `${msg} - ${j.title}`;
      } else {
        msg = `${msg} - ${JSON.stringify(j)}`;
      }
    } catch {
      try {
        msg = `${msg} - ${await res.text()}`;
      } catch {
        msg = `${msg} - ${res.statusText}`;
      }
    }
    return msg;
  };

  const mapApiCustomer = (c: any): Customer => ({
    id: Number(c?.id ?? 0),
    customerCode: Number(c?.customerCode ?? c?.customerCode ?? 0),
    customerName: String(c?.customerName ?? ''),

    email: c?.email ? String(c.email) : '',
    phone: c?.phone ? String(c.phone) : '',
    mobile: c?.mobile ? String(c.mobile) : '',

    address: String(c?.address ?? ''),
    city: String(c?.city ?? ''),
    state: String(c?.state ?? ''),
    postalCode: c?.postalCode ? String(c.postalCode) : '',
    taxNumber: c?.taxNumber ? String(c.taxNumber) : '',

    isActive: Boolean(c?.isActive ?? true),
    createdAt: c?.createdAt ? String(c.createdAt) : '',
  });

  const reload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/Customer`, { headers: authHeaders() });
      if (!res.ok) {
        console.warn('Failed to fetch customers. status:', res.status);
        setCustomers([]);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) setCustomers(data.map(mapApiCustomer));
      else setCustomers([]);
    } catch (e) {
      console.error('Error fetching customers', e);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCustomerById = (id: number) => customers.find((c) => c.id === id);

  const addCustomer = async (
    payload: Omit<Customer, 'id' | 'customerCode' | 'createdAt'>
  ): Promise<ApiResult> => {
    try {
      // ✅ required fields
      const body = {
        customerName: payload.customerName?.trim(),
        email: payload.email?.trim() ?? '',
        phone: payload.phone?.trim() ?? '',
        mobile: (payload.mobile?.trim() ?? payload.phone?.trim() ?? ''),
        address: payload.address?.trim(),
        city: payload.city?.trim(),
        state: payload.state?.trim(),
        postalCode: payload.postalCode?.trim() ?? '',
        taxNumber: payload.taxNumber?.trim() ?? '',
        isActive: payload.isActive ?? true,
      };

      const res = await fetch(`${API_BASE}/api/Customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(body),
      });

      if (!res.ok) return { ok: false, message: await parseApiError(res) };

      await reload();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: String(e) };
    }
  };

 const deleteCustomer = async (id: number): Promise<ApiResult> => {
  try {
    const cid = Number(id);
    if (!Number.isFinite(cid) || cid <= 0) {
      return { ok: false, message: 'id غير صحيح' };
    }

    const res = await fetch(`${API_BASE}/api/Customer/${cid}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });

    if (!res.ok) return { ok: false, message: await parseApiError(res) };

    await reload();
    return { ok: true };
  } catch (e) {
    return { ok: false, message: String(e) };
  }
};

  const updateCustomer = async (id: number, updates: Partial<Customer>): Promise<ApiResult> => {
    try {
      const current = getCustomerById(id);
      if (!current) return { ok: false, message: 'العميل غير موجود في القائمة' };

      const merged: Customer = { ...current, ...updates };

      // ✅ PUT غالباً محتاج كل required fields
      const body = {
        customerName: String((merged.customerName ?? '').trim()),
        email: String((merged.email ?? '').trim()),
        phone: String((merged.phone ?? '').trim()),
        mobile: String((merged.mobile ?? merged.phone ?? '').trim()),
        address: String((merged.address ?? '').trim()),
        city: String((merged.city ?? '').trim()),
        state: String((merged.state ?? '').trim()),
        postalCode: String((merged.postalCode ?? '').trim()),
        taxNumber: String((merged.taxNumber ?? '').trim()),
        isActive: merged.isActive ?? true,
      };

      const res = await fetch(`${API_BASE}/api/Customer/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(body),
      });

      if (!res.ok) return { ok: false, message: await parseApiError(res) };

      await reload();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: String(e) };
    }
  };

  return (
    <CustomersContext.Provider
      value={{
        customers,
        loading,
        reload,
        addCustomer,
        deleteCustomer,
        updateCustomer,
        getCustomerById,
      }}
    >
      {children}
    </CustomersContext.Provider>
  );
};

export const useCustomers = () => {
  const ctx = useContext(CustomersContext);
  if (!ctx) throw new Error('useCustomers must be used within CustomersProvider');
  return ctx;
};