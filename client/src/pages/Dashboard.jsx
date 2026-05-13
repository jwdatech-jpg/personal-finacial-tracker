import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus
} from 'lucide-react';
import AddTransactionModal from '../components/AddTransactionModal';
import AddAccountModal from '../components/AddAccountModal';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { clsx } from 'clsx';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTransModalOpen, setIsTransModalOpen] = useState(false);
  const [isAccModalOpen, setIsAccModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/dashboard');
      setData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64">{t('common.loading')}</div>;

  const summaryCards = [
    { 
      title: t('common.balance'), 
      amount: data?.summary.balance || 0, 
      icon: Wallet, 
      color: 'primary',
      trend: null
    },
    { 
      title: t('common.income'), 
      amount: data?.summary.income || 0, 
      icon: TrendingUp, 
      color: 'emerald',
      trend: '+12%' 
    },
    { 
      title: t('common.expense'), 
      amount: data?.summary.expense || 0, 
      icon: TrendingDown, 
      color: 'rose',
      trend: '+5%' 
    }
  ];

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: user?.currency || 'EGP',
    }).format(val);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {t('dashboard.welcome', { name: user?.name })}
          </h2>
          <p className="text-slate-500">{t('dashboard.monthlySummary')}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsAccModalOpen(true)} className="btn btn-secondary gap-2 border-slate-200">
            <Plus size={18} />
            {t('accounts.addAccount')}
          </button>
          <button onClick={() => setIsTransModalOpen(true)} className="btn btn-primary gap-2">
            <Plus size={18} />
            {t('transactions.addTransaction')}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="card p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(card.amount)}</h3>
              {card.trend && (
                <div className="flex items-center gap-1 mt-2">
                  <span className={clsx(
                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                    card.title === t('common.income') ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  )}>
                    {card.trend}
                  </span>
                  <span className="text-xs text-slate-400">{t('dashboard.vsLastMonth')}</span>
                </div>
              )}
            </div>
            <div className={clsx("p-3 rounded-xl border transition-colors", `bg-${card.color}-50 border-${card.color}-100 text-${card.color}-600`)}>
              <card.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trend Bar Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">{t('dashboard.monthlyTrend')}</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar name={t('common.income')} dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar name={t('common.expense')} dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Donut Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">{t('dashboard.categoryBreakdown')}</h3>
          <div className="h-80 w-full flex items-center justify-center">
            {data?.categoryBreakdown?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="amount"
                    nameKey={i18n.language === 'ar' ? 'nameAr' : 'nameEn'}
                  >
                    {(data?.categoryBreakdown || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center">
                <p className="text-slate-400 text-sm">{t('common.noData')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddTransactionModal 
        isOpen={isTransModalOpen} 
        onClose={() => setIsTransModalOpen(false)} 
        onSuccess={fetchDashboardData} 
      />
      
      <AddAccountModal 
        isOpen={isAccModalOpen} 
        onClose={() => setIsAccModalOpen(false)} 
        onSuccess={fetchDashboardData} 
      />
    </div>
  );
};

export default Dashboard;
