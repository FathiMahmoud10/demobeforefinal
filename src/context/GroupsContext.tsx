import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Group {
  id: number;
  code: string;
  name: string;
}

interface GroupsContextType {
  groups: Group[];
  addGroup: (name: string) => void;
  deleteGroup: (id: number) => void;
  duplicateGroup: (id: number) => void;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

export const GroupsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('takamul_groups');
    return saved ? JSON.parse(saved) : [
      { id: 1, code: 'GP-001', name: 'مجموعة رئيسية' },
      { id: 2, code: 'GP-002', name: 'مجموعة فرعية' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('takamul_groups', JSON.stringify(groups));
  }, [groups]);

  const addGroup = (name: string) => {
    const nextId = groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1;
    const nextCodeNum = groups.length > 0 ? Math.max(...groups.map(g => parseInt(g.code.split('-')[1]))) + 1 : 1;
    const newGroup = {
      id: nextId,
      code: `GP-${String(nextCodeNum).padStart(3, '0')}`,
      name
    };
    setGroups([...groups, newGroup]);
  };

  const deleteGroup = (id: number) => {
    setGroups(groups.filter(g => g.id !== id));
  };

  const duplicateGroup = (id: number) => {
    const group = groups.find(g => g.id === id);
    if (group) {
      const nextId = Math.max(...groups.map(g => g.id)) + 1;
      const nextCodeNum = Math.max(...groups.map(g => parseInt(g.code.split('-')[1]))) + 1;
      const newGroup = {
        id: nextId,
        code: `GP-${String(nextCodeNum).padStart(3, '0')}`,
        name: `${group.name} (نسخة)`
      };
      setGroups([...groups, newGroup]);
    }
  };

  return (
    <GroupsContext.Provider value={{ groups, addGroup, deleteGroup, duplicateGroup }}>
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroups = () => {
  const context = useContext(GroupsContext);
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
};
