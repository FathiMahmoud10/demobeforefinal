import React, { useState } from 'react';
import { 
  Users, 
  LayoutGrid, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Eye,
  ChevronRight,
  ChevronLeft,
  UserPlus
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSuppliers } from '@/context/SuppliersContext';
import { motion } from 'framer-motion';
import Pagination from '@/components/Pagination';
import MobileDataCard from '@/components/MobileDataCard';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import AddSupplierModal from '@/components/AddSupplierModal';

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  taxNumber: string;
}

export default function SuppliersList() {
  const { t, direction } = useLanguage();
  const { suppliers, deleteSupplier } = useSuppliers();
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<number | null>(null);

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm) ||
    s.taxNumber.includes(searchTerm)
  );

  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleAddClick = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (supplier: any) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const toggleSelectAll = () => {
    if (selectedSuppliers.length === paginatedSuppliers.length) {
      setSelectedSuppliers([]);
    } else {
      setSelectedSuppliers(paginatedSuppliers.map(s => s.id));
    }
  };

  const toggleSelectSupplier = (id: number) => {
    if (selectedSuppliers.includes(id)) {
      setSelectedSuppliers(selectedSuppliers.filter(sid => sid !== id));
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
      <DeleteConfirmationModal
        isOpen={supplierToDelete !== null}
        onClose={() => setSupplierToDelete(null)}
        onConfirm={() => {
          if (supplierToDelete !== null) {
            deleteSupplier(supplierToDelete);
            setSupplierToDelete(null);
          }
        }}
        itemName={suppliers.find(s => s.id === supplierToDelete)?.name}
      />

      {/* Page Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2 text-primary">
          <Users size={20} />
          <h1 className="text-lg font-bold">{t('suppliers') || 'الموردين'}</h1>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={handleAddClick}
             className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors flex items-center gap-2 text-sm font-bold"
           >
             <UserPlus size={18} />
             <span>{t('add_supplier') || 'إضافة مورد'}</span>
           </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {/* Table Controls */}
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

        {/* Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
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
                  <td colSpan={6} className="p-8 text-center text-gray-400 italic bg-gray-50">
                    {t('no_data_in_table') || 'لا توجد بيانات في الجدول'}
                  </td>
                </tr>
              ) : (
                paginatedSuppliers.map((supplier) => (
                  <tr key={`desktop-${supplier.id}`} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-l border-gray-100 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedSuppliers.includes(supplier.id)}
                        onChange={() => toggleSelectSupplier(supplier.id)}
                        className="w-4 h-4 accent-primary"
                      />
                    </td>
                    <td className="p-3 border-l border-gray-100">{supplier.name}</td>
                    <td className="p-3 border-l border-gray-100">{supplier.email}</td>
                    <td className="p-3 border-l border-gray-100">{supplier.phone}</td>
                    <td className="p-3 border-l border-gray-100">{supplier.taxNumber}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEditClick(supplier)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => setSupplierToDelete(supplier.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
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

        {/* Mobile View */}
        <div className="md:hidden space-y-4 p-4">
          {paginatedSuppliers.length === 0 ? (
            <div className="p-8 text-center text-gray-400 italic bg-gray-50 rounded-lg">
              {t('no_data_in_table') || 'لا توجد بيانات في الجدول'}
            </div>
          ) : (
            paginatedSuppliers.map((supplier) => (
              <MobileDataCard
                key={`mobile-${supplier.id}`}
                title={supplier.name}
                fields={[
                  { label: t('email_address') || 'عنوان البريد الإلكتروني', value: supplier.email },
                  { label: t('phone') || 'هاتف', value: supplier.phone },
                  { label: t('tax_number') || 'الرقم الضريبي', value: supplier.taxNumber },
                ]}
                actions={
                  <div className="flex flex-wrap justify-end gap-2">
                    <button 
                      onClick={() => handleEditClick(supplier)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg border border-green-100 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Edit2 size={16} />
                      {t('edit') || 'تعديل'}
                    </button>
                    <button 
                      onClick={() => setSupplierToDelete(supplier.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Trash2 size={16} />
                      {t('delete') || 'حذف'}
                    </button>
                  </div>
                }
              />
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-50 bg-gray-50/50">
          <div className="w-full">
             <Pagination 
               currentPage={currentPage}
               totalItems={filteredSuppliers.length}
               itemsPerPage={entriesPerPage}
               onPageChange={setCurrentPage}
             />
          </div>
        </div>
      </div>

      <AddSupplierModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supplier={editingSupplier}
      />
    </motion.div>
  );
}
