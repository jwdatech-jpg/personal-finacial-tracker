import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Wallet, 
  PiggyBank, 
  Target,
  LogOut,
  TrendingUp,
  Tag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';

const Sidebar = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const isRtl = i18n.language === 'ar';

  const menuItems = [
    { icon: LayoutDashboard, label: t('common.dashboard'), path: '/' },
    { icon: ArrowLeftRight, label: t('common.transactions'), path: '/transactions' },
    { icon: Wallet, label: t('common.accounts'), path: '/accounts' },
    { icon: TrendingUp, label: t('common.budgets'), path: '/budgets' },
    { icon: Target, label: t('common.goals'), path: '/goals' },
    { icon: Tag, label: t('common.categories'), path: '/categories' },
  ];

  return (
    <aside className={clsx(
      "fixed inset-y-0 z-50 w-64 bg-white border-e border-slate-200 flex flex-col h-screen transition-transform duration-300 lg:translate-x-0 lg:static lg:block",
      isOpen ? (isRtl ? "-translate-x-0" : "translate-x-0") : (isRtl ? "translate-x-full" : "-translate-x-full"),
      isRtl ? "right-0 border-s" : "left-0",
      isRtl ? "font-ibm" : "font-inter"
    )}>
      <div className="p-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-primary-600" size={24} />
          </div>
          <span className="text-xl font-bold text-slate-800">
            {isRtl ? 'مصاريفي' : 'FinTrack'}
          </span>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-600">
          <ArrowLeftRight size={20} className="rotate-45" /> {/* Simple replacement for X if needed or use X icon */}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
              isActive 
                ? "bg-primary-50 text-primary-600 font-semibold" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <item.icon size={24} className={clsx(!isRtl && "rtl-flip")} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 w-full"
        >
          <LogOut size={20} className={clsx(!isRtl && "rtl-flip")} />
          <span>{t('common.logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
