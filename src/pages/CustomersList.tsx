import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  User,
  Edit2,
  Trash2,
  UserPlus,
  FileText,
  Minus,
  PlusCircle,
  ChevronDown,
  History,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Pagination from '@/components/Pagination';
import Toast from '@/components/Toast';
import Confirm from '@/components/Confirm';

import { useLanguage } from '@/context/LanguageContext';
import { useCustomers } from '@/context/CustomersContext';

import AddCustomerModal from '@/components/AddCustomerModal';
import EditCustomerModal from '@/components/modals/EditCustomerModal';
import AddDepositModal from '@/components/modals/AddDepositModal';
import AddDiscountModal from '@/components/modals/AddDiscountModal';
import ViewPaymentsModal from '@/components/modals/ViewPaymentsModal';

export default function CustomersList() {
  const { t, direction } = useLanguage();
  const isRTL = direction === 'rtl';

  const { customers, deleteCustomer, loading } = useCustomers();

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

  const [paymentType, setPaymentType] = useState<'deposit' | 'discount'>('deposit');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // ✅ delete like suppliers (Confirm + Toast)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
  };

  // ✅ helpers to unify API fields
  const getName = (c: any) => String(c?.customerName ?? c?.name ?? '');
  const getCode = (c: any) => String(c?.customerCode ?? c?.code ?? '');
  const getEmail = (c: any) => String(c?.email ?? '');
  const getPhone = (c: any) => String(c?.phone ?? c?.mobile ?? '');
  const getTax = (c: any) => String(c?.taxNumber ?? '');

  const filteredCustomers = useMemo(() => {
    const s = searchTerm.trim().toLowerCase();
    if (!s) return customers;
    return customers.filter((c: any) => {
      const hay = `${getName(c)} ${getEmail(c)} ${getPhone(c)} ${getCode(c)} ${getTax(c)}`.toLowerCase();
      return hay.includes(s);
    });
  }, [customers, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, entriesPerPage]);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return filteredCustomers.slice(start, start + entriesPerPage);
  }, [filteredCustomers, currentPage, entriesPerPage]);

  const startIndex = filteredCustomers.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1;
  const endIndex = Math.min(currentPage * entriesPerPage, filteredCustomers.length);

  const toggleSelectAll = () => {
    if (selectedCustomers.length === paginatedCustomers.length) setSelectedCustomers([]);
    else setSelectedCustomers(paginatedCustomers.map((c: any) => c.id));
  };

  const toggleSelectCustomer = (id: number) => {
    setSelectedCustomers((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const openEdit = (id: number) => {
    const c = customers.find((x: any) => x.id === id) || null;
    setSelectedCustomer(c);
    setIsEditModalOpen(true);
  };

  const openPayments = (id: number, type: 'deposit' | 'discount') => {
    const c = customers.find((x: any) => x.id === id) || null;
    setSelectedCustomer(c);
    setPaymentType(type);
    setIsPaymentsModalOpen(true);
  };

  const openDeposit = (id: number) => {
    const c = customers.find((x: any) => x.id === id) || null;
    setSelectedCustomer(c);
    setIsDepositModalOpen(true);
  };

  const openDiscount = (id: number) => {
    const c = customers.find((x: any) => x.id === id) || null;
    setSelectedCustomer(c);
    setIsDiscountModalOpen(true);
  };

  // =============================
  // ✅ Action menu positioning FIX
  // =============================
  const actionButtonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  const repositionMenu = (id: number) => {
    const el = actionButtonRefs.current[id];
    if (!el) return;
    const rect = el.getBoundingClientRect(); // viewport coords
    setMenuPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (activeActionMenu !== null) repositionMenu(activeActionMenu);
  }, [activeActionMenu]);

  useEffect(() => {
    const onScrollOrResize = () => {
      if (activeActionMenu !== null) repositionMenu(activeActionMenu);
    };
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [activeActionMenu]);

  // =============================
  // ✅ Delete flow (like suppliers)
  // =============================
  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const performDelete = async () => {
    if (confirmDeleteId === null) return;

    const id = confirmDeleteId;
    setConfirmDeleteId(null);

    const result = await deleteCustomer(id);

    if (result.ok) {
      // ✅ translated toast (Arabic in RTL, English in LTR)
      const msgFromT = t('customer_deleted_successfully');
      const msg =
        msgFromT && msgFromT !== 'customer_deleted_successfully'
          ? msgFromT
          : isRTL
            ? 'تم حذف العميل بنجاح'
            : 'Customer deleted successfully';

      showToast('success', msg);
    } else {
      const msgFromT = t('operation_failed');
      const fallback = isRTL ? 'فشلت العملية' : 'Operation failed';
      showToast('error', result.message || (msgFromT && msgFromT !== 'operation_failed' ? msgFromT : fallback));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4" dir={direction}>
      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2 text-[#007e4a]">
          <User size={20} />
          <h1 className="text-lg font-bold">{t('customers') || (isRTL ? 'العملاء' : 'Customers')}</h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-[#2ecc71] text-white rounded-md hover:bg-[#27ae60] transition-colors flex items-center gap-2 text-sm font-bold shadow-sm"
        >
          <UserPlus size={18} />
          <span>{t('add_customer') || (isRTL ? 'إضافة عميل' : 'Add Customer')}</span>
        </button>
      </div>

      <div className="text-sm text-gray-500 mb-2">
        {t('customers_table_desc') || (isRTL ? 'الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.' : 'Use the table below to navigate or filter results.')}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-visible">
        {/* Controls */}
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-50">
          <div className="flex items-center gap-2 order-2 md:order-1">
            <span className="text-sm text-gray-600">{t('show') || (isRTL ? 'إظهار' : 'Show')}</span>
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
            <span className="text-sm text-gray-600">{t('records') || (isRTL ? 'سجلات' : 'records')}</span>
          </div>

          <div className="flex items-center gap-2 order-1 md:order-2 w-full md:w-auto">
            <span className="text-sm text-gray-600 whitespace-nowrap">{t('search') || (isRTL ? 'بحث' : 'Search')}</span>
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

        {/* Table */}
        <div className="overflow-x-auto">
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

                <th className="p-3 border-l border-white/10 font-bold">{t('code') || (isRTL ? 'كود' : 'Code')}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('name') || (isRTL ? 'اسم' : 'Name')}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('email_address') || (isRTL ? 'عنوان البريد الإلكتروني' : 'Email')}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('phone') || (isRTL ? 'هاتف' : 'Phone')}</th>

                <th className="p-3 border-l border-white/10 font-bold">{t('pricing_group') || (isRTL ? 'مجموعة التسعيرة' : 'Pricing Group')}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('customer_group') || (isRTL ? 'مجموعة العملاء' : 'Customer Group')}</th>

                <th className="p-3 border-l border-white/10 font-bold">{t('tax_number') || (isRTL ? 'الرقم الضريبي' : 'Tax Number')}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('actual_balance') || (isRTL ? 'الرصيد الفعلي' : 'Balance')}</th>
                <th className="p-3 border-l border-white/10 font-bold">{t('total_points') || (isRTL ? 'إجمالي النقاط المكتسبة' : 'Total Points')}</th>

                <th className="p-3 font-bold text-center">{t('actions') || (isRTL ? 'الإجراءات' : 'Actions')}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-gray-400 italic bg-gray-50">
                    {isRTL ? 'جاري تحميل البيانات...' : 'Loading...'}
                  </td>
                </tr>
              ) : paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-gray-400 italic bg-gray-50">
                    {t('no_data_in_table') || (isRTL ? 'لا توجد بيانات في الجدول' : 'No data')}
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer: any) => (
                  <tr key={customer.id} className={cn('hover:bg-gray-50 transition-colors group')}>
                    <td className="p-3 border-l border-gray-100 text-center">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => toggleSelectCustomer(customer.id)}
                        className="w-4 h-4 accent-[#2ecc71]"
                      />
                    </td>

                    <td className="p-3 border-l border-gray-100">{getCode(customer)}</td>
                    <td className="p-3 border-l border-gray-100 font-medium">{getName(customer)}</td>
                    <td className="p-3 border-l border-gray-100 text-blue-600">{getEmail(customer) || '-'}</td>
                    <td className="p-3 border-l border-gray-100">{getPhone(customer) || '-'}</td>

                    <td className="p-3 border-l border-gray-100">{customer.pricingGroup ?? (isRTL ? 'عام' : 'General')}</td>
                    <td className="p-3 border-l border-gray-100">{customer.customerGroup ?? (isRTL ? 'عام' : 'General')}</td>

                    <td className="p-3 border-l border-gray-100">{getTax(customer) || '-'}</td>
                    <td className="p-3 border-l border-gray-100 font-bold">{Number(customer.actualBalance ?? 0).toFixed(2)}</td>
                    <td className="p-3 border-l border-gray-100 font-bold">{Number(customer.totalPoints ?? 0).toFixed(2)}</td>

                    <td className="p-3 text-center">
                      <button
                        ref={(el) => (actionButtonRefs.current[customer.id] = el)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionMenu((prev) => (prev === customer.id ? null : customer.id));
                        }}
                        className="bg-[#2ecc71] text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-1 mx-auto hover:bg-[#27ae60] transition-colors font-bold shadow-sm"
                      >
                        <ChevronDown size={14} className={cn('transition-transform', activeActionMenu === customer.id && 'rotate-180')} />
                        <span>{t('actions') || (isRTL ? 'الإجراءات' : 'Actions')}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-gray-50 bg-gray-50/50">
          <div className="text-sm text-gray-500">
            {t('showing_records') || (isRTL ? 'عرض' : 'Showing')} {startIndex} {t('to') || (isRTL ? 'إلى' : 'to')}{' '}
            {endIndex} {t('of') || (isRTL ? 'من' : 'of')} {filteredCustomers.length} {t('records') || (isRTL ? 'سجلات' : 'records')}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredCustomers.length}
            itemsPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Modals */}
      <AddCustomerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <EditCustomerModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} customer={selectedCustomer} />

      <AddDepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} customer={selectedCustomer} />
      <AddDiscountModal isOpen={isDiscountModalOpen} onClose={() => setIsDiscountModalOpen(false)} customer={selectedCustomer} />
      <ViewPaymentsModal isOpen={isPaymentsModalOpen} onClose={() => setIsPaymentsModalOpen(false)} customer={selectedCustomer} type={paymentType} />

      {/* Confirm delete (like suppliers) */}
      <Confirm
        isOpen={confirmDeleteId !== null}
        title={t('confirm_delete') || (isRTL ? 'تأكيد الحذف' : 'Confirm Delete')}
        message={t('confirm_delete_customer') || (isRTL ? 'هل تريد حذف هذا العميل؟' : 'Do you want to delete this customer?')}
        confirmLabel={t('delete') || (isRTL ? 'حذف' : 'Delete')}
        cancelLabel={t('cancel') || (isRTL ? 'إلغاء' : 'Cancel')}
        onConfirm={performDelete}
        onClose={() => setConfirmDeleteId(null)}
      />

      {toastOpen && <Toast isOpen={toastOpen} message={toastMsg} type={toastType} onClose={() => setToastOpen(false)} />}

      {/* Action Menu Portal (fixed positioning) */}
      {createPortal(
        <AnimatePresence>
          {activeActionMenu !== null && (
            <>
              <div className="fixed inset-0 z-[9998]" onClick={() => setActiveActionMenu(null)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                style={{
                  position: 'fixed', // ✅ FIXED (not absolute)
                  top: menuPos.top,
                  left: isRTL ? undefined : Math.min(menuPos.left, window.innerWidth - 240),
                  right: isRTL ? Math.min(window.innerWidth - (menuPos.left + menuPos.width), window.innerWidth - 240) : undefined,
                  minWidth: 220,
                }}
                className="z-[9999] bg-white border border-gray-200 rounded-lg shadow-2xl py-2 text-right"
              >
                <button
                  onClick={() => {
                    openPayments(activeActionMenu, 'deposit');
                    setActiveActionMenu(null);
                  }}
                  className="w-full px-4 py-2 text-sm text-black hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
                >
                  <History size={18} className="text-gray-400" />
                  <span className="flex-1 text-right">{t('deposits_list') || (isRTL ? 'قائمة الإيداعات' : 'Deposits')}</span>
                </button>

                <button
                  onClick={() => {
                    openDeposit(activeActionMenu);
                    setActiveActionMenu(null);
                  }}
                  className="w-full px-4 py-2 text-sm text-black hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
                >
                  <PlusCircle size={18} className="text-gray-400" />
                  <span className="flex-1 text-right">{t('add_deposit') || (isRTL ? 'إضافة إيداع' : 'Add Deposit')}</span>
                </button>

                <button
                  onClick={() => {
                    openPayments(activeActionMenu, 'discount');
                    setActiveActionMenu(null);
                  }}
                  className="w-full px-4 py-2 text-sm text-black hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
                >
                  <FileText size={18} className="text-gray-400" />
                  <span className="flex-1 text-right">{t('discounts_list') || (isRTL ? 'قائمة الخصومات' : 'Discounts')}</span>
                </button>

                <button
                  onClick={() => {
                    openDiscount(activeActionMenu);
                    setActiveActionMenu(null);
                  }}
                  className="w-full px-4 py-2 text-sm text-black hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
                >
                  <Minus size={18} className="text-gray-400" />
                  <span className="flex-1 text-right">{t('add_discount') || (isRTL ? 'إضافة خصم' : 'Add Discount')}</span>
                </button>

                <div className="h-px bg-gray-100 my-1 mx-2" />

                <button
                  onClick={() => {
                    openEdit(activeActionMenu);
                    setActiveActionMenu(null);
                  }}
                  className="w-full px-4 py-2 text-sm text-black hover:bg-gray-50 flex items-center gap-3 transition-colors font-medium"
                >
                  <Edit2 size={18} className="text-gray-400" />
                  <span className="flex-1 text-right">{t('edit_customer') || (isRTL ? 'تعديل العميل' : 'Edit Customer')}</span>
                </button>

                <button
                  onClick={() => {
                    handleDelete(activeActionMenu);
                    setActiveActionMenu(null);
                  }}
                  className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                >
                  <Trash2 size={18} />
                  <span className="flex-1 text-right">{t('delete') || (isRTL ? 'حذف' : 'Delete')}</span>
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