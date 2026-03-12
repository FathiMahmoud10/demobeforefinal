import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Bank } from '@/types';
import ResponsiveModal from '@/components/ResponsiveModal';

interface AddBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (bank: Omit<Bank, 'id' | 'currentBalance'>) => void;
}

export default function AddBankModal({ isOpen, onClose, onSave }: AddBankModalProps) {
  const { t, direction } = useLanguage();
  const [formData, setFormData] = useState<Omit<Bank, 'id' | 'currentBalance'>>({
    code: '',
    name: '',
    openingBalance: 0,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      code: '',
      name: '',
      openingBalance: 0,
      notes: ''
    });
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('add_bank')}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={direction}>
        <p className="text-sm text-[var(--text-muted)]">
          {t('please_enter_bank_info')}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              {t('bank_code')} *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              {t('bank_name')} *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              {t('bank_opening_balance')}
            </label>
            <input
              type="number"
              value={formData.openingBalance}
              onChange={(e) => setFormData({ ...formData, openingBalance: Number(e.target.value) })}
              className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              {t('notes')}
            </label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>
        </div>

        <div className="flex justify-start pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
          >
            {t('add_bank')}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
