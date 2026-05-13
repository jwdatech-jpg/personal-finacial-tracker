import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { Plus, TrendingUp, AlertCircle, CheckCircle2, PackageSearch, Loader2, Trash2 } from 'lucide-react';
import AddBudgetModal from '../components/AddBudgetModal';
import { clsx } from 'clsx';
import DynamicIcon from '../components/DynamicIcon';
import ConfirmModal from '../components/ConfirmModal';

const Budgets = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/budgets');
      setBudgets(data.budgets);
    } catch (error) {
      console.error('Failed to fetch budgets', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!budgetToDelete) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/budgets/${budgetToDelete}`);
      setIsConfirmOpen(false);
      setBudgetToDelete(null);
      fetchBudgets();
    } catch (error) {
      console.error('Failed to delete budget', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: user?.currency || 'EGP',
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t('common.budgets')}</h2>
          <p className="text-slate-500">{t('budgets.manageBudgets')}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary gap-2">
          <Plus size={18} />
          {t('budgets.addBudget')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center card bg-slate-50/50 border-dashed">
            <Loader2 className="animate-spin text-primary-500 mb-4" size={32} />
            <p className="text-slate-500 font-medium">{t('common.loading')}</p>
          </div>
        ) : budgets.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center card bg-slate-50/50 border-dashed">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <PackageSearch size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{t('common.noData')}</h3>
            <p className="text-slate-500 mb-6 text-center max-w-xs">{t('budgets.noBudgetsDesc')}</p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary border-slate-200">
              {t('budgets.createFirstBudget')}
            </button>
          </div>
        ) : budgets.map((budget) => (
          <div key={budget.id} className="card p-6 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110" style={{ backgroundColor: budget.category.color + '10', borderColor: budget.category.color + '40', color: budget.category.color }}>
                  <DynamicIcon name={budget.category.icon} size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    {i18n.language === 'ar' ? budget.category.nameAr : budget.category.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500">{t('budgets.monthlyBudget')}</p>
                </div>
              </div>
              <div className="text-end">
                <p className="text-sm font-bold text-slate-900">{formatCurrency(budget.amount)}</p>
                <p className="text-xs text-slate-500">{t('budgets.totalLimit')}</p>
              </div>
              <button 
                onClick={() => {
                  setBudgetToDelete(budget.id);
                  setIsConfirmOpen(true);
                }}
                className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">{t('budgets.spent')}: {formatCurrency(budget.spent)}</span>
                <span className={clsx(
                  "font-bold",
                  budget.status === 'exceeded' ? "text-rose-600" : budget.status === 'warning' ? "text-amber-600" : "text-emerald-600"
                )}>
                  {budget.percentage}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={clsx(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    budget.status === 'exceeded' ? "bg-rose-500" : budget.status === 'warning' ? "bg-amber-500" : "bg-emerald-500"
                  )}
                  style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
               {budget.status === 'exceeded' ? (
                 <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-2 rounded-lg w-full">
                    <AlertCircle size={18} />
                    <span className="text-xs font-bold uppercase tracking-wide">{t('budgets.limitExceeded')}</span>
                 </div>
               ) : budget.status === 'warning' ? (
                 <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg w-full">
                    <AlertCircle size={18} />
                    <span className="text-xs font-bold uppercase tracking-wide">{t('budgets.nearLimit')}</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg w-full">
                    <CheckCircle2 size={18} />
                     <span className="text-xs font-bold uppercase tracking-wide">{t('budgets.safeSpending')}</span>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>

      <AddBudgetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchBudgets} 
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setBudgetToDelete(null);
        }}
        onConfirm={handleDelete}
        title={t('common.delete')}
        message={t('common.confirmDelete')}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Budgets;
