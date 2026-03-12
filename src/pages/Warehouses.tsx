import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useWarehouses, Warehouse } from '../context/WarehousesContext';
import { Plus, Search, Trash2, Edit2, X, ChevronRight, ChevronLeft, Building, Camera, CheckSquare, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MobileDataCard from '../components/MobileDataCard';

const Warehouses: React.FC = () => {
  const { t, direction } = useLanguage();
  const { warehouses, addWarehouse, updateWarehouse, deleteWarehouse } = useWarehouses();

  const [showModal, setShowModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState<Omit<Warehouse, 'id'>>({
    code: '',
    name: '',
    pricingGroup: 'عام',
    phone: '',
    email: '',
    address: '',
    showTouchScreen: false,
    showScreen2: false,
    enableTables: false,
    printPrepSlip: false,
    enableReservations: false,
    enableMarketers: false,
    enableGlasses: false,
    printSizesOnInvoice: false
  });

  const handleOpenModal = (warehouse?: Warehouse) => {
    if (warehouse) {
      setEditingWarehouse(warehouse.id);
      setForm({
        code: warehouse.code || '',
        name: warehouse.name || '',
        pricingGroup: warehouse.pricingGroup || 'عام',
        phone: warehouse.phone || '',
        email: warehouse.email || '',
        address: warehouse.address || '',
        showTouchScreen: !!warehouse.showTouchScreen,
        showScreen2: !!warehouse.showScreen2,
        enableTables: !!warehouse.enableTables,
        printPrepSlip: !!warehouse.printPrepSlip,
        enableReservations: !!warehouse.enableReservations,
        enableMarketers: !!warehouse.enableMarketers,
        enableGlasses: !!warehouse.enableGlasses,
        printSizesOnInvoice: !!warehouse.printSizesOnInvoice
      });
    } else {
      setEditingWarehouse(null);
      setForm({
        code: '',
        name: '',
        pricingGroup: 'عام',
        phone: '',
        email: '',
        address: '',
        showTouchScreen: false,
        showScreen2: false,
        enableTables: false,
        printPrepSlip: false,
        enableReservations: false,
        enableMarketers: false,
        enableGlasses: false,
        printSizesOnInvoice: false
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWarehouse) {
      updateWarehouse({ ...form, id: editingWarehouse });
    } else {
      addWarehouse(form);
    }
    setShowModal(false);
  };

  const filteredWarehouses = warehouses.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6" dir={direction}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">{t('warehouses')}</h1>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all text-sm font-medium"
        >
          <Plus size={18} />
          {t('add_warehouse')}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm"
      >
        <div className="p-4 border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-main)]/50">
          <div className="flex items-center gap-2">
            <Building size={20} className="text-[var(--primary)]" />
            <span className="font-bold text-[var(--text-main)]">{t('warehouses')}</span>
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
                  <th className="p-3 border border-white/10">{t('address')}</th>
                  <th className="p-3 border border-white/10">{t('email_address')}</th>
                  <th className="p-3 border border-white/10">{t('phone')}</th>
                  <th className="p-3 border border-white/10">{t('pricing_group_label')}</th>
                  <th className="p-3 border border-white/10">{t('name')}</th>
                  <th className="p-3 border border-white/10">{t('code')}</th>
                  <th className="p-3 border border-white/10 text-center">{t('map')}</th>
                  <th className="p-3 border border-white/10 text-center">
                    <Square size={16} className="mx-auto" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredWarehouses.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-[var(--text-muted)] bg-[var(--bg-main)]/30">
                      {t('no_data_in_table')}
                    </td>
                  </tr>
                ) : (
                  filteredWarehouses.map((w) => (
                    <tr key={`desktop-${w.id}`} className="border-b border-[var(--border)] hover:bg-[var(--bg-main)]/50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2 justify-center">
                          <button 
                            onClick={() => handleOpenModal(w)}
                            className="p-1.5 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => deleteWarehouse(w.id)}
                            className="p-1.5 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-[var(--text-main)]">{w.address}</td>
                      <td className="p-3 text-[var(--text-main)]">{w.email}</td>
                      <td className="p-3 text-[var(--text-main)]">{w.phone}</td>
                      <td className="p-3 text-[var(--text-main)]">{w.pricingGroup}</td>
                      <td className="p-3 text-[var(--text-main)] font-medium">{w.name}</td>
                      <td className="p-3 text-[var(--text-main)]">{w.code}</td>
                      <td className="p-3 text-center">
                        <Camera size={18} className="mx-auto text-gray-400" />
                      </td>
                      <td className="p-3 text-center">
                        <Square size={16} className="mx-auto text-gray-300" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredWarehouses.length === 0 ? (
              <div className="p-8 text-center text-[var(--text-muted)] bg-[var(--bg-main)]/30 rounded-xl">
                {t('no_data_in_table')}
              </div>
            ) : (
              filteredWarehouses.map((w) => (
                <MobileDataCard
                  key={`mobile-${w.id}`}
                  title={w.name}
                  subtitle={w.code}
                  fields={[
                    { label: t('pricing_group_label'), value: w.pricingGroup },
                    { label: t('phone'), value: w.phone },
                    { label: t('email_address'), value: w.email },
                    { label: t('address'), value: w.address }
                  ]}
                  actions={
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenModal(w)}
                        className="p-2 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteWarehouse(w.id)}
                        className="p-2 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-colors"
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
              عرض 1 إلى {filteredWarehouses.length} من {warehouses.length} سجلات
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8"
            >
              <div className="bg-primary p-4 flex items-center justify-between text-white">
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/80"
                >
                  <X size={20} />
                </button>
                <span className="font-bold text-lg">
                  {editingWarehouse ? t('edit_warehouse') : t('add_warehouse')}
                </span>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="text-sm text-[var(--primary)] text-right leading-relaxed font-bold">
                  برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-[var(--primary)] mb-1.5">{t('code')} *</label>
                      <input
                        type="text"
                        required
                        value={form.code || ''}
                        onChange={(e) => setForm({ ...form, code: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-[var(--primary)]/10 outline-none text-right transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[var(--primary)] mb-1.5">{t('name')} *</label>
                      <input
                        type="text"
                        required
                        value={form.name || ''}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-[var(--primary)]/10 outline-none text-right transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-[var(--primary)] mb-1.5">{t('pricing_group_label')}</label>
                      <select
                        value={form.pricingGroup || 'عام'}
                        onChange={(e) => setForm({ ...form, pricingGroup: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-[var(--primary)]/10 outline-none text-right transition-all"
                      >
                        <option value="عام">عام</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[var(--primary)] mb-1.5">{t('phone')}</label>
                      <input
                        type="text"
                        value={form.phone || ''}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-[var(--primary)]/10 outline-none text-right transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-right">
                  {[
                    { key: 'showTouchScreen', label: t('show_touch_screen') },
                    { key: 'showScreen2', label: 'إظهار شاشة 2' },
                    { key: 'enableTables', label: t('enable_tables') },
                    { key: 'printPrepSlip', label: t('print_prep_slip') },
                    { key: 'enableReservations', label: t('enable_reservations') },
                    { key: 'enableMarketers', label: t('enable_marketers') },
                    { key: 'enableGlasses', label: t('enable_glasses') },
                    { key: 'printSizesOnInvoice', label: t('print_sizes_on_invoice') }
                  ].map((item) => (
                    <label key={item.key} className="flex items-center justify-end gap-2 cursor-pointer group">
                      <span className="text-xs font-bold text-[var(--primary)] group-hover:text-[var(--primary-hover)] transition-colors">{item.label}</span>
                      <input
                        type="checkbox"
                        checked={!!(form as any)[item.key]}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          if (item.key === 'showTouchScreen' && checked) {
                            setForm({ ...form, showTouchScreen: true, showScreen2: false });
                          } else if (item.key === 'showScreen2' && checked) {
                            setForm({ ...form, showScreen2: true, showTouchScreen: false });
                          } else {
                            setForm({ ...form, [item.key]: checked });
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                    </label>
                  ))}
                </div>

                <div className="space-y-4 text-right">
                   <div>
                    <label className="block text-sm font-bold text-[var(--primary)] mb-1.5">{t('email_address')}</label>
                    <input
                      type="email"
                      value={form.email || ''}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-[var(--primary)]/10 outline-none text-right transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[var(--primary)] mb-1.5">{t('address')} *</label>
                    <textarea
                      required
                      value={form.address || ''}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-[var(--primary)]/10 outline-none text-right transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-[var(--primary)] text-white px-8 py-3 rounded-xl hover:bg-[var(--primary-hover)] transition-all font-bold shadow-lg shadow-[var(--primary)]/10 active:scale-95"
                  >
                    {editingWarehouse ? t('save_changes') : t('add_warehouse')}
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

export default Warehouses;
