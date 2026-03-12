import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Eye, 
  Edit2, 
  RotateCcw, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  Filter,
  Download,
  Printer,
  ChevronDown,
  Menu,
  LayoutGrid,
  List as ListIcon,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  DollarSign,
  FileCheck,
  Truck,
  FileSpreadsheet,
  Mail,
  MessageCircle,
  X,
  Copy,
  Info,
  Building,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

import { ResponsiveModal } from '../components/ResponsiveModal';
import Pagination from '../components/Pagination';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import MobileDataCard from '@/components/MobileDataCard';

interface SaleRecord {
  id: string;
  invoiceNo: string;
  date: string;
  refNo: string;
  cashier: string;
  customer: string;
  saleStatus: 'completed' | 'returned';
  grandTotal: number;
  paid: number;
  remaining: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentType: 'mada' | 'cash' | 'bank_transfer';
}

const mockSales: SaleRecord[] = [
  { id: '1', invoiceNo: '508', date: '23/02/2026 13:13:04', refNo: 'SALE/POS2026/02/0613', cashier: 'شركة اختبار', customer: 'عميل افتراضي', saleStatus: 'completed', grandTotal: 400.00, paid: 400.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '2', invoiceNo: '507', date: '23/02/2026 13:12:06', refNo: 'SALE/POS2026/02/0612', cashier: 'شركة اختبار', customer: 'عميل افتراضي', saleStatus: 'completed', grandTotal: 400.00, paid: 400.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '3', invoiceNo: '506', date: '23/02/2026 02:59:57', refNo: 'SALE/POS2026/02/0611', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'returned', grandTotal: -500.00, paid: -500.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '4', invoiceNo: '505', date: '23/02/2026 02:58:48', refNo: 'SALE/POS2026/02/0611', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 500.00, paid: 500.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '5', invoiceNo: '504', date: '16/02/2026 20:39:44', refNo: 'SALE/POS2026/02/0610', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 150.00, paid: 150.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '6', invoiceNo: '503', date: '16/02/2026 20:39:34', refNo: 'SALE/POS2026/02/0609', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 400.00, paid: 400.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '7', invoiceNo: '502', date: '16/02/2026 20:25:58', refNo: 'SALE/POS2026/02/0608', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 500.00, paid: 500.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '8', invoiceNo: '501', date: '16/02/2026 20:24:03', refNo: 'SALE/POS2026/02/0607', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 500.00, paid: 500.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '9', invoiceNo: '500', date: '16/02/2026 19:13:23', refNo: 'SALE/POS2026/02/0606', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 250.00, paid: 250.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '10', invoiceNo: '499', date: '12/02/2026 17:39:53', refNo: 'SALE/POS2026/02/0605', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 250.00, paid: 250.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
];

export default function POSInvoices() {
  const { t, direction, language } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCount, setShowCount] = useState(10);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [showTopMenu, setShowTopMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSimplifiedInvoice, setShowSimplifiedInvoice] = useState<SaleRecord | null>(null);
  const [showTaxInvoice, setShowTaxInvoice] = useState<SaleRecord | null>(null);
  const [showPaymentsModal, setShowPaymentsModal] = useState<SaleRecord | null>(null);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState<SaleRecord | null>(null);
  const [showWarehouseReceiptModal, setShowWarehouseReceiptModal] = useState<SaleRecord | null>(null);
  const [showClaimReceiptModal, setShowClaimReceiptModal] = useState<SaleRecord | null>(null);
  const [showAddDeliveryModal, setShowAddDeliveryModal] = useState<SaleRecord | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
  const [bondToDelete, setBondToDelete] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sales] = useState<SaleRecord[]>(mockSales);

  const [filters, setFilters] = useState({
    refNo: '',
    invoiceNo: '',
    customer: '',
    branch: '',
    fromDate: '',
    toDate: '',
    grandTotal: '',
    deliveryCompany: 'all',
  });

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.action-menu-container')) {
        setActiveActionMenu(null);
      }
      if (!target.closest('.top-menu-container')) {
        setShowTopMenu(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const paginatedSales = sales.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount
  );

  const totals = sales.reduce((acc, sale) => ({
    grandTotal: acc.grandTotal + sale.grandTotal,
    paid: acc.paid + sale.paid,
    remaining: acc.remaining + sale.remaining,
  }), { grandTotal: 0, paid: 0, remaining: 0 });

  const handleActionClick = (action: string, sale: SaleRecord) => {
    setActiveActionMenu(null);
    switch (action) {
      case 'simplified':
        setShowSimplifiedInvoice(sale);
        break;
      case 'tax':
        setShowTaxInvoice(sale);
        break;
      case 'details':
        navigate(`/sales/pos-invoices/${sale.id}`);
        break;
      case 'return':
        navigate(`/sales/pos-invoices/return/${sale.id}`);
        break;
      case 'view_payments':
        setShowPaymentsModal(sale);
        break;
      case 'add_payment':
        setShowAddPaymentModal(sale);
        break;
      case 'warehouse_receipt':
        setShowWarehouseReceiptModal(sale);
        break;
      case 'claim_receipt':
        setShowClaimReceiptModal(sale);
        break;
      case 'add_delivery':
        setShowAddDeliveryModal(sale);
        break;
      default:
        console.log(`Action ${action} clicked for sale ${sale.id}`);
    }
  };

  return (
    <div className="space-y-4" dir={direction}>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1 px-2">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('pos_quick')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('invoices_pos')}</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-primary">
              {t('invoices_pos')} ({t('all_branches')})
            </h1>
          </div>

          <div className="flex items-center gap-1">
            {/* Hamburger Menu */}
            <div className="relative top-menu-container">
              <button 
                onClick={() => setShowTopMenu(!showTopMenu)}
                className="p-2 bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Menu size={20} />
              </button>
              <AnimatePresence>
                {showTopMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      "absolute z-50 top-full mt-2 bg-white rounded-md shadow-xl border border-gray-100 min-w-[200px] overflow-hidden",
                      direction === 'rtl' ? "left-0" : "right-0"
                    )}
                  >
                    <button 
                      onClick={() => navigate('/sales/pos')}
                      className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 border-b border-gray-50 transition-colors"
                    >
                      <span className="font-bold text-gray-800">{t('new_sale')}</span>
                      <PlusCircle size={18} className="text-gray-600" />
                    </button>
                    <button className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 border-b border-gray-50 transition-colors">
                      <span className="text-gray-700">{t('download_excel')}</span>
                      <FileSpreadsheet size={18} className="text-green-600" />
                    </button>
                    <button className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 transition-colors">
                      <span className="text-gray-700">{t('download_pdf')}</span>
                      <FileText size={18} className="text-primary" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Arrow Toggle Filters */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-1.5 bg-white text-primary hover:bg-green-50 rounded border border-gray-200 w-9 h-9 flex items-center justify-center transition-colors"
            >
              {showFilters ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
            </button>
          </div>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
          
          <p className="text-sm text-primary mb-6 text-right font-medium">
            {t('sales_table_desc')}
          </p>

          {/* Filters Section */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary text-right">{t('ref_no')}</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary text-right">{t('invoice_no')}</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary text-right">{t('customer')}</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                      <option>{t('select_customer')}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary text-right">{t('branches')}</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                      <option>{t('all_branches')}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary text-right">{t('grand_total')}</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary text-right">{t('from_date')}</label>
                    <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary text-right">{t('to_date')}</label>
                    <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary text-right">{t('delivery_companies')}</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                      <option>{t('all')}</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-primary-hover transition-colors">
                      {t('complete_process')}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{t('show')}</span>
                  <select 
                    value={showCount}
                    onChange={(e) => setShowCount(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-primary bg-white"
                  >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                  </select>
              </div>
              <div className="relative w-full md:w-80 flex items-center gap-2">
                  <div className="relative flex-1">
                    <input 
                        type="text" 
                        placeholder={t('search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary text-right" 
                    />
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">{t('search')}</span>
              </div>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block overflow-x-auto pb-64">
              <table className="w-full min-w-[1200px] text-sm text-right border-collapse">
                  <thead>
                      <tr className="bg-primary text-white">
                          <th className="p-3 border border-primary-hover w-10 text-center">
                              <input type="checkbox" className="rounded border-gray-300" />
                          </th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">{t('invoice_no')}</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">{t('date')}</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">{t('ref_no')}</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">{t('cashier')}</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">{t('customer')}</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">{t('sale_status')}</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">{t('grand_total')}</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">{t('paid')}</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">{t('remaining_amount')}</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">{t('payment_status')}</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">{t('payment_type')}</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap w-24 text-center">{t('actions')}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {paginatedSales.map((sale) => (
                          <tr key={`desktop-${sale.id}`} className="bg-green-50/30 hover:bg-green-100/50 transition-colors border-b border-gray-200">
                              <td className="p-3 text-center border-x border-gray-200">
                                  <input type="checkbox" className="rounded border-gray-300" />
                              </td>
                              <td className="p-3 border-x border-gray-200 font-medium">{sale.invoiceNo}</td>
                              <td className="p-3 border-x border-gray-200 text-gray-600">{sale.date}</td>
                              <td className="p-3 border-x border-gray-200 text-gray-600">{sale.refNo}</td>
                              <td className="p-3 border-x border-gray-200">{sale.cashier}</td>
                              <td className="p-3 border-x border-gray-200">{sale.customer}</td>
                              <td className="p-3 border-x border-gray-200">
                                  <span className={cn(
                                      "px-2 py-1 rounded text-xs font-medium text-white",
                                      sale.saleStatus === 'completed' ? "bg-green-600" : "bg-red-500"
                                  )}>
                                      {sale.saleStatus === 'completed' ? t('completed') : t('returned')}
                                  </span>
                              </td>
                              <td className="p-3 border-x border-gray-200 font-bold">{(sale.grandTotal || 0).toFixed(2)}</td>
                              <td className="p-3 border-x border-gray-200">{(sale.paid || 0).toFixed(2)}</td>
                              <td className="p-3 border-x border-gray-200">{(sale.remaining || 0).toFixed(2)}</td>
                              <td className="p-3 border-x border-gray-200">
                                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                                      {t('paid')}
                                  </span>
                              </td>
                              <td className="p-3 border-x border-gray-200">
                                  {sale.paymentType === 'mada' && (
                                      <div className="flex items-center gap-1">
                                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Mada_Logo.svg/1200px-Mada_Logo.svg.png" alt="mada" className="h-4" />
                                          <span className="text-xs text-gray-500">{t('mada')}</span>
                                      </div>
                                  )}
                              </td>
                              <td className={cn("p-3 border-x border-gray-200 text-center relative action-menu-container", activeActionMenu === sale.id && "z-[60]")}>
                                  <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveActionMenu(activeActionMenu === sale.id ? null : sale.id);
                                    }}
                                    className="bg-primary text-white px-3 py-1 rounded text-xs flex items-center gap-1 mx-auto hover:bg-primary-hover transition-colors"
                                  >
                                      {t('actions')}
                                      <ChevronDown size={14} />
                                  </button>
                                  
                                  <AnimatePresence>
                                    {activeActionMenu === sale.id && (
                                        <motion.div 
                                          initial={{ opacity: 0, scale: 0.95 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 0.95 }}
                                          className={cn(
                                            "absolute top-full mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-xl z-50 py-1 text-right",
                                            direction === 'rtl' ? "left-0" : "right-0"
                                          )}
                                        >
                                            <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                                                {t('duplicate_sale')}
                                                <PlusCircle size={16} />
                                            </button>
                                            <button 
                                              onClick={() => handleActionClick('simplified', sale)}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                            >
                                                {t('view_invoice')}
                                                <FileText size={16} />
                                            </button>
                                            <button 
                                              onClick={() => handleActionClick('tax', sale)}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                            >
                                                {t('view_invoice')}
                                                <FileText size={16} />
                                            </button>
                                            <button 
                                              onClick={() => handleActionClick('details', sale)}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                            >
                                                {t('invoice_details')}
                                                <FileText size={16} />
                                            </button>
                                            <button 
                                              onClick={() => handleActionClick('return', sale)}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                            >
                                                {t('return_sale')}
                                                <RotateCcw size={16} />
                                            </button>
                                            <button 
                                              onClick={() => handleActionClick('view_payments', sale)}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                            >
                                                {t('view_payments')}
                                                <DollarSign size={16} />
                                            </button>
                                            <button 
                                              onClick={() => handleActionClick('add_payment', sale)}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                            >
                                                {t('add_payment')}
                                                <DollarSign size={16} />
                                            </button>
                                            <button 
                                              onClick={() => handleActionClick('warehouse_receipt', sale)}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                            >
                                                {t('store_bond')}
                                                <FileCheck size={16} />
                                            </button>
                                            <button 
                                              onClick={() => handleActionClick('claim_receipt', sale)}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                            >
                                                {t('claim_bond')}
                                                <Info size={16} />
                                            </button>
                                            <button 
                                              onClick={() => handleActionClick('add_delivery', sale)}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                            >
                                                {t('add_delivery')}
                                                <Truck size={16} />
                                            </button>
                                            <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                                                {t('download_pdf')}
                                                <Download size={16} />
                                            </button>
                                            <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                                                {t('send_email')}
                                                <Mail size={16} />
                                            </button>
                                            <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                                                {t('send_whatsapp')}
                                                <MessageCircle size={16} />
                                            </button>
                                            <button 
                                              onClick={() => setBondToDelete(sale.id)}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                            >
                                                {t('release_bond')}
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                                                {t('edit_delegate')}
                                                <Edit2 size={16} />
                                            </button>
                                        </motion.div>
                                    )}
                                  </AnimatePresence>

                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4 mb-6">
            {paginatedSales.map((sale) => (
              <MobileDataCard
                key={`mobile-${sale.id}`}
                title={`${t('invoice_no')}: ${sale.invoiceNo}`}
                subtitle={sale.date}
                fields={[
                  { label: t('ref_no'), value: sale.refNo },
                  { label: t('customer'), value: sale.customer },
                  { label: t('grand_total'), value: (sale.grandTotal || 0).toFixed(2), isBold: true },
                  { label: t('paid'), value: (sale.paid || 0).toFixed(2) },
                  { 
                    label: t('payment_status'), 
                    value: (
                      <span className="bg-green-600 text-white px-2 py-0.5 rounded text-[10px] font-medium">
                        {t('paid')}
                      </span>
                    )
                  },
                ]}
                actions={
                  <div className="flex flex-wrap justify-end gap-2">
                    <button 
                      onClick={() => handleActionClick('simplified', sale)}
                      className="p-2 text-primary hover:bg-primary/5 rounded-lg border border-primary/10 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Eye size={16} />
                      {t('view')}
                    </button>
                    <button 
                      onClick={() => handleActionClick('add_payment', sale)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg border border-green-100 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <DollarSign size={16} />
                      {t('pay')}
                    </button>
                    <button 
                      onClick={() => handleActionClick('details', sale)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <FileText size={16} />
                      {t('details')}
                    </button>
                  </div>
                }
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalItems={sales.length}
            itemsPerPage={showCount}
            onPageChange={setCurrentPage}
          />

      </div>
      {/* Modals */}
      <ResponsiveModal 
        isOpen={!!showSimplifiedInvoice} 
        onClose={() => setShowSimplifiedInvoice(null)}
        headerActions={
          <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
            <Printer size={14} /> {t('print')}
          </button>
        }
        maxWidth="max-w-md"
      >
        {showSimplifiedInvoice && (
          <div className="p-6 text-center space-y-4 font-mono text-sm" dir={direction}>
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                <Building size={40} className="text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-1">
              <h2 className="font-bold text-lg">شركة اختبار</h2>
              <p>الرياض - الملقا - سعود بن فيصل</p>
              <p className="font-bold">{t('sales_invoice')}</p>
            </div>

            <div className="text-right space-y-1 border-t border-dashed pt-2">
              <p>{t('invoice_no')}: {showSimplifiedInvoice.invoiceNo}</p>
              <p>{t('date')}: {showSimplifiedInvoice.date}</p>
              <p>{t('customer')}: {showSimplifiedInvoice.customer}</p>
            </div>

            <table className="w-full text-right border-t border-b border-dashed py-2">
              <thead>
                <tr className="border-b border-dashed">
                  <th className="py-1">{t('product_description')}</th>
                  <th className="py-1">{t('quantity')}</th>
                  <th className="py-1">{t('price')}</th>
                  <th className="py-1">{t('total')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1">عباية كريب مع اكمام مموجه</td>
                  <td className="py-1">1.00</td>
                  <td className="py-1">250.00</td>
                  <td className="py-1">250.00</td>
                </tr>
                <tr>
                  <td className="py-1">صنف جديد</td>
                  <td className="py-1">1.00</td>
                  <td className="py-1">150.00</td>
                  <td className="py-1">150.00</td>
                </tr>
              </tbody>
            </table>

            <div className="space-y-1 text-right">
              <div className="flex justify-between font-bold">
                <span>{t('grand_total')}</span>
                <span>{(showSimplifiedInvoice.grandTotal || 0).toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500">أربعمائة ريال سعودي فقط لا غير</p>
            </div>

            <div className="flex justify-between border-t border-dashed pt-2">
              <span>{t('payment_type')}: {t('network')}</span>
              <div className="space-x-4 space-x-reverse">
                <span>{t('paid')}: {(showSimplifiedInvoice.paid || 0).toFixed(2)}</span>
                <span>{t('remaining')}: {(showSimplifiedInvoice.remaining || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-gray-500">
              <p>{t('thank_you')}</p>
              <p>{t('see_you_again')}</p>
              <p>{t('return_policy')}</p>
              <p>{t('bring_invoice')}</p>
            </div>

            <div className="flex justify-center pt-4">
              <div className="w-24 h-24 bg-white border border-gray-200 p-1">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://deqaksa.com/demo/admin/pos/view/507" 
                  alt="QR Code" 
                  className="w-full h-full"
                />
              </div>
            </div>

            <p className="text-[10px] text-gray-400 mb-8">Powered By: www.deqatech.com</p>
          </div>
        )}
      </ResponsiveModal>

      <ResponsiveModal 
        isOpen={!!showTaxInvoice} 
        onClose={() => setShowTaxInvoice(null)}
        headerActions={
          <button className="bg-white border border-gray-200 p-1.5 rounded-md text-gray-600 hover:bg-gray-50 shadow-sm transition-colors">
            <Printer size={18} />
          </button>
        }
        maxWidth="max-w-4xl"
      >
        {showTaxInvoice && (
          <div className="p-8 space-y-6 text-right" dir={direction}>
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-primary">شركة اختبار</h2>
                <p className="text-sm text-gray-600">الرياض - الملقا - سعود بن فيصل</p>
                <p className="text-sm text-gray-600">الرمز البريدي: 13251 - رقم المبنى : 4152 - 6542</p>
                <p className="text-sm text-gray-600">{t('commercial_register')}: 1234123123</p>
                <p className="text-sm text-gray-600">{t('phone')}: 0146580073</p>
              </div>
              <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                <Building size={48} className="text-gray-300" />
              </div>
            </div>

            <div className="bg-primary text-white py-2 px-4 rounded-md text-center font-bold text-lg">
              {t('sales_invoice')}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-4 border border-gray-200 rounded-lg overflow-hidden text-xs">
              <div className="bg-gray-50 p-2 border-l border-b border-gray-200 font-bold">{t('invoice_no')}</div>
              <div className="bg-gray-50 p-2 border-l border-b border-gray-200 font-bold">{t('ref_no')}</div>
              <div className="bg-gray-50 p-2 border-l border-b border-gray-200 font-bold">{t('invoice_date')}</div>
              <div className="bg-gray-50 p-2 border-b border-gray-200 font-bold">{t('invoice_type')}</div>
              
              <div className="p-2 border-l border-gray-200">{showTaxInvoice.invoiceNo}</div>
              <div className="p-2 border-l border-gray-200">{showTaxInvoice.refNo}</div>
              <div className="p-2 border-l border-gray-200">{showTaxInvoice.date}</div>
              <div className="p-2">{t('invoice')} {t('network')}</div>
            </div>

            {/* Customer Data */}
            <div className="space-y-2">
              <div className="bg-gray-100 p-1 text-center font-bold text-sm rounded">{t('customer_details')}</div>
              <div className="grid grid-cols-8 border border-gray-200 rounded-lg overflow-hidden text-[10px] text-center">
                <div className="bg-gray-50 p-1 border-l border-gray-200 font-bold">{t('customer_no')}</div>
                <div className="bg-gray-50 p-1 border-l border-gray-200 font-bold">{t('customer_name')}</div>
                <div className="bg-gray-50 p-1 border-l border-gray-200 font-bold">{t('customer_tax_no')}</div>
                <div className="bg-gray-50 p-1 border-l border-gray-200 font-bold">{t('mobile_no')}</div>
                <div className="bg-gray-50 p-1 border-l border-gray-200 font-bold">{t('city')}</div>
                <div className="bg-gray-50 p-1 border-l border-gray-200 font-bold">{t('district')}</div>
                <div className="bg-gray-50 p-1 border-l border-gray-200 font-bold">{t('street_name')}</div>
                <div className="bg-gray-50 p-1 font-bold">{t('tax_no')}</div>

                <div className="p-1 border-l border-t border-gray-200">1</div>
                <div className="p-1 border-l border-t border-gray-200">{showTaxInvoice.customer}</div>
                <div className="p-1 border-l border-t border-gray-200">-</div>
                <div className="p-1 border-l border-t border-gray-200">00</div>
                <div className="p-1 border-l border-t border-gray-200">Riyadh</div>
                <div className="p-1 border-l border-t border-gray-200">Riyadh</div>
                <div className="p-1 border-l border-t border-gray-200">KSA</div>
                <div className="p-1 border-t border-gray-200">13248</div>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-xs text-center border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border border-gray-200">{t('item_no')}</th>
                  <th className="p-2 border border-gray-200">{t('product_description')}</th>
                  <th className="p-2 border border-gray-200">{t('quantity')}</th>
                  <th className="p-2 border border-gray-200">{t('unit_price')}</th>
                  <th className="p-2 border border-gray-200">{t('total')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-gray-200">1</td>
                  <td className="p-2 border border-gray-200">6666 - صنف جديد</td>
                  <td className="p-2 border border-gray-200">1.00</td>
                  <td className="p-2 border border-gray-200">150.00</td>
                  <td className="p-2 border border-gray-200">150.00</td>
                </tr>
                <tr>
                  <td className="p-2 border border-gray-200">2</td>
                  <td className="p-2 border border-gray-200">60990980 - عباية كريب مع اكمام مموجه</td>
                  <td className="p-2 border border-gray-200">1.00</td>
                  <td className="p-2 border border-gray-200">250.00</td>
                  <td className="p-2 border border-gray-200">250.00</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between items-start pt-4">
              <div className="space-y-1 text-xs">
                <p>{t('payment_type')}: {t('network')}</p>
                <p className="font-bold">{t('paid')} : {(showTaxInvoice.paid || 0).toFixed(2)}</p>
                <p className="text-primary">{t('remaining')} : {(showTaxInvoice.remaining || 0).toFixed(2)}</p>
              </div>
              <div className="text-left space-y-1 text-xs text-gray-500">
                <p>{t('thank_you')}</p>
                <p>{t('see_you_again')}</p>
                <p>{t('return_policy')}</p>
                <p>{t('bring_invoice')}</p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-primary rounded-lg overflow-hidden flex text-white text-sm font-bold mb-8">
              <button className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-primary-hover border-l border-white/20 transition-colors">
                <DollarSign size={18} /> {t('pay')}
              </button>
              <button className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-primary-hover border-l border-white/20 transition-colors">
                <Truck size={18} /> {t('delivery')}
              </button>
              <button className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-primary-hover border-l border-white/20 transition-colors">
                <Mail size={18} /> {t('email')}
              </button>
              <button className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors">
                <Download size={18} /> PDF
              </button>
            </div>
          </div>
        )}
      </ResponsiveModal>
      <ResponsiveModal 
        isOpen={!!showPaymentsModal} 
        onClose={() => setShowPaymentsModal(null)}
        title={showPaymentsModal && t('view_payments_ref').replace('{ref}', showPaymentsModal.refNo)}
        maxWidth="max-w-4xl"
      >
        {showPaymentsModal && (
          <div className="p-6" dir={direction}>
            <table className="w-full text-sm text-center border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-3 border border-primary-hover">{t('date')}</th>
                  <th className="p-3 border border-primary-hover">{t('ref_no')}</th>
                  <th className="p-3 border border-primary-hover">{t('paid')}</th>
                  <th className="p-3 border border-primary-hover">{t('payment_type')}</th>
                  <th className="p-3 border border-primary-hover">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3">13:13:04 23/02/2026</td>
                  <td className="p-3">IPAY2026/02/0622</td>
                  <td className="p-3 font-bold">400.00</td>
                  <td className="p-3">{t('network')}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <button 
                        onClick={() => setPaymentToDelete('IPAY2026/02/0622')}
                        className="hover:text-primary transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button className="hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                      <button className="hover:text-blue-600 transition-colors"><Mail size={16} /></button>
                      <button className="hover:text-primary transition-colors"><FileText size={16} /></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </ResponsiveModal>

      <ResponsiveModal 
        isOpen={!!showAddPaymentModal} 
        onClose={() => setShowAddPaymentModal(null)}
        title={t('add_payment')}
        maxWidth="max-w-2xl"
      >
        {showAddPaymentModal && (
          <div className="p-6 space-y-6" dir={direction}>
            <p className="text-sm text-primary font-medium">{t('please_enter_info_below')}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-bold text-primary">{t('date')} *</label>
                <input type="text" defaultValue="06:13:00 24/02/2026" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-bold text-primary">{t('ref_no')} *</label>
                <input type="text" defaultValue="IPAY2026/02/0623" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-bold text-primary">{t('paid')} *</label>
                <input type="number" defaultValue="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-bold text-primary">{t('payment_type')} *</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                  <option>{t('network')}</option>
                  <option>{t('cash')}</option>
                  <option>{t('bank_transfer')}</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-primary">{t('attachments')}</label>
              <div className="flex gap-2">
                <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" readOnly />
                <button className="bg-primary text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-primary-hover transition-colors">
                  <Download size={16} /> {t('browse')}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-bold text-primary">{t('note')}</label>
              <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary h-32"></textarea>
            </div>

            <button className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors mb-8">
              {t('add_payment')}
            </button>
          </div>
        )}
      </ResponsiveModal>

      <ResponsiveModal 
        isOpen={!!showWarehouseReceiptModal} 
        onClose={() => setShowWarehouseReceiptModal(null)}
        title={t('store_bond')}
        headerActions={
          <button className="bg-white border border-gray-200 px-3 py-1 rounded text-xs flex items-center gap-1 text-gray-600 hover:bg-gray-50 transition-colors">
            <Printer size={14} /> {t('print')}
          </button>
        }
        maxWidth="max-w-4xl"
      >
        {showWarehouseReceiptModal && (
          <div className="p-8 space-y-6 text-right" dir={direction}>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-2">
              <p className="text-sm font-bold">{t('cashier')}: شركة اختبار</p>
              <p className="text-sm font-bold">{t('ref_no')}: {showWarehouseReceiptModal.refNo}</p>
              <p className="text-sm font-bold">{t('branch')}: شركة دقة الحلول (WHI)</p>
            </div>

            <table className="w-full text-sm text-center border-collapse mb-8">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-3 border border-primary-hover">{t('name')}</th>
                  <th className="p-3 border border-primary-hover">{t('quantity')}</th>
                  <th className="p-3 border border-primary-hover">{t('shelf')}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="p-3">6666 - صنف جديد</td>
                  <td className="p-3">1.00 003</td>
                  <td className="p-3">-</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-3">60990980 - عباية كريب مع اكمام مموجه</td>
                  <td className="p-3">1.00 003</td>
                  <td className="p-3">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </ResponsiveModal>

      <ResponsiveModal 
        isOpen={!!showClaimReceiptModal} 
        onClose={() => setShowClaimReceiptModal(null)}
        title={t('financial_claim_letter')}
        headerActions={
          <button className="bg-white border border-gray-200 px-3 py-1 rounded text-xs flex items-center gap-1 text-gray-600 hover:bg-gray-50 transition-colors">
            <Printer size={14} /> {t('print')}
          </button>
        }
        maxWidth="max-w-4xl"
      >
        {showClaimReceiptModal && (
          <div className="p-12 space-y-8 text-right" dir={direction}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-xl font-bold">شركة اختبار</h2>
                <p className="text-sm text-gray-600">الرياض - الملقا - سعود بن فيصل</p>
                <p className="text-sm text-gray-600">{t('commercial_register')}: 1234123123</p>
                <p className="text-sm text-gray-600">{t('phone')}: 0146580073</p>
                <p className="text-sm text-gray-600">رخصة البلدية: 50608090</p>
              </div>
              <div className="w-32 h-32 flex items-center justify-center">
                <LayoutGrid size={80} className="text-gray-200" />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="bg-gray-300 px-12 py-3 rounded-xl font-bold text-2xl shadow-inner">
                {t('financial_claim_letter')}
              </div>
            </div>

            <div className="space-y-6 text-lg leading-relaxed pt-8">
              <p className="font-bold">{t('date')}: 24 فبراير 2026</p>
              
              <div className="space-y-2">
                <p><span className="font-bold">{t('sender')} :</span> شركة اختبار</p>
                <p><span className="font-bold">{t('recipient')} :</span> {t('walk_in_customer')}</p>
                <p><span className="font-bold">{t('subject')} :</span> مطالبة مالية بسداد مبلغ معين</p>
              </div>

              <p>السادة عميل افتراضي تحية طيبة</p>

              <p>
                نود تذكيركم بأن الفاتورة رقم 508 الصادرة بتاريخ 23/02/2026م والمتعلقة 
                بقيمة 400.00 ريال (أربعمائة ريال) كان من المفترض سدادها بحلول __________ وحتى تاريخ هذا الخطاب لم يتم استلام مبلغ الفاتورة.
              </p>

              <p>
                لذلك نرجو منكم تسديد المبلغ المستحق خلال 7 أيام من تاريخه، وذلك عبر الحساب البنكي المرفق في الفاتورة.
              </p>

              <p>
                في حال عدم السداد خلال المهلة المحددة سنضطر آسفين لاتخاذ الإجراءات القانونية اللازمة لتحصيل المستحقات.
              </p>

              <p className="text-center font-bold pt-4">وتفضلو بقبول فائق الاحترام.</p>
            </div>

            <div className="flex justify-between pt-20 mb-8">
              <div className="w-64 border-t border-gray-400 pt-2 text-center font-bold">ختم الشركة</div>
              <div className="w-64 border-t border-gray-400 pt-2 text-center font-bold"></div>
            </div>
          </div>
        )}
      </ResponsiveModal>

      <ResponsiveModal 
        isOpen={!!showAddDeliveryModal} 
        onClose={() => setShowAddDeliveryModal(null)}
        title={t('edit_delivery')}
        maxWidth="max-w-4xl"
      >
        {showAddDeliveryModal && (
          <div className="p-6 space-y-6" dir={direction}>
                  <p className="text-sm text-[#8b0000] font-medium">{t('please_enter_info_below')}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-primary">{t('date')} *</label>
                        <input type="text" defaultValue="03:44:00 24/02/2026" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-primary">{t('delivery_ref_no')} *</label>
                        <input type="text" defaultValue="DO2026/02/0004" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-primary">{t('sale_ref_no')} *</label>
                        <input type="text" defaultValue={showAddDeliveryModal.refNo} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-primary">{t('customer')} *</label>
                        <input type="text" defaultValue={showAddDeliveryModal.customer} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-primary">{t('address')} *</label>
                        <div className="border border-gray-300 rounded p-3 text-sm min-h-[100px] bg-gray-50">
                          <p className="font-bold">KSA Riyadh Riyadh 13248 SA</p>
                          <p>{t('phone')} : 00 Email: info@posit.sa</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-primary">{t('status')} *</label>
                        <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                          <option>{t('in_progress')}</option>
                          <option>{t('delivered')}</option>
                          <option>{t('delivery_failed')}</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-primary">{t('delivered_by')}</label>
                        <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-primary">{t('received_by')}</label>
                        <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-primary">{t('attachments')}</label>
                        <div className="flex gap-2">
                          <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" readOnly />
                          <button className="bg-primary text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-primary-hover transition-colors">
                            <Download size={16} /> {t('browse')}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-primary">{t('note')}</label>
                        <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary h-32"></textarea>
                      </div>
                    </div>
                  </div>

            <button className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors mb-8">
              {t('edit_delivery')}
            </button>
          </div>
        )}
      </ResponsiveModal>
      <DeleteConfirmationModal
        isOpen={paymentToDelete !== null}
        onClose={() => setPaymentToDelete(null)}
        onConfirm={() => {
          // In a real app, we'd delete the payment
          setPaymentToDelete(null);
        }}
        itemName={language === 'ar' ? 'هذا الدفع' : 'this payment'}
      />

      <DeleteConfirmationModal
        isOpen={bondToDelete !== null}
        onClose={() => setBondToDelete(null)}
        onConfirm={() => {
          // In a real app, we'd delete the bond
          setBondToDelete(null);
          setActiveActionMenu(null);
        }}
        itemName={language === 'ar' ? 'هذا السند' : 'this bond'}
      />
    </div>
  );
}
