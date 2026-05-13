import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Globe, User as UserIcon, Bell, Menu, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';

const Navbar = ({ onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    
    // Save preference to DB if logged in
    try {
      await api.put('/users/language', { language: newLang });
    } catch (error) {
      console.error('Failed to save language preference', error);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 md:px-8 sticky top-0 z-30">
      <button 
        onClick={onMenuClick}
        className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg me-4"
      >
        <Menu size={24} />
      </button>

      <div className="flex-1">
        <h1 className="text-lg font-semibold text-slate-800 hidden md:block">
          {new Date().toLocaleDateString(i18n.language === 'ar' ? 'ar-SA' : 'en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={toggleLanguage}
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors flex items-center gap-2 px-3"
          title={t('common.settings')}
        >
          <Globe size={20} />
          <span className="text-sm font-medium uppercase">{i18n.language}</span>
        </button>

        <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        <Link to="/profile" className="flex items-center gap-3 p-1 hover:bg-slate-50 rounded-xl transition-colors">
          <div className="hidden md:block text-end">
            <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
            <UserIcon size={20} className="text-slate-600" />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
