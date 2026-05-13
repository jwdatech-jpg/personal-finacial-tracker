import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar,
  Wallet,
  ReceiptText,
  Loader2,
  Trash2
} from 'lucide-react';
import AddTransactionModal from '../components/AddTransactionModal';
import ConfirmModal from '../components/ConfirmModal';
import { clsx } from 'clsx';
import DynamicIcon from '../components/DynamicIcon';

const Transactions = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isRtl = i18n.language === 'ar';
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', accountId: '', categoryId: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/transactions', { params: filter });
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!txToDelete) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/transactions/${txToDelete}`);
      setIsConfirmOpen(false);
      setTxToDelete(null);
      fetchTransactions();
    } catch (error) {
      console.error('Failed to delete transaction', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: user?.currency || 'EGP',
    }).format(val);
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateString));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t('common.transactions')}</h2>
          <p className="text-slate-500">{t('transactions.manageTransactions')}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary gap-2">
          <Plus size={18} />
          {t('transactions.addTransaction')}
        </button>
      </div>

      {/* Filters & Search */}
      <div className="card p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className={clsx("absolute top-1/2 -translate-y-1/2 text-slate-400", isRtl ? "right-3" : "left-3")} size={18} />
          <input 
            type="text" 
            placeholder={t('common.search')} 
            className={clsx("input", isRtl ? "pr-10" : "pl-10")}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select 
            className="input py-2 bg-slate-50"
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
            <option value="">{t('common.allTypes')}</option>
            <option value="INCOME">{t('common.income')}</option>
            <option value="EXPENSE">{t('common.expense')}</option>
          </select>
          <button className="btn btn-secondary px-3 border-slate-200 text-slate-600 hover:text-slate-900">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className={clsx("px-6 py-4 font-semibold", isRtl ? "text-right" : "text-left")}>{t('common.category')}</th>
                <th className={clsx("px-6 py-4 font-semibold", isRtl ? "text-right" : "text-left")}>{t('common.date')}</th>
                <th className={clsx("px-6 py-4 font-semibold", isRtl ? "text-right" : "text-left")}>{t('common.account')}</th>
                <th className={clsx("px-6 py-4 font-semibold", isRtl ? "text-left" : "text-right")}>{t('common.amount')}</th>
                <th className="px-6 py-4 font-semibold text-center">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="animate-spin text-primary-500 mb-4" size={32} />
                      <p className="text-sm font-medium">{t('common.loading')}</p>
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                       <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                         <ReceiptText size={32} />
                       </div>
                       <h3 className="text-lg font-bold text-slate-900 mb-1">{t('common.noData')}</h3>
                        <p className="text-slate-500 mb-6 max-w-sm">{t('transactions.noTransactionsDesc')}</p>
                       <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary border-slate-200">
                          {t('transactions.addTransaction')}
                       </button>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110" style={{ backgroundColor: tx.category.color + '10', borderColor: tx.category.color + '30', color: tx.category.color }}>
                          <DynamicIcon name={tx.category.icon} size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{isRtl ? tx.category.nameAr : tx.category.nameEn}</p>
                          {tx.note && <p className="text-xs text-slate-500 truncate max-w-[200px]">{tx.note}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        {formatDate(tx.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tx.account.color }}></div>
                        {tx.account.name}
                      </div>
                    </td>
                    <td className={clsx("px-6 py-4", isRtl ? "text-left" : "text-right")}>
                      <div className={clsx(
                        "text-sm font-bold flex items-center gap-1 justify-end",
                        tx.type === 'INCOME' ? "text-emerald-600" : "text-rose-600",
                        isRtl && "flex-row-reverse"
                      )}>
                        {tx.type === 'INCOME' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                        {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => {
                          setTxToDelete(tx.id);
                          setIsConfirmOpen(true);
                        }}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title={t('common.delete')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTransactions} 
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setTxToDelete(null);
        }}
        onConfirm={handleDelete}
        title={t('common.delete')}
        message={t('common.confirmDelete')}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Transactions;
