import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Target, Calendar, TrendingUp, Sparkles, Loader2, Trash2 } from 'lucide-react';
import AddGoalModal from '../components/AddGoalModal';
import AddSavingsModal from '../components/AddSavingsModal';
import { clsx } from 'clsx';
import DynamicIcon from '../components/DynamicIcon';
import ConfirmModal from '../components/ConfirmModal';

const Goals = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/goals');
      setGoals(data.goals);
    } catch (error) {
      console.error('Failed to fetch goals', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!goalToDelete) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/goals/${goalToDelete}`);
      setIsConfirmOpen(false);
      setGoalToDelete(null);
      fetchGoals();
    } catch (error) {
      console.error('Failed to delete goal', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: user?.currency || 'EGP',
    }).format(val);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No Deadline';
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
          <h2 className="text-2xl font-bold text-slate-900">{t('common.goals')}</h2>
          <p className="text-slate-500">{t('goals.manageGoals')}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary gap-2">
          <Plus size={18} />
          {t('goals.addGoal')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center card bg-slate-50/50 border-dashed">
            <Loader2 className="animate-spin text-primary-500 mb-4" size={32} />
            <p className="text-slate-500 font-medium">{t('common.loading')}</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center card bg-slate-50/50 border-dashed">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
              <Sparkles size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{t('common.noData')}</h3>
            <p className="text-slate-500 mb-6 text-center max-w-xs">{t('goals.noGoalsDesc')}</p>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary border-slate-200">
              {t('goals.createFirstGoal')}
            </button>
          </div>
        ) : goals.map((goal) => (
          <div key={goal.id} className="card p-8 relative overflow-hidden group transition-all duration-300">
            {/* Background Icon */}
            <div className="absolute -right-4 -bottom-4 text-slate-50 opacity-50 group-hover:opacity-100 transition-opacity">
               <Target size={160} />
            </div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110" style={{ backgroundColor: goal.color + '10', borderColor: goal.color + '40', color: goal.color }}>
                    <DynamicIcon name={goal.icon} size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{goal.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                      <Calendar size={14} />
                      <span>{formatDate(goal.deadline)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-end flex flex-col items-end gap-2">
                  <span className="text-primary-600 font-black text-2xl">{goal.progress}%</span>
                  <button 
                    onClick={() => {
                      setGoalToDelete(goal.id);
                      setIsConfirmOpen(true);
                    }}
                    className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500 font-medium">{t('goals.currentAmount')}</span>
                    <span className="text-slate-900 font-bold">{formatCurrency(goal.currentAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-slate-500 font-medium">{t('goals.targetAmount')}</span>
                    <span className="text-slate-900 font-bold">{formatCurrency(goal.targetAmount)}</span>
                  </div>
                  
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${Math.min(goal.progress, 100)}%`,
                        backgroundColor: goal.color 
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                   <button className="btn btn-secondary flex-1 py-3">{t('common.edit')}</button>
                   <button 
                      onClick={() => {
                        setSelectedGoal(goal);
                        setIsSavingsModalOpen(true);
                      }}
                      className="btn btn-primary flex-1 py-3 gap-2"
                   >
                      <TrendingUp size={18} />
                      {t('goals.addSavings')}
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddGoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchGoals} 
      />

      <AddSavingsModal
        isOpen={isSavingsModalOpen}
        onClose={() => {
          setIsSavingsModalOpen(false);
          setSelectedGoal(null);
        }}
        onSuccess={fetchGoals}
        goal={selectedGoal}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setGoalToDelete(null);
        }}
        onConfirm={handleDelete}
        title={t('common.delete')}
        message={t('common.confirmDelete')}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Goals;
