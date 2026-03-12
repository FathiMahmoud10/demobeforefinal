import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrencies, Currency } from '@/context/CurrenciesContext';
import ResponsiveModal from './ResponsiveModal';

interface AddCurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency?: Currency | null;
}

export default function AddCurrencyModal({ isOpen, onClose, currency }: AddCurrencyModalProps) {
  const { t, direction } = useLanguage();
  const { addCurrency, updateCurrency } = useCurrencies();
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    symbol: '',
    exchangeRate: '',
    autoUpdate: false
  });

  useEffect(() => {
    if (currency) {
      setFormData({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        exchangeRate: currency.exchangeRate,
        autoUpdate: currency.autoUpdate
      });
    } else {
      setFormData({
        code: '',
        name: '',
        symbol: '',
        exchangeRate: '',
        autoUpdate: false
      });
    }
  }, [currency, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currency) {
      updateCurrency(currency.id, formData);
    } else {
      addCurrency(formData);
    }
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={currency ? t('edit_currency') || 'تعديل العملة' : t('add_currency') || 'إضافة العملات'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4" dir={direction}>
        <p className="text-sm text-gray-600 mb-6">
          {t('please_enter_info_below') || 'برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .'}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              {t('currency_code') || 'رمز العملة'} *
            </label>
            <input
              type="text"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              {t('currency_name') || 'اسم العملة'} *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              {t('symbol') || 'الرمز'} *
            </label>
            <input
              type="text"
              required
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              {t('exchange_rate') || 'سعر الصرف'} *
            </label>
            <input
              type="text"
              required
              value={formData.exchangeRate}
              onChange={(e) => setFormData({ ...formData, exchangeRate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="autoUpdate"
              checked={formData.autoUpdate}
              onChange={(e) => setFormData({ ...formData, autoUpdate: e.target.checked })}
              className="w-4 h-4 accent-primary rounded border-gray-300 focus:ring-primary"
            />
            <label htmlFor="autoUpdate" className="text-sm font-bold text-gray-700 cursor-pointer">
              {t('auto_update') || 'معدل التحديث التلقائي'}
            </label>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all font-bold shadow-lg shadow-primary/20"
          >
            {currency ? t('update') || 'تحديث' : t('add_currency') || 'إضافة العملات'}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
