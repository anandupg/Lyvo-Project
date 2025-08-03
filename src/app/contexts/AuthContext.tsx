'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, handleRedirectResult } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isEmailVerified: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isEmailVerified: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First, handle any redirect result (for mobile Google sign-in)
        const redirectResult = await handleRedirectResult();
        
        // Set up auth state listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log('Auth state changed:', user?.email);
          setUser(user);
          setLoading(false);
        });

        // If we have a redirect result with a user, update the state immediately
        if (redirectResult.user) {
          console.log('Redirect result user found:', redirectResult.user.email);
          setUser(redirectResult.user);
          setLoading(false);
        }

        return unsubscribe;
      } catch (error) {
        console.error('Error initializing auth:', error);
        
        // Even if redirect handling fails, we should still set up the auth listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log('Auth state changed (after error):', user?.email);
          setUser(user);
          setLoading(false);
        });
        
        return unsubscribe;
      }
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    loading,
    isEmailVerified: user?.emailVerified || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 