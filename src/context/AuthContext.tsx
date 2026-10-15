'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAccount } from '../types/trading';

export const DEMO_USERS: (UserAccount & { password: string })[] = [
  {
    id: 'user_idx_001',
    name: 'Budi Santoso (Pro Trader)',
    email: 'demo@indodax.mock',
    password: 'password123',
    kycStatus: 'VERIFIED_LEVEL_2',
    memberSince: 'Januari 2022',
  },
  {
    id: 'user_idx_002',
    name: 'Siti Rahma (Crypto Investor)',
    email: 'trader@crypto.id',
    password: 'password123',
    kycStatus: 'VERIFIED_LEVEL_2',
    memberSince: 'Maret 2023',
  },
];

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginWithDemoAccount: (index?: number) => void;
  logout: () => void;
  updateProfile: (data: Partial<UserAccount>) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
}

const STORAGE_KEY = 'indodax_user_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Initialize from localStorage safely
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch {
      // ignore JSON parse or localStorage errors
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!found) {
      return { success: false, message: 'Email tidak ditemukan. Silakan gunakan akun demo.' };
    }

    if (found.password !== password) {
      return { success: false, message: 'Password salah. Gunakan: password123' };
    }

    const account: UserAccount = {
      id: found.id,
      name: found.name,
      email: found.email,
      kycStatus: found.kycStatus,
      memberSince: found.memberSince,
    };

    setUser(account);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
    } catch {
      // ignore
    }
    setIsLoginModalOpen(false);
    return { success: true };
  };

  const loginWithDemoAccount = (index: number = 0) => {
    const target = DEMO_USERS[index] || DEMO_USERS[0];
    login(target.email, target.password);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsProfileModalOpen(false);
  };

  const updateProfile = (data: Partial<UserAccount>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        loginWithDemoAccount,
        logout,
        updateProfile,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
