import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import Modal from './Modal';
import { Loader2, Plus, Wallet, CreditCard, Building2, Coins, Palette } from 'lucide-react';
import { clsx } from 'clsx';

const AddAccountModal = ({ isOpen, onClose, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRtl = i18n.language === 'ar';
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      type: 'BANK',
      balance: 0,
      currency: user?.currency || 'EGP',
      color: '#6366f1'
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/accounts', data);
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create account', error);
    } finally {
      setLoading(false);
    }
  };

  const accountTypes = [
    { value: 'BANK', label: t('accounts.bank'), icon: Building2 },
    { value: 'CASH', label: t('accounts.cash'), icon: Wallet },
    { value: 'CREDIT_CARD', label: t('accounts.creditCard'), icon: CreditCard },
    { value: 'SAVINGS', label: t('accounts.savings'), icon: Coins },
  ];

  const colors = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#475569'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('accounts.addAccount')}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Account Name */}
        <div>
          <label className="label">{t('accounts.accountName')}</label>
          <div className="relative">
            <Wallet className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
            <input
              {...register('name', { required: 'Name is required' })}
              className={clsx("input", isRtl ? "pr-10" : "pl-10")}
              placeholder="e.g. My Primary Bank"
            />
          </div>
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Account Type */}
        <div>
          <label className="label">{t('accounts.accountType')}</label>
          <div className="grid grid-cols-2 gap-2">
            {accountTypes.map((type) => (
              <label 
                key={type.value}
                className={clsx(
                  "flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition-all",
                  "hover:bg-slate-50",
                  // Watch value for manual selection since we are using custom radio
                )}
              >
                <input 
                  type="radio" 
                  value={type.value} 
                  {...register('type')} 
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <type.icon size={18} className="text-slate-400" />
                <span className="text-sm font-medium">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Balance */}
        <div>
          <label className="label">{t('accounts.initialBalance')}</label>
          <div className="relative">
             <span className={clsx("absolute top-1/2 -translate-y-1/2 font-bold text-slate-400", isRtl ? "left-4" : "right-4")}>
               {user?.currency || 'EGP'}
            </span>
            <input
              {...register('balance', { required: 'Balance is required', valueAsNumber: true })}
              type="number"
              step="0.01"
              className="input text-lg font-bold"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="label">{t('accounts.accountThemeColor')}</label>
          <div className="flex flex-wrap gap-3 p-1">
            {colors.map((color) => (
              <label key={color} className="relative cursor-pointer">
                <input 
                  type="radio" 
                  value={color} 
                  {...register('color')} 
                  className="sr-only peer"
                />
                <div 
                  className="w-8 h-8 rounded-full border-2 border-white ring-2 ring-transparent peer-checked:ring-primary-500 transition-all"
                  style={{ backgroundColor: color }}
                />
              </label>
            ))}
          </div>
        </div>

        <button disabled={loading} type="submit" className="btn btn-primary w-full gap-2 py-3 mt-4">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
          {t('accounts.addAccount')}
        </button>
      </form>
    </Modal>
  );
};

export default AddAccountModal;
