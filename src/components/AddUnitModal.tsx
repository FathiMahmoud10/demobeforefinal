import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import ResponsiveModal from './ResponsiveModal';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUnit: (unitName: string) => void;
}

const AddUnitModal: React.FC<AddUnitModalProps> = ({ isOpen, onClose, onAddUnit }) => {
  const { t, direction } = useLanguage();
  const [unitName, setUnitName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitName.trim()) {
      alert(direction === 'rtl' ? 'يرجى إدخال اسم الوحدة' : 'Please enter unit name');
      return;
    }
    onAddUnit(unitName);
    setUnitName('');
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('add_new_unit')}
      maxWidth="max-w-md"
    >
      <div className="p-6" dir={direction}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('unit_name')} <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              className="w-full border border-primary rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" 
              required
            />
          </div>
          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              className="bg-primary text-white px-8 py-2 rounded-md font-medium hover:bg-primary-hover transition-colors shadow-sm"
            >
                {t('add_new_unit')}
            </button>
          </div>
        </form>
      </div>
    </ResponsiveModal>
  );
};

export default AddUnitModal;
