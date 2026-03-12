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
  ShoppingCart,
  Settings,
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
  FileJson
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Drawer } from 'vaul';
import Pagination from '@/components/Pagination';
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

interface Payment {
  id: string;
  date: string;
  refNo: string;
  amount: number;
  type: string;
}

const mockSales: SaleRecord[] = [
  { id: '1', invoiceNo: '506', date: '23/02/2026 02:59:57', refNo: 'SALE/POS2026/02/0611', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'returned', grandTotal: -500.00, paid: -500.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '2', invoiceNo: '505', date: '23/02/2026 02:58:48', refNo: 'SALE/POS2026/02/0611', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 500.00, paid: 500.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '3', invoiceNo: '504', date: '16/02/2026 20:39:44', refNo: 'SALE/POS2026/02/0610', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 150.00, paid: 150.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '4', invoiceNo: '503', date: '16/02/2026 20:39:34', refNo: 'SALE/POS2026/02/0609', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 400.00, paid: 400.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '5', invoiceNo: '502', date: '16/02/2026 20:25:58', refNo: 'SALE/POS2026/02/0608', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 500.00, paid: 500.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '6', invoiceNo: '501', date: '16/02/2026 20:24:03', refNo: 'SALE/POS2026/02/0607', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 500.00, paid: 500.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '7', invoiceNo: '500', date: '16/02/2026 19:13:23', refNo: 'SALE/POS2026/02/0606', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 250.00, paid: 250.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '8', invoiceNo: '499', date: '12/02/2026 17:39:53', refNo: 'SALE/POS2026/02/0605', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 250.00, paid: 250.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '9', invoiceNo: '498', date: '11/02/2026 20:13:04', refNo: 'SALE/POS2026/02/0604', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 250.00, paid: 250.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
  { id: '10', invoiceNo: '497', date: '11/02/2026 20:12:54', refNo: 'SALE/POS2026/02/0603', cashier: 'شركة اختبار', customer: 'شخص عام', saleStatus: 'completed', grandTotal: 250.00, paid: 250.00, remaining: 0.00, paymentStatus: 'paid', paymentType: 'mada' },
];

export default function AllSales() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCount, setShowCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [sales, setSales] = useState<SaleRecord[]>(() => {
    const saved = localStorage.getItem('takamul_sales');
    return saved ? JSON.parse(saved) : mockSales;
  });

  useEffect(() => {
    localStorage.setItem('takamul_sales', JSON.stringify(sales));
  }, [sales]);

  // Close menu on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.action-menu-container')) {
        setActiveActionMenu(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Modal States
  const [showInvoiceDetails, setShowInvoiceDetails] = useState<SaleRecord | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showPayments, setShowPayments] = useState<SaleRecord | null>(null);
  const [showEditPayment, setShowEditPayment] = useState<Payment | null>(null);
  const [showPaymentReceipt, setShowPaymentReceipt] = useState<Payment | null>(null);
  const [salePayments, setSalePayments] = useState<Payment[]>([]);
  const [showStoreBond, setShowStoreBond] = useState<SaleRecord | null>(null);
  const [showClaimBond, setShowClaimBond] = useState<SaleRecord | null>(null);
  const [showAddDelivery, setShowAddDelivery] = useState<SaleRecord | null>(null);

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

  const [appliedFilters, setAppliedFilters] = useState(filters);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, appliedFilters, showCount]);

  React.useEffect(() => {
    if (showPayments) {
      setSalePayments([
        { id: '1', date: '11/02/2026 19:31:51', refNo: 'IPAY2026/02/0609', amount: 250.00, type: 'mada' }
      ]);
    }
  }, [showPayments]);

  const handleFilter = () => {
    const newSale: SaleRecord = {
      id: `${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`,
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
    const initialFilters = {
      refNo: '',
      invoiceNo: '',
      customer: '',
      branch: '',
      fromDate: '',
      toDate: '',
      grandTotal: '',
      deliveryCompany: 'all',
    };
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    
    alert(direction === 'rtl' ? 'تمت إضافة العملية بنجاح' : 'Operation added successfully');
  };

  const handleReset = () => {
    const initialFilters = {
      refNo: '',
      invoiceNo: '',
      customer: '',
      branch: '',
      fromDate: '',
      toDate: '',
      grandTotal: '',
      deliveryCompany: 'all',
    };
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const filteredSales = sales.filter(sale => {
    return (
      (appliedFilters.refNo ? sale.refNo.toLowerCase().includes(appliedFilters.refNo.toLowerCase()) : true) &&
      (appliedFilters.invoiceNo ? sale.invoiceNo.includes(appliedFilters.invoiceNo) : true) &&
      (appliedFilters.customer ? sale.customer.toLowerCase().includes(appliedFilters.customer.toLowerCase()) : true) &&
      (appliedFilters.branch ? sale.cashier.toLowerCase().includes(appliedFilters.branch.toLowerCase()) : true) && // Assuming branch is in cashier
      (appliedFilters.fromDate ? new Date(sale.date.split(' ')[0].split('/').reverse().join('-')) >= new Date(appliedFilters.fromDate) : true) &&
      (appliedFilters.toDate ? new Date(sale.date.split(' ')[0].split('/').reverse().join('-')) <= new Date(appliedFilters.toDate) : true) &&
      (appliedFilters.grandTotal ? sale.grandTotal >= parseFloat(appliedFilters.grandTotal) : true) &&
      (searchTerm ? (sale.invoiceNo.includes(searchTerm) || sale.refNo.toLowerCase().includes(searchTerm.toLowerCase()) || sale.customer.includes(searchTerm)) : true)
    );
  });

  const duplicateSale = (sale: SaleRecord) => {
    const newSale = {
      ...sale,
      id: `${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`,
      invoiceNo: (parseInt(sales[0].invoiceNo) + 1).toString(),
      date: new Date().toLocaleString('en-GB'),
    };
    setSales(prevSales => [newSale, ...prevSales]);
    setActiveActionMenu(null);
  };

  const totals = filteredSales.reduce((acc, sale) => ({
    grandTotal: acc.grandTotal + sale.grandTotal,
    paid: acc.paid + sale.paid,
    remaining: acc.remaining + sale.remaining,
  }), { grandTotal: 0, paid: 0, remaining: 0 });

  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount
  );

  return (
    <div className="space-y-4">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1 px-2">
        <span>{t('home')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('sales')}</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
              <div className="p-2 bg-white border border-gray-300 rounded-lg text-primary shadow-sm">
                  <ShoppingCart size={20} />
              </div>
              <h1 className="text-lg font-bold text-primary">
                  {t('sales_all_branches')}
              </h1>
          </div>
          <div className="flex items-center gap-1">
              {/* Arrow Up/Down Icon (Red) - Toggle Filters */}
              <button 
                className="p-1.5 bg-white text-primary hover:bg-primary/10 rounded border border-gray-200 w-9 h-9 flex items-center justify-center transition-colors" 
                onClick={() => setShowFilters(!showFilters)}
                title={t('filter_results')}
              >
                  {showFilters ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
              </button>

              {/* List Icon with Dropdown */}
              <div className='relative action-menu-container'>
                <button 
                  className="p-1.5 bg-white text-gray-800 hover:bg-gray-100 rounded-lg border border-gray-200 w-9 h-9 flex items-center justify-center transition-colors"
                  onClick={() => setActiveActionMenu(activeActionMenu === 'actions' ? null : 'actions')}
                >
                    <Menu size={20} />
                </button>
                {activeActionMenu === 'actions' && (
                  <div className='absolute z-50 top-full end-0 mt-2 bg-white rounded-md shadow-xl border border-gray-100 min-w-[220px] overflow-hidden'>
                    <div className='flex flex-col'>
                      <button 
                        onClick={() => { navigate('/sales/create-from-quote'); setActiveActionMenu(null); }}
                        className='w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 border-b border-gray-50 transition-colors'
                      >
                        <span className="font-bold text-gray-800">{t('add_sale_operation')}</span>
                        <PlusCircle size={18} className="text-gray-600" />
                      </button>
                      <button className='w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 border-b border-gray-50 transition-colors'>
                        <span className="text-gray-700">تصدير إلى ملف Excel</span>
                        <FileSpreadsheet size={18} className="text-green-600" />
                      </button>
                      <button className='w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 transition-colors'>
                        <span className="text-gray-700">تصدير إلى ملف pdf</span>
                        <FileText size={18} className="text-primary" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
          </div>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
          
          <p className="text-sm text-primary mb-6 text-right font-medium">
              {t('sales_table_desc')}
          </p>

          {/* Table Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6" dir={direction}>
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
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary text-right" 
                    />
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">{t('search')}</span>
              </div>
          </div>

          {/* Table */}
          {showFilters && (
            <div className="p-4 bg-gray-100 rounded-md my-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor='ref_no' className='block text-sm font-medium text-gray-700 text-right'>
                    {t('ref_no')}
                  </label>
                  <input
                    type='text'
                    id='ref_no'
                    value={filters.refNo}
                    onChange={(e) => setFilters({ ...filters, refNo: e.target.value })}
                    className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                </div>
                <div>
                  <label htmlFor='invoice_no' className='block text-sm font-medium text-gray-700 text-right'>
                    {t('invoice_no')}
                  </label>
                  <input
                    type='text'
                    id='invoice_no'
                    value={filters.invoiceNo}
                    onChange={(e) => setFilters({ ...filters, invoiceNo: e.target.value })}
                    className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                </div>
                <div>
                  <label htmlFor='customer' className='block text-sm font-medium text-gray-700 text-right'>
                    {t('customer')}
                  </label>
                  <select
                    id='customer'
                    value={filters.customer}
                    onChange={(e) => setFilters({ ...filters, customer: e.target.value })}
                    className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  >
                    <option value="">اختر عميل</option>
                    <option value="شخص عام">شخص عام</option>
                  </select>
                </div>
                <div>
                  <label htmlFor='branch' className='block text-sm font-medium text-gray-700 text-right'>
                    {t('branch')}
                  </label>
                  <input
                    type='text'
                    id='branch'
                    value={filters.branch}
                    onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                    className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                </div>
                <div>
                  <label htmlFor='from_date' className='block text-sm font-medium text-gray-700 text-right'>
                    {t('from_date')}
                  </label>
                  <input
                    type='date'
                    id='from_date'
                    value={filters.fromDate}
                    onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                    className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                </div>
                <div>
                  <label htmlFor='to_date' className='block text-sm font-medium text-gray-700 text-right'>
                    {t('to_date')}
                  </label>
                  <input
                    type='date'
                    id='to_date'
                    value={filters.toDate}
                    onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                    className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                </div>
                <div>
                  <label htmlFor='grand_total' className='block text-sm font-medium text-gray-700 text-right'>
                    {t('grand_total')}
                  </label>
                  <input
                    type='text'
                    id='grand_total'
                    value={filters.grandTotal}
                    onChange={(e) => setFilters({ ...filters, grandTotal: e.target.value })}
                    className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  />
                </div>
                <div>
                  <label htmlFor='delivery_companies' className='block text-sm font-medium text-gray-700 text-right'>
                    {t('delivery_companies')}
                  </label>
                  <select
                    id='delivery_companies'
                    value={filters.deliveryCompany}
                    onChange={(e) => setFilters({ ...filters, deliveryCompany: e.target.value })}
                    className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                  >
                    <option value="all">{t('all')}</option>
                  </select>
                </div>
              </div>
              <div className='flex justify-end mt-4 gap-2'>
                <button className='px-4 py-2 bg-gray-500 text-white rounded-md' onClick={handleReset}>
                  {t('reset_form')}
                </button>
                <button className='px-4 py-2 bg-primary text-white rounded-md' onClick={handleFilter}>
                  {t('complete_process')}
                </button>
              </div>
            </div>
          )}
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
                          <th className="p-3 border border-primary-hover w-24 text-center">{t('actions')}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {paginatedSales.map((sale) => (
                          <tr key={`desktop-${sale.id}`} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
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
                                      {t(sale.saleStatus)}
                                  </span>
                              </td>
                              <td className="p-3 border-x border-gray-200 font-bold">{(sale.grandTotal || 0).toFixed(2)}</td>
                              <td className="p-3 border-x border-gray-200">{(sale.paid || 0).toFixed(2)}</td>
                              <td className="p-3 border-x border-gray-200">{(sale.remaining || 0).toFixed(2)}</td>
                              <td className="p-3 border-x border-gray-200">
                                  <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                                      {t(sale.paymentStatus)}
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
                                  
                                  {activeActionMenu === sale.id && (
                                      <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-xl z-50 py-1 text-right">
                                          <button 
                                            onClick={() => { setShowInvoiceDetails(sale); setActiveActionMenu(null); }}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                          >
                                              {t('invoice_details')}
                                              <FileText size={16} />
                                          </button>
                                          <button 
                                            onClick={() => duplicateSale(sale)}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                          >
                                              {t('duplicate_sale')}
                                              <PlusCircle size={16} />
                                          </button>
                                          <button 
                                            onClick={() => { setShowPayments(sale); setActiveActionMenu(null); }}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                          >
                                              {t('view_payments')}
                                              <DollarSign size={16} />
                                          </button>
                                          <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                                              {t('add_payment')}
                                              <DollarSign size={16} />
                                          </button>
                                          <button 
                                            onClick={() => { navigate(`/sales/return/${sale.id}`); setActiveActionMenu(null); }}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                          >
                                              {t('return_sale')}
                                              <RotateCcw size={16} />
                                          </button>
                                          <button 
                                            onClick={() => { setShowStoreBond(sale); setActiveActionMenu(null); }}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                          >
                                              {t('store_bond')}
                                              <FileCheck size={16} />
                                          </button>
                                          <button 
                                            onClick={() => { setShowClaimBond(sale); setActiveActionMenu(null); }}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                          >
                                              {t('claim_bond')}
                                              <Info size={16} />
                                          </button>
                                          <button 
                                            onClick={() => { setShowAddDelivery(sale); setActiveActionMenu(null); }}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                          >
                                              {t('add_delivery')}
                                              <Truck size={16} />
                                          </button>
                                          <div className="border-t border-gray-100 my-1" />
                                          <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                                              {t('download_pdf')}
                                              <FileText size={16} />
                                          </button>
                                          <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                                              {t('download_excel')}
                                              <FileSpreadsheet size={16} />
                                          </button>
                                          <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                                              {t('download_csv')}
                                              <FileSpreadsheet size={16} />
                                          </button>
                                          <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                                              {t('send_email')}
                                              <Mail size={16} />
                                          </button>
                                          <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                                              {t('send_whatsapp')}
                                              <MessageCircle size={16} />
                                          </button>
                                          <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                                              {t('release_bond')}
                                              <Truck size={16} />
                                          </button>
                                          <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2">
                                              {t('edit_delegate')}
                                              <Truck size={16} />
                                          </button>
                                      </div>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {paginatedSales.map((sale) => (
              <MobileDataCard
                key={`mobile-${sale.id}`}
                title={`#${sale.invoiceNo}`}
                status={{
                  label: t(sale.saleStatus),
                  type: sale.saleStatus === 'completed' ? 'success' : 'danger'
                }}
                fields={[
                  { label: t('date'), value: sale.date },
                  { label: t('ref_no'), value: sale.refNo },
                  { label: t('customer'), value: sale.customer },
                  { label: t('grand_total'), value: (sale.grandTotal || 0).toFixed(2), isBold: true },
                  { 
                    label: t('payment_status'), 
                    value: t(sale.paymentStatus), 
                    isBadge: true, 
                    badgeType: sale.paymentStatus === 'paid' ? 'success' : 'warning' 
                  },
                ]}
                actions={
                  <div className="flex flex-wrap justify-end gap-2">
                    <button 
                      onClick={() => setShowInvoiceDetails(sale)}
                      className="p-2 text-primary hover:bg-primary/5 rounded-lg border border-primary/10 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Eye size={16} />
                      {t('view')}
                    </button>
                    <button 
                      onClick={() => duplicateSale(sale)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Copy size={16} />
                      {t('duplicate')}
                    </button>
                    <button 
                      onClick={() => { setShowPayments(sale); setActiveActionMenu(null); }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg border border-green-100 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <DollarSign size={16} />
                      {t('payments')}
                    </button>
                  </div>
                }
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalItems={filteredSales.length}
            itemsPerPage={showCount}
            onPageChange={setCurrentPage}
          />

      </div>

      {/* Modals */}
      <AnimatePresence>
      <Drawer.Root open={!!showInvoiceDetails} onOpenChange={(open) => !open && setShowInvoiceDetails(null)}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[101] outline-none flex flex-col max-h-[96vh] bg-white rounded-t-[24px] shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3 shrink-0" />
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10" dir={direction}>
                <Drawer.Title className="text-lg font-bold text-primary">
                  {t('invoice_details')} {showInvoiceDetails?.invoiceNo}
                </Drawer.Title>
                <button onClick={() => setShowInvoiceDetails(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <Drawer.Description className="hidden">Invoice details view</Drawer.Description>
              {showInvoiceDetails && (
                <div className="p-8 space-y-8" dir={direction}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2 text-right">
                      <h3 className="font-bold text-primary">{t('customer_default')}</h3>
                      <p className="text-sm text-gray-600">{t('phone')}: 00</p>
                      <p className="text-sm text-gray-600">{t('email')}: info@posit.sa</p>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <LayoutGrid size={48} className="text-gray-300" />
                      </div>
                    </div>
                    <div className="space-y-2 text-right">
                      <h3 className="font-bold text-primary">{t('test_company')}</h3>
                      <p className="text-sm text-gray-600">{t('cr_no')}: 1234123123</p>
                      <p className="text-sm text-gray-600">{t('vat_no')}: 50608090</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-right space-y-1">
                      <p className="text-sm font-bold text-primary">{t('ref_no')}: {showInvoiceDetails.refNo}</p>
                      <p className="text-xs text-gray-500">{t('date')}: {showInvoiceDetails.date}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-bold">{t('sale_status')}: <span className="text-primary">{t(showInvoiceDetails.saleStatus)}</span></p>
                      <p className="text-sm font-bold">{t('payment_status')}: <span className="text-green-600">{t(showInvoiceDetails.paymentStatus)}</span></p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right border-collapse min-w-[800px]">
                      <thead>
                        <tr className="bg-primary text-white">
                          <th className="p-3 border border-primary-hover">{t('item_no')}</th>
                          <th className="p-3 border border-primary-hover">{t('description')}</th>
                          <th className="p-3 border border-primary-hover">{t('quantity')}</th>
                          <th className="p-3 border border-primary-hover">{t('unit_price')}</th>
                          <th className="p-3 border border-primary-hover">{t('total_without_vat')}</th>
                          <th className="p-3 border border-primary-hover">{t('vat')}</th>
                          <th className="p-3 border border-primary-hover">{t('total_price')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="p-3 border-x border-gray-200">1</td>
                          <td className="p-3 border-x border-gray-200">60990980 - عباية كريب مع اكمام مموجه</td>
                          <td className="p-3 border-x border-gray-200">-2.00 وحدة</td>
                          <td className="p-3 border-x border-gray-200">250.00</td>
                          <td className="p-3 border-x border-gray-200">500.00-</td>
                          <td className="p-3 border-x border-gray-200">0.00</td>
                          <td className="p-3 border-x border-gray-200 font-bold">500.00-</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

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
                    <button className="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-primary-hover transition-colors">
                      <DollarSign size={18} /> {t('add_payment')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <Drawer.Root open={!!showPayments} onOpenChange={(open) => !open && setShowPayments(null)}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[101] outline-none flex flex-col max-h-[96vh] bg-white rounded-t-[24px] shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3 shrink-0" />
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10" dir={direction}>
                <Drawer.Title className="text-lg font-bold text-primary">
                  {t('payment_view_title').replace('{ref}', showPayments?.refNo || '')}
                </Drawer.Title>
                <button onClick={() => setShowPayments(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <Drawer.Description className="hidden">View payments list</Drawer.Description>
              {showPayments && (
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right border-collapse min-w-[600px]">
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
                        {salePayments.map((payment) => (
                          <tr key={payment.id} className="border-b border-gray-200">
                            <td className="p-3 border-x border-gray-200">{payment.date}</td>
                            <td className="p-3 border-x border-gray-200">{payment.refNo}</td>
                            <td className="p-3 border-x border-gray-200 font-bold">{(payment.amount || 0).toFixed(2)}</td>
                            <td className="p-3 border-x border-gray-200">{t(payment.type)}</td>
                            <td className="p-3 border-x border-gray-200 flex justify-center gap-2">
                              <button 
                                onClick={() => setSalePayments(salePayments.filter(p => p.id !== payment.id))}
                                className="text-primary hover:bg-green-50 p-1 rounded"
                              >
                                <Trash2 size={16} />
                              </button>
                              <button 
                                onClick={() => setShowEditPayment(payment)}
                                className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => alert(t('email_sent_success'))}
                                className="text-gray-600 hover:bg-gray-50 p-1 rounded"
                              >
                                <Mail size={16} />
                              </button>
                              <button 
                                onClick={() => setShowPaymentReceipt(payment)}
                                className="text-gray-600 hover:bg-gray-50 p-1 rounded"
                              >
                                <FileText size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <Drawer.Root open={!!showEditPayment} onOpenChange={(open) => !open && setShowEditPayment(null)}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[110] backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[111] outline-none flex flex-col max-h-[96vh] bg-white rounded-t-[24px] shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3 shrink-0" />
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10" dir={direction}>
                <Drawer.Title className="text-lg font-bold text-primary">
                  {t('edit_payment')}
                </Drawer.Title>
                <button onClick={() => setShowEditPayment(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <Drawer.Description className="hidden">Edit payment details</Drawer.Description>
              {showEditPayment && (
                <div className="p-8 space-y-6 text-right" dir={direction}>
                  <p className="text-sm text-primary">{t('edit_payment_desc')}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">{t('date')} *</label>
                      <input type="text" defaultValue={showEditPayment.date} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">{t('payment_ref')} *</label>
                      <input type="text" defaultValue={showEditPayment.refNo} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">{t('paid')}</label>
                      <input type="number" defaultValue={showEditPayment.amount} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">{t('paid_by')}</label>
                      <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                        <option value="mada">{t('mada')}</option>
                        <option value="cash">{t('cash')}</option>
                        <option value="bank_transfer">{t('bank_transfer')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('attachments')}</label>
                    <div className="flex gap-2">
                      <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                      <button className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary-hover">{t('browse')}</button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('note')}</label>
                    <div className="border border-gray-300 rounded overflow-hidden">
                      <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-2 flex-wrap">
                        <button className="p-1 hover:bg-gray-200 rounded"><ListIcon size={14} /></button>
                        <button className="p-1 hover:bg-gray-200 rounded font-bold">B</button>
                        <button className="p-1 hover:bg-gray-200 rounded italic">I</button>
                        <button className="p-1 hover:bg-gray-200 rounded underline">U</button>
                      </div>
                      <textarea className="w-full p-3 text-sm outline-none h-32 resize-none" />
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <button 
                      onClick={() => setShowEditPayment(null)}
                      className="bg-primary text-white px-8 py-2 rounded-md font-bold hover:bg-primary-hover transition-colors"
                    >
                      {t('edit_payment')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <Drawer.Root open={!!showPaymentReceipt} onOpenChange={(open) => !open && setShowPaymentReceipt(null)}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[110] backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[111] outline-none flex flex-col max-h-[96vh] bg-white rounded-t-[24px] shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3 shrink-0" />
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10" dir={direction}>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-sm">
                    <Printer size={16} /> {t('print')}
                  </button>
                </div>
                <button onClick={() => setShowPaymentReceipt(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <Drawer.Title className="hidden">Payment Receipt</Drawer.Title>
              <Drawer.Description className="hidden">View payment receipt bond</Drawer.Description>
              {showPaymentReceipt && (
                <div className="p-10 space-y-8 text-right" dir={direction}>
                  <div className="flex justify-between items-start">
                    <div className="w-32 h-32 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
                      <LayoutGrid size={48} className="text-gray-300" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold">{t('test_company')}</h2>
                      <p className="text-sm text-gray-600">الرياض - الملقا - سعود بن فيصل</p>
                      <p className="text-sm text-gray-600">السجل التجاري: 1234123123</p>
                      <p className="text-sm text-gray-600">هاتف: 0146580073</p>
                      <p className="text-sm text-gray-600">رخصة البلدية: 50608090</p>
                    </div>
                  </div>

                  <div className="bg-gray-200 p-3 rounded-lg text-center font-bold text-lg">
                    {t('receipt_bond')}
                  </div>

                  <div className="flex justify-between font-bold">
                    <p>{t('date')}: {showPaymentReceipt.date.split(' ')[0]}</p>
                    <p>{t('payment_ref')}: {showPaymentReceipt.refNo}</p>
                  </div>

                  <div className="space-y-6 border border-gray-200 p-6 rounded-xl">
                    <div className="flex items-center gap-4">
                      <span className="font-bold whitespace-nowrap">{t('received_from')} :</span>
                      <span className="flex-1 border-b border-dotted border-gray-400 pb-1 text-red-600">عميل افتراضي</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold whitespace-nowrap">{t('amount_of')} :</span>
                      <span className="flex-1 border-b border-dotted border-gray-400 pb-1 text-red-600">{(showPaymentReceipt.amount || 0).toFixed(2)} (أربعمائة ريال )</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold whitespace-nowrap">{t('payment_type')} :</span>
                      <span className="flex-1 border-b border-dotted border-gray-400 pb-1 text-red-600">{t(showPaymentReceipt.type)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold whitespace-nowrap">{t('for_payment')} :</span>
                      <span className="flex-1 border-b border-dotted border-gray-400 pb-1 text-red-600">فاتورة رقم : 508</span>
                    </div>
                  </div>

                  <div className="flex justify-between pt-12">
                    <div className="w-64 border-t border-black pt-2 text-center font-bold">{t('seal_signature')}</div>
                    <div className="w-64 border-t border-black pt-2 text-center font-bold">{t('receiver')}</div>
                  </div>
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <Drawer.Root open={!!showStoreBond} onOpenChange={(open) => !open && setShowStoreBond(null)}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[101] outline-none flex flex-col max-h-[96vh] bg-white rounded-t-[24px] shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3 shrink-0" />
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10" dir={direction}>
                <div className="flex items-center gap-2">
                  <Printer size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{t('print')}</span>
                  <Drawer.Title className="text-lg font-bold text-primary ml-4">{t('store_bond_title')}</Drawer.Title>
                </div>
                <button onClick={() => setShowStoreBond(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <Drawer.Description className="hidden">View store bond details</Drawer.Description>
              {showStoreBond && (
                <div className="p-8 space-y-6" dir={direction}>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-bold text-primary">{t('cashier')}: {showStoreBond.cashier}</p>
                    <p className="text-sm font-bold text-primary">{t('ref_no')}: {showStoreBond.refNo}</p>
                    <p className="text-sm font-bold text-primary">{t('branch')}: شركة دقة الحلول (WHI)</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right border-collapse min-w-[500px]">
                      <thead>
                        <tr className="bg-primary text-white">
                          <th className="p-3 border border-primary-hover">{t('name')}</th>
                          <th className="p-3 border border-primary-hover">{t('quantity')}</th>
                          <th className="p-3 border border-primary-hover">{t('ref')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200">
                          <td className="p-3 border-x border-gray-200">60990980 - عباية كريب مع اكمام مموجه</td>
                          <td className="p-3 border-x border-gray-200">-2.00</td>
                          <td className="p-3 border-x border-gray-200">003</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <Drawer.Root open={!!showClaimBond} onOpenChange={(open) => !open && setShowClaimBond(null)}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[101] outline-none flex flex-col max-h-[96vh] bg-white rounded-t-[24px] shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3 shrink-0" />
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10" dir={direction}>
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 text-sm">
                  <Printer size={16} /> {t('print')}
                </button>
                <button onClick={() => setShowClaimBond(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <Drawer.Title className="hidden">Claim Bond</Drawer.Title>
              <Drawer.Description className="hidden">View claim bond details</Drawer.Description>
              {showClaimBond && (
                <div className="p-10 space-y-8 text-right" dir={direction}>
                  <div className="flex justify-between items-start">
                    <div className="w-32 h-32 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
                      <LayoutGrid size={48} className="text-gray-300" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold">{showClaimBond.cashier}</h2>
                      <p className="text-sm text-gray-600">الرياض - الملقا - سعود بن فيصل</p>
                      <p className="text-sm text-gray-600">السجل التجاري: 1234123123</p>
                      <p className="text-sm text-gray-600">هاتف: 0146580073</p>
                      <p className="text-sm text-gray-600">رخصة البلدية: 50608090</p>
                    </div>
                  </div>

                  <div className="bg-gray-200 p-3 rounded-lg text-center font-bold text-lg">
                    {t('claim_letter_title')}
                  </div>

                  <p className="font-bold">التاريخ: 23 فبراير 2026</p>

                  <div className="space-y-4">
                    <p><span className="font-bold">المرسل:</span> {showClaimBond.cashier}</p>
                    <p><span className="font-bold">المستلم:</span> {showClaimBond.customer}</p>
                    <p><span className="font-bold">الموضوع:</span> مطالبة مالية بسداد مبلغ معين</p>
                    <p>السادة {showClaimBond.customer} تحية طيبة</p>
                    <p className="leading-relaxed">
                      نود تذكيركم بأن الفاتورة رقم <span className="font-bold">{showClaimBond.invoiceNo}</span> الصادرة بتاريخ <span className="font-bold">23/02/2026</span> والمتعلقة بقيمة <span className="font-bold">{(showClaimBond.grandTotal || 0).toFixed(2)} (صفر ريال)</span> كان من المفترض سدادها بحلول ________________ وحتى تاريخ هذا الخطاب لم يتم استلام مبلغ الفاتورة.
                    </p>
                    <p className="leading-relaxed">
                      لذلك نرجو منكم تسديد المبلغ المستحق خلال 7 أيام من تاريخه، وذلك عبر الحساب البنكي المرفق في الفاتورة. في حال عدم السداد خلال المهلة المحددة سنضطر آسفين لاتخاذ الإجراءات القانونية اللازمة لتحصيل المستحقات.
                    </p>
                    <p className="text-center font-bold pt-4">وتفضلو بقبول فائق الاحترام.</p>
                  </div>

                  <div className="flex justify-between pt-12">
                    <div className="w-48 border-t border-black pt-2 text-center font-bold">ختم الشركة</div>
                    <div className="w-48 border-t border-black pt-2 text-center font-bold">التوقيع</div>
                  </div>
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <Drawer.Root open={!!showAddDelivery} onOpenChange={(open) => !open && setShowAddDelivery(null)}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[101] outline-none flex flex-col max-h-[96vh] bg-white rounded-t-[24px] shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3 shrink-0" />
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10" dir={direction}>
                <Drawer.Title className="text-lg font-bold text-primary">
                  {t('delivery_title')}
                </Drawer.Title>
                <button onClick={() => setShowAddDelivery(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <Drawer.Description className="hidden">Add delivery details</Drawer.Description>
              {showAddDelivery && (
                <div className="p-8 space-y-6 text-right" dir={direction}>
                  <p className="text-sm text-primary">برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">{t('date')} *</label>
                      <input type="text" defaultValue="07:44:00 23/02/2026" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">{t('delivery_status')} *</label>
                      <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                        <option>جاري العمل عليه</option>
                        <option>تم التوصيل</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">{t('delivery_ref')}</label>
                      <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">تمت عمليه التوصيل من قبل</label>
                      <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">{t('sale_ref')} *</label>
                      <input type="text" defaultValue={showAddDelivery.refNo} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">تم الاستلام من قبل</label>
                      <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">{t('customer')} *</label>
                      <input type="text" defaultValue={showAddDelivery.customer} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">{t('attachments')}</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          id="fileNameDisplay"
                          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" 
                          readOnly 
                          placeholder="لم يتم اختيار ملف" 
                        />
                        <label className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary-hover cursor-pointer flex items-center justify-center">
                          استعراض ...
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={(e) => {
                              const fileName = e.target.files?.[0]?.name;
                              const displayInput = document.getElementById('fileNameDisplay') as HTMLInputElement;
                              if (displayInput && fileName) {
                                displayInput.value = fileName;
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold">{t('address')} *</label>
                      <textarea 
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary h-32"
                        defaultValue="KSA Riyadh Riyadh 13248 SA الهاتف: 00 Email: info@posit.sa"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold">{t('note')}</label>
                      <textarea className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary h-32" />
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <button 
                      onClick={() => {
                        const newDelivery = {
                          id: Math.random().toString(36).substr(2, 9),
                          date: '23/02/2026 07:44:00',
                          deliveryRef: 'DO' + Math.floor(Math.random() * 1000000),
                          saleRef: showAddDelivery.refNo,
                          customer: showAddDelivery.customer,
                          address: 'KSA Riyadh Riyadh 13248 SA\nEmail: info@posit.sa الهاتف: 00',
                          status: 'working'
                        };
                        
                        const savedDeliveries = localStorage.getItem('takamul_deliveries');
                        const deliveries = savedDeliveries ? JSON.parse(savedDeliveries) : [
                          {
                            id: '1',
                            date: '03:44:00 24/02/2026',
                            deliveryRef: 'DO2026/02/0004',
                            saleRef: 'SALE/POS2026/02/0613',
                            customer: 'عميل افتراضي',
                            address: 'KSA Riyadh Riyadh 13248 SA\nEmail: info@posit.sa الهاتف: 00',
                            status: 'working'
                          },
                          {
                            id: '2',
                            date: '18:17:00 16/09/2025',
                            deliveryRef: 'DO2025/09/0003',
                            saleRef: 'SALE/POS2025/09/0120',
                            customer: 'عميل افتراضي',
                            address: 'KSA Riyadh Riyadh 13248 SA\nEmail: info@posit.sa الهاتف: 00',
                            status: 'received'
                          },
                          {
                            id: '3',
                            date: '02:21:00 20/12/2020',
                            deliveryRef: 'DO2020/12/0002',
                            saleRef: 'SALE2020/12/0008',
                            customer: 'سعد منصور',
                            address: 'KSA Riyadh ksa 1111 Egypt\nEmail: saad_ena2@hotmail.com الهاتف: 0568101255',
                            status: 'received'
                          }
                        ];
                        localStorage.setItem('takamul_deliveries', JSON.stringify([newDelivery, ...deliveries]));
                        
                        setShowAddDelivery(null);
                        navigate('/sales/deliveries');
                      }}
                      className="bg-[#8b0000] text-white px-8 py-2 rounded-md font-bold hover:bg-[#a52a2a] transition-colors"
                    >
                      {t('add_delivery_btn')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
      </AnimatePresence>
    </div>
  );
}
