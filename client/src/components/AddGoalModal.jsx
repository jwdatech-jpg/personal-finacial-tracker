import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import Modal from './Modal';
import { Loader2, Plus, Target, Calendar, Wallet, Palette } from 'lucide-react';
import { clsx } from 'clsx';
import DynamicIcon from './DynamicIcon';

const AddGoalModal = ({ isOpen, onClose, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRtl = i18n.language === 'ar';
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      currentAmount: 0,
      icon: 'Target',
      color: '#10b981'
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post('/goals', data);
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create goal', error);
    } finally {
      setLoading(false);
    }
  };

  const icons = ['Target', 'Home', 'Car', 'Plane', 'Laptop', 'Heart', 'GraduationCap', 'Palmtree'];
  const colors = ['#10b981', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f43f5e'];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('goals.addGoal')}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Goal Name */}
        <div>
          <label className="label">{t('goals.goalName')}</label>
          <div className="relative">
            <Target className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
            <input
              {...register('name', { required: 'Goal name is required' })}
              className={clsx("input", isRtl ? "pr-10" : "pl-10")}
              placeholder="e.g. New Car, Vacation"
            />
          </div>
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Target Amount */}
          <div>
            <label className="label">{t('goals.targetAmount')}</label>
            <div className="relative">
              <span className={clsx("absolute top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400", isRtl ? "left-3" : "right-3")}>
                {user?.currency || 'EGP'}
              </span>
              <input
                {...register('targetAmount', { required: 'Target is required', min: 1, valueAsNumber: true })}
                type="number"
                step="0.01"
                className="input font-bold"
                placeholder="0.00"
              />
            </div>
          </div>
          {/* Current Amount */}
          <div>
            <label className="label">{t('goals.savedAmount')}</label>
            <div className="relative">
              <span className={clsx("absolute top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400", isRtl ? "left-3" : "right-3")}>
                {user?.currency || 'EGP'}
              </span>
              <input
                {...register('currentAmount', { valueAsNumber: true })}
                type="number"
                step="0.01"
                className="input font-bold"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="label">{t('goals.targetDate')}</label>
          <div className="relative">
            <Calendar className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
            <input
              {...register('deadline')}
              type="date"
              className={clsx("input", isRtl ? "pr-10" : "pl-10")}
            />
          </div>
        </div>

        {/* Icon Selection */}
        <div>
          <label className="label">{t('goals.chooseIcon')}</label>
          <div className="flex flex-wrap gap-2">
            {icons.map(icon => (
              <label key={icon} className="relative cursor-pointer">
                <input type="radio" value={icon} {...register('icon')} className="sr-only peer" />
                <div className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl border-2 border-transparent peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-all">
                  <DynamicIcon name={icon} size={20} className="text-slate-600" />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="label">{t('goals.themeColor')}</label>
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

        <button disabled={loading} type="submit" className="btn btn-primary w-full gap-2 py-3 mt-2">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
          {t('goals.addGoal')}
        </button>
      </form>
    </Modal>
  );
};

export default AddGoalModal;
