import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { X, Printer } from 'lucide-react';

const ViewPaymentsModal = ({ isOpen, onClose, customer, type }) => {
  const { t, direction } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md" dir={direction}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-primary">
            {type === 'deposit' ? (t('deposits_list') || 'قائمة الايداعات') : (t('discounts_list') || 'قائمة الخصومات')} ({customer?.name})
          </h2>
          <div className="flex items-center gap-2">
            <button className="text-gray-600 hover:text-gray-900">
              <Printer size={20} />
            </button>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <p>{t('customers_table_desc')}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>{t('show')}</span>
              <select className="border border-gray-300 rounded px-2 py-1 bg-white focus:border-primary outline-none">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span>{t('search')}</span>
              <input type="text" className="border border-gray-300 rounded px-2 py-1 focus:border-primary outline-none" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-3">{t('date')}</th>
                  <th className="p-3">{t('paid_amount')}</th>
                  <th className="p-3">{t('payment_type')}</th>
                  <th className="p-3">{t('data_entry')}</th>
                  <th className="p-3">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="5" className="text-center p-8 text-gray-400 italic">
                    {t('no_data_in_table')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center text-sm">
            <p>{t('showing_records')} 0 {t('to')} 0 {t('of')} 0 {t('records')}</p>
            <div className="flex gap-1">
              <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50 text-sm">{t('previous')}</button>
              <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50 text-sm">{t('next')}</button>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t text-right">
          <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium">{t('close')}</button>
        </div>
      </div>
    </div>
  );
};

export default ViewPaymentsModal;
