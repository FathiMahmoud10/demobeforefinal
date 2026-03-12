import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Printer, Trash2, Edit2 } from 'lucide-react';
import ResponsiveModal from '@/components/ResponsiveModal';

const ViewPaymentsModal = ({ isOpen, onClose, customer, payments = [] }: any) => {
  const { t, direction } = useLanguage();

  const content = (
    <div className="p-6 space-y-4" dir={direction}>
      <p className="text-sm text-gray-500">{t('customers_table_desc')}</p>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">{t('show')}</span>
          <select className="border border-gray-300 rounded px-2 py-1 bg-white focus:border-primary outline-none text-sm">
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-sm whitespace-nowrap">{t('search')}</span>
          <input type="text" className="border border-gray-300 rounded px-2 py-1 focus:border-primary outline-none text-sm w-full md:w-64" />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-right border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="p-3 border border-primary-hover whitespace-nowrap">{t('date')}</th>
              <th className="p-3 border border-primary-hover whitespace-nowrap">{t('ref_no')}</th>
              <th className="p-3 border border-primary-hover whitespace-nowrap">{t('paid_amount')}</th>
              <th className="p-3 border border-primary-hover whitespace-nowrap">{t('payment_type')}</th>
              <th className="p-3 border border-primary-hover whitespace-nowrap text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment: any) => (
                <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 border-x border-gray-200">{payment.date}</td>
                  <td className="p-3 border-x border-gray-200">{payment.refNo}</td>
                  <td className="p-3 border-x border-gray-200 font-bold">{payment.amount.toFixed(2)}</td>
                  <td className="p-3 border-x border-gray-200">{t(payment.type)}</td>
                  <td className="p-3 border-x border-gray-200">
                    <div className="flex justify-center gap-2">
                      <button className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 size={16} /></button>
                      <button className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"><Edit2 size={16} /></button>
                      <button className="p-1 text-gray-500 hover:bg-gray-50 rounded transition-colors"><Printer size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center p-8 text-gray-400 italic">
                  {t('no_data_in_table')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>{t('showing_records')} 0 {t('to')} 0 {t('of')} 0 {t('records')}</p>
        <div className="flex gap-1">
          <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50 transition-colors">{t('previous')}</button>
          <button className="px-3 py-1 border rounded bg-white hover:bg-gray-50 transition-colors">{t('next')}</button>
        </div>
      </div>
    </div>
  );

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('payment_view_title')?.replace('{ref}', customer?.refNo || '') || t('deposits_list')}
      maxWidth="max-w-4xl"
    >
      <div className="flex flex-col max-h-[90vh]">
        <div className="flex-1 overflow-y-auto">
          {content}
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end gap-3 shrink-0" dir={direction}>
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold shadow-sm"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </ResponsiveModal>
  );
};

export default ViewPaymentsModal;
