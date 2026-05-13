import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Mail, Lock, ArrowRight, Loader2, Globe, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { clsx } from 'clsx';

const Login = () => {
  const { t, i18n } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isRtl = i18n.language === 'ar';

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={clsx(
      "min-h-screen bg-gradient-to-br from-primary-50 via-white to-slate-100 flex items-center justify-center p-4",
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

      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center border border-primary-100">
              <TrendingUp className="text-primary-600" size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isRtl ? 'مصاريفي' : 'FinTrack'}
            </h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-900">{t('common.login')}</h2>
            <p className="text-slate-500 mt-1">{t('auth.loginWelcome')}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              <div className="flex items-center justify-between mb-1">
                <label className="label mb-0">{t('auth.password')}</label>
                <a href="#" className="text-xs font-semibold text-primary-600 hover:text-primary-700">
                  {t('auth.forgotPassword')}
                </a>
              </div>
              <div className="relative">
                <Lock className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? "text" : "password"}
                  className={clsx("input", isRtl ? "pr-10 pl-10" : "pl-10 pr-10")}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1", isRtl ? "left-2" : "right-2")}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="btn btn-primary w-full py-3 text-base gap-2 mt-4"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : t('common.login')}
              {!isLoading && <ArrowRight size={20} className={clsx(isRtl && "rotate-180")} />}
            </button>
          </form>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            {t('auth.dontHaveAccount')}{' '}
            <Link to="/register" className="font-bold text-primary-600 hover:text-primary-700 underline decoration-primary-200">
              {t('common.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
