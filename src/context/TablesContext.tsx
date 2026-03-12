import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Table {
  id: string;
  code: string;
  name: string;
  branch: string;
}

interface TablesContextType {
  tables: Table[];
  addTable: (table: Omit<Table, 'id'>) => void;
  updateTable: (table: Table) => void;
  deleteTable: (id: string) => void;
}

const TablesContext = createContext<TablesContextType | undefined>(undefined);

export const TablesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>(() => {
    const saved = localStorage.getItem('pos_tables');
    return saved ? JSON.parse(saved) : [
      { id: '1', code: '0010', name: '0010', branch: 'مغسلة سيارات' },
      { id: '2', code: 'طاولة 1', name: 'طاولة 1', branch: 'نشاط المطاعم' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('pos_tables', JSON.stringify(tables));
  }, [tables]);

  const addTable = (table: Omit<Table, 'id'>) => {
    const newTable = { ...table, id: Date.now().toString() };
    setTables(prev => [...prev, newTable]);
  };

  const updateTable = (updatedTable: Table) => {
    setTables(prev => prev.map(t => t.id === updatedTable.id ? updatedTable : t));
  };

  const deleteTable = (id: string) => {
    setTables(prev => prev.filter(t => t.id !== id));
  };

  return (
    <TablesContext.Provider value={{ tables, addTable, updateTable, deleteTable }}>
      {children}
    </TablesContext.Provider>
  );
};

export const useTables = () => {
  const context = useContext(TablesContext);
  if (context === undefined) {
    throw new Error('useTables must be used within a TablesProvider');
  }
  return context;
};
