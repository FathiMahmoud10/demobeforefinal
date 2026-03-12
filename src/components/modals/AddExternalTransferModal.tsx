import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useBanks } from '@/context/BanksContext';
import { ExternalTransfer } from '@/types';
import ResponsiveModal from '@/components/ResponsiveModal';

interface AddExternalTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transfer: Omit<ExternalTransfer, 'id' | 'date'>) => void;
}

export default function AddExternalTransferModal({ isOpen, onClose, onSave }: AddExternalTransferModalProps) {
  const { t, direction } = useLanguage();
  const { banks } = useBanks();
  const [formData, setFormData] = useState<Omit<ExternalTransfer, 'id' | 'date'>>({
    bankId: '',
    amount: 0,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      bankId: '',
      amount: 0,
      notes: ''
    });
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('add_external_transfer')}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={direction}>
        <p className="text-sm text-[var(--text-muted)]">
          {t('please_enter_transfer_info')}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              {t('select_bank')} *
            </label>
            <select
              value={formData.bankId}
              onChange={(e) => setFormData({ ...formData, bankId: e.target.value })}
              className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            >
              <option value="">{t('select_bank')}</option>
              {banks.map(bank => (
                <option key={bank.id} value={bank.id}>{bank.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              {t('paid_amount')} *
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
              className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              {t('notes')}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-start pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-[#006437] text-white rounded-lg hover:bg-[#006437]/90 transition-colors"
          >
            {t('add_external_transfer')}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
