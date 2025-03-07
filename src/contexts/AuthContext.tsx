import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user-type';
import authService from '../services/auth-service';

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loginWithGoogle: () => void;
  clearError: () => void;
}

// Create context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component props interface
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const initAuth = async () => {
      const currentUser = authService.getCurrentUser();
      console.log(currentUser);
      
      if (currentUser && authService.isAuthenticated()) {
        setUser(currentUser);
        
        // Try to refresh token
        try {
          const { request } = authService.refreshToken();
          const response = await request;
          
          // Update auth data
          authService.saveAuth(response.data);
          setUser(response.data.user);
        } catch (err) {
          console.error('Token refresh failed:', err);
          // If refresh fails, we still keep the user logged in with current token
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { request } = authService.login({ email, password });
      const response = await request;
      
      authService.saveAuth(response.data);
      setUser(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name:string , email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { request } = authService.register({name ,email, password });
      const response = await request;
      
      authService.saveAuth(response.data);
      setUser(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    try {
      const { request } = authService.logout();
      // We don't need to await this, as we want to log out immediately
      request.catch(err => console.error('Logout error:', err));
    } finally {
      authService.clearAuth();
      setUser(null);
    }
  };

  // Social login functions
  const loginWithGoogle = () => {
    authService.loginWithGoogle();
  };


  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    loginWithGoogle,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;