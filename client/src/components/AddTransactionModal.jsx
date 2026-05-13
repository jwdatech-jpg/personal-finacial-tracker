import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import Modal from './Modal';
import { Loader2, Plus, Calendar, Tag, Wallet, FileText, ArrowUpCircle, ArrowDownCircle, Paperclip } from 'lucide-react';
import { clsx } from 'clsx';

const AddTransactionModal = ({ isOpen, onClose, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRtl = i18n.language === 'ar';
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    defaultValues: {
      type: 'EXPENSE',
      date: new Date().toISOString().split('T')[0]
    }
  });

  const type = watch('type');

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [accRes, catRes] = await Promise.all([
            api.get('/accounts'),
            api.get('/categories')
          ]);
          setAccounts(accRes.data.accounts);
          setCategories(catRes.data.categories);
        } catch (error) {
          console.error('Failed to fetch data for modal', error);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'attachment') {
        if (data[key] && data[key][0]) {
          formData.append('attachment', data[key][0]);
        }
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      await api.post('/transactions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create transaction', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('transactions.addTransaction')}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => reset({ ...watch(), type: 'EXPENSE' })}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
              type === 'EXPENSE' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <ArrowDownCircle size={18} />
            {t('common.expense')}
          </button>
          <button
            type="button"
            onClick={() => reset({ ...watch(), type: 'INCOME' })}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
              type === 'INCOME' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <ArrowUpCircle size={18} />
            {t('common.income')}
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="label">{t('common.amount')}</label>
          <div className="relative">
            <span className={clsx("absolute top-1/2 -translate-y-1/2 font-bold text-slate-400", isRtl ? "left-4" : "right-4")}>
               {user?.currency || 'EGP'}
            </span>
            <input
              {...register('amount', { required: 'Amount is required', min: 0.01, valueAsNumber: true })}
              type="number"
              step="0.01"
              className="input text-lg font-bold"
              placeholder="0.00"
            />
          </div>
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
        </div>

        {/* Account */}
        <div>
          <label className="label">{t('common.account')}</label>
          <div className="relative">
            <Wallet className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
            <select
              {...register('accountId', { required: 'Account is required' })}
              className={clsx("input", isRtl ? "pr-10" : "pl-10")}
            >
               <option value="">{t('common.selectAccount')}</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name} ({acc.balance} {user?.currency || 'EGP'})</option>
              ))}
            </select>
          </div>
          {errors.accountId && <p className="text-xs text-red-500 mt-1">{errors.accountId.message}</p>}
        </div>

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
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {isRtl ? cat.nameAr : cat.nameEn}
                </option>
              ))}
            </select>
          </div>
          {errors.categoryId && <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="label">{t('common.date')}</label>
          <div className="relative">
            <Calendar className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
            <input
              {...register('date', { required: 'Date is required' })}
              type="date"
              className={clsx("input", isRtl ? "pr-10" : "pl-10")}
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="label">{t('common.note')}</label>
          <div className="relative">
            <FileText className={clsx("absolute top-3 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
            <textarea
              {...register('note')}
              className={clsx("input min-h-[80px] py-2", isRtl ? "pr-10" : "pl-10")}
               placeholder={t('common.notePlaceholder')}
            />
          </div>
        </div>

        {/* Attachment */}
        <div>
          <label className="label">{t('common.attachment')}</label>
          <div className="relative">
            <Paperclip className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
            <input
              {...register('attachment')}
              type="file"
              className={clsx("input py-2 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100", isRtl ? "pr-10" : "pl-10")}
            />
          </div>
        </div>

        <button disabled={loading} type="submit" className="btn btn-primary w-full gap-2 py-3">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
          {t('transactions.addTransaction')}
        </button>
      </form>
    </Modal>
  );
};

export default AddTransactionModal;
