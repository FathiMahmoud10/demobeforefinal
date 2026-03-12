import React, { useState } from 'react';
import { 
  Coins, 
  Search, 
  Edit2, 
  Trash2,
  Plus
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCurrencies, Currency } from '@/context/CurrenciesContext';
import { motion } from 'framer-motion';
import Pagination from '@/components/Pagination';
import MobileDataCard from '@/components/MobileDataCard';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import AddCurrencyModal from '@/components/AddCurrencyModal';

export default function Currencies() {
  const { t, direction } = useLanguage();
  const { currencies, deleteCurrency } = useCurrencies();
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [currencyToDelete, setCurrencyToDelete] = useState<number | null>(null);

  const filteredCurrencies = currencies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.symbol.includes(searchTerm)
  );

  const paginatedCurrencies = filteredCurrencies.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleAddClick = () => {
    setEditingCurrency(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (currency: Currency) => {
    setEditingCurrency(currency);
    setIsModalOpen(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
      dir={direction}
    >
      <DeleteConfirmationModal
        isOpen={currencyToDelete !== null}
        onClose={() => setCurrencyToDelete(null)}
        onConfirm={() => {
          if (currencyToDelete !== null) {
            deleteCurrency(currencyToDelete);
            setCurrencyToDelete(null);
          }
        }}
        itemName={currencies.find(c => c.id === currencyToDelete)?.name}
      />

      {/* Page Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2 text-primary">
          <Coins size={20} />
          <h1 className="text-lg font-bold">{t('currencies') || 'العملات'}</h1>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={handleAddClick}
             className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center gap-2 text-sm font-bold"
           >
             <Plus size={18} />
             <span>{t('add_currency') || 'إضافة عملة'}</span>
           </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <p className="text-sm text-gray-600">
          {t('currencies_table_desc') || 'الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.'}
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-50">
          <div className="flex items-center gap-2 order-2 md:order-1">
            <span className="text-sm text-gray-600">{t('show') || 'اظهار'}</span>
            <select 
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-primary bg-white"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-2 order-1 md:order-2 w-full md:w-auto">
            <span className="text-sm text-gray-600 whitespace-nowrap">{t('search') || 'بحث'}</span>
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary text-right"
              />
            </div>
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-right border-collapse">
            <thead>
              <tr className="bg-[#064e3b] text-white">
                <th className="p-3 border-l border-white/10 w-10 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 accent-primary"
                  />
                </th>
                <th className="p-3 border-l border-white/10 font-bold">{t('currency_code') || 'رمز العملة'}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('currency_name') || 'اسم العملة'}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('exchange_rate') || 'سعر الصرف'}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('symbol') || 'الرمز'}</th>
                <th className="p-3 font-bold text-center">{t('actions') || 'الإجراءات'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCurrencies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 italic bg-gray-50">
                    {t('no_data_in_table') || 'لا توجد بيانات في الجدول'}
                  </td>
                </tr>
              ) : (
                paginatedCurrencies.map((currency) => (
                  <tr key={`desktop-${currency.id}`} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-l border-gray-100 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-primary"
                      />
                    </td>
                    <td className="p-3 border-l border-gray-100 font-bold">{currency.code}</td>
                    <td className="p-3 border-l border-gray-100">{currency.name}</td>
                    <td className="p-3 border-l border-gray-100">{currency.exchangeRate}</td>
                    <td className="p-3 border-l border-gray-100">{currency.symbol}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEditClick(currency)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => setCurrencyToDelete(currency.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4 p-4">
          {paginatedCurrencies.length === 0 ? (
            <div className="p-8 text-center text-gray-400 italic bg-gray-50 rounded-lg">
              {t('no_data_in_table') || 'لا توجد بيانات في الجدول'}
            </div>
          ) : (
            paginatedCurrencies.map((currency) => (
              <MobileDataCard
                key={`mobile-${currency.id}`}
                title={currency.name}
                fields={[
                  { label: t('currency_code') || 'رمز العملة', value: currency.code },
                  { label: t('exchange_rate') || 'سعر الصرف', value: currency.exchangeRate },
                  { label: t('symbol') || 'الرمز', value: currency.symbol },
                ]}
                actions={
                  <div className="flex flex-wrap justify-end gap-2">
                    <button 
                      onClick={() => handleEditClick(currency)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg border border-green-100 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Edit2 size={16} />
                      {t('edit') || 'تعديل'}
                    </button>
                    <button 
                      onClick={() => setCurrencyToDelete(currency.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Trash2 size={16} />
                      {t('delete') || 'حذف'}
                    </button>
                  </div>
                }
              />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-50 bg-gray-50/50">
          <div className="w-full">
             <Pagination 
               currentPage={currentPage}
               totalItems={filteredCurrencies.length}
               itemsPerPage={entriesPerPage}
               onPageChange={setCurrentPage}
             />
          </div>
        </div>
      </div>

      <AddCurrencyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currency={editingCurrency}
      />
    </motion.div>
  );
}
