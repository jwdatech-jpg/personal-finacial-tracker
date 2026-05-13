import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import api from '../lib/axios';
import Modal from './Modal';
import { Loader2, Plus, TrendingUp } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../context/AuthContext';

const AddSavingsModal = ({ isOpen, onClose, onSuccess, goal }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRtl = i18n.language === 'ar';
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      amount: 0
    }
  });

  const onSubmit = async (data) => {
    if (!goal) return;
    setLoading(true);
    try {
      await api.put(`/goals/${goal.id}`, {
        currentAmount: goal.currentAmount + parseFloat(data.amount)
      });
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update goal savings', error);
    } finally {
      setLoading(false);
    }
  };

  if (!goal) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${t('goals.addSavings')} - ${goal.name}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="label">{t('common.amount')}</label>
          <div className="relative">
            <span className={clsx("absolute top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400", isRtl ? "left-4" : "right-4")}>
              {user?.currency || 'EGP'}
            </span>
            <input
              {...register('amount', { required: 'Amount is required', min: 1, valueAsNumber: true })}
              type="number"
              step="0.01"
              className="input text-lg font-bold"
              placeholder="0.00"
              autoFocus
            />
          </div>
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
        </div>

        <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">{t('common.balance')}</span>
            <span className="text-slate-900 font-bold">{goal.currentAmount} {user?.currency || 'EGP'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">{t('goals.targetAmount')}</span>
            <span className="text-slate-900 font-bold">{goal.targetAmount} {user?.currency || 'EGP'}</span>
          </div>
        </div>

        <button disabled={loading} type="submit" className="btn btn-primary w-full gap-2 py-3">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <TrendingUp size={20} />}
          {t('goals.addSavings')}
        </button>
      </form>
    </Modal>
  );
};

export default AddSavingsModal;
