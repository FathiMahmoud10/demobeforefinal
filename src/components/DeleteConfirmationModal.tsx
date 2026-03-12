import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import ResponsiveModal from './ResponsiveModal';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName
}: DeleteConfirmationModalProps) {
  const { t, direction, language } = useLanguage();

  const defaultTitle = t('confirm_delete_title');
  const defaultDesc = itemName 
    ? (language === 'ar' ? `هل أنت متأكد من حذف ${itemName}؟` : `Are you sure you want to delete ${itemName}?`)
    : t('confirm_delete_desc');

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={title || defaultTitle}
      maxWidth="max-w-md"
    >
      <div className="p-6 text-center" dir={direction}>
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
          <AlertTriangle size={32} />
        </div>
        <p className="text-gray-500 mb-8">
          {description || defaultDesc}
        </p>
        <div className="flex gap-3 mb-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-200"
          >
            {t('confirm_delete_btn')}
          </button>
        </div>
      </div>
    </ResponsiveModal>
  );
}
