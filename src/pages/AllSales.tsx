import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Edit2, RotateCcw, Trash2,
  ChevronDown, LayoutGrid,
  PlusCircle, DollarSign,
  FileCheck, Truck, FileSpreadsheet, Mail,
  MessageCircle, X, Info, Printer, Download,
  Loader2, AlertCircle, RefreshCw, Search,
  TrendingUp, ShoppingBag, CreditCard, Clock,
  Filter, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SaleRecord {
  id: string;
  invoiceNo: string;
  orderNumber: string;
  date: string;
  cashier: string;
  customer: string;
  saleStatus: 'completed' | 'returned' | 'unconfirmed';
  grandTotal: number;
  paid: number;
  remaining: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentType: 'mada' | 'cash' | 'bank_transfer';
}

interface ApiOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  warehouseName: string;
  orderDate: string;
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  orderStatus: string;
}

interface Payment {
  id: string;
  date: string;
  refNo: string;
  amount: number;
  type: string;
}

function mapApiOrder(o: ApiOrder): SaleRecord {
  const dateObj = new Date(o.orderDate);
  const date = isNaN(dateObj.getTime())
    ? o.orderDate
    : dateObj.toLocaleString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      });
  const status = (o.orderStatus ?? '').toLowerCase();
  const saleStatus: SaleRecord['saleStatus'] =
    status === 'confirmed' ? 'completed' :
    status === 'returned'  ? 'returned'  : 'unconfirmed';
  const isConfirmed = saleStatus === 'completed';
  return {
    id:          String(o.id),
    invoiceNo:   String(o.id),
    orderNumber: o.orderNumber ?? '',
    date,
    cashier:     o.warehouseName ?? '',
    customer:    o.customerName  ?? '',
    saleStatus,
    grandTotal:  Number(o.grandTotal)  || 0,
    paid:        isConfirmed ? (Number(o.grandTotal) || 0) : 0,
    remaining:   isConfirmed ? 0 : (Number(o.grandTotal) || 0),
    paymentStatus: isConfirmed ? 'paid' : 'unpaid',
    paymentType:   'mada',
  };
}

