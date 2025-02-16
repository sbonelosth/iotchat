import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, ChatContextType } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [chatContext, setChatContext] = useState<ChatContextType>('MAIN');

  useEffect(() => {
    const storedContext = localStorage.getItem('selectedContext');
    if (storedContext) {
      setChatContext(storedContext as ChatContextType);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ chatContext, setChatContext }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}