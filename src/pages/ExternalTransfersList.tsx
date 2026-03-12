import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTransfers } from '@/context/TransfersContext';
import { useBanks } from '@/context/BanksContext';
import { Trash2, List as ListIcon, Plus } from 'lucide-react';
import AddExternalTransferModal from '@/components/modals/AddExternalTransferModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import MobileDataCard from '@/components/MobileDataCard';

export default function ExternalTransfersList() {
  const { t, direction, language } = useLanguage();
  const { externalTransfers, addExternalTransfer, deleteExternalTransfer } = useTransfers();
  const { banks } = useBanks();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredTransfers = externalTransfers.filter(transfer => {
    const bank = banks.find(b => b.id === transfer.bankId);
    return (
      bank?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank?.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transfer.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = (id: string) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedId) {
      deleteExternalTransfer(selectedId);
      setIsDeleteModalOpen(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="p-6 space-y-6" dir={direction}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-2">
          <ListIcon className="w-6 h-6" />
          {t('external_transfers_list')}
        </h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
        >
          <Plus size={20} />
          {t('add_external_transfer')}
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
                <th className="px-6 py-3 text-center">{t('date')}</th>
                <th className="px-6 py-3 text-center">{t('bank_code')}</th>
                <th className="px-6 py-3 text-center">{t('bank_name')}</th>
                <th className="px-6 py-3 text-center">{t('paid_amount')}</th>
                <th className="px-6 py-3 text-center">{t('notes')}</th>
                <th className="px-6 py-3 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransfers.map((transfer) => {
                const bank = banks.find(b => b.id === transfer.bankId);
                return (
                  <tr key={`desktop-${transfer.id}`} className="border-b border-[var(--border)] hover:bg-[var(--bg-main)]">
                    <td className="px-6 py-4 text-center">{transfer.date}</td>
                    <td className="px-6 py-4 text-center">{bank?.code || '-'}</td>
                    <td className="px-6 py-4 text-center">{bank?.name || '-'}</td>
                    <td className="px-6 py-4 text-center font-bold">{transfer.amount}</td>
                    <td className="px-6 py-4 text-center">{transfer.notes || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleDelete(transfer.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title={t('delete')}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredTransfers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-[var(--text-muted)]">
                    لا توجد بيانات في الجدول
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-gray-50 text-[var(--text-muted)] text-xs">
              <tr>
                <th className="px-6 py-3 text-center">[{t('date')}]</th>
                <th className="px-6 py-3 text-center">[{t('bank_code')}]</th>
                <th className="px-6 py-3 text-center">[{t('bank_name')}]</th>
                <th className="px-6 py-3 text-center">[{t('paid_amount')}]</th>
                <th className="px-6 py-3 text-center">[{t('notes')}]</th>
                <th className="px-6 py-3 text-center">{t('actions')}</th>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredTransfers.map((transfer) => {
            const bank = banks.find(b => b.id === transfer.bankId);
            return (
              <MobileDataCard
                key={`mobile-${transfer.id}`}
                title={bank?.name || '-'}
                subtitle={transfer.date}
                fields={[
                  { label: t('bank_code'), value: bank?.code || '-' },
                  { label: t('paid_amount'), value: transfer.amount, isBold: true },
                  { label: t('notes'), value: transfer.notes || '-' }
                ]}
                actions={
                  <button 
                    onClick={() => handleDelete(transfer.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                }
              />
            );
          })}
          {filteredTransfers.length === 0 && (
            <div className="text-center py-8 text-[var(--text-muted)] bg-[var(--bg-main)] rounded-xl">
              لا توجد بيانات
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--text-muted)]">
          <div>
            عرض 1 إلى {filteredTransfers.length} من {filteredTransfers.length} سجلات
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

      <AddExternalTransferModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addExternalTransfer}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedId(null);
        }}
        onConfirm={confirmDelete}
        itemName={language === 'ar' ? 'هذا التحويل' : 'this transfer'}
      />
    </div>
  );
}
