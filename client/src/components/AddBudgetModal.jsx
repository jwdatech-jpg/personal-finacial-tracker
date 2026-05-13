import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import Modal from './Modal';
import { Loader2, Plus, Tag, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

const AddBudgetModal = ({ isOpen, onClose, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRtl = i18n.language === 'ar';
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const { data } = await api.get('/categories');
          // Only show expense categories for budgets
          setCategories(data.categories.filter(c => c.type === 'EXPENSE'));
        } catch (error) {
          console.error('Failed to fetch categories', error);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/budgets', {
        categoryId: data.categoryId,
        amount: parseFloat(data.amount),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      });
      reset();
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('budgets.addBudget')}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Category */}
        <div>
          <label className="label">{t('common.category')}</label>
          <div className="relative">
            <Tag className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
            <select
              {...register('categoryId', { required: 'Category is required' })}
              className={clsx("input", isRtl ? "pr-10" : "pl-10")}
            >
               <option value="">{t('common.selectCategory')}</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {isRtl ? cat.nameAr : cat.nameEn}
                </option>
              ))}
            </select>
          </div>
          {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>}
        </div>

        {/* Amount */}
        <div>
           <label className="label">{t('budgets.monthlyBudget')}</label>
          <div className="relative">
             <span className={clsx("absolute top-1/2 -translate-y-1/2 font-bold text-slate-400", isRtl ? "left-4" : "right-4")}>
               {user?.currency || 'EGP'}
            </span>
            <input
              {...register('amount', { required: 'Amount is required', min: 1 })}
              type="number"
              step="0.01"
              className="input text-lg font-bold"
              placeholder="0.00"
            />
          </div>
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
        </div>

        <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
           {t('budgets.budgetNote')}
        </p>

        <button disabled={loading} type="submit" className="btn btn-primary w-full gap-2 py-3">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
          {t('budgets.addBudget')}
        </button>
      </form>
    </Modal>
  );
};

export default AddBudgetModal;
