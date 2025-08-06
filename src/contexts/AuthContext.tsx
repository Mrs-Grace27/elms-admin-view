// Authentication Context
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, LoginCredentials, LoginResponse, User } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      // Get user details after login
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setUserRole(authService.getCurrentUserRole());
      setIsAuthenticated(true);

      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${userData.first_name} ${userData.last_name}`,
      });

      return response;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (!authService.isAuthenticated()) {
        return;
      }

      const userData = await authService.getCurrentUser();
      setUser(userData);
      setUserRole(authService.getCurrentUserRole());
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error refreshing user:', error);
      // If refresh fails, logout the user
      await logout();
    }
  };

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          await refreshUser();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh token
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    if (isAuthenticated) {
      // Refresh token every 30 minutes
      refreshInterval = setInterval(async () => {
        try {
          await authService.refreshToken();
        } catch (error) {
          console.error('Token refresh failed:', error);
          await logout();
        }
      }, 30 * 60 * 1000);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [isAuthenticated]);

  const value: AuthContextType = {
    user,
    userRole,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};