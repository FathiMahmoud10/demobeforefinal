import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useBanks } from '@/context/BanksContext';
import { InternalTransfer } from '@/types';
import ResponsiveModal from '@/components/ResponsiveModal';

interface AddInternalTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transfer: Omit<InternalTransfer, 'id' | 'date'>) => void;
}

export default function AddInternalTransferModal({ isOpen, onClose, onSave }: AddInternalTransferModalProps) {
  const { t, direction } = useLanguage();
  const { banks } = useBanks();
  const [formData, setFormData] = useState<Omit<InternalTransfer, 'id' | 'date'>>({
    type: '',
    from: '',
    to: '',
    amount: 0,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      type: '',
      from: '',
      to: '',
      amount: 0,
      notes: ''
    });
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('add_internal_transfer')}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6" dir={direction}>
        <p className="text-sm text-[var(--text-muted)]">
          {t('please_enter_transfer_info')}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              {t('select_transfer_type')} *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            >
              <option value="">{t('select_transfer_type')}</option>
              <option value="fund_to_bank">{t('transfer_from_fund')}</option>
              <option value="bank_to_fund">{t('transfer_to_fund')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              {t('fund_balance')} : 0
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">
              {t('select_bank')} *
            </label>
            <select
              value={formData.type === 'fund_to_bank' ? formData.to : formData.from}
              onChange={(e) => {
                if (formData.type === 'fund_to_bank') {
                  setFormData({ ...formData, to: e.target.value, from: 'Fund' });
                } else {
                  setFormData({ ...formData, from: e.target.value, to: 'Fund' });
                }
              }}
              className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              required
            >
              <option value="">{t('select_bank')}</option>
              {banks.map(bank => (
                <option key={bank.id} value={bank.name}>{bank.name}</option>
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
            {t('add_internal_transfer')}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
