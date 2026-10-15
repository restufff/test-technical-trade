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
      setError(res.message || 'Login gagal.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0f172a] border border-[#1e2d4a] shadow-2xl overflow-hidden">
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indodax-blue via-indodax-cyan to-trading-buy" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indodax-cyan/20 border border-indodax-cyan/40 flex items-center justify-center text-indodax-cyan font-bold">
              ID
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
                Masuk ke Indodax
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-indodax-cyan/15 text-indodax-cyan border border-indodax-cyan/30">
                  Demo
                </span>
              </h2>
              <p className="text-xs text-gray-400">Trading Simulator Indonesia</p>
            </div>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1a263f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 pb-6 pt-2 space-y-4">
          {/* Quick 1-Click Demo Login Box */}
          <div className="rounded-xl p-3.5 bg-[#142038] border border-indodax-cyan/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-indodax-cyan flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-indodax-cyan fill-indodax-cyan" />
                1-Klik Masuk Akun Demo (Rekomendasi)
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_USERS.map((user, idx) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => loginWithDemoAccount(idx)}
                  className="flex flex-col text-left p-2.5 rounded-lg bg-[#0b111e]/90 hover:bg-[#1a2b4c] border border-[#1f3152] hover:border-indodax-cyan/50 transition-all group"
                >
                  <span className="text-xs font-semibold text-white group-hover:text-indodax-cyan truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-gray-400 truncate">{user.email}</span>
                  <span className="text-[10px] text-trading-buy mt-1 font-medium">Saldo: Rp 50 Jt</span>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#1e2d4a]"></div>
            <span className="flex-shrink mx-3 text-xs text-gray-500 uppercase tracking-wider font-medium">atau masuk manual</span>
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
                  placeholder="demo@indodax.mock"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#0b111e] border border-[#1e2d4a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indodax-cyan focus:ring-1 focus:ring-indodax-cyan transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password123"
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm bg-[#0b111e] border border-[#1e2d4a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indodax-cyan focus:ring-1 focus:ring-indodax-cyan transition-colors"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Hint password demo: <code className="text-indodax-cyan">password123</code></p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-indodax-cyan hover:bg-indodax-cyanHover text-[#0b111e] font-bold text-sm shadow-lg shadow-indodax-cyan/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? 'Memproses...' : 'Masuk ke Akun'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-1 text-[11px] text-gray-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-trading-buy" />
            <span>Simulasi aman: Tanpa dana riil, tanpa risiko finansial.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
