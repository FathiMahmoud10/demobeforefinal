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
  const { t, direction } = useLanguage();
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
        <span>{t('pos')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('simplified_tax_invoices')}</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-primary">
              {t('simplified_tax_invoices')} ({t('all_branches')})
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
                      direction === 'rtl' ? "right-0" : "left-0"
                    )}
                  >
                    <button 
                      onClick={() => navigate('/sales/pos')}
                      className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 border-b border-gray-50 transition-colors"
                    >
                      <span className="font-bold text-gray-800">{t('new_sale_process')}</span>
                      <PlusCircle size={18} className="text-gray-600" />
                    </button>
                    <button className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 border-b border-gray-50 transition-colors">
                      <span className="text-gray-700">{t('export_excel')}</span>
                      <FileSpreadsheet size={18} className="text-green-600" />
                    </button>
                    <button className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 transition-colors">
                      <span className="text-gray-700">{t('export_pdf')}</span>
                      <FileText size={18} className="text-red-600" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Arrow Toggle Filters */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-1.5 bg-white text-primary hover:bg-red-50 rounded border border-gray-200 w-9 h-9 flex items-center justify-center transition-colors"
            >
              {showFilters ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
            </button>
          </div>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
          
          <p className="text-sm text-primary mb-6 text-right font-medium">
            {t('data_last_30_days')}
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
                    <label className="block text-sm font-bold text-primary text-right">{t('reference_no')}</label>
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

          {/* Table */}
          <div className="overflow-x-auto pb-64">
              <table className="w-full min-w-[1200px] text-sm text-right border-collapse">
                  <thead>
                      <tr className="bg-primary text-white">
                          <th className="p-3 border border-primary-hover w-10 text-center">
                              <input type="checkbox" className="rounded border-gray-300" />
                          </th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">{t('invoice_no')}</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">{t('date')}</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">{t('reference_no')}</th>
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
                      {sales.map((sale) => (
                          <tr key={sale.id} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
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
                                      {sale.saleStatus === 'completed' ? 'مكتملة' : 'رجيع'}
                                  </span>
                              </td>
                              <td className="p-3 border-x border-gray-200 font-bold">{sale.grandTotal.toFixed(2)}</td>
                              <td className="p-3 border-x border-gray-200">{sale.paid.toFixed(2)}</td>
                              <td className="p-3 border-x border-gray-200">{sale.remaining.toFixed(2)}</td>
                              <td className="p-3 border-x border-gray-200">
                                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                                      مدفوع
                                  </span>
                              </td>
                              <td className="p-3 border-x border-gray-200">
                                  {sale.paymentType === 'mada' && (
                                      <div className="flex items-center gap-1">
                                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Mada_Logo.svg/1200px-Mada_Logo.svg.png" alt="mada" className="h-4" />
                                          <span className="text-xs text-gray-500">مدى</span>
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
                                                {t('view_simplified_tax_invoice')}
                                                <FileText size={16} />
                                            </button>
                                            <button 
                                              onClick={() => handleActionClick('tax', sale)}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                            >
                                                {t('view_tax_invoice')}
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
                                                {t('return_sales')}
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
                                                {t('warehouse_receipt')}
                                                <FileCheck size={16} />
                                            </button>
                                            <button 
                                              onClick={() => handleActionClick('claim_receipt', sale)}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                            >
                                                {t('claim_receipt')}
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
                                                {t('send_invoice_email')}
                                                <Mail size={16} />
                                            </button>
                                            <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                                                {t('send_invoice_whatsapp')}
                                                <MessageCircle size={16} />
                                            </button>
                                            <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                                                {t('cancel_delivery')}
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                                                {t('edit_delegate_employee')}
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

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
              <div className="text-sm text-gray-600">
                {t('showing_records')} 1 {t('to')} {sales.length} {t('of')} 25 {t('records')}
              </div>
              <div className="flex items-center gap-1">
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 text-sm">
                    {t('previous')}
                  </button>
                  <button className="px-3 py-1 border border-primary bg-primary text-white rounded text-sm">1</button>
                  <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 rounded text-sm">2</button>
                  <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 rounded text-sm">3</button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 text-sm">
                    {t('next')}
                  </button>
              </div>
          </div>

      </div>
      {/* Modals */}
      <AnimatePresence>
        {showSimplifiedInvoice && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowSimplifiedInvoice(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-md shadow-2xl relative overflow-hidden my-8 p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs flex items-center gap-1">
                  <Printer size={14} /> طباعة
                </button>
                <button onClick={() => setShowSimplifiedInvoice(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>

              <div className="text-center space-y-4 font-mono text-sm" dir="rtl">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                    <Building size={40} className="text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h2 className="font-bold text-lg">شركة اختبار</h2>
                  <p>الرياض - الملقا - سعود بن فيصل</p>
                  <p className="font-bold">فاتورة مبيعات</p>
                </div>

                <div className="text-right space-y-1 border-t border-dashed pt-2">
                  <p>رقم الفاتورة: {showSimplifiedInvoice.invoiceNo}</p>
                  <p>التاريخ: {showSimplifiedInvoice.date}</p>
                  <p>العميل: {showSimplifiedInvoice.customer}</p>
                </div>

                <table className="w-full text-right border-t border-b border-dashed py-2">
                  <thead>
                    <tr className="border-b border-dashed">
                      <th className="py-1">بيان الصنف</th>
                      <th className="py-1">الكمية</th>
                      <th className="py-1">السعر</th>
                      <th className="py-1">الإجمالي</th>
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
                    <span>اجمالي الفاتورة</span>
                    <span>{showSimplifiedInvoice.grandTotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500">أربعمائة ريال سعودي فقط لا غير</p>
                </div>

                <div className="flex justify-between border-t border-dashed pt-2">
                  <span>نوع الدفع: شبكة</span>
                  <div className="space-x-4 space-x-reverse">
                    <span>المدفوع: {showSimplifiedInvoice.paid.toFixed(2)}</span>
                    <span>المتبقي: {showSimplifiedInvoice.remaining.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-gray-500">
                  <p>شكراً لزيارتكم</p>
                  <p>ننتظركم مرة أخرى</p>
                  <p>للإرجاع والاستبدال خلال 48 ساعة</p>
                  <p>يجب احضار الفاتورة</p>
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

                <p className="text-[10px] text-gray-400">Powered By: www.deqatech.com</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showTaxInvoice && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowTaxInvoice(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <button className="bg-white/80 backdrop-blur shadow-sm border border-gray-200 p-1.5 rounded-md text-gray-600 hover:bg-white">
                  <Printer size={18} />
                </button>
                <button onClick={() => setShowTaxInvoice(null)} className="bg-white/80 backdrop-blur shadow-sm border border-gray-200 p-1.5 rounded-md text-gray-600 hover:bg-white">
                  <X size={18} />
                </button>
              </div>

              <div className="p-8 space-y-6 text-right" dir="rtl">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-primary">شركة اختبار</h2>
                    <p className="text-sm text-gray-600">الرياض - الملقا - سعود بن فيصل</p>
                    <p className="text-sm text-gray-600">الرمز البريدي: 13251 - رقم المبنى : 4152 - 6542</p>
                    <p className="text-sm text-gray-600">السجل التجاري: 1234123123</p>
                    <p className="text-sm text-gray-600">هاتف: 0146580073</p>
                  </div>
                  <div className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                    <Building size={48} className="text-gray-300" />
                  </div>
                </div>

                <div className="bg-primary text-white py-2 px-4 rounded-md text-center font-bold text-lg">
                  فاتورة مبيعات
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-4 border border-gray-200 rounded-lg overflow-hidden text-xs">
                  <div className="bg-gray-50 p-2 border-l border-b border-gray-200 font-bold">رقم الفاتورة</div>
                  <div className="bg-gray-50 p-2 border-l border-b border-gray-200 font-bold">الرقم المرجعي</div>
                  <div className="bg-gray-50 p-2 border-l border-b border-gray-200 font-bold">تاريخ اصدار الفاتورة</div>
                  <div className="bg-gray-50 p-2 border-b border-gray-200 font-bold">نوع الفاتورة</div>
                  
                  <div className="p-2 border-l border-gray-200">{showTaxInvoice.invoiceNo}</div>
                  <div className="p-2 border-l border-gray-200">{showTaxInvoice.refNo}</div>
                  <div className="p-2 border-l border-gray-200">{showTaxInvoice.date}</div>
                  <div className="p-2">فاتورة شبكة</div>
                </div>

                {/* Customer Data */}
                <div className="space-y-2">
                  <div className="bg-gray-100 p-1 text-center font-bold text-sm rounded">بيانات العميل</div>
                  <div className="grid grid-cols-8 border border-gray-200 rounded-lg overflow-hidden text-[10px] text-center">
                    <div className="bg-gray-50 p-1 border-l border-gray-200 font-bold">رقم العميل</div>
                    <div className="bg-gray-50 p-1 border-l border-gray-200 font-bold">اسم العميل</div>
                    <div className="bg-gray-50 p-1 border-l border-gray-200 font-bold">الرقم الضريبي للعميل</div>
                    <div className="bg-gray-50 p-1 border-l border-gray-200 font-bold">رقم الجوال</div>
                    <div className="bg-gray-50 p-1 border-l border-gray-200 font-bold">المدينة</div>
                    <div className="bg-gray-50 p-1 border-l border-gray-200 font-bold">الحي</div>
                    <div className="bg-gray-50 p-1 border-l border-gray-200 font-bold">اسم الشارع</div>
                    <div className="bg-gray-50 p-1 font-bold">الرقم الضريبي</div>

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
                      <th className="p-2 border border-gray-200">م</th>
                      <th className="p-2 border border-gray-200">وصف السلعة أو الخدمة</th>
                      <th className="p-2 border border-gray-200">الكمية</th>
                      <th className="p-2 border border-gray-200">سعر الوحدة</th>
                      <th className="p-2 border border-gray-200">الإجمالي</th>
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
                    <p>نوع الدفع: شبكة</p>
                    <p className="font-bold">المدفوع : {showTaxInvoice.paid.toFixed(2)}</p>
                    <p className="text-red-600">المتبقي : {showTaxInvoice.remaining.toFixed(2)}</p>
                  </div>
                  <div className="text-left space-y-1 text-xs text-gray-500">
                    <p>شكراً لزيارتكم</p>
                    <p>ننتظركم مرة أخرى</p>
                    <p>للإرجاع والاستبدال خلال 48 ساعة</p>
                    <p>يجب احضار الفاتورة</p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-primary rounded-lg overflow-hidden flex text-white text-sm font-bold">
                  <button className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-primary-hover border-l border-white/20">
                    <DollarSign size={18} /> دفع
                  </button>
                  <button className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-primary-hover border-l border-white/20">
                    <Truck size={18} /> التسليم
                  </button>
                  <button className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-primary-hover border-l border-white/20">
                    <Mail size={18} /> البريد الإلكتروني
                  </button>
                  <button className="flex-1 py-3 flex items-center justify-center gap-2 hover:bg-primary-hover">
                    <Download size={18} /> PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        {showPaymentsModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowPaymentsModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <button onClick={() => setShowPaymentsModal(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  عرض المدفوعات (بيع المرجع: {showPaymentsModal.refNo})
                </h2>
              </div>

              <div className="p-6" dir="rtl">
                <table className="w-full text-sm text-center border-collapse">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="p-3 border border-primary-hover">التاريخ</th>
                      <th className="p-3 border border-primary-hover">الرقم المرجعي</th>
                      <th className="p-3 border border-primary-hover">المدفوع</th>
                      <th className="p-3 border border-primary-hover">نوع الدفع</th>
                      <th className="p-3 border border-primary-hover">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="p-3">13:13:04 23/02/2026</td>
                      <td className="p-3">IPAY2026/02/0622</td>
                      <td className="p-3 font-bold">400.00</td>
                      <td className="p-3">شبكة</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2 text-gray-600">
                          <button className="hover:text-red-600"><Trash2 size={16} /></button>
                          <button className="hover:text-blue-600"><Edit2 size={16} /></button>
                          <button className="hover:text-blue-600"><Mail size={16} /></button>
                          <button className="hover:text-red-600"><FileText size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showAddPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowAddPaymentModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <button onClick={() => setShowAddPaymentModal(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
                <h2 className="text-lg font-bold text-primary">إضافة الدفع</h2>
              </div>

              <div className="p-6 space-y-6" dir="rtl">
                <p className="text-sm text-primary font-medium">برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary">التاريخ *</label>
                    <input type="text" defaultValue="06:13:00 24/02/2026" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary">الرقم المرجعي *</label>
                    <input type="text" defaultValue="IPAY2026/02/0623" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary">المدفوع *</label>
                    <input type="number" defaultValue="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary">نوع الدفع *</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                      <option>شبكة</option>
                      <option>نقدي</option>
                      <option>تحويل بنكي</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-bold text-primary">ملحقات</label>
                  <div className="flex gap-2">
                    <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" readOnly />
                    <button className="bg-primary text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
                      <Download size={16} /> استعراض ...
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-bold text-primary">مذكرة</label>
                  <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary h-32"></textarea>
                </div>

                <button className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors">
                  إضافة الدفع
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showWarehouseReceiptModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowWarehouseReceiptModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl relative overflow-hidden my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <button onClick={() => setShowWarehouseReceiptModal(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
                <div className="flex items-center gap-4">
                  <button className="bg-white border border-gray-200 px-3 py-1 rounded text-xs flex items-center gap-1 text-gray-600 hover:bg-gray-50">
                    <Printer size={14} /> طباعة
                  </button>
                  <h2 className="text-lg font-bold text-primary">سند مخزني</h2>
                </div>
              </div>

              <div className="p-8 space-y-6 text-right" dir="rtl">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-2">
                  <p className="text-sm font-bold">كاشير: شركة اختبار</p>
                  <p className="text-sm font-bold">المرجع: {showWarehouseReceiptModal.refNo}</p>
                  <p className="text-sm font-bold">الفرع: شركة دقة الحلول (WHI)</p>
                </div>

                <table className="w-full text-sm text-center border-collapse">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="p-3 border border-primary-hover">اسم</th>
                      <th className="p-3 border border-primary-hover">كمية</th>
                      <th className="p-3 border border-primary-hover">رف</th>
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
            </motion.div>
          </motion.div>
        )}

        {showClaimReceiptModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowClaimReceiptModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <button onClick={() => setShowClaimReceiptModal(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
                <button className="bg-white border border-gray-200 px-3 py-1 rounded text-xs flex items-center gap-1 text-gray-600 hover:bg-gray-50">
                  <Printer size={14} /> طباعة
                </button>
              </div>

              <div className="p-12 space-y-8 text-right" dir="rtl">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold">شركة اختبار</h2>
                    <p className="text-sm text-gray-600">الرياض - الملقا - سعود بن فيصل</p>
                    <p className="text-sm text-gray-600">السجل التجاري: 1234123123</p>
                    <p className="text-sm text-gray-600">هاتف: 0146580073</p>
                    <p className="text-sm text-gray-600">رخصة البلدية: 50608090</p>
                  </div>
                  <div className="w-32 h-32 flex items-center justify-center">
                    <LayoutGrid size={80} className="text-gray-200" />
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="bg-gray-300 px-12 py-3 rounded-xl font-bold text-2xl shadow-inner">
                    نموذج خطاب مطالبة مالية
                  </div>
                </div>

                <div className="space-y-6 text-lg leading-relaxed pt-8">
                  <p className="font-bold">التاريخ: 24 فبراير 2026</p>
                  
                  <div className="space-y-2">
                    <p><span className="font-bold">المرسل :</span> شركة اختبار</p>
                    <p><span className="font-bold">المستلم :</span> عميل افتراضي</p>
                    <p><span className="font-bold">الموضوع :</span> مطالبة مالية بسداد مبلغ معين</p>
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

                <div className="flex justify-between pt-20">
                  <div className="w-64 border-t border-gray-400 pt-2 text-center font-bold">ختم الشركة</div>
                  <div className="w-64 border-t border-gray-400 pt-2 text-center font-bold"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showAddDeliveryModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowAddDeliveryModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <button onClick={() => setShowAddDeliveryModal(null)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
                <h2 className="text-lg font-bold text-primary">تعديل تسليم</h2>
              </div>

              <div className="p-6 space-y-6" dir="rtl">
                <p className="text-sm text-[#8b0000] font-medium">برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .</p>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-primary">التاريخ *</label>
                      <input type="text" defaultValue="03:44:00 24/02/2026" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-primary">الرقم المرجعي للتسليم *</label>
                      <input type="text" defaultValue="DO2026/02/0004" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-primary">الرقم المرجعي للبيع *</label>
                      <input type="text" defaultValue={showAddDeliveryModal.refNo} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-primary">عميل *</label>
                      <input type="text" defaultValue={showAddDeliveryModal.customer} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-primary">العنوان *</label>
                      <div className="border border-gray-300 rounded p-3 text-sm min-h-[100px] bg-gray-50">
                        <p className="font-bold">KSA Riyadh Riyadh 13248 SA</p>
                        <p>الهاتف : 00 Email: info@posit.sa</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-primary">الحالة *</label>
                      <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                        <option>جاري العمل عليه</option>
                        <option>تم التوصيل</option>
                        <option>فشل التوصيل</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-primary">تمت عمليه التوصيل من قبل</label>
                      <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-primary">تم الاستلام من قبل</label>
                      <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-primary">ملحقات</label>
                      <div className="flex gap-2">
                        <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" readOnly />
                        <button className="bg-primary text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
                          <Download size={16} /> استعراض ...
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-bold text-primary">مذكرة</label>
                      <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary h-32"></textarea>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors">
                  تعديل تسليم
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
