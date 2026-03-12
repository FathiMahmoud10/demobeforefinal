import React, { useState, useRef, useEffect } from 'react';
import { Upload, Calendar, Building, DollarSign, CreditCard, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useExpenses } from '@/context/ExpensesContext';
import { Expense } from '@/types';
import ResponsiveModal from './ResponsiveModal';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense | null;
}

export default function AddExpenseModal({ isOpen, onClose, expense }: AddExpenseModalProps) {
  const { t, direction } = useLanguage();
  const { addExpense, updateExpense } = useExpenses();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('en-GB'),
    category: '',
    branch: 'تجريبي',
    amount: '',
    paymentType: 'نقدي',
    description: '',
    attachment: null as File | null
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        date: expense.date,
        category: expense.category,
        branch: 'تجريبي',
        amount: expense.amount.toString(),
        paymentType: 'نقدي',
        description: expense.description,
        attachment: null
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('en-GB'),
        category: '',
        branch: 'تجريبي',
        amount: '',
        paymentType: 'نقدي',
        description: '',
        attachment: null
      });
    }
  }, [expense, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) return;

    if (expense) {
      updateExpense(expense.id, {
        date: formData.date.split(' ')[0],
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description,
        hasAttachment: formData.attachment ? true : expense.hasAttachment
      });
    } else {
      addExpense({
        date: formData.date.split(' ')[0],
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description,
        hasAttachment: !!formData.attachment
      });
    }

    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, attachment: e.target.files[0] });
    }
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={expense ? t('edit') : t('add_expense')}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-6" dir={direction}>
        <p className="text-xs text-[var(--text-muted)] mb-2 text-center">
          {t('please_enter_info_below')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Calendar size={14} className="text-[#2ecc71]" />
              {t('date')}
            </label>
            <input 
              type="text"
              value={formData.date}
              readOnly
              className="w-full p-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#2ecc71]/20"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <FileText size={14} className="text-[#2ecc71]" />
              {t('expense_categories')} *
            </label>
            <select 
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#2ecc71]/20"
            >
              <option value="">{t('select_category_load')}</option>
              <option value="إيجار">إيجار</option>
              <option value="كهرباء">كهرباء</option>
              <option value="مياه">مياه</option>
              <option value="رواتب">رواتب</option>
              <option value="أدوات مكتبية">أدوات مكتبية</option>
              <option value="أخرى">أخرى</option>
            </select>
          </div>

          {/* Branch */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Building size={14} className="text-[#2ecc71]" />
              {t('branch')}
            </label>
            <select 
              value={formData.branch}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full p-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#2ecc71]/20"
            >
              <option value="تجريبي">تجريبي</option>
              <option value="الفرع الرئيسي">الفرع الرئيسي</option>
            </select>
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <DollarSign size={14} className="text-[#2ecc71]" />
              {t('paid_amount')} *
            </label>
            <input 
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full p-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#2ecc71]/20"
              placeholder="0.00"
            />
          </div>

          {/* Payment Type */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <CreditCard size={14} className="text-[#2ecc71]" />
              {t('payment_by')}
            </label>
            <select 
              value={formData.paymentType}
              onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
              className="w-full p-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#2ecc71]/20"
            >
              <option value="نقدي">{t('cash')}</option>
              <option value="شبكة">{t('network')}</option>
              <option value="تحويل بنكي">{t('bank_transfer')}</option>
            </select>
          </div>

          {/* Attachments */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Upload size={14} className="text-[#2ecc71]" />
              {t('attachments')}
            </label>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#007e4a] text-white rounded-lg text-xs hover:bg-[#006b3f] transition-colors whitespace-nowrap font-bold"
              >
                <Upload size={14} />
                <span>استعراض ...</span>
              </button>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex-1 p-1.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-[10px] text-[var(--text-muted)] truncate">
                {formData.attachment ? formData.attachment.name : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[var(--text-main)]">
            {t('sale_notes')}
          </label>
          <div className="border border-[var(--border)] rounded-lg overflow-hidden">
            <div className="bg-[var(--bg-main)] p-1.5 border-b border-[var(--border)] flex flex-wrap gap-2 text-xs">
              <button type="button" className="p-1 hover:bg-white rounded border border-transparent hover:border-gray-300 font-bold">B</button>
              <button type="button" className="p-1 hover:bg-white rounded border border-transparent hover:border-gray-300 italic">I</button>
              <button type="button" className="p-1 hover:bg-white rounded border border-transparent hover:border-gray-300 underline">U</button>
            </div>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 bg-white text-black outline-none resize-none text-xs min-h-[80px]"
            />
          </div>
        </div>

        {/* Footer Button */}
        <div className="pt-2">
          <button 
            type="submit"
            className="w-full py-2.5 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm bg-[#2ecc71] hover:bg-[#27ae60]"
          >
            {expense ? t('edit') : t('add_expense')}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
