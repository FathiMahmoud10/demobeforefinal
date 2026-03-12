import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Calendar, Building, DollarSign, CreditCard, FileText, Edit } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useExpenses } from '@/context/ExpensesContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Expense } from '@/types';

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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[var(--bg-card)] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[var(--border)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--bg-main)]">
            <h2 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
              {expense ? <Edit className="text-[#2ecc71]" size={24} /> : <PlusIcon className="text-[#2ecc71]" size={24} />}
              {expense ? t('edit') : t('add_expense')}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <p className="text-sm text-[var(--text-muted)] mb-4">
              {t('please_enter_info_below')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--text-main)] flex items-center gap-2">
                  <Calendar size={16} className="text-[#2ecc71]" />
                  {t('date')}
                </label>
                <input 
                  type="text"
                  value={formData.date}
                  readOnly
                  className="w-full p-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2ecc71]/20"
                />
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--text-main)] flex items-center gap-2">
                  <FileText size={16} className="text-[#2ecc71]" />
                  {t('expense_categories')} *
                </label>
                <select 
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2ecc71]/20"
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
                <label className="text-sm font-medium text-[var(--text-main)] flex items-center gap-2">
                  <Building size={16} className="text-[#2ecc71]" />
                  {t('branch')}
                </label>
                <select 
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full p-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2ecc71]/20"
                >
                  <option value="تجريبي">تجريبي</option>
                  <option value="الفرع الرئيسي">الفرع الرئيسي</option>
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--text-main)] flex items-center gap-2">
                  <DollarSign size={16} className="text-[#2ecc71]" />
                  {t('paid_amount')} *
                </label>
                <input 
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full p-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2ecc71]/20"
                  placeholder="0.00"
                />
              </div>

              {/* Payment Type */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--text-main)] flex items-center gap-2">
                  <CreditCard size={16} className="text-[#2ecc71]" />
                  {t('payment_by')}
                </label>
                <select 
                  value={formData.paymentType}
                  onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                  className="w-full p-2.5 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2ecc71]/20"
                >
                  <option value="نقدي">{t('cash')}</option>
                  <option value="شبكة">{t('network')}</option>
                  <option value="تحويل بنكي">{t('bank_transfer')}</option>
                </select>
              </div>

              {/* Attachments */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-[var(--text-main)] flex items-center gap-2">
                  <Upload size={16} className="text-[#2ecc71]" />
                  {t('attachments')}
                </label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#007e4a] text-white rounded-lg text-sm hover:bg-[#006b3f] transition-colors whitespace-nowrap"
                  >
                    <Upload size={16} />
                    <span>استعراض ...</span>
                  </button>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex-1 p-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-xs text-[var(--text-muted)] truncate">
                    {formData.attachment ? formData.attachment.name : ""}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-[var(--text-main)]">
                {t('sale_notes')}
              </label>
              <div className="border border-[var(--border)] rounded-lg overflow-hidden">
                {/* Mock Rich Text Toolbar */}
                <div className="bg-[var(--bg-main)] p-2 border-b border-[var(--border)] flex flex-wrap gap-2">
                  <button type="button" className="p-1 hover:bg-white rounded border border-transparent hover:border-gray-300">B</button>
                  <button type="button" className="p-1 hover:bg-white rounded border border-transparent hover:border-gray-300 italic">I</button>
                  <button type="button" className="p-1 hover:bg-white rounded border border-transparent hover:border-gray-300 underline">U</button>
                  <div className="w-px h-4 bg-gray-300 mx-1 self-center"></div>
                  <button type="button" className="p-1 hover:bg-white rounded border border-transparent hover:border-gray-300">List</button>
                </div>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-white text-black outline-none resize-none min-h-[150px]"
                />
              </div>
            </div>

            {/* Footer Button */}
            <div className="pt-4 border-t border-[var(--border)]">
              <button 
                type="submit"
                className={cn(
                  "w-full py-3 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2",
                  "bg-[#2ecc71] hover:bg-[#27ae60]"
                )}
              >
                {expense ? t('edit') : t('add_expense')}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

function PlusIcon({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
