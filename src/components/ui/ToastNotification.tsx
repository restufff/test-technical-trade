'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message }: Omit<Toast, 'id'>) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const newToast: Toast = { id, type, title, message };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast container floating at bottom right */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-start gap-2.5 animate-in slide-in-from-bottom-2 duration-200 backdrop-blur-md ${
                isSuccess
                  ? 'bg-[#0f2420]/95 border-trading-buy/40 text-trading-buy'
                  : isError
                  ? 'bg-[#291419]/95 border-trading-sell/40 text-trading-sell'
                  : 'bg-[#121c32]/95 border-indodax-cyan/40 text-indodax-cyan'
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              ) : isError ? (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <div className="flex-grow text-xs">
                <div className="font-bold text-white text-sm">{toast.title}</div>
                {toast.message && <div className="text-gray-300 mt-0.5">{toast.message}</div>}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
