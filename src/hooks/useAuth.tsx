'use client';

import React, { createContext, useContext } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { registerUser, loginUser, logoutUser } from '@/lib/auth';

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  register: (credentials: any) => Promise<any>;
  login: (credentials: any) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const register = async (credentials: any) => {
    try {
      const result = await registerUser(credentials);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials: any) => {
    try {
      const result = await loginUser(credentials);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    // Clerk handles user refresh automatically
    // This function is kept for compatibility but doesn't need to do anything
  };

  const value = {
    user,
    session: null, // Clerk doesn't expose session object like Supabase
    loading: !isLoaded,
    register,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
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