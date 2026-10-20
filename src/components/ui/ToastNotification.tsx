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

      setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // Keep max 5 toasts

      // Auto dismiss after 4.5 seconds
      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast container floating at top right */}
      <div data-testid="toast-container" className="fixed top-16 right-4 z-[9999] flex flex-col space-y-2.5 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';

          return (
            <div
              key={toast.id}
              data-testid="toast-notification"
              className={`pointer-events-auto p-3.5 rounded-xl border shadow-2xl flex items-start gap-3 animate-in slide-in-from-top-3 duration-250 backdrop-blur-md transition-all ${
                isSuccess
                  ? 'bg-[#0a1f1b]/95 border-trading-buy/50 text-trading-buy shadow-trading-buy/10'
                  : isError
                  ? 'bg-[#290e14]/95 border-trading-sell/50 text-trading-sell shadow-trading-sell/10'
                  : 'bg-[#0f1d35]/95 border-indodax-cyan/50 text-indodax-cyan shadow-indodax-cyan/10'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {isSuccess ? (
                  <div className="w-6 h-6 rounded-full bg-trading-buy/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-trading-buy" />
                  </div>
                ) : isError ? (
                  <div className="w-6 h-6 rounded-full bg-trading-sell/20 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-trading-sell" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-indodax-cyan/20 flex items-center justify-center">
                    <Info className="w-4 h-4 text-indodax-cyan" />
                  </div>
                )}
              </div>

              <div className="flex-grow text-xs min-w-0">
                <div className="font-bold text-white text-sm tracking-wide leading-tight flex items-center gap-1.5">
                  <span data-testid="toast-title">{toast.title}</span>
                  <span
                    data-testid="toast-badge"
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      isSuccess
                        ? 'bg-trading-buy/20 text-trading-buy'
                        : isError
                        ? 'bg-trading-sell/20 text-trading-sell'
                        : 'bg-indodax-cyan/20 text-indodax-cyan'
                    }`}
                  >
                    {isSuccess ? 'SUKSES' : isError ? 'GAGAL' : 'INFO'}
                  </span>
                </div>
                {toast.message && (
                  <div data-testid="toast-message" className="text-gray-300 mt-1 leading-relaxed text-[11.5px] break-words">
                    {toast.message}
                  </div>
                )}
              </div>

              <button
                data-testid="btn-dismiss-toast"
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-white transition-colors shrink-0 p-0.5 rounded hover:bg-white/10"
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
    return {
      toasts: [],
      showToast: () => {},
      removeToast: () => {},
    };
  }
  return context;
}
