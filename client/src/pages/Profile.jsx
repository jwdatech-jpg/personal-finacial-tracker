import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import { User, Mail, Lock, Save, Loader2, CheckCircle2, AlertCircle, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useToast } from '../context/ToastContext';
import { clsx } from 'clsx';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { user, setUser } = useAuth();
  const { addToast } = useToast();
  const isRtl = i18n.language === 'ar';
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors } } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      currency: user?.currency || 'EGP'
    }
  });

  const { register: registerPass, handleSubmit: handleSubmitPass, formState: { errors: passErrors }, reset: resetPass, watch } = useForm();
  const newPassword = watch("newPassword");

  const onUpdateProfile = async (data) => {
    setProfileLoading(true);
    setProfileMessage(null);
    try {
      const res = await api.put('/users/profile', data);
      setUser(res.data.user);
      addToast(t('profile.updateSuccess'), 'success');
    } catch (err) {
      addToast(err.response?.data?.error?.message || t('profile.updateError'), 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const onChangePassword = async (data) => {
    setPasswordLoading(true);
    setPasswordMessage(null);
    try {
      await api.put('/users/change-password', data);
      addToast(t('profile.passSuccess'), 'success');
      resetPass();
    } catch (err) {
      addToast(err.response?.data?.error?.message || t('profile.passError'), 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{t('common.settings')}</h2>
        <p className="text-slate-500">{isRtl ? 'إدارة تفضيلات حسابك والأمان' : 'Manage your account preferences and security'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Info */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
              <User size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('profile.personalInfo')}</h3>
          </div>

          <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="space-y-4">
            <div>
              <label className="label">{t('auth.name')}</label>
              <div className="relative">
                <User className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
                <input
                  {...registerProfile('name', { required: 'Name is required' })}
                  className={clsx("input", isRtl ? "pr-10" : "pl-10")}
                />
              </div>
              {profileErrors.name && <p className="text-xs text-red-500 mt-1">{profileErrors.name.message}</p>}
            </div>

            <div>
              <label className="label">{t('auth.email')}</label>
              <div className="relative">
                <Mail className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
                <input
                  {...registerProfile('email', { required: 'Email is required' })}
                  type="email"
                  className={clsx("input", isRtl ? "pr-10" : "pl-10")}
                />
              </div>
              {profileErrors.email && <p className="text-xs text-red-500 mt-1">{profileErrors.email.message}</p>}
            </div>

            <div>
              <label className="label">{t('currencies.preferredCurrency')}</label>
              <select
                {...registerProfile('currency', { required: 'Currency is required' })}
                className="input"
              >
                <option value="EGP">{t('currencies.EGP')}</option>
                <option value="SAR">{t('currencies.SAR')}</option>
                <option value="USD">{t('currencies.USD')}</option>
                <option value="EUR">{t('currencies.EUR')}</option>
                <option value="GBP">{t('currencies.GBP')}</option>
              </select>
            </div>



            <button disabled={profileLoading} type="submit" className="btn btn-primary w-full gap-2">
              {profileLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {t('profile.updateProfile')}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <Lock size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t('profile.security')}</h3>
          </div>

          <form onSubmit={handleSubmitPass(onChangePassword)} className="space-y-4">
            <div>
              <label className="label">{t('profile.currentPassword')}</label>
              <div className="relative">
                <Lock className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
                <input
                  {...registerPass('currentPassword', { required: 'Current password is required' })}
                  type="password"
                  className={clsx("input", isRtl ? "pr-10" : "pl-10")}
                  placeholder="••••••••"
                />
              </div>
              {passErrors.currentPassword && <p className="text-xs text-red-500 mt-1">{passErrors.currentPassword.message}</p>}
            </div>

            <div>
              <label className="label">{t('profile.newPassword')}</label>
              <div className="relative">
                <Lock className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
                <input
                  {...registerPass('newPassword', { 
                    required: 'New password is required',
                    minLength: { value: 6, message: 'Must be at least 6 characters' }
                  })}
                  type="password"
                  className={clsx("input", isRtl ? "pr-10" : "pl-10")}
                  placeholder="••••••••"
                />
              </div>
              {passErrors.newPassword && <p className="text-xs text-red-500 mt-1">{passErrors.newPassword.message}</p>}
            </div>

            <button disabled={passwordLoading} type="submit" className="btn btn-secondary w-full gap-2 border-slate-200">
              {passwordLoading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
              {t('profile.changePassword')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