const SaleStatusBadge = ({ status }: { status: SaleRecord['saleStatus'] }) => {
  const cfg = {
    completed:   { label: 'مكتملة',    dot: 'bg-emerald-500', cls: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
    returned:    { label: 'مرتجعة',    dot: 'bg-rose-500',    cls: 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'           },
    unconfirmed: { label: 'غير مؤكدة', dot: 'bg-amber-500',   cls: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'        },
  };
  const { label, dot, cls } = cfg[status] ?? cfg.unconfirmed;
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap', cls)}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dot)} />
      {label}
    </span>
  );
};

const PayStatusBadge = ({ status }: { status: SaleRecord['paymentStatus'] }) => {
  const cfg = {
    paid:    { label: 'مدفوعة',    cls: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'       },
    partial: { label: 'جزئي',      cls: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200' },
    unpaid:  { label: 'غير مدفوع', cls: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200'   },
  };
  const { label, cls } = cfg[status] ?? cfg.unpaid;
  return <span className={cn('inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap', cls)}>{label}</span>;
};

const StatCard = ({ label, value, icon, color, sub }: {
  label: string; value: string; icon: React.ReactNode;
  color: 'rose' | 'emerald' | 'blue' | 'amber'; sub?: string;
}) => {
  const c = {
    rose:    { bg: 'bg-rose-50',    iconBg: 'bg-rose-100 text-rose-700',       val: 'text-rose-800',    border: 'border-rose-100'    },
    emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100 text-emerald-700', val: 'text-emerald-800', border: 'border-emerald-100' },
    blue:    { bg: 'bg-blue-50',    iconBg: 'bg-blue-100 text-blue-700',       val: 'text-blue-800',    border: 'border-blue-100'    },
    amber:   { bg: 'bg-amber-50',   iconBg: 'bg-amber-100 text-amber-700',     val: 'text-amber-800',   border: 'border-amber-100'   },
  }[color];
  return (
    <div className={cn('rounded-2xl border p-4 flex items-center gap-3', c.bg, c.border)}>
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', c.iconBg)}>{icon}</div>
      <div className="text-right flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className={cn('text-lg font-black truncate', c.val)}>{value}</p>
        {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
      </div>
    </div>
  );
};

export default function AllSales() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();

  const [sales,        setSales]        = useState<SaleRecord[]>([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [salesError,   setSalesError]   = useState<string | null>(null);

  const fetchSales = useCallback(() => {
    setSalesLoading(true);
    setSalesError(null);
    fetch('http://takamulerp.runasp.net/SalesOrders', {
      headers: { Accept: 'application/json' },
      mode: 'cors',
    })
      .then(r => { if (!r.ok) throw new Error(`خطأ ${r.status}`); return r.json(); })
      .then((d: ApiOrder[]) => setSales(Array.isArray(d) ? d.map(mapApiOrder) : []))
      .catch(e => setSalesError(e.message ?? 'فشل التحميل'))
      .finally(() => setSalesLoading(false));
  }, []);

  useEffect(() => { fetchSales(); }, [fetchSales]);

  const [searchTerm,       setSearchTerm]      = useState('');
  const [showCount,        setShowCount]        = useState(10);
  const [currentPage,      setCurrentPage]      = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [showFilters,      setShowFilters]      = useState(false);
  const [actionsOpen,      setActionsOpen]      = useState(false);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.action-menu-container')) {
        setActiveActionMenu(null);
        setActionsOpen(false);
      }
    };
    window.addEventListener('click', h);
    return () => window.removeEventListener('click', h);
  }, []);

  const [showInvoiceDetails, setShowInvoiceDetails] = useState<SaleRecord | null>(null);
  const [showPayments,       setShowPayments]        = useState<SaleRecord | null>(null);
  const [showEditPayment,    setShowEditPayment]     = useState<Payment | null>(null);
  const [showPaymentReceipt, setShowPaymentReceipt]  = useState<Payment | null>(null);
  const [salePayments,       setSalePayments]        = useState<Payment[]>([]);
  const [showStoreBond,      setShowStoreBond]       = useState<SaleRecord | null>(null);
  const [showClaimBond,      setShowClaimBond]       = useState<SaleRecord | null>(null);
  const [showAddDelivery,    setShowAddDelivery]     = useState<SaleRecord | null>(null);

  useEffect(() => {
    if (showPayments)
      setSalePayments([{ id: '1', date: '11/02/2026 19:31:51', refNo: 'IPAY2026/02/0609', amount: 250, type: 'mada' }]);
  }, [showPayments]);

  const init = { orderNumber: '', invoiceNo: '', customer: '', branch: '', fromDate: '', toDate: '', grandTotal: '', deliveryCompany: 'all' };
  const [filters,        setFilters]        = useState(init);
  const [appliedFilters, setAppliedFilters] = useState(init);

  const handleFilter = () => { setAppliedFilters({ ...filters }); setCurrentPage(1); };
  const handleReset  = () => { setFilters(init); setAppliedFilters(init); setCurrentPage(1); };

  const filtered = sales.filter(s =>
    (appliedFilters.invoiceNo   ? s.invoiceNo.includes(appliedFilters.invoiceNo)                                         : true) &&
    (appliedFilters.orderNumber ? s.orderNumber.toLowerCase().includes(appliedFilters.orderNumber.toLowerCase())         : true) &&
    (appliedFilters.customer    ? s.customer.toLowerCase().includes(appliedFilters.customer.toLowerCase())               : true) &&
    (appliedFilters.branch      ? s.cashier.toLowerCase().includes(appliedFilters.branch.toLowerCase())                  : true) &&
    (appliedFilters.grandTotal  ? s.grandTotal >= parseFloat(appliedFilters.grandTotal)                                  : true) &&
    (searchTerm
      ? s.invoiceNo.includes(searchTerm) ||
        s.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.customer.includes(searchTerm)
      : true)
  );

  const totalRecords = filtered.length;
  const totalPages   = Math.max(1, Math.ceil(totalRecords / showCount));
  const paginated    = filtered.slice((currentPage - 1) * showCount, currentPage * showCount);
  const totals       = filtered.reduce(
    (a, s) => ({ grandTotal: a.grandTotal + s.grandTotal, paid: a.paid + s.paid, remaining: a.remaining + s.remaining }),
    { grandTotal: 0, paid: 0, remaining: 0 }
  );

  const pageNums = () => {
    const pages: number[] = [];
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) pages.push(i);
    return pages;
  };

  const duplicateSale = (sale: SaleRecord) => {
    const max = sales.length > 0 ? Math.max(...sales.map(s => parseInt(s.invoiceNo) || 0)) : 0;
    setSales(prev => [{ ...sale, id: Math.random().toString(36).substr(2, 9), invoiceNo: (max + 1).toString(), date: new Date().toLocaleString('en-GB') }, ...prev]);
    setActiveActionMenu(null);
  };

  const inp = "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-gray-50/60 text-right transition-all";

  // عرض الأعمدة — ثابت عشان الجدول يتوزع صح
  const colWidths = [
    'w-[3%]',   // checkbox
    'w-[10%]',  // التاريخ
    'w-[14%]',  // الرقم المرجعي
    'w-[10%]',  // المستودع
    'w-[10%]',  // العميل
    'w-[8%]',   // الحالة
    'w-[8%]',   // الإجمالي
    'w-[7%]',   // المدفوع
    'w-[7%]',   // المتبقي
    'w-[8%]',   // حالة الدفع
    'w-[7%]',   // طريقة الدفع
    'w-[8%]',   // الإجراءات
  ];

  const colHeaders = [
    'التاريخ', 'الرقم المرجعي', 'المستودع', 'العميل',
    'الحالة', 'الإجمالي', 'المدفوع', 'المتبقي',
    'حالة الدفع', 'طريقة الدفع', 'الإجراءات',
  ];

  return (
    <div className="space-y-4 min-h-screen bg-gray-50/60" dir="rtl">

      {/* ── TOP BAR ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
        <div className="px-5 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <ShoppingBag size={16} className="text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-800 leading-none">المبيعات</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">جميع الفروع</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchSales} disabled={salesLoading}
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all disabled:opacity-40">
              <RefreshCw size={13} className={salesLoading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => setShowFilters(v => !v)}
              className={cn('w-8 h-8 flex items-center justify-center rounded-xl border transition-all',
                showFilters ? 'bg-primary border-primary text-white' : 'border-gray-200 text-gray-400 hover:text-primary hover:border-primary/30 hover:bg-primary/5')}>
              <Filter size={13} />
            </button>
            <div className="relative action-menu-container">
              <button onClick={() => setActionsOpen(v => !v)}
                className="flex items-center gap-1.5 bg-primary text-white px-3 py-2 rounded-xl text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20">
                <PlusCircle size={13} />
                إجراءات
                <ChevronDown size={11} className={cn('transition-transform duration-200', actionsOpen && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {actionsOpen && (
                  <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.12 }}
                    className="absolute top-full end-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 py-1.5">
                    {[
                      { label: 'إضافة فاتورة مبيعات', icon: <PlusCircle size={13} />, bold: true, action: () => navigate('/sales/create') },
                      { label: 'تصدير Excel',           icon: <FileSpreadsheet size={13} className="text-green-600" />, action: () => {} },
                      { label: 'تصدير PDF',             icon: <FileText size={13} className="text-primary" />,         action: () => {} },
                    ].map(item => (
                      <button key={item.label} onClick={() => { item.action(); setActionsOpen(false); }}
                        className="w-full flex items-center justify-end gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">
                        <span className={item.bold ? 'font-bold text-gray-800' : 'text-gray-600'}>{item.label}</span>
                        <span>{item.icon}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4">

        {/* ── STAT CARDS ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'إجمالي المبيعات',  value: totals.grandTotal.toFixed(2), icon: <TrendingUp size={17} />, color: 'rose'    as const, sub: 'ر.س'    },
            { label: 'المبالغ المدفوعة', value: totals.paid.toFixed(2),        icon: <CreditCard size={17} />, color: 'emerald' as const, sub: 'ر.س'    },
            { label: 'المتبقي',           value: totals.remaining.toFixed(2),  icon: <Clock size={17} />,      color: 'amber'   as const, sub: 'ر.س'    },
            { label: 'عدد الفواتير',      value: String(totalRecords),         icon: <FileText size={17} />,   color: 'blue'    as const, sub: 'فاتورة' },
          ].map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <StatCard {...card} />
            </motion.div>
          ))}
        </div>

        {/* ── SEARCH + COUNT ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
            <input type="text" placeholder="ابحث بالرقم أو المرجع أو العميل..."
              value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full border border-gray-200 rounded-xl pr-9 pl-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-gray-50/50 text-right transition-all" />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-gray-400">عرض</span>
            <select value={showCount} onChange={e => { setShowCount(Number(e.target.value)); setCurrentPage(1); }}
              className="border border-gray-200 rounded-xl px-2.5 py-2 text-sm outline-none focus:border-primary bg-white font-medium">
              {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="text-xs text-gray-400">سجل</span>
          </div>
        </div>

        {/* ── FILTERS ───────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                  <button onClick={handleReset} className="text-xs text-gray-400 hover:text-rose-500 flex items-center gap-1 font-medium transition-colors">
                    <RotateCcw size={11} /> إعادة تعيين
                  </button>
                  <p className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                    <Filter size={12} className="text-primary" /> خيارات التصفية
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'رقم الفاتورة',  key: 'invoiceNo',   ph: '1'        },
                    { label: 'الرقم المرجعي', key: 'orderNumber', ph: 'SO-...'   },
                    { label: 'الفرع',          key: 'branch',      ph: 'Warehouse'},
                    { label: 'الإجمالي (≥)',   key: 'grandTotal',  ph: '100'      },
                  ].map(({ label, key, ph }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">{label}</label>
                      <input value={(filters as any)[key]} placeholder={ph}
                        onChange={e => setFilters({ ...filters, [key]: e.target.value })}
                        className={inp} />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">العميل</label>
                    <select value={filters.customer} onChange={e => setFilters({ ...filters, customer: e.target.value })} className={inp}>
                      <option value="">الكل</option>
                      {[...new Set(sales.map(s => s.customer))].filter(Boolean).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">من تاريخ</label>
                    <input type="date" value={filters.fromDate} onChange={e => setFilters({ ...filters, fromDate: e.target.value })} className={inp} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">إلى تاريخ</label>
                    <input type="date" value={filters.toDate} onChange={e => setFilters({ ...filters, toDate: e.target.value })} className={inp} />
                  </div>
                </div>
                <div className="flex justify-start">
                  <button onClick={handleFilter}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-sm shadow-primary/20">
                    <Search size={12} /> تطبيق الفلتر
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── TABLE ─────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {salesLoading && (
            <div className="py-20 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Loader2 size={22} className="animate-spin text-primary" />
              </div>
              <p className="text-sm text-gray-400">جاري تحميل البيانات...</p>
            </div>
          )}

          {!salesLoading && salesError && (
            <div className="py-20 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                <AlertCircle size={22} className="text-rose-400" />
              </div>
              <p className="text-sm text-rose-500">{salesError}</p>
              <button onClick={fetchSales}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
                <RefreshCw size={12} /> إعادة المحاولة
              </button>
            </div>
          )}

          {/* ✅ الجدول بدون overflow وبدون min-width ثابت */}
          {!salesLoading && !salesError && (
            <div className="w-full">
              <table className="w-full text-right border-collapse table-fixed">
                <colgroup>
                  {colWidths.map((w, i) => <col key={i} className={w} />)}
                </colgroup>
                <thead>
                  <tr className="bg-gray-800 text-white">
                    {/* Checkbox */}
                    <th className="px-2 py-3.5 text-center">
                      <input type="checkbox" className="rounded border-white/20 bg-transparent accent-primary" />
                    </th>
                    {/* Headers */}
                    {colHeaders.map(h => (
                      <th key={h} className="px-2 py-3.5 text-[11px] font-semibold tracking-wide border-r border-white/5 last:border-0 last:text-center">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center">
                            <FileText size={18} className="text-gray-300" />
                          </div>
                          <p className="text-sm text-gray-400">لا توجد نتائج</p>
                        </div>
                      </td>
                    </tr>
                  ) : paginated.map((sale, idx) => (
                    <motion.tr key={sale.id}
                      initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-primary/[0.02] transition-colors group relative">

                      {/* Checkbox */}
                      <td className="px-2 py-3 text-center">
                        <input type="checkbox" className="rounded border-gray-300 accent-primary" />
                      </td>

                      {/* التاريخ */}
                      <td className="px-2 py-3 text-gray-400 text-[11px] leading-tight">
                        {/* تاريخ فقط في سطر أول، وقت في سطر ثاني */}
                        {sale.date.split(', ').map((part, i) => (
                          <div key={i}>{part}</div>
                        ))}
                      </td>

                      {/* الرقم المرجعي — مختصر مع tooltip */}
                      <td className="px-2 py-3">
                        <span title={sale.orderNumber}
                          className="font-mono text-[10px] text-gray-600 bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100 cursor-default block truncate">
                          {sale.orderNumber.length > 20
                            ? '…' + sale.orderNumber.slice(-18)
                            : sale.orderNumber}
                        </span>
                      </td>

                      {/* المستودع */}
                      <td className="px-2 py-3 text-gray-500 text-[11px] truncate">{sale.cashier}</td>

                      {/* العميل */}
                      <td className="px-2 py-3 font-semibold text-gray-700 text-[11px] truncate">{sale.customer}</td>

                      {/* الحالة */}
                      <td className="px-2 py-3"><SaleStatusBadge status={sale.saleStatus} /></td>

                      {/* الإجمالي */}
                      <td className="px-2 py-3 font-black text-gray-800 text-xs">{sale.grandTotal.toFixed(2)}</td>

                      {/* المدفوع */}
                      <td className="px-2 py-3 font-semibold text-emerald-600 text-xs">{sale.paid.toFixed(2)}</td>

                      {/* المتبقي */}
                      <td className="px-2 py-3 font-semibold text-rose-500 text-xs">{sale.remaining.toFixed(2)}</td>

                      {/* حالة الدفع */}
                      <td className="px-2 py-3"><PayStatusBadge status={sale.paymentStatus} /></td>

                      {/* طريقة الدفع */}
                      <td className="px-2 py-3">
                        {sale.paymentType === 'mada' && (
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Mada_Logo.svg/1200px-Mada_Logo.svg.png"
                            alt="mada" className="h-3.5 w-auto" />
                        )}
                      </td>

                      {/* الإجراءات */}
                      <td className="px-2 py-3 text-center relative action-menu-container overflow-visible">
                        <button
                          onClick={e => { e.stopPropagation(); setActiveActionMenu(activeActionMenu === sale.id ? null : sale.id); }}
                          className="inline-flex items-center gap-1 bg-gray-100 hover:bg-primary hover:text-white text-gray-600 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all">
                          خيارات
                          <ChevronDown size={10} className={cn('transition-transform duration-150', activeActionMenu === sale.id && 'rotate-180')} />
                        </button>

                        <AnimatePresence>
                          {activeActionMenu === sale.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.12 }}
                              className="absolute end-0 top-full mt-1.5 w-52 bg-white rounded-2xl border border-gray-100 shadow-2xl z-[200] py-1.5 overflow-hidden">
                              {[
                                { label: 'تفاصيل الفاتورة', icon: <FileText size={13} />,   fn: () => { setShowInvoiceDetails(sale); setActiveActionMenu(null); } },
                                { label: 'نسخ الفاتورة',    icon: <PlusCircle size={13} />, fn: () => duplicateSale(sale) },
                                { label: 'عرض المدفوعات',   icon: <DollarSign size={13} />, fn: () => { setShowPayments(sale); setActiveActionMenu(null); } },
                                { label: 'إضافة دفعة',      icon: <CreditCard size={13} />, fn: () => setActiveActionMenu(null) },
                                { label: 'مرتجع مبيعات',    icon: <RotateCcw size={13} />,  fn: () => { navigate(`/sales/return/${sale.id}`); setActiveActionMenu(null); } },
                                { label: 'سند مخزن',        icon: <FileCheck size={13} />,  fn: () => { setShowStoreBond(sale); setActiveActionMenu(null); } },
                                { label: 'خطاب مطالبة',     icon: <Info size={13} />,       fn: () => { setShowClaimBond(sale); setActiveActionMenu(null); } },
                                { label: 'إضافة شحنة',      icon: <Truck size={13} />,      fn: () => { setShowAddDelivery(sale); setActiveActionMenu(null); } },
                              ].map(item => (
                                <button key={item.label} onClick={item.fn}
                                  className="w-full flex items-center justify-end gap-3 px-4 py-2.5 text-xs text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors font-medium">
                                  {item.label}
                                  <span className="text-gray-300">{item.icon}</span>
                                </button>
                              ))}
                              <div className="border-t border-gray-50 my-1" />
                              {[
                                { label: 'تحميل PDF',    icon: <FileText size={13} /> },
                                { label: 'إرسال بريد',   icon: <Mail size={13} /> },
                                { label: 'إرسال واتساب', icon: <MessageCircle size={13} /> },
                              ].map(item => (
                                <button key={item.label}
                                  className="w-full flex items-center justify-end gap-3 px-4 py-2.5 text-xs text-gray-400 hover:bg-gray-50 transition-colors">
                                  {item.label}
                                  <span className="text-gray-200">{item.icon}</span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>

                {paginated.length > 0 && (
                  <tfoot>
                    <tr className="bg-gray-50/80 border-t-2 border-gray-100">
                      <td colSpan={6} className="px-3 py-3 text-gray-400 text-xs">
                        إجمالي <span className="text-gray-700 font-black">{totalRecords}</span> فاتورة
                      </td>
                      <td className="px-2 py-3 text-gray-800 font-black text-xs">{totals.grandTotal.toFixed(2)}</td>
                      <td className="px-2 py-3 text-emerald-600 font-black text-xs">{totals.paid.toFixed(2)}</td>
                      <td className="px-2 py-3 text-rose-500 font-black text-xs">{totals.remaining.toFixed(2)}</td>
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}

          {/* Pagination */}
          {!salesLoading && !salesError && totalRecords > 0 && (
            <div className="border-t border-gray-50 px-5 py-3.5 flex flex-col md:flex-row justify-between items-center gap-3">
              <p className="text-xs text-gray-400">
                عرض{' '}
                <span className="font-bold text-gray-600">{Math.min((currentPage - 1) * showCount + 1, totalRecords)}</span>
                {' — '}
                <span className="font-bold text-gray-600">{Math.min(currentPage * showCount, totalRecords)}</span>
                {' من '}
                <span className="font-bold text-gray-600">{totalRecords}</span> سجل
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronRight size={13} />
                </button>
                {pageNums().map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)}
                    className={cn('w-8 h-8 flex items-center justify-center rounded-xl text-sm font-bold transition-all',
                      page === currentPage
                        ? 'bg-primary text-white shadow-sm shadow-primary/20'
                        : 'border border-gray-200 text-gray-400 hover:border-primary/30 hover:text-primary')}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MODALS ───────────────────────────────────────────────────────── */}
      <AnimatePresence>

        {showInvoiceDetails && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowInvoiceDetails(null)}>
            <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl my-8 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-l from-gray-900 to-gray-800 px-7 py-5 flex justify-between items-center">
                <button onClick={() => setShowInvoiceDetails(null)} className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"><X size={17} /></button>
                <div className="flex items-center gap-3 text-white">
                  <div className="text-right">
                    <p className="text-[10px] text-white/40 mb-0.5">تفاصيل الفاتورة</p>
                    <h2 className="text-base font-black truncate max-w-xs">{showInvoiceDetails.orderNumber}</h2>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center"><FileText size={17} /></div>
                </div>
              </div>
              <div className="p-6 space-y-4" dir="rtl">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'العميل',       value: showInvoiceDetails.customer    },
                    { label: 'التاريخ',      value: showInvoiceDetails.date        },
                    { label: 'الرقم المرجعي',value: showInvoiceDetails.orderNumber },
                    { label: 'المستودع',     value: showInvoiceDetails.cashier     },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-xl p-3.5 text-right border border-gray-100">
                      <p className="text-[10px] text-gray-400 mb-1 font-semibold">{label}</p>
                      <p className="font-bold text-gray-700 text-sm break-all">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-xl p-3.5 flex items-center justify-between border border-gray-100">
                  <div className="flex items-center gap-2">
                    <SaleStatusBadge status={showInvoiceDetails.saleStatus} />
                    <PayStatusBadge status={showInvoiceDetails.paymentStatus} />
                  </div>
                  <span className="text-xl font-black text-gray-800">
                    {showInvoiceDetails.grandTotal.toFixed(2)} <span className="text-xs font-medium text-gray-400">ر.س</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-100">
                  {[
                    { icon: <Printer size={13} />,    label: 'طباعة',      cls: 'bg-gray-800 text-white hover:bg-gray-700'       },
                    { icon: <Download size={13} />,   label: 'PDF',        cls: 'bg-primary text-white hover:bg-primary/90'      },
                    { icon: <Mail size={13} />,       label: 'إرسال',      cls: 'bg-blue-600 text-white hover:bg-blue-700'       },
                    { icon: <DollarSign size={13} />, label: 'إضافة دفعة', cls: 'bg-emerald-600 text-white hover:bg-emerald-700' },
                  ].map(({ icon, label, cls }) => (
                    <button key={label} className={cn('flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all', cls)}>
                      {icon} {label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showPayments && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowPayments(null)}>
            <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <button onClick={() => setShowPayments(null)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"><X size={17} /></button>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 mb-0.5">سجل المدفوعات</p>
                  <h2 className="text-sm font-bold text-gray-800 truncate max-w-xs">{showPayments.orderNumber}</h2>
                </div>
              </div>
              <div className="p-6">
                <table className="w-full text-sm text-right">
                  <thead>
                    <tr>
                      {['التاريخ','المرجع','المبلغ','الطريقة','إجراءات'].map(h => (
                        <th key={h} className="pb-3 text-xs font-bold text-gray-400 border-b border-gray-100">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {salePayments.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-3 text-gray-400 text-xs">{p.date}</td>
                        <td className="py-3 font-mono text-xs text-gray-500">{p.refNo}</td>
                        <td className="py-3 font-black text-emerald-600">{p.amount.toFixed(2)}</td>
                        <td className="py-3 text-gray-500">{p.type}</td>
                        <td className="py-3">
                          <div className="flex gap-1.5">
                            {[
                              { icon: <Trash2 size={12} />,   cls: 'text-rose-400 hover:bg-rose-50 hover:text-rose-600',   fn: () => setSalePayments(salePayments.filter(x => x.id !== p.id)) },
                              { icon: <Edit2 size={12} />,    cls: 'text-blue-400 hover:bg-blue-50',                        fn: () => setShowEditPayment(p) },
                              { icon: <FileText size={12} />, cls: 'text-gray-400 hover:bg-gray-100',                       fn: () => setShowPaymentReceipt(p) },
                            ].map(({ icon, cls, fn }, i) => (
                              <button key={i} onClick={fn} className={cn('w-7 h-7 rounded-lg flex items-center justify-center transition-colors', cls)}>{icon}</button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showEditPayment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowEditPayment(null)}>
            <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl my-8 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-l from-blue-700 to-blue-600 px-7 py-5 flex justify-between items-center">
                <button onClick={() => setShowEditPayment(null)} className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"><X size={17} /></button>
                <div className="flex items-center gap-3 text-white">
                  <h2 className="font-bold">تعديل الدفعة</h2>
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center"><Edit2 size={15} /></div>
                </div>
              </div>
              <div className="p-6 space-y-4" dir="rtl">
                <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-center gap-2 justify-end">
                  <p className="text-sm text-amber-700">سيؤثر هذا التعديل على رصيد الفاتورة</p>
                  <span>⚠️</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'التاريخ *', dv: showEditPayment.date,   type: 'text'   },
                    { label: 'المرجع *',  dv: showEditPayment.refNo,  type: 'text'   },
                    { label: 'المبلغ',    dv: showEditPayment.amount, type: 'number' },
                  ].map(({ label, dv, type }) => (
                    <div key={label} className="space-y-1">
                      <label className="text-xs font-bold text-gray-400">{label}</label>
                      <input type={type} defaultValue={dv} className={inp} />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400">طريقة الدفع</label>
                    <select className={inp}><option>مدى</option><option>نقدي</option><option>تحويل</option></select>
                  </div>
                </div>
                <button onClick={() => setShowEditPayment(null)} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all">
                  حفظ التعديلات
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showPaymentReceipt && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowPaymentReceipt(null)}>
            <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="bg-white rounded-3xl w-full max-w-xl shadow-2xl my-8 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="px-7 py-4 flex justify-between items-center border-b border-gray-100">
                <button onClick={() => setShowPaymentReceipt(null)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"><X size={17} /></button>
                <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors">
                  <Printer size={13} /> طباعة
                </button>
              </div>
              <div className="p-8 space-y-5" dir="rtl">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <LayoutGrid size={22} className="text-primary/40" />
                  </div>
                  <h2 className="text-lg font-black text-gray-800">شركة الاختبار</h2>
                  <p className="text-xs text-gray-400 mt-0.5">الرياض • س.ت: 1234123123</p>
                </div>
                <div className="bg-primary/5 border border-primary/10 rounded-xl py-2.5 text-center font-black text-sm text-primary tracking-widest">سند قبض</div>
                <div className="space-y-3">
                  {[
                    { label: 'المبلغ',   value: `${showPaymentReceipt.amount.toFixed(2)} ريال` },
                    { label: 'الطريقة', value: showPaymentReceipt.type },
                    { label: 'التاريخ', value: showPaymentReceipt.date },
                    { label: 'المرجع',  value: showPaymentReceipt.refNo },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-500 w-14 text-right shrink-0">{label}:</span>
                      <span className="flex-1 border-b border-dashed border-gray-200 pb-1 text-primary font-semibold text-sm">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-8">
                  <div className="w-32 border-t-2 border-gray-600 pt-2 text-center text-xs font-bold text-gray-500">ختم الشركة</div>
                  <div className="w-32 border-t-2 border-gray-600 pt-2 text-center text-xs font-bold text-gray-500">المستلم</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showStoreBond && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowStoreBond(null)}>
            <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-l from-emerald-700 to-emerald-600 px-7 py-5 flex justify-between items-center">
                <button onClick={() => setShowStoreBond(null)} className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"><X size={17} /></button>
                <div className="flex items-center gap-3 text-white">
                  <h2 className="font-bold">سند مخزن</h2>
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center"><FileCheck size={15} /></div>
                </div>
              </div>
              <div className="p-6 space-y-4" dir="rtl">
                <div className="grid grid-cols-3 gap-3">
                  {[{ l: 'المستودع', v: showStoreBond.cashier }, { l: 'المرجع', v: showStoreBond.orderNumber }, { l: 'العميل', v: showStoreBond.customer }].map(({ l, v }) => (
                    <div key={l} className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-right">
                      <p className="text-[10px] text-emerald-500 mb-1 font-semibold">{l}</p>
                      <p className="text-xs font-bold text-gray-700 truncate" title={v}>{v}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-400 text-sm border border-gray-100">لا توجد تفاصيل أصناف متاحة حالياً</div>
                <button onClick={() => setShowStoreBond(null)} className="flex items-center gap-2 bg-gray-800 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-700 transition-all">
                  <Printer size={13} /> طباعة السند
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showClaimBond && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowClaimBond(null)}>
            <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="bg-white rounded-3xl w-full max-w-xl shadow-2xl my-8 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="px-7 py-4 flex justify-between items-center border-b border-gray-100">
                <button onClick={() => setShowClaimBond(null)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"><X size={17} /></button>
                <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors"><Printer size={13} /> طباعة</button>
              </div>
              <div className="p-7 space-y-5" dir="rtl">
                <div className="bg-rose-50 border border-rose-100 rounded-xl py-2.5 text-center font-black text-sm text-rose-700 tracking-widest">خطاب مطالبة</div>
                <p className="text-xs font-bold text-gray-500">التاريخ: {showClaimBond.date.split(' ')[0]}</p>
                <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm text-gray-700 leading-loose border border-gray-100">
                  <p><b>المرسل:</b> {showClaimBond.cashier}</p>
                  <p><b>المستلم:</b> {showClaimBond.customer}</p>
                  <div className="border-t border-gray-100 my-2" />
                  <p>السادة {showClaimBond.customer}، تحية طيبة وبعد،</p>
                  <p>نفيدكم بأن الفاتورة رقم <b className="text-primary">{showClaimBond.orderNumber}</b> البالغة{' '}
                    <b className="text-primary">{showClaimBond.grandTotal.toFixed(2)} ريال</b> لم يتم سدادها حتى تاريخه. نرجو التسوية خلال <b>7 أيام</b> تجنباً للإجراءات القانونية.</p>
                  <p className="text-center font-bold pt-2">وتفضلوا بقبول فائق الاحترام</p>
                </div>
                <div className="flex justify-between pt-6">
                  <div className="w-32 border-t-2 border-gray-600 pt-2 text-center text-xs font-bold text-gray-500">ختم الشركة</div>
                  <div className="w-32 border-t-2 border-gray-600 pt-2 text-center text-xs font-bold text-gray-500">التوقيع</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showAddDelivery && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowAddDelivery(null)}>
            <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl my-8 overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-l from-slate-800 to-slate-700 px-7 py-5 flex justify-between items-center">
                <button onClick={() => setShowAddDelivery(null)} className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"><X size={17} /></button>
                <div className="flex items-center gap-3 text-white">
                  <h2 className="font-bold">إضافة شحنة</h2>
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center"><Truck size={15} /></div>
                </div>
              </div>
              <div className="p-6 space-y-4" dir="rtl">
                <p className="text-xs text-gray-400 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5">
                  الحقول المميزة بـ <b className="text-primary">*</b> إلزامية
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'التاريخ *', dv: showAddDelivery.date }, { label: 'مرجع الفاتورة *', dv: showAddDelivery.orderNumber },
                    { label: 'العميل *', dv: showAddDelivery.customer }, { label: 'تسليم بواسطة', dv: '' },
                    { label: 'استلام بواسطة', dv: '' }, { label: 'رقم مرجع الشحن', dv: '' },
                  ].map(({ label, dv }) => (
                    <div key={label} className="space-y-1">
                      <label className="text-xs font-bold text-gray-400">{label}</label>
                      <input type="text" defaultValue={dv} className={inp} />
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400">حالة الشحن *</label>
                    <select className={inp}><option>جاري العمل عليه</option><option>تم التوصيل</option></select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[{ label: 'العنوان *' }, { label: 'ملاحظات' }].map(({ label }) => (
                    <div key={label} className="space-y-1">
                      <label className="text-xs font-bold text-gray-400">{label}</label>
                      <textarea className={cn(inp, 'h-20 resize-none')} />
                    </div>
                  ))}
                </div>
                <button onClick={() => { setShowAddDelivery(null); navigate('/sales/deliveries'); }}
                  className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-700 transition-all">
                  <Truck size={13} /> تأكيد الشحنة
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}