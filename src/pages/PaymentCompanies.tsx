import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePaymentCompanies } from '../context/PaymentCompaniesContext';
import { Plus, Search, Trash2, Edit2, X, ChevronRight, ChevronLeft, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const PaymentCompanies: React.FC = () => {
  const { t, direction } = useLanguage();
  const { paymentCompanies, addPaymentCompany, updatePaymentCompany, deletePaymentCompany } = usePaymentCompanies();

  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ code: '', name: '' });

  const handleOpenModal = (company?: any) => {
    if (company) {
      setEditingCompany(company.id);
      setForm({ code: company.code, name: company.name });
    } else {
      setEditingCompany(null);
      setForm({ code: '', name: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCompany) {
      updatePaymentCompany({ ...form, id: editingCompany });
    } else {
      addPaymentCompany(form);
    }
    setShowModal(false);
  };

  const filteredCompanies = paymentCompanies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">{t('payment_companies')}</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all text-sm font-medium"
        >
          <Plus size={18} />
          {t('add_payment_company')}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden"
      >
        <div className="p-4 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-main)]/50">
          <div className="flex items-center gap-2">
            <LayoutGrid size={20} className="text-[var(--primary)]" />
            <span className="font-bold text-[var(--text-main)]">{t('payment_companies')}</span>
          </div>
          <div className="text-sm text-[var(--text-muted)] italic">
            الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-muted)]">اظهار</span>
              <select className="bg-[var(--input-bg)] border border-[var(--border)] rounded px-2 py-1 text-sm">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder={t('search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[var(--input-bg)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-64"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            </div>
          </div>

          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm text-right">
              <thead>
                <tr className="bg-[#2ecc71] text-white">
                  <th className="p-3 border border-white/10 w-12">
                    <input type="checkbox" className="rounded border-white/20" />
                  </th>
                  <th className="p-3 border border-white/10">{t('company_code')}</th>
                  <th className="p-3 border border-white/10">{t('company_name_label')}</th>
                  <th className="p-3 border border-white/10 text-center">{t('promotion_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[var(--text-muted)] bg-[var(--bg-main)]/30">
                      {t('no_promotions_found')}
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((c) => (
                    <tr key={`desktop-${c.id}`} className="border-b border-[var(--border)] hover:bg-[var(--bg-main)]/50 transition-colors">
                      <td className="p-3 text-center">
                        <input type="checkbox" className="rounded border-[var(--border)]" />
                      </td>
                      <td className="p-3 font-mono">{c.code}</td>
                      <td className="p-3">{c.name}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2 justify-center">
                          <button 
                            onClick={() => handleOpenModal(c)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => deletePaymentCompany(c.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
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

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredCompanies.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-muted)] bg-[var(--bg-main)]/30 rounded-xl">
                {t('no_promotions_found')}
              </div>
            ) : (
              filteredCompanies.map((c) => (
                <div key={`mobile-${c.id}`} className="bg-[var(--bg-main)]/30 p-4 rounded-xl border border-[var(--border)] space-y-3">
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="rounded border-[var(--border)]" />
                      <span className="font-bold text-[var(--text-main)]">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenModal(c)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deletePaymentCompany(c.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-[var(--text-muted)]">{t('company_code')}:</div>
                    <div className="font-mono text-left">{c.code}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            <div className="text-sm text-[var(--text-muted)]">
              عرض 1 إلى {filteredCompanies.length} من {paymentCompanies.length} سجلات
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-main)] disabled:opacity-50">
                <ChevronRight size={18} />
              </button>
              <div className="bg-[var(--primary)] text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium">1</div>
              <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-main)] disabled:opacity-50">
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                >
                  <X size={20} />
                </button>
                <span className="font-bold text-gray-800 text-lg">
                  {editingCompany ? t('edit_payment_company') : t('add_payment_company')}
                </span>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="text-sm text-gray-500 text-right leading-relaxed">
                  برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
                </div>

                <div className="space-y-4 text-right">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('company_code')}</label>
                    <input
                      type="text"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent outline-none text-right transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('company_name_label')} *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50/50 text-gray-900 focus:ring-2 focus:ring-[#2ecc71] focus:border-transparent outline-none text-right transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[#2ecc71] text-white px-8 py-3 rounded-xl hover:bg-[#27ae60] transition-all font-bold shadow-lg shadow-green-100 active:scale-95"
                  >
                    {editingCompany ? t('save_changes') : t('add_payment_company')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentCompanies;
