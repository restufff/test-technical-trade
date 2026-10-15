'use client';

import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '@/context/AuthContext';
import { X, Lock, Mail, ShieldCheck, Zap, AlertCircle } from 'lucide-react';

export default function LoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, login, loginWithDemoAccount } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);
    if (!res.success) {
      setError(res.message || 'Email atau password salah.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0f172a] border border-[#1e2d4a] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#18233c] bg-[#0d1424]">
          <div>
            <h2 className="text-lg font-bold text-white">Masuk</h2>
            <p className="text-xs text-gray-400">Pilih akun tester atau login manual</p>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1a263f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 pt-4 space-y-4">
          {/* Quick Preset Accounts */}
          <div>
            <div className="text-xs font-semibold text-gray-300 mb-2 flex items-center gap-1">
              Pilih Akun
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map((user, idx) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => loginWithDemoAccount(idx)}
                  className="flex flex-col text-left p-2.5 rounded-xl bg-[#142038] hover:bg-[#1a2b4c] border border-[#1f3152] hover:border-indodax-cyan/50 transition-all group"
                >
                  <span className="text-xs font-bold text-white group-hover:text-indodax-cyan truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-gray-400 truncate mt-0.5">{user.email}</span>
                  <span className="text-[10px] text-trading-buy mt-1 font-mono font-medium">Rp 50.000.000</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#1e2d4a]"></div>
            <span className="flex-shrink mx-3 text-xs text-gray-500 font-medium">atau</span>
            <div className="flex-grow border-t border-[#1e2d4a]"></div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-trading-sell/10 border border-trading-sell/30 flex items-start gap-2 text-xs text-trading-sell">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@exchange.mock"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#0b111e] border border-[#1e2d4a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indodax-cyan transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-gray-300">Password</label>
                <span className="text-[11px] text-gray-500">default: <code className="text-indodax-cyan">password123</code></span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#0b111e] border border-[#1e2d4a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indodax-cyan transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-indodax-cyan hover:bg-indodax-cyanHover text-[#0b111e] font-bold text-sm shadow-lg shadow-indodax-cyan/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? 'Memuat...' : 'Masuk'}
            </button>
          </form>

          <div className="text-center text-[11px] text-gray-500 pt-1">
            Pre-Test Only
          </div>
        </div>
      </div>
    </div>
  );
}
