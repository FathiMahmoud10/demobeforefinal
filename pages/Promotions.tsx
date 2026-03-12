import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePromotions } from '../context/PromotionsContext';
import { Plus, Search, Trash2, Edit2, FileText, ChevronRight, ChevronLeft, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import MobileDataCard from '@/components/MobileDataCard';

const Promotions: React.FC = () => {
  const { t, language } = useLanguage();
  const { 
    specialPromotions, 
    generalPromotions, 
    addSpecialPromotion, 
    updateSpecialPromotion,
    deleteSpecialPromotion,
    addGeneralPromotion,
    deleteGeneralPromotion
  } = usePromotions();

  const [activeTab, setActiveTab] = useState<'special' | 'general'>('special');
  const [showAddSpecial, setShowAddSpecial] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states for Special Promotion
  const [specialForm, setSpecialForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    basicItem: '',
    basicItemQty: 1,
    freeItem: '',
    freeItemQty: 1,
    discount: 100,
    policy: 'option1',
    details: ''
  });

  // Form states for General Promotion
  const [generalForm, setGeneralForm] = useState({
    startDate: '2021-06-01',
    endDate: '2021-07-01',
    discount: 0,
    branch: 'تجريبي'
  });

  const handleAddSpecial = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPromotion) {
      updateSpecialPromotion({ ...specialForm, id: editingPromotion });
    } else {
      addSpecialPromotion(specialForm);
    }
    setShowAddSpecial(false);
    setEditingPromotion(null);
    setSpecialForm({
      name: '',
      startDate: '',
      endDate: '',
      basicItem: '',
      basicItemQty: 1,
      freeItem: '',
      freeItemQty: 1,
      discount: 100,
      policy: 'option1',
      details: ''
    });
  };

  const handleEditSpecial = (promotion: any) => {
    setEditingPromotion(promotion.id);
    setSpecialForm({
      name: promotion.name,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      basicItem: promotion.basicItem,
      basicItemQty: promotion.basicItemQty,
      freeItem: promotion.freeItem,
      freeItemQty: promotion.freeItemQty,
      discount: promotion.discount,
      policy: promotion.policy,
      details: promotion.details
    });
    setShowAddSpecial(true);
  };

  const handleAddGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    addGeneralPromotion(generalForm);
    // Reset or keep? The image shows it as a persistent form
  };

  const filteredSpecial = specialPromotions.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.basicItem.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">{t('promotions')}</h1>
        <div className="flex bg-[var(--card-bg)] rounded-lg p-1 border border-[var(--border)]">
          <button
            onClick={() => { setActiveTab('special'); setShowAddSpecial(false); setEditingPromotion(null); }}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === 'special' ? "bg-[var(--primary)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
            )}
          >
            {t('special_promotions')}
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === 'general' ? "bg-[var(--primary)] text-white" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
            )}
          >
            {t('general_promotions')}
          </button>
        </div>
      </div>

      {activeTab === 'special' ? (
        <div className="space-y-4">
          {!showAddSpecial ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden"
            >
              <div className="p-4 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-main)]/50">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setShowAddSpecial(true); setEditingPromotion(null); }}
                    className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all text-sm font-medium"
                  >
                    <Plus size={18} />
                    {t('add_special_promotion')}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <LayoutGrid size={20} className="text-[var(--primary)]" />
                  <span className="font-bold text-[var(--text-main)]">{t('promotions')}</span>
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

                <div className="overflow-x-auto">
                  {/* Desktop Table */}
                  <table className="hidden md:table w-full text-sm text-right">
                    <thead>
                      <tr className="bg-[#004d2c] text-white">
                        <th className="p-3 border border-white/10">{t('promotion_name')}</th>
                        <th className="p-3 border border-white/10">{t('basic_item')}</th>
                        <th className="p-3 border border-white/10">{t('free_item')}</th>
                        <th className="p-3 border border-white/10">{t('promotion_start_date')}</th>
                        <th className="p-3 border border-white/10">{t('promotion_end_date')}</th>
                        <th className="p-3 border border-white/10">{t('promotion_actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSpecial.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-[var(--text-muted)] bg-[var(--bg-main)]/30">
                            {t('no_promotions_found')}
                          </td>
                        </tr>
                      ) : (
                        filteredSpecial.map((p) => (
                          <tr key={`desktop-${p.id}`} className="border-b border-[var(--border)] hover:bg-[var(--bg-main)]/50 transition-colors">
                            <td className="p-3">{p.name}</td>
                            <td className="p-3">{p.basicItem}</td>
                            <td className="p-3">{p.freeItem}</td>
                            <td className="p-3 font-mono">{p.startDate}</td>
                            <td className="p-3 font-mono">{p.endDate}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2 justify-center">
                                <button 
                                  onClick={() => handleEditSpecial(p)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  onClick={() => deleteSpecialPromotion(p.id)}
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

                  {/* Mobile View */}
                  <div className="md:hidden space-y-4">
                    {filteredSpecial.map((p) => (
                      <MobileDataCard
                        key={`mobile-${p.id}`}
                        title={p.name}
                        subtitle={`${t('promotion_start_date')}: ${p.startDate}`}
                        fields={[
                          { label: t('basic_item'), value: p.basicItem },
                          { label: t('free_item'), value: p.freeItem },
                          { label: t('promotion_end_date'), value: p.endDate },
                        ]}
                        actions={
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => deleteSpecialPromotion(p.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleEditSpecial(p)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                          </div>
                        }
                      />
                    ))}
                    {filteredSpecial.length === 0 && (
                      <div className="p-8 text-center text-[var(--text-muted)] bg-[var(--bg-main)]/30 rounded-xl border border-dashed border-[var(--border)]">
                        {t('no_promotions_found')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <div className="text-sm text-[var(--text-muted)]">
                    عرض 0 إلى 0 من 0 سجلات
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-main)] disabled:opacity-50">
                      <ChevronRight size={18} />
                    </button>
                    <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-main)] disabled:opacity-50">
                      <ChevronLeft size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden"
            >
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-main)]/50">
                <div className="flex items-center gap-2">
                  {editingPromotion ? <Edit2 size={18} className="text-[var(--primary)]" /> : <Plus size={18} className="text-[var(--primary)]" />}
                  <span className="font-bold text-[var(--text-main)]">
                    {editingPromotion ? t('edit_special_promotion') : t('add_special_promotion')}
                  </span>
                </div>
                <button 
                  onClick={() => { setShowAddSpecial(false); setEditingPromotion(null); }}
                  className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleAddSpecial} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('promotion_name')} *</label>
                    <input
                      type="text"
                      required
                      value={specialForm.name}
                      onChange={(e) => setSpecialForm({ ...specialForm, name: e.target.value })}
                      className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('promotion_start_date')}</label>
                    <input
                      type="date"
                      value={specialForm.startDate}
                      onChange={(e) => setSpecialForm({ ...specialForm, startDate: e.target.value })}
                      className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('promotion_end_date')}</label>
                    <input
                      type="date"
                      value={specialForm.endDate}
                      onChange={(e) => setSpecialForm({ ...specialForm, endDate: e.target.value })}
                      className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('basic_item')} *</label>
                    <input
                      type="text"
                      required
                      value={specialForm.basicItem}
                      onChange={(e) => setSpecialForm({ ...specialForm, basicItem: e.target.value })}
                      className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('basic_item_qty')}</label>
                    <input
                      type="number"
                      value={specialForm.basicItemQty}
                      onChange={(e) => setSpecialForm({ ...specialForm, basicItemQty: Number(e.target.value) })}
                      className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('free_item')} *</label>
                    <input
                      type="text"
                      required
                      value={specialForm.freeItem}
                      onChange={(e) => setSpecialForm({ ...specialForm, freeItem: e.target.value })}
                      className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('free_item_qty')}</label>
                      <input
                        type="number"
                        value={specialForm.freeItemQty}
                        onChange={(e) => setSpecialForm({ ...specialForm, freeItemQty: Number(e.target.value) })}
                        className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('promotion_discount')}</label>
                      <input
                        type="number"
                        value={specialForm.discount}
                        onChange={(e) => setSpecialForm({ ...specialForm, discount: Number(e.target.value) })}
                        className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('promotion_policy')}</label>
                    <select
                      value={specialForm.policy}
                      onChange={(e) => setSpecialForm({ ...specialForm, policy: e.target.value })}
                      className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                    >
                      <option value="option1">{t('promotion_policy_option1')}</option>
                      <option value="option2">{t('promotion_policy_option2')}</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('promotion_details')}</label>
                    <textarea
                      rows={4}
                      value={specialForm.details}
                      onChange={(e) => setSpecialForm({ ...specialForm, details: e.target.value })}
                      className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary)] outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#004d2c] text-white px-8 py-2 rounded-lg hover:bg-opacity-90 transition-all font-medium"
                  >
                    {editingPromotion ? t('save_changes') : t('promotion_save')}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] overflow-hidden"
        >
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-main)]/50">
            <div className="flex items-center gap-2">
              <LayoutGrid size={20} className="text-[var(--primary)]" />
              <span className="font-bold text-[var(--text-main)]">{t('general_promotions')}</span>
            </div>
          </div>
          <form onSubmit={handleAddGeneral} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('promotion_start_date')}</label>
                <input
                  type="date"
                  value={generalForm.startDate}
                  onChange={(e) => setGeneralForm({ ...generalForm, startDate: e.target.value })}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('promotion_end_date')}</label>
                <input
                  type="date"
                  value={generalForm.endDate}
                  onChange={(e) => setGeneralForm({ ...generalForm, endDate: e.target.value })}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('promotion_discount')}</label>
                <input
                  type="number"
                  value={generalForm.discount}
                  onChange={(e) => setGeneralForm({ ...generalForm, discount: Number(e.target.value) })}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('promotion_branch')}</label>
                <select
                  value={generalForm.branch}
                  onChange={(e) => setGeneralForm({ ...generalForm, branch: e.target.value })}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                >
                  <option value="تجريبي">تجريبي</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#004d2c] text-white px-8 py-2 rounded-lg hover:bg-opacity-90 transition-all font-medium"
              >
                {t('promotion_save')}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default Promotions;
