import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useBanks } from '@/context/BanksContext';
import { Edit, Trash2, Search, List as ListIcon, Plus } from 'lucide-react';
import EditBankModal from '@/components/modals/EditBankModal';
import AddBankModal from '@/components/modals/AddBankModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import MobileDataCard from '@/components/MobileDataCard';
import { Bank } from '@/types';

export default function BanksList() {
  const { t, direction } = useLanguage();
  const { banks, addBank, updateBank, deleteBank } = useBanks();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  const filteredBanks = banks.filter(bank => 
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (bank: Bank) => {
    setSelectedBank(bank);
    setIsEditModalOpen(true);
  };

  const handleDelete = (bank: Bank) => {
    setSelectedBank(bank);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBank) {
      deleteBank(selectedBank.id);
      setIsDeleteModalOpen(false);
      setSelectedBank(null);
    }
  };

  const handleSaveEdit = (id: string, updatedBank: Partial<Bank>) => {
    updateBank(id, updatedBank);
  };

  const handleAddBank = (newBank: Omit<Bank, 'id' | 'currentBalance'>) => {
    addBank(newBank);
  };

  return (
    <div className="p-6 space-y-6" dir={direction}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-2">
          <ListIcon className="w-6 h-6" />
          {t('banks')}
        </h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
        >
          <Plus size={20} />
          {t('add_bank')}
        </button>
      </div>

      <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border)] p-6">
        <div className="mb-4">
          <p className="text-sm text-[var(--text-muted)] mb-4">
            الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-sm text-[var(--text-muted)]">إظهار</span>
              <select className="border border-[var(--border)] rounded px-2 py-1 bg-[var(--input-bg)] text-[var(--text-main)]">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
              <span className="text-sm text-[var(--text-muted)]">سجلات</span>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-sm text-[var(--text-muted)]">بحث</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-[var(--border)] rounded px-3 py-1 bg-[var(--input-bg)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left" dir={direction}>
            <thead className="text-xs text-white uppercase bg-[var(--primary)]">
              <tr>
                <th className="px-6 py-3 text-center w-12">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-center">{t('bank_code')}</th>
                <th className="px-6 py-3 text-center">{t('bank_name')}</th>
                <th className="px-6 py-3 text-center">{t('bank_opening_balance')}</th>
                <th className="px-6 py-3 text-center">{t('current_balance')}</th>
                <th className="px-6 py-3 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredBanks.map((bank) => (
                <tr key={`desktop-${bank.id}`} className="border-b border-[var(--border)] hover:bg-[var(--bg-main)]">
                  <td className="px-6 py-4 text-center">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 text-center">{bank.code}</td>
                  <td className="px-6 py-4 text-center">{bank.name}</td>
                  <td className="px-6 py-4 text-center">{bank.openingBalance}</td>
                  <td className="px-6 py-4 text-center">{bank.currentBalance}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => handleEdit(bank)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title={t('edit_bank')}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(bank)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title={t('delete')}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBanks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-[var(--text-muted)]">
                    لا توجد بيانات
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50 text-[var(--text-muted)] text-xs">
              <tr>
                <th className="px-6 py-3 text-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-center">[{t('bank_code')}]</th>
                <th className="px-6 py-3 text-center">[{t('bank_name')}]</th>
                <th className="px-6 py-3 text-center">[{t('bank_opening_balance')}]</th>
                <th className="px-6 py-3 text-center">[{t('current_balance')}]</th>
                <th className="px-6 py-3 text-center">{t('actions')}</th>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredBanks.map((bank) => (
            <MobileDataCard
              key={`mobile-${bank.id}`}
              title={bank.name}
              subtitle={bank.code}
              fields={[
                { label: t('bank_opening_balance'), value: bank.openingBalance },
                { label: t('current_balance'), value: bank.currentBalance, isBold: true }
              ]}
              actions={
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(bank)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(bank)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              }
            />
          ))}
          {filteredBanks.length === 0 && (
            <div className="text-center py-8 text-[var(--text-muted)] bg-[var(--bg-main)] rounded-xl">
              لا توجد بيانات
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--text-muted)]">
          <div>
            عرض 1 إلى {filteredBanks.length} من {filteredBanks.length} سجلات
          </div>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-[var(--border)] rounded hover:bg-[var(--bg-main)]">
              السابق
            </button>
            <button className="px-3 py-1 bg-[var(--primary)] text-white rounded">
              1
            </button>
            <button className="px-3 py-1 border border-[var(--border)] rounded hover:bg-[var(--bg-main)]">
              التالي
            </button>
          </div>
        </div>
      </div>

      <AddBankModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddBank}
      />

      <EditBankModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBank(null);
        }}
        bank={selectedBank}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBank(null);
        }}
        onConfirm={confirmDelete}
        itemName={selectedBank?.name}
      />
    </div>
  );
}

