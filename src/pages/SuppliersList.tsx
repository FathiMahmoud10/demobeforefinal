import React, { useMemo, useState } from 'react';
import {
  Users,
  UserPlus,
  Loader,
  Edit2,
  Trash2
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSuppliers } from '@/context/SuppliersContext';
import { motion } from 'framer-motion';
import Pagination from '@/components/Pagination';
import AddSupplierModal from '@/components/AddSupplierModal';
import Toast from '@/components/Toast';
import Confirm from '@/components/Confirm';

export default function SuppliersList() {
  const { t, direction } = useLanguage();
  const { suppliers, loading, deleteSupplier } = useSuppliers();

  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);

  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const getName = (s: any) => String(s?.supplierName ?? s?.name ?? '');
  const getEmail = (s: any) => String(s?.email ?? '');
  const getPhone = (s: any) => String(s?.phone ?? s?.mobile ?? '');
  const getTax = (s: any) => String(s?.taxNumber ?? '');

  const filteredSuppliers = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    if (!s) return suppliers;

    return suppliers.filter((x: any) => {
      const hay = `${getName(x)} ${getEmail(x)} ${getPhone(x)} ${getTax(x)}`.toLowerCase();
      return hay.includes(s);
    });
  }, [suppliers, searchTerm]);

  const paginatedSuppliers = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredSuppliers.slice(start, start + entriesPerPage);
  }, [filteredSuppliers, currentPage, entriesPerPage]);

  // reset page when filtering/page size changes
  React.useEffect(() => {
    setCurrentPage(1);
    setSelectedSuppliers([]);
  }, [searchTerm, entriesPerPage]);

  const handleAddClick = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (supplier: any) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const performDelete = async () => {
    if (confirmDeleteId === null) return;

    const result = await deleteSupplier(confirmDeleteId);
    setConfirmDeleteId(null);

    if (result?.ok) {
      setToastMsg(t('supplier_deleted_successfully') || 'تم حذف المورد بنجاح');
      setToastType('success');
    } else {
      setToastMsg(result?.message || t('operation_failed') || 'فشلت العملية');
      setToastType('error');
    }
    setToastOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedSuppliers.length === paginatedSuppliers.length) {
      setSelectedSuppliers([]);
    } else {
      setSelectedSuppliers(paginatedSuppliers.map((s: any) => s.id));
    }
  };

  const toggleSelectSupplier = (id: number) => {
    if (selectedSuppliers.includes(id)) {
      setSelectedSuppliers(selectedSuppliers.filter((sid) => sid !== id));
    } else {
      setSelectedSuppliers([...selectedSuppliers, id]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
      dir={direction}
    >
      {/* Page Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2 text-primary">
          <Users size={20} />
          <h1 className="text-lg font-bold">{t('suppliers') || 'الموردين'}</h1>
        </div>

        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center gap-2 text-sm font-bold"
        >
          <UserPlus size={18} />
          <span>{t('add_supplier') || 'إضافة مورد'}</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader size={24} className="animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-50">
              <div className="flex items-center gap-2 order-2 md:order-1">
                <span className="text-sm text-gray-600">{t('show') || 'اظهار'}</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-primary bg-white"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">{t('records') || 'سجلات'}</span>
              </div>

              <div className="flex items-center gap-2 order-1 md:order-2 w-full md:w-auto">
                <span className="text-sm text-gray-600 whitespace-nowrap">{t('search') || 'بحث'}</span>
                <div className="relative flex-1 md:w-64">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary text-right"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right border-collapse">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-3 border-l border-white/10 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={paginatedSuppliers.length > 0 && selectedSuppliers.length === paginatedSuppliers.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 accent-primary"
                      />
                    </th>

                    {/* لو تحبي تضيفي كود المورد */}
                    <th className="p-3 border-l border-white/10 font-bold">{t('code') || 'كود'}</th>

                    <th className="p-3 border-l border-white/10 font-bold">{t('name') || 'اسم'}</th>
                    <th className="p-3 border-l border-white/10 font-bold">{t('email_address') || 'عنوان البريد الإلكتروني'}</th>
                    <th className="p-3 border-l border-white/10 font-bold">{t('phone') || 'هاتف'}</th>
                    <th className="p-3 border-l border-white/10 font-bold">{t('tax_number') || 'الرقم الضريبي'}</th>
                    <th className="p-3 font-bold text-center">{t('actions') || 'الإجراءات'}</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {paginatedSuppliers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400 italic bg-gray-50">
                        {t('no_data_in_table') || 'لا توجد بيانات في الجدول'}
                      </td>
                    </tr>
                  ) : (
                    paginatedSuppliers.map((supplier: any) => (
                      <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 border-l border-gray-100 text-center">
                          <input
                            type="checkbox"
                            checked={selectedSuppliers.includes(supplier.id)}
                            onChange={() => toggleSelectSupplier(supplier.id)}
                            className="w-4 h-4 accent-primary"
                          />
                        </td>

                        <td className="p-3 border-l border-gray-100">
                          {supplier.supplierCode ?? supplier.code ?? supplier.id}
                        </td>

                        <td className="p-3 border-l border-gray-100">{getName(supplier)}</td>
                        <td className="p-3 border-l border-gray-100">{getEmail(supplier) || '-'}</td>
                        <td className="p-3 border-l border-gray-100">{getPhone(supplier) || '-'}</td>
                        <td className="p-3 border-l border-gray-100">{getTax(supplier) || '-'}</td>

                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditClick(supplier)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title={t('edit') || 'تعديل'}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(supplier.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title={t('delete') || 'حذف'}
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

            {/* Pagination */}
            <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-50 bg-gray-50/50">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredSuppliers.length}
                itemsPerPage={entriesPerPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      <AddSupplierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supplier={editingSupplier}
      />

      {/* Confirm delete */}
      <Confirm
        isOpen={confirmDeleteId !== null}
        title={t('confirm_delete') || 'تأكيد الحذف'}
        message={t('confirm_delete_supplier') || 'هل تريد حذف هذا المورد؟'}
        confirmLabel={t('delete') || 'حذف'}
        cancelLabel={t('cancel') || 'إلغاء'}
        onConfirm={performDelete}
        onClose={() => setConfirmDeleteId(null)}
      />

      {/* Toast */}
      {toastOpen && (
        <Toast
          isOpen={toastOpen}
          message={toastMsg}
          type={toastType}
          onClose={() => setToastOpen(false)}
        />
      )}
    </motion.div>
  );
}