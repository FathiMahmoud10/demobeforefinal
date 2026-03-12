import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTables } from '../context/TablesContext';
import { Plus, Search, Trash2, Edit2, X, ChevronRight, ChevronLeft, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileDataCard from '../components/MobileDataCard';

const Tables: React.FC = () => {
  const { t, direction } = useLanguage();
  const { tables, addTable, updateTable, deleteTable } = useTables();

  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ code: '', name: '', branch: '' });

  const handleOpenModal = (table?: any) => {
    if (table) {
      setEditingTable(table.id);
      setForm({ code: table.code, name: table.name, branch: table.branch });
    } else {
      setEditingTable(null);
      setForm({ code: '', name: '', branch: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTable) {
      updateTable({ ...form, id: editingTable });
    } else {
      addTable(form);
    }
    setShowModal(false);
  };

  const filteredTables = tables.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6" dir={direction}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">{t('tables')}</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all text-sm font-medium"
        >
          <Plus size={18} />
          {t('add_table')}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm"
      >
        <div className="p-4 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-main)]/50">
          <div className="flex items-center gap-2">
            <LayoutGrid size={20} className="text-[var(--primary)]" />
            <span className="font-bold text-[var(--text-main)]">{t('tables')}</span>
          </div>
          <div className="text-sm text-[var(--text-muted)] italic">
            الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-muted)]">اظهار</span>
              <select className="bg-[var(--input-bg)] border border-[var(--border)] rounded px-2 py-1 text-sm text-[var(--text-main)]">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
            <div className="relative flex items-center gap-2">
              <span className="text-sm text-[var(--text-muted)]">بحث</span>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[var(--input-bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] w-64 text-[var(--text-main)]"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm text-right border-collapse">
              <thead>
                <tr className="bg-[var(--table-header)] text-white">
                  <th className="p-3 border border-white/10 text-center">{t('actions')}</th>
                  <th className="p-3 border border-white/10">{t('branch')}</th>
                  <th className="p-3 border border-white/10">{t('code')}</th>
                  <th className="p-3 border border-white/10">{t('name')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTables.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-[var(--text-muted)] bg-[var(--bg-main)]/30">
                      {t('no_data_in_table')}
                    </td>
                  </tr>
                ) : (
                  filteredTables.map((table) => (
                    <tr key={`desktop-${table.id}`} className="border-b border-[var(--border)] hover:bg-[var(--bg-main)]/50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2 justify-center">
                          <button 
                            onClick={() => handleOpenModal(table)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => deleteTable(table.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-[var(--text-main)]">{table.branch}</td>
                      <td className="p-3 text-[var(--text-main)]">{table.code}</td>
                      <td className="p-3 text-[var(--text-main)] font-medium">{table.name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredTables.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-muted)] bg-[var(--bg-main)]/30 rounded-xl">
                {t('no_data_in_table')}
              </div>
            ) : (
              filteredTables.map((table) => (
                <MobileDataCard
                  key={`mobile-${table.id}`}
                  title={table.name}
                  subtitle={table.code}
                  fields={[
                    { label: t('branch'), value: table.branch }
                  ]}
                  actions={
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenModal(table)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteTable(table.id)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  }
                />
              ))
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
            <div className="text-sm text-[var(--text-muted)]">
              عرض 1 إلى {filteredTables.length} من {tables.length} سجلات
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-main)] disabled:opacity-50 text-[var(--text-main)]">
                <ChevronRight size={18} />
              </button>
              <div className="bg-[var(--primary)] text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium">1</div>
              <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-main)] disabled:opacity-50 text-[var(--text-main)]">
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
              <div className="bg-primary p-4 flex items-center justify-between text-white">
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/80"
                >
                  <X size={20} />
                </button>
                <span className="font-bold text-lg">
                  {editingTable ? t('edit_table') : t('add_table')}
                </span>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="text-sm text-emerald-800 text-right leading-relaxed font-bold">
                  برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
                </div>

                <div className="space-y-4 text-right">
                  <div>
                    <label className="block text-sm font-bold text-emerald-800 mb-1.5">{t('name')} *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-emerald-100 outline-none text-right transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-emerald-800 mb-1.5">{t('code')} *</label>
                    <input
                      type="text"
                      required
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-emerald-100 outline-none text-right transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-emerald-800 mb-1.5">{t('branch')}</label>
                    <select
                      value={form.branch}
                      onChange={(e) => setForm({ ...form, branch: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-emerald-100 outline-none text-right transition-all"
                    >
                      <option value="">{t('select_branch')}</option>
                      <option value="نشاط المطاعم">نشاط المطاعم</option>
                      <option value="مغسلة سيارات">مغسلة سيارات</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white px-8 py-3 rounded-xl hover:bg-emerald-700 transition-all font-bold shadow-lg shadow-emerald-100 active:scale-95"
                  >
                    {editingTable ? t('save_changes') : t('add_table')}
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

export default Tables;
