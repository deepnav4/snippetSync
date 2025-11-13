import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../lib/auth';
import type { User } from '../lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };

    // Add a timeout to ensure loading doesn't hang forever
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    loadUser().finally(() => clearTimeout(timeoutId));

    return () => clearTimeout(timeoutId);
  }, []);

  const login = async (email: string, password: string) => {
    await authService.login({ email, password });
    // Fetch user profile after login
    const userData = await authService.getProfile();
    setUser(userData);
  };

  const signup = async (username: string, email: string, password: string, fullName?: string) => {
    await authService.signup({ username, email, password, fullName });
    // Fetch user profile after signup
    const userData = await authService.getProfile();
    setUser(userData);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
