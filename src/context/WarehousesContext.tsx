import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  pricingGroup: string;
  phone: string;
  email: string;
  address: string;
  showTouchScreen: boolean;
  showScreen2: boolean;
  enableTables: boolean;
  printPrepSlip: boolean;
  enableReservations: boolean;
  enableMarketers: boolean;
  enableGlasses: boolean;
  printSizesOnInvoice: boolean;
}

interface WarehousesContextType {
  warehouses: Warehouse[];
  addWarehouse: (warehouse: Omit<Warehouse, 'id'>) => void;
  updateWarehouse: (warehouse: Warehouse) => void;
  deleteWarehouse: (id: string) => void;
}

const WarehousesContext = createContext<WarehousesContextType | undefined>(undefined);

export const WarehousesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(() => {
    const saved = localStorage.getItem('pos_warehouses');
    const defaultWarehouses = [
      { 
        id: '1', code: '001', name: 'نشاط المطاعم', pricingGroup: 'عام', phone: '', email: '', address: '1',
        showTouchScreen: true, showScreen2: false, enableTables: true, printPrepSlip: true, enableReservations: false, enableMarketers: false, enableGlasses: false, printSizesOnInvoice: false
      },
      { 
        id: '2', code: '003', name: 'نشاط الصالون', pricingGroup: 'عام', phone: '', email: '', address: '3',
        showTouchScreen: false, showScreen2: false, enableTables: false, printPrepSlip: false, enableReservations: false, enableMarketers: false, enableGlasses: false, printSizesOnInvoice: false
      },
      { 
        id: '3', code: 'WHI', name: 'مغسلة سيارات', pricingGroup: 'عام', phone: '122221', email: 'info@posit2030.com', address: 'سكاكا',
        showTouchScreen: true, showScreen2: false, enableTables: true, printPrepSlip: true, enableReservations: true, enableMarketers: true, enableGlasses: true, printSizesOnInvoice: true
      }
    ];

    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all fields are present in loaded data
      return parsed.map((w: any) => ({
        ...defaultWarehouses[0], // Use first default as template for missing fields
        ...w,
        // Explicitly ensure new fields have defaults if missing
        showScreen2: w.showScreen2 ?? false,
        showTouchScreen: w.showTouchScreen ?? false,
        enableTables: w.enableTables ?? false,
        printPrepSlip: w.printPrepSlip ?? false,
        enableReservations: w.enableReservations ?? false,
        enableMarketers: w.enableMarketers ?? false,
        enableGlasses: w.enableGlasses ?? false,
        printSizesOnInvoice: w.printSizesOnInvoice ?? false,
        phone: w.phone || '',
        email: w.email || '',
        address: w.address || '',
        pricingGroup: w.pricingGroup || 'عام'
      }));
    }
    return defaultWarehouses;
  });

  useEffect(() => {
    localStorage.setItem('pos_warehouses', JSON.stringify(warehouses));
  }, [warehouses]);

  const addWarehouse = (warehouse: Omit<Warehouse, 'id'>) => {
    const newWarehouse = { ...warehouse, id: Date.now().toString() };
    setWarehouses(prev => [...prev, newWarehouse]);
  };

  const updateWarehouse = (updatedWarehouse: Warehouse) => {
    setWarehouses(prev => prev.map(w => w.id === updatedWarehouse.id ? updatedWarehouse : w));
  };

  const deleteWarehouse = (id: string) => {
    setWarehouses(prev => prev.filter(w => w.id !== id));
  };

  return (
    <WarehousesContext.Provider value={{ warehouses, addWarehouse, updateWarehouse, deleteWarehouse }}>
      {children}
    </WarehousesContext.Provider>
  );
};

export const useWarehouses = () => {
  const context = useContext(WarehousesContext);
  if (context === undefined) {
    throw new Error('useWarehouses must be used within a WarehousesProvider');
  }
  return context;
};
