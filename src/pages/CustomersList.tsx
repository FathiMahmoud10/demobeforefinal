import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  User, 
  Search, 
  Edit2, 
  Trash2, 
  Plus,
  FileText,
  ChevronRight,
  ChevronLeft,
  UserPlus,
  CreditCard,
  List,
  Minus,
  PlusCircle,
  ChevronDown,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  History,
  Printer
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCustomers } from '@/context/CustomersContext';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '@/components/Pagination';
import { cn } from '@/lib/utils';
import MobileDataCard from '@/components/MobileDataCard';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import AddCustomerModal from '@/components/AddCustomerModal';
import EditCustomerModal from '@/components/modals/EditCustomerModal';
import AddDepositModal from '@/components/modals/AddDepositModal';
import AddDiscountModal from '@/components/modals/AddDiscountModal';
import ViewPaymentsModal from '@/components/modals/ViewPaymentsModal';

export default function CustomersList() {
  const { t, direction } = useLanguage();
  const { customers, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [activeActionMenu, setActiveActionMenu] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const actionButtonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (activeActionMenu !== null && actionButtonRefs.current[activeActionMenu]) {
      const rect = actionButtonRefs.current[activeActionMenu]!.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [activeActionMenu]);

  // Close menu on scroll or resize
  useEffect(() => {
    const handleScroll = () => setActiveActionMenu(null);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.code.includes(searchTerm)
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const toggleSelectAll = () => {
    if (selectedCustomers.length === paginatedCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(paginatedCustomers.map(c => c.id));
    }
  };

  const toggleSelectCustomer = (id: number) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter(sid => sid !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
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
        isOpen={customerToDelete !== null}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={() => {
          if (customerToDelete !== null) {
            deleteCustomer(customerToDelete);
            setCustomerToDelete(null);
          }
        }}
        itemName={customers.find(c => c.id === customerToDelete)?.name}
      />

      {/* Page Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[#007e4a]">
          <User size={20} />
          <h1 className="text-lg font-bold">{t('customers') || 'العملاء'}</h1>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="px-4 py-2 bg-[#2ecc71] text-white rounded-md hover:bg-[#27ae60] transition-colors flex items-center gap-2 text-sm font-bold shadow-sm"
           >
             <UserPlus size={18} />
             <span>{t('add_customer') || 'إضافة عميل'}</span>
           </button>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-2">
        {t('customers_table_desc') || 'الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.'}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-visible">
        {/* Table Controls */}
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-50">
          <div className="flex items-center gap-2 order-2 md:order-1">
            <span className="text-sm text-gray-600">{t('show') || 'اظهار'}</span>
            <select 
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-[#2ecc71] bg-white"
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
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#2ecc71] text-right"
              />
            </div>
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-right border-collapse">
            <thead>
              <tr className="bg-green-500 text-white">
                <th className="p-3 border-l border-white/10 w-10 text-center">
                  <input 
                    type="checkbox" 
                    checked={paginatedCustomers.length > 0 && selectedCustomers.length === paginatedCustomers.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-[#2ecc71]"
                  />
                </th>
                <th className="p-3 border-l border-white/10 font-bold">{t('code') || 'كود'}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('name') || 'اسم'}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('email_address') || 'عنوان البريد الإلكتروني'}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('phone') || 'هاتف'}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('pricing_group') || 'مجموعة التسعيرة'}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('customer_group') || 'مجموعة العملاء'}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('tax_number') || 'الرقم الضريبي'}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('actual_balance') || 'الرصيد الفعلي'}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('total_points') || 'إجمالي النقاط المكتسبة'}</th>
                <th className="p-3 font-bold text-center">{t('actions') || 'الإجراءات'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-gray-400 italic bg-gray-50">
                    {t('no_data_in_table') || 'لا توجد بيانات في الجدول'}
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer) => (
                  <tr key={`desktop-${customer.id}`} className={cn("hover:bg-gray-50 transition-colors group", activeActionMenu === customer.id && "relative z-30")}>
                    <td className="p-3 border-l border-gray-100 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => toggleSelectCustomer(customer.id)}
                        className="w-4 h-4 accent-[#2ecc71]"
                      />
                    </td>
                    <td className="p-3 border-l border-gray-100">{customer.code}</td>
                    <td className="p-3 border-l border-gray-100 font-medium">{customer.name}</td>
                    <td className="p-3 border-l border-gray-100 text-blue-600">{customer.email}</td>
                    <td className="p-3 border-l border-gray-100">{customer.phone}</td>
                    <td className="p-3 border-l border-gray-100">{customer.pricingGroup}</td>
                    <td className="p-3 border-l border-gray-100">{customer.customerGroup}</td>
                    <td className="p-3 border-l border-gray-100">{customer.taxNumber || '-'}</td>
                    <td className="p-3 border-l border-gray-100 font-bold">{(customer.actualBalance || 0).toFixed(2)}</td>
                    <td className="p-3 border-l border-gray-100 font-bold">{(customer.totalPoints || 0).toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <button 
                        ref={el => actionButtonRefs.current[customer.id] = el}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionMenu(activeActionMenu === customer.id ? null : customer.id);
                        }}
                        className="bg-[#2ecc71] text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 mx-auto hover:bg-[#27ae60] transition-colors font-bold shadow-sm"
                      >
                        <ChevronDown size={14} className={cn("transition-transform", activeActionMenu === customer.id && "rotate-180")} />
                        <span>{t('actions') || 'الإجراءات'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4 p-4">
          {paginatedCustomers.length === 0 ? (
            <div className="p-8 text-center text-gray-400 italic bg-gray-50 rounded-lg border border-dashed border-gray-200">
              {t('no_data_in_table') || 'لا توجد بيانات في الجدول'}
            </div>
          ) : (
            paginatedCustomers.map((customer) => (
              <MobileDataCard
                key={`mobile-${customer.id}`}
                title={customer.name}
                subtitle={customer.code}
                fields={[
                  { label: t('email_address') || 'عنوان البريد الإلكتروني', value: customer.email },
                  { label: t('phone') || 'هاتف', value: customer.phone },
                  { label: t('customer_group') || 'مجموعة العملاء', value: customer.customerGroup },
                  { label: t('actual_balance') || 'الرصيد الفعلي', value: (customer.actualBalance || 0).toFixed(2), isBold: true },
                  { label: t('total_points') || 'إجمالي النقاط المكتسبة', value: (customer.totalPoints || 0).toFixed(2) },
                ]}
                actions={
                  <div className="flex flex-wrap justify-end gap-2">
                    <button 
                      onClick={() => { setIsEditModalOpen(true); setSelectedCustomer(customer); }}
                      className="p-2 text-primary hover:bg-primary/5 rounded-lg border border-primary/10 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Edit2 size={16} />
                      {t('edit') || 'تعديل'}
                    </button>
                    <button 
                      onClick={() => { setIsDepositModalOpen(true); setSelectedCustomer(customer); }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <PlusCircle size={16} />
                      {t('deposit') || 'إيداع'}
                    </button>
                    <button 
                      onClick={() => { setCustomerToDelete(customer.id); }}
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
          <div className="text-sm text-gray-500">
            {t('showing_records') || 'عرض'} 1 {t('to') || 'إلى'} {filteredCustomers.length} {t('of') || 'من'} {filteredCustomers.length} {t('records') || 'سجلات'}
          </div>
          <div className="flex items-center gap-2">
             <Pagination 
               currentPage={currentPage}
               totalItems={filteredCustomers.length}
               itemsPerPage={entriesPerPage}
               onPageChange={setCurrentPage}
             />
          </div>
        </div>
      </div>

      <AddCustomerModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <EditCustomerModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        customer={selectedCustomer}
      />

      <AddDepositModal 
        isOpen={isDepositModalOpen} 
        onClose={() => setIsDepositModalOpen(false)} 
        customer={selectedCustomer}
      />

      <AddDiscountModal 
        isOpen={isDiscountModalOpen} 
        onClose={() => setIsDiscountModalOpen(false)} 
        customer={selectedCustomer}
      />

      <ViewPaymentsModal 
        isOpen={isPaymentsModalOpen} 
        onClose={() => setIsPaymentsModalOpen(false)} 
        customer={selectedCustomer}
      />

      {/* Action Menu Portal */}
      {createPortal(
        <AnimatePresence>
          {activeActionMenu !== null && (
            <>
              <div 
                className="fixed inset-0 z-[9998]" 
                onClick={() => setActiveActionMenu(null)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                style={{ 
                  position: 'absolute',
                  top: menuPosition.top + 4,
                  ...(direction === 'rtl' 
                    ? { right: Math.max(10, Math.min(window.innerWidth - (menuPosition.left + menuPosition.width), window.innerWidth - 220)) }
                    : { left: Math.max(10, Math.min(menuPosition.left, window.innerWidth - 220)) }
                  ),
                  minWidth: '200px'
                }}
                className="z-[9999] bg-white border border-gray-200 rounded-lg shadow-2xl py-2 text-right"
              >
                <button onClick={() => { setIsPaymentsModalOpen(true); setSelectedCustomer(customers.find(c => c.id === activeActionMenu)); setActiveActionMenu(null); }} className="w-full px-4 py-2 text-sm text-black hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium">
                  <History size={18} className="text-gray-400" />
                  <span className="flex-1 text-right">{t('deposits_list')}</span>
                </button>
                <button onClick={() => { setIsDepositModalOpen(true); setSelectedCustomer(customers.find(c => c.id === activeActionMenu)); setActiveActionMenu(null); }} className="w-full px-4 py-2 text-sm text-black hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium">
                  <PlusCircle size={18} className="text-gray-400" />
                  <span className="flex-1 text-right">{t('add_deposit')}</span>
                </button>
                <button onClick={() => { setIsPaymentsModalOpen(true); setSelectedCustomer(customers.find(c => c.id === activeActionMenu)); setActiveActionMenu(null); }} className="w-full px-4 py-2 text-sm text-black hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium">
                  <FileText size={18} className="text-gray-400" />
                  <span className="flex-1 text-right">{t('discounts_list')}</span>
                </button>
                <button onClick={() => { setIsDiscountModalOpen(true); setSelectedCustomer(customers.find(c => c.id === activeActionMenu)); setActiveActionMenu(null); }} className="w-full px-4 py-2 text-sm text-black hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium">
                  <Minus size={18} className="text-gray-400" />
                  <span className="flex-1 text-right">{t('add_discount')}</span>
                </button>
                <div className="h-px bg-gray-100 my-1 mx-2"></div>
                <button onClick={() => { setIsEditModalOpen(true); setSelectedCustomer(customers.find(c => c.id === activeActionMenu)); setActiveActionMenu(null); }} className="w-full px-4 py-2 text-sm text-black hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium">
                  <Edit2 size={18} className="text-gray-400" />
                  <span className="flex-1 text-right">{t('edit_customer')}</span>
                </button>
                <button 
                  onClick={() => {
                    if (activeActionMenu !== null) {
                      setCustomerToDelete(activeActionMenu);
                      setActiveActionMenu(null);
                    }
                  }}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                >
                  <Trash2 size={18} />
                  <span className="flex-1 text-right">{t('delete')}</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}
