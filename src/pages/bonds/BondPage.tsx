import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FileText,
  Calendar,
  Building2,
  User,
  DollarSign,
  StickyNote,
  Landmark
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';
import { useBanks } from '@/context/BanksContext';
import ResponsiveModal from '@/components/ResponsiveModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import MobileDataCard from '@/components/MobileDataCard';
import { Bond } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface BondPageProps {
  type: 'receipt' | 'payment' | 'deposit' | 'withdrawal';
  titleKey: string;
  addButtonKey: string;
  modalTitleKey: string;
  editModalTitleKey: string;
}

export default function BondPage({ 
  type, 
  titleKey, 
  addButtonKey, 
  modalTitleKey,
  editModalTitleKey
}: BondPageProps) {
  const { t, direction } = useLanguage();
  const { systemSettings } = useSettings();
  const { banks } = useBanks();
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const [bonds, setBonds] = useState<Bond[]>([]);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Bond>>({
    date: new Date().toISOString().split('T')[0],
    branch: systemSettings.site.defaultBranch || '',
    amount: 0,
    notes: '',
    beneficiary: '',
    bank: banks[0]?.id || ''
  });

  // Mock data for initial load
  useEffect(() => {
    const mockBonds: Bond[] = [
      {
        id: '1',
        type: type,
        date: '2024-03-20',
        beneficiary: 'عميل افتراضي',
        branch: 'الفرع الرئيسي',
        bank: banks[0]?.name,
        amount: 1500,
        notes: 'دفعة مقدمة'
      },
      {
        id: '2',
        type: type,
        date: '2024-03-21',
        beneficiary: 'مورد تجريبي',
        branch: 'فرع جدة',
        bank: banks[0]?.name,
        amount: 2500,
        notes: 'تسوية حساب'
      }
    ];
    setBonds(mockBonds);
  }, [type, banks]);

  const filteredBonds = bonds.filter(bond => 
    bond.beneficiary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bond.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bond.amount.toString().includes(searchTerm)
  );

  const handleAdd = () => {
    setSelectedBond(null);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      branch: systemSettings.site.defaultBranch || '',
      amount: 0,
      notes: '',
      beneficiary: '',
      bank: banks[0]?.id || ''
    });
    setIsModalOpen(true);
  };

  // Check for openAddModal from navigation state
  useEffect(() => {
    if (location.state?.openAddModal) {
      handleAdd();
      // Clear state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleEdit = (bond: Bond) => {
    setSelectedBond(bond);
    setFormData(bond);
    setIsModalOpen(true);
  };

  const handleDelete = (bond: Bond) => {
    setSelectedBond(bond);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBond) {
      setBonds(bonds.filter(b => b.id !== selectedBond.id));
      setIsDeleteModalOpen(false);
      setSelectedBond(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBond) {
      // Update
      setBonds(bonds.map(b => b.id === selectedBond.id ? { ...b, ...formData } as Bond : b));
    } else {
      // Add
      const newBond: Bond = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        type: type
      } as Bond;
      setBonds([newBond, ...bonds]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6" dir={direction}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[var(--primary)]" />
            {t(titleKey)}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {t('bonds_table_desc')}
          </p>
        </div>
        <button 
          onClick={handleAdd}
          className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[var(--primary-hover)] transition-all shadow-md active:scale-95"
        >
          <Plus size={20} />
          {t(addButtonKey)}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5" />
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--text-main)] transition-all"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
        <table className="w-full text-sm text-right">
          <thead className="bg-[var(--primary)] text-white">
            <tr>
              <th className="px-6 py-4 font-bold">{t('date')}</th>
              {(type === 'receipt' || type === 'payment' || type === 'withdrawal') && (
                <th className="px-6 py-4 font-bold">{t('beneficiary')}</th>
              )}
              <th className="px-6 py-4 font-bold">{t('branch')}</th>
              {(type === 'deposit' || type === 'withdrawal') && (
                <th className="px-6 py-4 font-bold">{t('bank')}</th>
              )}
              <th className="px-6 py-4 font-bold">
                {type === 'withdrawal' ? t('withdrawn_amount') : t('paid_amount')}
              </th>
              <th className="px-6 py-4 font-bold">{t('notes')}</th>
              <th className="px-6 py-4 font-bold text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filteredBonds.map((bond) => (
              <tr key={bond.id} className="hover:bg-[var(--bg-main)] transition-colors">
                <td className="px-6 py-4 text-[var(--text-main)] font-medium">{bond.date}</td>
                {(type === 'receipt' || type === 'payment' || type === 'withdrawal') && (
                  <td className="px-6 py-4 text-[var(--text-main)]">{bond.beneficiary}</td>
                )}
                <td className="px-6 py-4 text-[var(--text-main)]">{bond.branch}</td>
                {(type === 'deposit' || type === 'withdrawal') && (
                  <td className="px-6 py-4 text-[var(--text-main)]">{bond.bank}</td>
                )}
                <td className="px-6 py-4 text-[var(--text-main)] font-bold">
                  {bond.amount.toLocaleString()} {t('currency_sar')}
                </td>
                <td className="px-6 py-4 text-[var(--text-muted)] max-w-xs truncate">{bond.notes}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleEdit(bond)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={t('edit')}
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(bond)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={t('delete')}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredBonds.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-[var(--text-muted)]">
                  {t('no_bonds_found')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden space-y-4">
        {filteredBonds.map((bond) => (
          <MobileDataCard
            key={bond.id}
            title={bond.beneficiary || bond.branch}
            subtitle={bond.date}
            fields={[
              { label: t('branch'), value: bond.branch },
              ...(type === 'deposit' || type === 'withdrawal' ? [{ label: t('bank'), value: bond.bank }] : []),
              { 
                label: type === 'withdrawal' ? t('withdrawn_amount') : t('paid_amount'), 
                value: `${bond.amount.toLocaleString()} ${t('currency_sar')}`,
                isBold: true 
              },
              { label: t('notes'), value: bond.notes }
            ]}
            actions={
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(bond)}
                  className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center gap-2 font-medium"
                >
                  <Edit size={18} />
                  {t('edit')}
                </button>
                <button 
                  onClick={() => handleDelete(bond)}
                  className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2 font-medium"
                >
                  <Trash2 size={18} />
                  {t('delete')}
                </button>
              </div>
            }
          />
        ))}
      </div>

      {/* Add/Edit Modal */}
      <ResponsiveModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBond ? t(editModalTitleKey) : t(modalTitleKey)}
      >
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text-main)] flex items-center gap-2">
                <Calendar size={16} className="text-[var(--primary)]" />
                {t('date')}
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--text-main)]"
              />
            </div>

            {/* Branch */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text-main)] flex items-center gap-2">
                <Building2 size={16} className="text-[var(--primary)]" />
                {t('branch')}
              </label>
              <select
                required
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full p-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--text-main)]"
              >
                <option value="الفرع الرئيسي">الفرع الرئيسي</option>
                <option value="فرع جدة">فرع جدة</option>
                <option value="فرع الرياض">فرع الرياض</option>
              </select>
            </div>

            {/* Beneficiary (if applicable) */}
            {(type === 'receipt' || type === 'payment' || type === 'withdrawal') && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--text-main)] flex items-center gap-2">
                  <User size={16} className="text-[var(--primary)]" />
                  {t('beneficiary')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.beneficiary}
                  onChange={(e) => setFormData({ ...formData, beneficiary: e.target.value })}
                  placeholder={t('beneficiary')}
                  className="w-full p-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--text-main)]"
                />
              </div>
            )}

            {/* Bank (if applicable) */}
            {(type === 'deposit' || type === 'withdrawal') && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--text-main)] flex items-center gap-2">
                  <Landmark size={16} className="text-[var(--primary)]" />
                  {t('bank')}
                </label>
                <select
                  required
                  value={formData.bank}
                  onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                  className="w-full p-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--text-main)]"
                >
                  {banks.map(bank => (
                    <option key={bank.id} value={bank.id}>{bank.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Amount */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text-main)] flex items-center gap-2">
                <DollarSign size={16} className="text-[var(--primary)]" />
                {type === 'withdrawal' ? t('withdrawn_amount') : t('paid_amount')}
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                className="w-full p-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--text-main)] font-bold"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-[var(--text-main)] flex items-center gap-2">
              <StickyNote size={16} className="text-[var(--primary)]" />
              {t('notes')}
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none text-[var(--text-main)] resize-none"
              placeholder={t('notes')}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[var(--primary)] text-white py-3 rounded-xl font-bold hover:bg-[var(--primary-hover)] transition-all shadow-lg active:scale-[0.98]"
            >
              {selectedBond ? t('update_bond') : t('save')}
            </button>
          </div>
        </form>
      </ResponsiveModal>

      {/* Delete Confirmation */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('confirm_delete_bond')}
        itemName={selectedBond?.beneficiary || selectedBond?.branch}
      />
    </div>
  );
}
