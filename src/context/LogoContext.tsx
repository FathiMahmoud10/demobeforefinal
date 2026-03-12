import React, { createContext, useContext, useState, useEffect } from 'react';

interface LogoContextType {
  logo: string;
  updateLogo: (newLogo: string) => void;
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export function LogoProvider({ children }: { children: React.ReactNode }) {
  const [logo, setLogo] = useState<string>(() => {
    return localStorage.getItem('app_logo') || '';
  });

  const updateLogo = (newLogo: string) => {
    setLogo(newLogo);
    localStorage.setItem('app_logo', newLogo);
  };

  return (
    <LogoContext.Provider value={{ logo, updateLogo }}>
      {children}
    </LogoContext.Provider>
  );
}

export function useLogo() {
  const context = useContext(LogoContext);
  if (context === undefined) {
    throw new Error('useLogo must be used within a LogoProvider');
  }
  return context;
}
