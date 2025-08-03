import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface JWTUser {
  uid: string;
  email: string;
  displayName?: string;
  emailVerified: boolean;
  role?: string;
}

interface UseJWTReturn {
  user: JWTUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  isAuthenticated: boolean;
}

export const useJWT = (): UseJWTReturn => {
  const [user, setUser] = useState<JWTUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/jwt', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/auth/jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          action: 'login'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'logout'
        })
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      router.push('/auth/login');
    }
  }, [router]);

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/jwt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'refresh'
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }, []);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (user) {
      const refreshInterval = setInterval(async () => {
        const success = await refreshToken();
        if (!success) {
          setUser(null);
          router.push('/auth/login');
        }
      }, 14 * 60 * 1000); // Refresh 1 minute before expiration

      return () => clearInterval(refreshInterval);
    }
  }, [user, refreshToken, router]);

  return {
    user,
    loading,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user
  };
}; 