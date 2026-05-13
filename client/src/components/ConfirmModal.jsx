import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import { AlertTriangle, Loader2 } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 bg-rose-50 rounded-xl text-rose-700">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <AlertTriangle size={24} />
          </div>
          <p className="text-sm font-medium">{message}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="btn btn-secondary flex-1 border-slate-200"
            disabled={loading}
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-rose-600 hover:bg-rose-700 text-white flex-1 gap-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            {t('common.delete')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
