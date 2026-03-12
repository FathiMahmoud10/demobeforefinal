import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { PriceGroup } from '@/types';
import ResponsiveModal from './ResponsiveModal';

interface PriceGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PriceGroup>) => void;
  initialData?: PriceGroup | null;
}

export default function PriceGroupsModal({ isOpen, onClose, onSave, initialData }: PriceGroupsModalProps) {
  const { t, direction } = useLanguage();
  const [name, setName] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name });
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('edit_pricing_group') : t('add_pricing_group')}
      maxWidth="md:max-w-xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={direction}>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-700 dark:text-blue-300">
          {t('pricing_group_info')}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
            {t('group_name')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#004d2c] focus:border-transparent transition-all outline-none ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
            placeholder={t('enter_group_name')}
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3 bg-[#004d2c] hover:bg-[#003d23] text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2"
          >
            <Check size={20} />
            {initialData ? t('update_pricing_group') : t('add_pricing_group')}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
