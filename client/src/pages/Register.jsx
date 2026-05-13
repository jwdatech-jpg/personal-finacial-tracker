import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Mail, Lock, User, ArrowRight, Loader2, Globe } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { clsx } from 'clsx';

const Register = () => {
  const { t, i18n } = useTranslation();
  const { register: authRegister } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isRtl = i18n.language === 'ar';

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      await authRegister({
        name: data.name,
        email: data.email,
        password: data.password,
        language: i18n.language,
        currency: data.currency
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={clsx(
      "min-h-screen bg-slate-50 flex items-center justify-center p-4",
      isRtl ? "font-ibm" : "font-inter"
    )}>
      {/* Language Switcher */}
      <div className="fixed top-6 right-6 z-50">
        <button 
          onClick={() => i18n.changeLanguage(isRtl ? 'en' : 'ar')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Globe size={18} className="text-primary-600" />
          {isRtl ? 'English' : 'العربية'}
        </button>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center border border-primary-100">
              <TrendingUp className="text-primary-600" size={28} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              {isRtl ? 'مصاريفي' : 'FinTrack'}
            </h1>
          </div>

            <p className="text-slate-500 mt-1">{t('auth.registerWelcome')}</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
             <div>
              <label className="label">{t('auth.name')}</label>
              <div className="relative">
                <User className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  className={clsx("input", isRtl ? "pr-10" : "pl-10")}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label">{t('auth.email')}</label>
              <div className="relative">
                <Mail className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  className={clsx("input", isRtl ? "pr-10" : "pl-10")}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">{t('auth.password')}</label>
              <div className="relative">
                <Lock className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  type="password"
                  className={clsx("input", isRtl ? "pr-10" : "pl-10")}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
                <input
                  {...register('confirmPassword', { 
                    required: 'Please confirm password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  type="password"
                  className={clsx("input", isRtl ? "pr-10" : "pl-10")}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <div>
              <label className="label">{t('currencies.preferredCurrency')}</label>
              <select
                {...register('currency', { required: 'Currency is required' })}
                className="input"
                defaultValue="EGP"
              >
                <option value="EGP">{t('currencies.EGP')}</option>
                <option value="SAR">{t('currencies.SAR')}</option>
                <option value="USD">{t('currencies.USD')}</option>
                <option value="EUR">{t('currencies.EUR')}</option>
                <option value="GBP">{t('currencies.GBP')}</option>
              </select>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="btn btn-primary w-full py-3 text-lg gap-2 mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : t('common.register')}
              {!isLoading && <ArrowRight size={20} className={clsx(isRtl && "rotate-180")} />}
            </button>
          </form>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            {t('auth.alreadyHaveAccount')}?{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 underline decoration-primary-200">
              {t('common.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
