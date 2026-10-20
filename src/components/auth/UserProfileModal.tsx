'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, User, CheckCircle2, Shield, LogOut, Calendar, Mail, Award } from 'lucide-react';

export default function UserProfileModal() {
  const { user, isProfileModalOpen, setIsProfileModalOpen, logout } = useAuth();

  if (!isProfileModalOpen || !user) return null;

  return (
    <div data-testid="modal-profile" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0f172a] border border-[#1e2d4a] shadow-2xl overflow-hidden">
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indodax-blue via-indodax-cyan to-trading-buy" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-trading-buy/20 border border-trading-buy/40 flex items-center justify-center text-trading-buy font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Profil Pengguna</h2>
              <p className="text-xs text-gray-400">Informasi Akun Terverifikasi</p>
            </div>
          </div>
          <button
            data-testid="btn-close-profile"
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#1a263f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-2 space-y-4">
          {/* User badge banner */}
          <div className="p-4 rounded-xl bg-[#142038] border border-[#1e2d4a] flex items-center justify-between">
            <div>
              <h3 data-testid="profile-user-name" className="font-semibold text-white text-base">{user.name}</h3>
              <p data-testid="profile-user-email" className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span data-testid="profile-kyc-badge" className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-trading-buy/15 text-trading-buy border border-trading-buy/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                KYC Level 2
              </span>
              <span className="text-[10px] text-gray-400 mt-1">Terverifikasi</span>
            </div>
          </div>

          {/* Account Details list */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0b111e] border border-[#1e2d4a]">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indodax-cyan" />
                Keamanan
              </span>
              <span data-testid="profile-security-status" className="font-medium text-trading-buy">2FA Aktif</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0b111e] border border-[#1e2d4a]">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indodax-cyan" />
                Tier Akun
              </span>
              <span data-testid="profile-tier-status" className="font-medium text-white">VIP 1 (Fee 0.1%)</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-[#0b111e] border border-[#1e2d4a]">
              <span className="text-gray-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indodax-cyan" />
                Bergabung
              </span>
              <span data-testid="profile-member-since" className="font-medium text-gray-200">{user.memberSince}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            data-testid="btn-logout"
            onClick={logout}
            className="w-full py-2.5 rounded-lg bg-[#1a233a] hover:bg-trading-sell/20 border border-[#2a385a] hover:border-trading-sell/40 text-trading-sell font-semibold text-sm transition-all flex items-center justify-center gap-2 mt-4"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  );
}
