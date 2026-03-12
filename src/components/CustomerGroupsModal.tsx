import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { CustomerGroup } from '@/context/CustomerGroupsContext';
import ResponsiveModal from './ResponsiveModal';

interface CustomerGroupsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: Omit<CustomerGroup, 'id'>) => void;
  initialData?: CustomerGroup | null;
}

const CustomerGroupsModal: React.FC<CustomerGroupsModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const { t, direction } = useLanguage();
  const [name, setName] = useState('');
  const [percentage, setPercentage] = useState<number>(0);
  const [sellAtCost, setSellAtCost] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPercentage(initialData.percentage);
      setSellAtCost(initialData.sellAtCost);
    } else {
      setName('');
      setPercentage(0);
      setSellAtCost(false);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, percentage, sellAtCost });
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t('edit_customer_group') : t('add_customer_group')}
      maxWidth="max-w-[500px]"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={direction}>
        <p className="text-sm text-gray-500 mb-4">
          {t('please_enter_info_below')}
        </p>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
            {t('group_name')} *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#00a65a] focus:border-transparent outline-none transition-all"
            placeholder={t('group_name_placeholder')}
          />
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <input
            type="checkbox"
            id="sellAtCost"
            checked={sellAtCost}
            onChange={(e) => setSellAtCost(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-[#00a65a] focus:ring-[#00a65a]"
          />
          <label htmlFor="sellAtCost" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            {t('sell_at_cost')}
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
            {t('group_percentage_no_sign')} *
          </label>
          <input
            type="number"
            required
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
            className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-[#00a65a] focus:border-transparent outline-none transition-all"
            placeholder="0"
          />
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-[#004d2c] hover:bg-[#003d23] text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all flex items-center gap-2"
          >
            <Check size={20} />
            {initialData ? t('update_customer_group') : t('add_customer_group')}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
};

export default CustomerGroupsModal;
