import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import api from '../lib/axios';
import Modal from './Modal';
import { Loader2, Plus, Tag, Palette } from 'lucide-react';
import { clsx } from 'clsx';
import DynamicIcon from './DynamicIcon';

const AddCategoryModal = ({ isOpen, onClose, onSuccess, category }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    defaultValues: {
      type: 'EXPENSE',
      icon: 'Tag',
      color: '#6366f1'
    }
  });

  React.useEffect(() => {
    if (category) {
      setValue('nameEn', category.nameEn);
      setValue('nameAr', category.nameAr);
      setValue('type', category.type);
      setValue('icon', category.icon);
      setValue('color', category.color);
    } else {
      reset({
        type: 'EXPENSE',
        icon: 'Tag',
        color: '#6366f1'
      });
    }
  }, [category, setValue, reset, isOpen]);

  const selectedIcon = watch('icon');
  const selectedType = watch('type');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (category) {
        await api.put(`/categories/${category.id}`, data);
      } else {
        await api.post('/categories', data);
      }
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to save category', error);
    } finally {
      setLoading(false);
    }
  };

  const iconOptions = [
    'Tag', 'ShoppingBag', 'Utensils', 'Car', 'Home', 'HeartPulse', 
    'Gamepad2', 'GraduationCap', 'Plane', 'Coffee', 'Bus', 'Zap', 
    'Phone', 'ShieldCheck', 'TrendingUp', 'Coins', 'Laptop', 'Gift', 'Download'
  ];

  const colors = [
    '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#475569'
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? t('common.edit') : t('common.addCategory')}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Type Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => reset({ ...watch(), type: 'EXPENSE' })}
            className={clsx(
              "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
              selectedType === 'EXPENSE' ? "bg-white text-rose-600 shadow-sm" : "text-slate-500"
            )}
          >
            {t('common.expense')}
          </button>
          <button
            type="button"
            onClick={() => reset({ ...watch(), type: 'INCOME' })}
            className={clsx(
              "flex-1 py-2 rounded-lg text-sm font-bold transition-all",
              selectedType === 'INCOME' ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"
            )}
          >
            {t('common.income')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">{t('common.categoryName')} (EN)</label>
            <input
              {...register('nameEn', { required: 'English name is required' })}
              className="input"
              placeholder="e.g. Groceries"
            />
          </div>
          <div>
            <label className="label">{t('common.categoryName')} (AR)</label>
            <input
              {...register('nameAr', { required: 'Arabic name is required' })}
              className="input text-end"
              placeholder="مثلاً: بقالة"
            />
          </div>
        </div>

        {/* Icon Selection */}
        <div>
          <label className="label">{t('common.categoryIcon')}</label>
          <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 rounded-xl">
            {iconOptions.map(icon => (
              <label key={icon} className="relative cursor-pointer">
                <input type="radio" value={icon} {...register('icon')} className="sr-only peer" />
                <div className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-transparent peer-checked:border-primary-500 peer-checked:bg-white transition-all">
                  <DynamicIcon name={icon} size={24} className="text-slate-600" />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="label">{t('common.color')}</label>
          <div className="flex flex-wrap gap-3 p-1">
            {colors.map((color) => (
              <label key={color} className="relative cursor-pointer">
                <input type="radio" value={color} {...register('color')} className="sr-only peer" />
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
          {category ? t('common.save') : t('common.addCategory')}
        </button>
      </form>
    </Modal>
  );
};

export default AddCategoryModal;
