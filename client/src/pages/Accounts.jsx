import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Wallet, 
  Building2, 
  CreditCard, 
  Coins, 
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  PackageSearch,
  Trash2
} from 'lucide-react';
import AddAccountModal from '../components/AddAccountModal';
import ConfirmModal from '../components/ConfirmModal';
import { clsx } from 'clsx';

const Accounts = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRtl = i18n.language === 'ar';
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/accounts');
      setAccounts(data.accounts);
    } catch (error) {
      console.error('Failed to fetch accounts', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!accountToDelete) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/accounts/${accountToDelete}`);
      setIsConfirmOpen(false);
      setAccountToDelete(null);
      fetchAccounts();
    } catch (error) {
      console.error('Failed to delete account', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: user?.currency || 'EGP',
    }).format(val);
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case 'BANK': return <Building2 size={24} />;
      case 'CREDIT_CARD': return <CreditCard size={24} />;
      case 'SAVINGS': return <Coins size={24} />;
      default: return <Wallet size={24} />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t('common.accounts')}</h2>
          <p className="text-slate-500">{t('accounts.manageAccounts')}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary gap-2">
          <Plus size={18} />
          {t('accounts.addAccount')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center card bg-slate-50/50 border-dashed">
            <Loader2 className="animate-spin text-primary-500 mb-4" size={32} />
            <p className="text-slate-500 font-medium">{t('common.loading')}</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center card bg-slate-50/50 border-dashed">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <PackageSearch size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{t('common.noData')}</h3>
            <p className="text-slate-500 mb-6 text-center max-w-xs">{t('accounts.noAccountsDesc')}</p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary border-slate-200">
              {t('accounts.createFirstAccount')}
            </button>
          </div>
        ) : accounts.map((account) => {
          const totalIn = (account.transactions || []).filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
          const totalOut = (account.transactions || []).filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

          return (
            <div key={account.id} className="card p-6 relative overflow-hidden group transition-all duration-300">
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: account.color }}></div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110" style={{ backgroundColor: account.color + '10', borderColor: account.color + '30', color: account.color }}>
                    {React.cloneElement(getAccountIcon(account.type), { size: 24 })}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{account.name}</h3>
                    <p className="text-xs text-slate-500">{t(`accounts.${account.type.toLowerCase().replace('_', '')}`)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setAccountToDelete(account.id);
                    setIsConfirmOpen(true);
                  }}
                  className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-slate-500 mb-1">{t('common.balance')}</p>
                <h4 className="text-2xl font-black text-slate-900">{formatCurrency(account.balance)}</h4>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <div className="flex items-center gap-1 text-emerald-600 mb-1">
                    <ArrowUpRight size={16} />
                    <span className="text-xs font-semibold">{t('common.income')}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(totalIn)}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-rose-600 mb-1">
                    <ArrowDownRight size={16} />
                    <span className="text-xs font-semibold">{t('common.expense')}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(totalOut)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddAccountModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchAccounts} 
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setAccountToDelete(null);
        }}
        onConfirm={handleDelete}
        title={t('common.delete')}
        message={t('common.confirmDelete')}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Accounts;
