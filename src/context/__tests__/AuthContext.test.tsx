import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default state as not authenticated if no stored session', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('allows logging in with demo credentials', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('demo@indodax.mock', 'password123');
    });

    expect(loginResult).toEqual({ success: true });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('demo@indodax.mock');
    expect(result.current.user?.kycStatus).toBe('VERIFIED_LEVEL_2');
    expect(localStorage.getItem('indodax_user_session')).toBeTruthy();
  });

  it('rejects invalid password', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginResult;
    await act(async () => {
      loginResult = await result.current.login('demo@indodax.mock', 'wrongpassword');
    });

    expect(loginResult?.success).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('allows logging out and cleans up session', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('demo@indodax.mock', 'password123');
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('indodax_user_session')).toBeNull();
  });
});
