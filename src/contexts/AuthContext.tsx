import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, User } from '../types/index';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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
        console.error('Error parsing stored user data:', error);
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

  const loginHandler = async (identifier: string, password: string) => {
    setIsLoading(true);
    const result = await authService.login(identifier, password);

    if (!result.success) {
      const error = result.error;
      setAuthError(error as { title: string; message: string });
      setIsAuthenticated(false);
      setUser(result.data);
    } else {
      localStorage.setItem('e58ea3edfbbbc2', result.data.user.accessToken);
      setUser(result.data.user);
      setIsAuthenticated(true);
      navigate('/');
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
    }

    if (result.success) {
      localStorage.setItem('e58ea3edfbbbc2', result.data.user.accessToken);
      setUser(result.data.user);
      setIsAuthenticated(true);
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
      if (result.data?.sent) {
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

  const refreshHandler = async () => {
    setIsRefreshing(true);
    const result = await authService.refresh();
    if (result.success) {
      setUser(result.data.user);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setIsRefreshing(false);
    return result;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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
      refresh: refreshHandler,
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