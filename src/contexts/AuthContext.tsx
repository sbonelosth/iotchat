import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, User } from '../types/index';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [authError, setAuthError] = useState({ title: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user data on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }

    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/');
    }
  }, [isAuthenticated]);

  const loginHandler = async (identifier: string, password: string) => {
    setIsLoading(true);
    const result = await authService.login(identifier, password);

    if (!result.success) {
      const error = result.error;
      setAuthError(error as { title: string; message: string });
      if (authError.message.includes('verify')) {
        navigate('/verify');
      }
      setIsAuthenticated(false);
      setUser(result.data);
    } else {
      setUser(result.data.user as Partial<User>);
      setIsAuthenticated(true);
    }

    setIsLoading(false);
    return result;
  };

  const signupHandler = async (signupData: Partial<User>) => {
    setIsLoading(true);
    const result = await authService.signup(signupData);
    if (!result.success) {
      const error = result.error;
      setAuthError(error as { title: string; message: string });
      setIsAuthenticated(false);
    } else {
      setUser(result.data.user as Partial<User>);
      navigate('/verify');
    }

    setIsLoading(false);
    return result;
  };

  const verifyEmailHandler = async (email: string, code: any) => {
    setIsLoading(true);
    const result = await authService.verify(email, code as string);
    if (!result.success) {
      const error = result.error;
      setAuthError(error as { title: string; message: string });
      setIsAuthenticated(false);
    } else {
      if (result.data?.sent as boolean) {
        setIsAuthenticated(false);
        navigate('/verify');
      } else {
        setIsAuthenticated(true);
        navigate('/');
      }
      setUser(result.data.user);
    }
    setIsLoading(false);
    return result;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('suggestions');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isAuthenticated,
      viewportHeight,
      setViewportHeight,
      authError,
      setAuthError,
      isLoading,
      isRefreshing,
      login: loginHandler,
      signup: signupHandler,
      verify: verifyEmailHandler,
      logout
    }}>
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