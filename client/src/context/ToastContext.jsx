import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className={clsx(
        "fixed bottom-6 z-[9999] flex flex-col gap-3 max-w-sm w-full transition-all duration-300",
        isRtl ? "left-6" : "right-6"
      )}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={clsx(
              "p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-right-4 duration-300",
              toast.type === 'success' && "bg-emerald-600 text-white",
              toast.type === 'error' && "bg-rose-600 text-white",
              toast.type === 'info' && "bg-slate-800 text-white",
              isRtl ? "font-ibm" : "font-inter"
            )}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle2 size={20} />}
              {toast.type === 'error' && <AlertCircle size={20} />}
              {toast.type === 'info' && <Info size={20} />}
              <span className="text-sm font-semibold">{toast.message}</span>
            </div>
            <button onClick={() => removeToast(toast.id)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
