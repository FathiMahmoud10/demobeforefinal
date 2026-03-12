import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useExpenseCategories } from '@/context/ExpenseCategoriesContext';
import { ExpenseCategory } from '@/types';
import ResponsiveModal from '@/components/ResponsiveModal';

interface AddExpenseCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: ExpenseCategory | null;
}

export default function AddExpenseCategoryModal({ isOpen, onClose, category }: AddExpenseCategoryModalProps) {
  const { t, direction } = useLanguage();
  const { addCategory, updateCategory } = useExpenseCategories();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (category) {
      setCode(category.code);
      setName(category.name);
    } else {
      setCode('');
      setName('');
    }
  }, [category, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      updateCategory(category.id, { code, name });
    } else {
      addCategory({ code, name });
    }
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? t('edit') : t('add_expense_category')}
      maxWidth="max-w-md"
      description={direction === 'rtl' 
        ? 'برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .' 
        : 'Please enter the information below. Field labels marked with * are mandatory.'}
    >
      <div className="p-6" dir={direction}>
        <p className="text-sm text-gray-600 mb-6">
          {direction === 'rtl' 
            ? 'برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .' 
            : 'Please enter the information below. Field labels marked with * are mandatory.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">
              {t('category_code')} *
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-700">
              {t('category_name')} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-fit px-6 py-2 bg-[#004d3d] hover:bg-[#003d30] text-white rounded-lg font-bold transition-colors mt-4"
          >
            {category 
              ? t('update') 
              : t('add_expense_category')}
          </button>
        </form>
      </div>
    </ResponsiveModal>
  );
}
