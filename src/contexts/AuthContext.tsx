import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, ChatContextType } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [chatContext, setChatContext] = useState<ChatContextType>('MAIN');
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  useEffect(() => {
    const storedContext = localStorage.getItem('selectedContext');
    if (storedContext) {
      setChatContext(storedContext as ChatContextType);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    console.log('Viewport height:', viewportHeight);
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ chatContext, setChatContext, viewportHeight, setViewportHeight }}>
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