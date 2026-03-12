import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  FileJson,
  ChevronUp
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
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
  { id: '1', invoiceNo: '484', date: '31/01/2026 17:20:10', refNo: 'SALE2026/01/0017', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 12.00, paid: 12.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' }
];

export default function A4Sales() {
  const { t, direction, language } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCount, setShowCount] = useState(10);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showTopMenu, setShowTopMenu] = useState(false);
  
  // Modal States
  const [showInvoiceDetails, setShowInvoiceDetails] = useState<SaleRecord | null>(null);
  const [showPayments, setShowPayments] = useState<SaleRecord | null>(null);
  const [showAddPayment, setShowAddPayment] = useState<SaleRecord | null>(null);
  const [showStoreBond, setShowStoreBond] = useState<SaleRecord | null>(null);
  const [showClaimBond, setShowClaimBond] = useState<SaleRecord | null>(null);
  const [showAddDelivery, setShowAddDelivery] = useState<SaleRecord | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<string | null>(null);
  const [bondToDelete, setBondToDelete] = useState<string | null>(null);

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

  const [sales, setSales] = useState<SaleRecord[]>(() => {
    const saved = localStorage.getItem('takamul_a4_sales');
    return saved ? JSON.parse(saved) : mockSales;
  });

  useEffect(() => {
    localStorage.setItem('takamul_a4_sales', JSON.stringify(sales));
  }, [sales]);

  // Close menus on click outside
  React.useEffect(() => {
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

  const handleFilter = () => {
    const newSale: SaleRecord = {
      id: Math.random().toString(36).substr(2, 9),
      invoiceNo: filters.invoiceNo || (sales.length > 0 ? (Math.max(...sales.map(s => parseInt(s.invoiceNo) || 0)) + 1).toString() : "1"),
      date: filters.fromDate ? `${filters.fromDate} 00:00:00` : new Date().toLocaleString('en-GB'),
      refNo: filters.refNo || `SALE/${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}`,
      cashier: filters.branch || 'شركة اختبار',
      customer: filters.customer || 'شخص عام',
      saleStatus: 'completed',
      grandTotal: parseFloat(filters.grandTotal) || 0,
      paid: parseFloat(filters.grandTotal) || 0,
      remaining: 0,
      paymentStatus: 'paid',
      paymentType: 'mada',
    };

    setSales(prevSales => [newSale, ...prevSales]);
    setFilters({
      refNo: '',
      invoiceNo: '',
      customer: '',
      branch: '',
      fromDate: '',
      toDate: '',
      grandTotal: '',
      deliveryCompany: 'all',
    });
    
    alert(t('operation_added_successfully'));
  };

  const handleActionClick = (action: string, sale: SaleRecord) => {
    setActiveActionMenu(null);
    switch (action) {
      case 'details':
        setShowInvoiceDetails(sale);
        break;
      case 'payments':
        setShowPayments(sale);
        break;
      case 'add_payment':
        setShowAddPayment(sale);
        break;
      case 'warehouse_receipt':
        setShowStoreBond(sale);
        break;
      case 'claim_receipt':
        setShowClaimBond(sale);
        break;
      case 'add_delivery':
        setShowAddDelivery(sale);
        break;
      case 'release_receipt':
        setBondToDelete(sale.id);
        break;
      case 'duplicate':
        const duplicatedSale = {
          ...sale,
          id: Math.random().toString(36).substr(2, 9),
          invoiceNo: (Math.max(...sales.map(s => parseInt(s.invoiceNo) || 0)) + 1).toString(),
          date: new Date().toLocaleString('en-GB'),
        };
        setSales(prevSales => [duplicatedSale, ...prevSales]);
        break;
      case 'return':
        navigate(`/sales/return/${sale.id}`);
        break;
      default:
        console.log(`Action ${action} clicked for sale ${sale.id}`);
    }
  };

  return (
    <div className="space-y-4" dir={direction}>
      {/* Top Bar */}
      <div className="bg-white p-3 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-[#8b0000]">
            {t('sales_a4_quick')}
          </h1>
          <ListIcon size={20} className="text-[#8b0000]" />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-1.5 bg-white text-[#8b0000] hover:bg-red-50 rounded border border-gray-200 w-9 h-9 flex items-center justify-center transition-colors"
          >
            {showFilters ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
          </button>
          <div className="relative top-menu-container">
            <button 
              onClick={() => setShowTopMenu(!showTopMenu)}
              className="p-1.5 bg-white text-gray-600 hover:bg-gray-100 rounded border border-gray-200 w-9 h-9 flex items-center justify-center transition-colors"
            >
              <ListIcon size={18} />
            </button>
            {showTopMenu && (
              <div className={cn(
                "absolute top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1 min-w-[200px]",
                direction === 'rtl' ? "left-0 text-right" : "right-0 text-left"
              )}>
                <button 
                  onClick={() => { navigate('/sales/a4-invoices/create'); setShowTopMenu(false); }}
                  className={cn(
                    "w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2",
                    direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse"
                  )}
                >
                  {t('a4_sales_title')}
                  <PlusCircle size={16} />
                </button>
                <button className={cn(
                  "w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2",
                  direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse"
                )}>
                  {t('export_to_excel')}
                  <FileSpreadsheet size={16} />
                </button>
                <button className={cn(
                  "w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2",
                  direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse"
                )}>
                  {t('export_to_pdf')}
                  <FileText size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
        <p className={cn(
          "text-sm text-[#8b0000] mb-6 font-medium",
          direction === 'rtl' ? "text-right" : "text-left"
        )}>
          {direction === 'rtl' 
            ? 'البيانات الظاهرة في اخر 30 يوم . برجاء استخدام النموذج لاظهار مزيد من النتائج'
            : 'Data shown for the last 30 days. Please use the form to show more results'}
        </p>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <div>
                  <label className={cn("block text-sm font-medium text-[#8b0000] mb-1", direction === 'rtl' ? "text-right" : "text-left")}>{t('ref_no')}</label>
                  <input 
                    type="text" 
                    value={filters.refNo}
                    onChange={(e) => setFilters({ ...filters, refNo: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#8b0000]" 
                  />
                </div>
                <div>
                  <label className={cn("block text-sm font-medium text-[#8b0000] mb-1", direction === 'rtl' ? "text-right" : "text-left")}>{t('invoice_no')}</label>
                  <input 
                    type="text" 
                    value={filters.invoiceNo}
                    onChange={(e) => setFilters({ ...filters, invoiceNo: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#8b0000]" 
                  />
                </div>
                <div>
                  <label className={cn("block text-sm font-medium text-[#8b0000] mb-1", direction === 'rtl' ? "text-right" : "text-left")}>{t('customer_label')}</label>
                  <select 
                    value={filters.customer}
                    onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#8b0000] bg-white"
                  >
                    <option value="">{t('select_customer')}</option>
                    <option value="شخص عام">{t('general_person')}</option>
                    <option value="عميل افتراضي">{t('walk_in_customer')}</option>
                  </select>
                </div>
                <div>
                  <label className={cn("block text-sm font-medium text-[#8b0000] mb-1", direction === 'rtl' ? "text-right" : "text-left")}>{t('branches')}</label>
                  <select 
                    value={filters.branch}
                    onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#8b0000] bg-white"
                  >
                    <option value="">{t('all_branches')}</option>
                    <option value="شركة اختبار">شركة اختبار</option>
                  </select>
                </div>
                <div>
                  <label className={cn("block text-sm font-medium text-[#8b0000] mb-1", direction === 'rtl' ? "text-right" : "text-left")}>{t('grand_total')}</label>
                  <input 
                    type="text" 
                    value={filters.grandTotal}
                    onChange={(e) => setFilters({ ...filters, grandTotal: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#8b0000]" 
                  />
                </div>
                <div>
                  <label className={cn("block text-sm font-medium text-[#8b0000] mb-1", direction === 'rtl' ? "text-right" : "text-left")}>{t('from_date')}</label>
                  <input 
                    type="date" 
                    value={filters.fromDate}
                    onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#8b0000]" 
                  />
                </div>
                <div>
                  <label className={cn("block text-sm font-medium text-[#8b0000] mb-1", direction === 'rtl' ? "text-right" : "text-left")}>{t('to_date')}</label>
                  <input 
                    type="date" 
                    value={filters.toDate}
                    onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#8b0000]" 
                  />
                </div>
                <div>
                  <label className={cn("block text-sm font-medium text-[#8b0000] mb-1", direction === 'rtl' ? "text-right" : "text-left")}>{t('delivery_companies')}</label>
                  <select 
                    value={filters.deliveryCompany}
                    onChange={(e) => setFilters({ ...filters, deliveryCompany: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-[#8b0000] bg-white"
                  >
                    <option value="all">{t('all')}</option>
                  </select>
                </div>
                <div className={cn("md:col-span-3 flex mt-2", direction === 'rtl' ? "justify-end" : "justify-start")}>
                  <button 
                    onClick={handleFilter}
                    className="bg-primary text-white px-6 py-2 rounded font-medium hover:bg-primary-hover transition-colors"
                  >
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
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary",
                  direction === 'rtl' ? "text-right" : "text-left"
                )} 
              />
            </div>
            <span className="text-sm text-gray-600 whitespace-nowrap">{t('search')}</span>
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block overflow-x-auto pb-64">
          <table className={cn("w-full min-w-[1200px] text-sm border-collapse", direction === 'rtl' ? "text-right" : "text-left")}>
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 border border-primary/20 w-10 text-center">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">{t('invoice_no')}</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">{t('date')}</th>
                <th className="p-3 border border-primary-hover whitespace-nowrap">{t('ref_no')}</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">{t('cashier')}</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">{t('customer')}</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap text-center">{t('sale_status').replace(' *', '')}</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">{t('grand_total')}</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">{t('paid_amount')}</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">{t('remaining_amount')}</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap text-center">{t('payment_status')}</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap text-center">{t('payment_type')}</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap w-24 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <tr key={`desktop-${sale.id}-${index}`} className="bg-green-50/30 hover:bg-green-100/50 transition-colors border-b border-gray-200">
                  <td className="p-3 text-center border-x border-gray-200">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="p-3 border-x border-gray-200">{sale.invoiceNo}</td>
                  <td className="p-3 border-x border-gray-200">{sale.date}</td>
                  <td className="p-3 border-x border-gray-200">{sale.refNo}</td>
                  <td className="p-3 border-x border-gray-200">{sale.cashier}</td>
                  <td className="p-3 border-x border-gray-200">{sale.customer}</td>
                  <td className="p-3 border-x border-gray-200 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${sale.saleStatus === 'completed' ? 'bg-[#5cb85c]' : 'bg-[#d9534f]'}`}>
                      {sale.saleStatus === 'completed' ? t('completed') : t('returned')}
                    </span>
                  </td>
                  <td className="p-3 border-x border-gray-200">{(sale.grandTotal || 0).toFixed(2)}</td>
                  <td className="p-3 border-x border-gray-200">{(sale.paid || 0).toFixed(2)}</td>
                  <td className="p-3 border-x border-gray-200">{(sale.remaining || 0).toFixed(2)}</td>
                  <td className="p-3 border-x border-gray-200 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${sale.paymentStatus === 'paid' ? 'bg-[#5cb85c]' : sale.paymentStatus === 'partial' ? 'bg-[#5bc0de]' : 'bg-[#d9534f]'}`}>
                      {sale.paymentStatus === 'paid' ? t('paid') : sale.paymentStatus === 'partial' ? (direction === 'rtl' ? 'جزئي' : 'Partial') : (direction === 'rtl' ? 'غير مدفوع' : 'Unpaid')}
                    </span>
                  </td>
                  <td className="p-3 border-x border-gray-200 text-center">
                    {sale.paymentType === 'mada' && (
                      <div className="flex justify-center items-center gap-1 text-xs font-bold text-green-700">
                        <span>mada</span>
                        <span className="text-[10px] bg-green-100 px-1 rounded">{t('mada')}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 border-x border-gray-200 text-center relative action-menu-container">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          setMenuPosition({
                            top: rect.bottom + window.scrollY,
                            left: rect.left + window.scrollX + (rect.width / 2)
                          });
                          setActiveActionMenu(activeActionMenu === sale.id ? null : sale.id);
                        }}
                        className="bg-primary text-white px-3 py-1 rounded text-xs flex items-center gap-1 mx-auto hover:bg-primary-hover transition-colors"
                      >
                        {t('actions')}
                        <ChevronDown size={14} />
                      </button>
                    
                    {activeActionMenu === sale.id && menuPosition && createPortal(
                      <div 
                        style={{ 
                          position: 'absolute', 
                          top: `${menuPosition.top}px`, 
                          left: `${menuPosition.left}px`,
                          transform: 'translateX(-50%)'
                        }}
                        className={cn(
                          "w-64 bg-white border border-gray-200 rounded-md shadow-2xl z-[9999] py-1",
                          direction === 'rtl' ? "text-right" : "text-left"
                        )}
                      >
                        <button onClick={() => handleActionClick('details', sale)} className={cn("w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-md", direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse")}>
                          {t('invoice_details')} <FileText size={16} />
                        </button>
                        <button onClick={() => handleActionClick('duplicate', sale)} className={cn("w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-md", direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse")}>
                          {t('duplicate_sale')} <Copy size={16} />
                        </button>
                        <button onClick={() => handleActionClick('payments', sale)} className={cn("w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-md", direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse")}>
                          {t('view_payments')} <DollarSign size={16} />
                        </button>
                        <button onClick={() => handleActionClick('add_payment', sale)} className={cn("w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-md", direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse")}>
                          {t('add_payment')} <DollarSign size={16} />
                        </button>
                        <button onClick={() => handleActionClick('return', sale)} className={cn("w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-md", direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse")}>
                          {t('return_sale')} <RotateCcw size={16} />
                        </button>
                        <button onClick={() => handleActionClick('warehouse_receipt', sale)} className={cn("w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-md", direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse")}>
                          {t('store_bond')} <FileCheck size={16} />
                        </button>
                        <button onClick={() => handleActionClick('claim_receipt', sale)} className={cn("w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-md", direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse")}>
                          {t('claim_bond')} <Info size={16} />
                        </button>
                        <button onClick={() => handleActionClick('add_delivery', sale)} className={cn("w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-md", direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse")}>
                          {t('add_delivery')} <Truck size={16} />
                        </button>
                        <button onClick={() => handleActionClick('download_pdf', sale)} className={cn("w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-md", direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse")}>
                          {t('download_pdf')} <FileText size={16} />
                        </button>
                        <button onClick={() => handleActionClick('download_excel', sale)} className={cn("w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-md", direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse")}>
                          {t('download_excel')} <FileSpreadsheet size={16} />
                        </button>
                        <button onClick={() => handleActionClick('download_csv', sale)} className={cn("w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-md", direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse")}>
                          {t('download_csv')} <FileJson size={16} />
                        </button>
                        <button onClick={() => handleActionClick('send_email', sale)} className={cn("w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-md", direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse")}>
                          {t('send_email')} <Mail size={16} />
                        </button>
                        <button onClick={() => handleActionClick('send_whatsapp', sale)} className={cn("w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-md", direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse")}>
                          {t('send_whatsapp')} <MessageCircle size={16} />
                        </button>
                        <button onClick={() => handleActionClick('release_receipt', sale)} className={cn("w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-md", direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse")}>
                          {t('release_bond')} <Trash2 size={16} />
                        </button>
                        <button onClick={() => handleActionClick('edit_employee', sale)} className={cn("w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 rounded-md", direction === 'rtl' ? "justify-end" : "justify-start flex-row-reverse")}>
                          {t('edit_delegate')} <Truck size={16} />
                        </button>
                      </div>,
                      document.body
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4 mb-6">
          {sales.map((sale, index) => (
            <MobileDataCard
              key={`mobile-${sale.id}-${index}`}
              title={`${t('invoice_no')}: ${sale.invoiceNo}`}
              subtitle={sale.date}
              fields={[
                { label: t('ref_no'), value: sale.refNo },
                { label: t('customer'), value: sale.customer },
                { label: t('grand_total'), value: (sale.grandTotal || 0).toFixed(2), isBold: true },
                { label: t('paid_amount'), value: (sale.paid || 0).toFixed(2) },
                { 
                  label: t('payment_status'), 
                  value: (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium text-white ${sale.paymentStatus === 'paid' ? 'bg-[#5cb85c]' : sale.paymentStatus === 'partial' ? 'bg-[#5bc0de]' : 'bg-[#d9534f]'}`}>
                      {sale.paymentStatus === 'paid' ? t('paid') : sale.paymentStatus === 'partial' ? (direction === 'rtl' ? 'جزئي' : 'Partial') : (direction === 'rtl' ? 'غير مدفوع' : 'Unpaid')}
                    </span>
                  )
                },
              ]}
              actions={
                <div className="flex flex-wrap justify-end gap-2">
                  <button 
                    onClick={() => handleActionClick('details', sale)}
                    className="p-2 text-primary hover:bg-primary/5 rounded-lg border border-primary/10 transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <Eye size={16} />
                    {t('details')}
                  </button>
                  <button 
                    onClick={() => handleActionClick('add_payment', sale)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg border border-green-100 transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <DollarSign size={16} />
                    {t('add_payment')}
                  </button>
                  <button 
                    onClick={() => handleActionClick('duplicate', sale)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <Copy size={16} />
                    {t('duplicate')}
                  </button>
                </div>
              }
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
          <div className={cn("text-sm font-bold", direction === 'rtl' ? "text-[#8b0000]" : "text-gray-600")}>
            {t('showing_records')} 1 {t('to')} {sales.length} {t('of')} {sales.length} {t('records')}
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 text-sm">
              {t('previous')}
            </button>
            <button className="px-3 py-1 border border-primary bg-primary text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 text-sm">
              {t('next')}
            </button>
          </div>
        </div>
        {/* Modals */}
        <AnimatePresence>
          {showInvoiceDetails && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setShowInvoiceDetails(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl w-full max-w-5xl shadow-2xl relative overflow-hidden my-8"
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-primary text-white p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText size={20} />
                    <h2 className="text-lg font-bold">{t('invoice_details')} {showInvoiceDetails.invoiceNo}</h2>
                  </div>
                  <button onClick={() => setShowInvoiceDetails(null)} className="hover:bg-white/10 p-1 rounded">
                    <X size={24} />
                  </button>
                </div>
                
                <div className={cn("p-8 space-y-8", direction === 'rtl' ? "text-right" : "text-left")} dir={direction}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <h3 className="font-bold text-[#8b0000]">{t('walk_in_customer')}</h3>
                      <p className="text-sm text-gray-600">{t('phone')}: 00</p>
                      <p className="text-sm text-gray-600">{t('email')}: info@posit.sa</p>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <LayoutGrid size={48} className="text-gray-300" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-[#8b0000]">شركة اختبار</h3>
                      <p className="text-sm text-gray-600">{direction === 'rtl' ? 'رقم السجل' : 'Commercial Register'}: 1234123123</p>
                      <p className="text-sm text-gray-600">{t('tax_number')}: 50608090</p>
                    </div>
                  </div>

                  <div className={cn("bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4", direction === 'rtl' ? "text-right" : "text-left")}>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-[#8b0000]">{t('ref_no')}: {showInvoiceDetails.refNo}</p>
                      <p className="text-xs text-gray-500">{t('date')}: {showInvoiceDetails.date}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold">{t('sale_status').replace(' *', '')}: <span className="text-red-600">{showInvoiceDetails.saleStatus === 'completed' ? t('completed') : t('returned_status')}</span></p>
                      <p className="text-sm font-bold">{t('payment_status')}: <span className="text-green-600">{showInvoiceDetails.paymentStatus === 'paid' ? t('paid') : t('partial')}</span></p>
                    </div>
                  </div>

                  <table className={cn("w-full text-sm border-collapse", direction === 'rtl' ? "text-right" : "text-left")}>
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="p-3 border border-primary/20">{t('item_no')}</th>
                        <th className="p-3 border border-primary/20">{t('description')}</th>
                        <th className="p-3 border border-primary/20">{t('quantity')}</th>
                        <th className="p-3 border border-primary/20">{t('unit_price_no_tax')}</th>
                        <th className="p-3 border border-primary/20">{t('total_no_tax')}</th>
                        <th className="p-3 border border-primary/20">{t('tax_rates')}</th>
                        <th className="p-3 border border-primary/20">{t('product_total')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="p-3 border-x border-gray-200">1</td>
                        <td className="p-3 border-x border-gray-200">{direction === 'rtl' ? 'منتج تجريبي' : 'Test Product'}</td>
                        <td className="p-3 border-x border-gray-200">1.00 {t('unit')}</td>
                        <td className="p-3 border-x border-gray-200">{(showInvoiceDetails.grandTotal || 0).toFixed(2)}</td>
                        <td className="p-3 border-x border-gray-200">{(showInvoiceDetails.grandTotal || 0).toFixed(2)}</td>
                        <td className="p-3 border-x border-gray-200">0.00</td>
                        <td className="p-3 border-x border-gray-200 font-bold">{(showInvoiceDetails.grandTotal || 0).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="flex flex-wrap gap-2 justify-center pt-4 border-t border-gray-100">
                    <button className="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-primary-hover transition-colors">
                      <Printer size={18} /> {t('print')}
                    </button>
                    <button className="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-primary-hover transition-colors">
                      <Download size={18} /> {t('download_pdf')}
                    </button>
                    <button className="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-primary-hover transition-colors">
                      <Mail size={18} /> {t('send_email')}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {showPayments && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
              onClick={() => setShowPayments(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-4 flex justify-between items-center border-b border-gray-100">
                  <h2 className="text-lg font-bold text-[#8b0000]">{t('view_payments')} - {showPayments.refNo}</h2>
                  <button onClick={() => setShowPayments(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>
                <div className="p-6">
                  <table className={cn("w-full text-sm border-collapse", direction === 'rtl' ? "text-right" : "text-left")}>
                    <thead>
                      <tr className="bg-[#8b0000] text-white">
                        <th className="p-3 border border-[#a52a2a]">{t('date')}</th>
                        <th className="p-3 border border-[#a52a2a]">{t('ref_no')}</th>
                        <th className="p-3 border border-[#a52a2a]">{t('paid_amount')}</th>
                        <th className="p-3 border border-[#a52a2a]">{t('payment_type')}</th>
                        <th className="p-3 border border-[#a52a2a]">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="p-3 border-x border-gray-200">{showPayments.date}</td>
                        <td className="p-3 border-x border-gray-200">PAY-{showPayments.id}</td>
                        <td className="p-3 border-x border-gray-200 font-bold">{(showPayments.paid || 0).toFixed(2)}</td>
                        <td className="p-3 border-x border-gray-200">{showPayments.paymentType === 'mada' ? t('mada') : showPayments.paymentType}</td>
                        <td className="p-3 border-x border-gray-200 flex justify-center gap-2">
                          <button 
                            onClick={() => setPaymentToDelete(showPayments.id)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button className="text-blue-600 hover:bg-blue-50 p-1 rounded">
                            <Edit2 size={16} />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DeleteConfirmationModal
        isOpen={paymentToDelete !== null}
        onClose={() => setPaymentToDelete(null)}
        onConfirm={() => {
          // In a real app, delete the payment
          setPaymentToDelete(null);
        }}
        itemName={language === 'ar' ? 'هذا الدفع' : 'this payment'}
      />

      <DeleteConfirmationModal
        isOpen={bondToDelete !== null}
        onClose={() => setBondToDelete(null)}
        onConfirm={() => {
          // In a real app, delete the bond
          setBondToDelete(null);
        }}
        itemName={language === 'ar' ? 'هذا السند' : 'this bond'}
      />
    </div>
  );
}
