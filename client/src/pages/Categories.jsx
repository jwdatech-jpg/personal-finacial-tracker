import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../lib/axios';
import { Plus, Tag, Edit2, Loader2, PackageSearch } from 'lucide-react';
import AddCategoryModal from '../components/AddCategoryModal';
import DynamicIcon from '../components/DynamicIcon';
import { clsx } from 'clsx';

const Categories = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('common.confirmDelete'))) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t('common.categories')}</h2>
          <p className="text-slate-500">{t('common.manageCategories')}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary gap-2">
          <Plus size={18} />
          {t('common.addCategory')}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-primary-500 mb-4" size={32} />
            <p className="text-slate-500 font-medium">{t('common.loading')}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center card bg-slate-50/50 border-dashed">
            <PackageSearch size={32} className="text-slate-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">{t('common.noData')}</h3>
          </div>
        ) : categories.map((cat) => (
          <div key={cat.id} className="card p-4 flex items-center justify-between group transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ backgroundColor: cat.color + '10', borderColor: cat.color + '30', color: cat.color }}>
                <DynamicIcon name={cat.icon} size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{isRtl ? cat.nameAr : cat.nameEn}</h4>
                <p className={clsx(
                  "text-[10px] font-bold uppercase tracking-wider",
                  cat.type === 'INCOME' ? "text-emerald-600" : "text-rose-600"
                )}>
                  {cat.type === 'INCOME' ? t('common.income') : t('common.expense')}
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                setSelectedCategory(cat);
                setIsModalOpen(true);
              }}
              className="p-2 text-slate-300 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <Edit2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <AddCategoryModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }} 
        onSuccess={fetchCategories}
        category={selectedCategory}
      />
    </div>
  );
};

export default Categories;
