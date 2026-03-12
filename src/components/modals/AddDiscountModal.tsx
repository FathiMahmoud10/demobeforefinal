import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import ResponsiveModal from '@/components/ResponsiveModal';

const AddDiscountModal = ({ isOpen, onClose, customer }: any) => {
  const { t, direction } = useLanguage();

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('add_discount')}
      maxWidth="max-w-md"
    >
      <div className="p-8" dir={direction}>
        <p className="mb-4">Add discount form will be here.</p>
        <button onClick={onClose} className="bg-primary text-white px-4 py-2 rounded-md">{t('close')}</button>
      </div>
    </ResponsiveModal>
  );
};

export default AddDiscountModal;
