import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface UsersContextType {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  deleteUser: (id: string) => void;
  updateUser: (id: string, user: Partial<User>) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('takamul_users');
    return savedUsers ? JSON.parse(savedUsers) : [
      {
        id: '1',
        firstName: 'مدير',
        lastName: 'النظام',
        gender: 'male',
        company: 'شركة دقة الحلول',
        phone: '0500000000',
        email: 'admin@takamul.com',
        usernameEmail: 'admin',
        status: 'active',
        group: 'owner',
        defaultPaymentMethod: 'network',
        defaultPaymentCompany: 'none',
        defaultInvoiceType: 'delivery',
        notifyEmail: true,
        createdAt: new Date().toISOString()
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('takamul_users', JSON.stringify(users));
  }, [users]);

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...userData } : user));
  };

  return (
    <UsersContext.Provider value={{ users, addUser, deleteUser, updateUser }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
}
