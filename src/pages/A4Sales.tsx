import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText, Eye, Edit2, RotateCcw, Trash2,
  ChevronRight, ChevronLeft, Download, Printer,
  ChevronDown, LayoutGrid, List as ListIcon,
  ArrowUp, ArrowDown, PlusCircle, DollarSign,
  FileCheck, Truck, FileSpreadsheet, Mail,
  MessageCircle, X, Copy, Info, FileJson,
  RefreshCw, AlertCircle, CheckCircle, Clock,
  Search, Filter, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── API CONFIG ────────────────────────────────────────────────────────────────
const API_BASE = 'https://takamulerp.runasp.net/api';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const cn = (...classes) => classes.filter(Boolean).join(' ');

const statusConfig = {
  completed: { label: 'مكتملة', cls: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' },
  returned:  { label: 'مرتجع',  cls: 'bg-rose-100 text-rose-600 ring-1 ring-rose-200' },
};
const paymentStatusConfig = {
  paid:    { label: 'مدفوع',       cls: 'bg-emerald-100 text-emerald-700' },
  partial: { label: 'جزئي',        cls: 'bg-sky-100 text-sky-700' },
  unpaid:  { label: 'غير مدفوع',  cls: 'bg-rose-100 text-rose-600' },
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div className="fixed bottom-6 left-6 z-[999] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: -40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.95 }}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium min-w-[260px]",
              t.type === 'success' ? "bg-emerald-600 text-white" :
              t.type === 'error'   ? "bg-rose-600 text-white" :
                                     "bg-gray-800 text-white"
            )}
          >
            {t.type === 'success' ? <CheckCircle size={16} /> :
             t.type === 'error'   ? <AlertCircle size={16} /> :
                                    <Clock size={16} />}
            <span>{t.message}</span>
            <button onClick={() => remove(t.id)} className="mr-auto opacity-70 hover:opacity-100">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  const remove = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, add, remove };
}

// ─── ADD INVOICE MODAL ────────────────────────────────────────────────────────
function AddInvoiceModal({ onClose, onSuccess, toast }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerId: '', orderDate: new Date().toISOString().slice(0, 16),
    warehouseId: '', shippingAddress: '', notes: '',
    items: [{ productId: '', unitId: '1', quantity: 1, unitPrice: 0, discountPercentage: 0, discountValue: 0, taxPercentage: 14 }]
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setItem = (i, k, v) => {
    const items = [...form.items];
    items[i] = { ...items[i], [k]: v };
    setForm(p => ({ ...p, items }));
  };
  const addItem = () => setForm(p => ({
    ...p,
    items: [...p.items, { productId: '', unitId: '1', quantity: 1, unitPrice: 0, discountPercentage: 0, discountValue: 0, taxPercentage: 14 }]
  }));
  const removeItem = i => setForm(p => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));

  const calcTotal = () => form.items.reduce((s, it) => {
    const base = it.quantity * it.unitPrice;
    const disc = base * (it.discountPercentage / 100) + Number(it.discountValue);
    const net  = base - disc;
    return s + net + net * (it.taxPercentage / 100);
  }, 0);

  const handleSubmit = async () => {
    if (!form.customerId || !form.warehouseId) {
      toast.add('يرجى تعبئة جميع الحقول المطلوبة', 'error'); return;
    }
    setLoading(true);
    try {
      const body = {
        customerId: Number(form.customerId),
        orderDate: new Date(form.orderDate).toISOString(),
        warehouseId: Number(form.warehouseId),
        shippingAddress: form.shippingAddress,
        notes: form.notes,
        items: form.items.map(it => ({
          productId: Number(it.productId),
          unitId: Number(it.unitId),
          quantity: Number(it.quantity),
          unitPrice: Number(it.unitPrice),
          discountPercentage: Number(it.discountPercentage),
          discountValue: Number(it.discountValue),
          taxPercentage: Number(it.taxPercentage),
        }))
      };
      await apiFetch('/SalesOrders', { method: 'POST', body: JSON.stringify(body) });
      toast.add('تم إنشاء الفاتورة بنجاح', 'success');
      onSuccess();
      onClose();
    } catch (e) {
      toast.add(`فشل إنشاء الفاتورة: ${e.message}`, 'error');
    } finally { setLoading(false); }
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white transition-all text-right";
  const labelCls = "block text-xs font-bold text-gray-500 text-right mb-1.5";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl my-6 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-indigo-700 to-indigo-500 px-7 py-5 flex justify-between items-center">
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/15 text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <div className="text-right text-white">
            <p className="text-xs text-white/60">إنشاء فاتورة جديدة</p>
            <h2 className="text-lg font-bold">فاتورة مبيعات A4</h2>
          </div>
        </div>

        <div className="p-7 space-y-6 text-right" dir="rtl">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>رقم العميل <span className="text-rose-500">*</span></label>
              <input type="number" className={inputCls} value={form.customerId} onChange={e => set('customerId', e.target.value)} placeholder="5" />
            </div>
            <div>
              <label className={labelCls}>رقم المستودع <span className="text-rose-500">*</span></label>
              <input type="number" className={inputCls} value={form.warehouseId} onChange={e => set('warehouseId', e.target.value)} placeholder="2" />
            </div>
            <div>
              <label className={labelCls}>تاريخ الطلب</label>
              <input type="datetime-local" className={inputCls} value={form.orderDate} onChange={e => set('orderDate', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>عنوان الشحن</label>
              <input type="text" className={inputCls} value={form.shippingAddress} onChange={e => set('shippingAddress', e.target.value)} placeholder="القاهرة - مدينة نصر" />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>ملاحظات</label>
              <input type="text" className={inputCls} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="ملاحظات إضافية..." />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <button onClick={addItem} className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
                <PlusCircle size={15} /> إضافة منتج
              </button>
              <h3 className="text-sm font-bold text-gray-700">المنتجات</h3>
            </div>
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-xs text-right">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['رقم المنتج','الكمية','سعر الوحدة','خصم%','ضريبة%',''].map(h => (
                      <th key={h} className="px-3 py-2.5 font-bold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {form.items.map((it, i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="px-2 py-2"><input type="number" className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-indigo-400" value={it.productId} onChange={e => setItem(i,'productId',e.target.value)} placeholder="5" /></td>
                      <td className="px-2 py-2"><input type="number" className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-indigo-400" value={it.quantity} onChange={e => setItem(i,'quantity',e.target.value)} /></td>
                      <td className="px-2 py-2"><input type="number" className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-indigo-400" value={it.unitPrice} onChange={e => setItem(i,'unitPrice',e.target.value)} /></td>
                      <td className="px-2 py-2"><input type="number" className="w-14 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-indigo-400" value={it.discountPercentage} onChange={e => setItem(i,'discountPercentage',e.target.value)} /></td>
                      <td className="px-2 py-2"><input type="number" className="w-14 border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-indigo-400" value={it.taxPercentage} onChange={e => setItem(i,'taxPercentage',e.target.value)} /></td>
                      <td className="px-2 py-2">
                        {form.items.length > 1 && (
                          <button onClick={() => removeItem(i)} className="p-1 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={13} /></button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center bg-indigo-50 rounded-xl px-5 py-3.5 border border-indigo-100">
            <span className="text-lg font-bold text-indigo-700">{calcTotal().toFixed(2)} ر.س</span>
            <span className="text-sm font-bold text-indigo-500">الإجمالي التقديري</span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-1">
            <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">إلغاء</button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-7 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60 flex items-center gap-2"
            >
              {loading && <RefreshCw size={14} className="animate-spin" />}
              {loading ? 'جاري الإنشاء...' : 'إنشاء الفاتورة'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function A4Sales() {
  const toast = useToast();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCount, setShowCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showTopMenu, setShowTopMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(null);
  const [showPayments, setShowPayments] = useState(null);
  const [filters, setFilters] = useState({
    refNo: '', invoiceNo: '', customer: '', branch: '',
    fromDate: '', toDate: '', grandTotal: '', deliveryCompany: 'all',
  });

  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/SalesOrders');
      // Normalize API response
      const normalized = (Array.isArray(data) ? data : data?.data ?? data?.items ?? []).map(item => ({
        id: String(item.id ?? item.orderId ?? Math.random()),
        invoiceNo: String(item.invoiceNumber ?? item.id ?? '—'),
        date: item.orderDate
          ? new Date(item.orderDate).toLocaleString('ar-SA')
          : '—',
        refNo: item.referenceNumber ?? item.refNo ?? `SALE${item.id}`,
        cashier: item.branchName ?? item.cashier ?? '—',
        customer: item.customerName ?? item.customer ?? '—',
        saleStatus: item.status === 'Returned' ? 'returned' : 'completed',
        grandTotal: Number(item.grandTotal ?? item.totalAmount ?? 0),
        paid: Number(item.paidAmount ?? item.paid ?? 0),
        remaining: Number(item.remainingAmount ?? item.remaining ?? 0),
        paymentStatus: item.paymentStatus === 'Paid' ? 'paid'
          : item.paymentStatus === 'Partial' ? 'partial' : 'unpaid',
        paymentType: item.paymentMethod ?? item.paymentType ?? 'cash',
        _raw: item,
      }));
      setSales(normalized);
    } catch (e) {
      toast.add(`فشل تحميل البيانات: ${e.message}`, 'error');
      // Fallback mock
      setSales([{
        id: '1', invoiceNo: '484', date: '31/01/2026 17:20',
        refNo: 'SALE2026/01/0017', cashier: 'شركة اختبار',
        customer: 'شخص عام', saleStatus: 'completed',
        grandTotal: 12.00, paid: 12.00, remaining: 0.00,
        paymentStatus: 'paid', paymentType: 'mada',
      }]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSales(); }, [fetchSales]);

  useEffect(() => {
    const h = e => {
      if (!e.target.closest('.action-menu-container')) setActiveActionMenu(null);
      if (!e.target.closest('.top-menu-container')) setShowTopMenu(false);
    };
    window.addEventListener('click', h);
    return () => window.removeEventListener('click', h);
  }, []);

  const filtered = sales.filter(s =>
    !searchTerm ||
    s.invoiceNo.includes(searchTerm) ||
    s.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.customer.includes(searchTerm)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / showCount));
  const paginated = filtered.slice((currentPage - 1) * showCount, currentPage * showCount);
  const totals = filtered.reduce((a, s) => ({
    grandTotal: a.grandTotal + s.grandTotal,
    paid: a.paid + s.paid,
    remaining: a.remaining + s.remaining,
  }), { grandTotal: 0, paid: 0, remaining: 0 });

  const actionItems = [
    { key: 'details',           label: 'تفاصيل الفاتورة',   icon: <FileText size={14} /> },
    { key: 'duplicate',         label: 'تكرار الفاتورة',     icon: <Copy size={14} /> },
    { key: 'payments',          label: 'عرض المدفوعات',      icon: <DollarSign size={14} /> },
    { key: 'add_payment',       label: 'إضافة دفع',          icon: <DollarSign size={14} /> },
    { key: 'return',            label: 'إرجاع مبيع',         icon: <RotateCcw size={14} /> },
    null,
    { key: 'warehouse_receipt', label: 'سند مخزني',          icon: <FileCheck size={14} /> },
    { key: 'claim_receipt',     label: 'سند مطالبة',         icon: <Info size={14} /> },
    { key: 'add_delivery',      label: 'إضافة تسليم',        icon: <Truck size={14} /> },
    null,
    { key: 'download_pdf',      label: 'تحميل PDF',          icon: <FileText size={14} /> },
    { key: 'download_excel',    label: 'تحميل إكسل',         icon: <FileSpreadsheet size={14} /> },
    { key: 'send_email',        label: 'إرسال بريد',         icon: <Mail size={14} /> },
    { key: 'send_whatsapp',     label: 'واتساب',             icon: <MessageCircle size={14} /> },
  ];

  const handleActionClick = (action, sale) => {
    setActiveActionMenu(null);
    if (action === 'details') { setShowInvoiceDetails(sale); return; }
    if (action === 'payments') { setShowPayments(sale); return; }
    if (action === 'duplicate') {
      setSales(p => [{
        ...sale, id: Math.random().toString(36).slice(2),
        invoiceNo: (Math.max(...p.map(s => parseInt(s.invoiceNo) || 0)) + 1).toString(),
        date: new Date().toLocaleString('ar-SA'),
      }, ...p]);
      toast.add('تم تكرار الفاتورة', 'success');
      return;
    }
    toast.add(`تم تنفيذ: ${actionItems.find(a => a?.key === action)?.label ?? action}`, 'info');
  };

  // ─── STAT CARDS ─────────────────────────────────────────────────────────────
  const stats = [
    { label: 'إجمالي المبيعات', value: totals.grandTotal.toFixed(2), unit: 'ر.س', color: 'from-indigo-500 to-indigo-700', icon: <FileText size={20} /> },
    { label: 'المدفوع',         value: totals.paid.toFixed(2),       unit: 'ر.س', color: 'from-emerald-500 to-emerald-700', icon: <CheckCircle size={20} /> },
    { label: 'المتبقي',         value: totals.remaining.toFixed(2),  unit: 'ر.س', color: 'from-rose-500 to-rose-700', icon: <AlertCircle size={20} /> },
    { label: 'عدد الفواتير',    value: filtered.length,               unit: 'فاتورة', color: 'from-violet-500 to-violet-700', icon: <LayoutGrid size={20} /> },
  ];

  const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 bg-white transition-all text-right";

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/70 p-5 space-y-5 font-[system-ui]">

      {/* ─── STAT CARDS ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-lg`}>
            <div className="flex justify-between items-start mb-3">
              <div className="bg-white/20 rounded-xl p-2">{s.icon}</div>
              <span className="text-xs text-white/70 font-medium">{s.label}</span>
            </div>
            <p className="text-2xl font-black tracking-tight">{s.value}</p>
            <p className="text-xs text-white/60 mt-0.5">{s.unit}</p>
          </div>
        ))}
      </div>

      {/* ─── MAIN CARD ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Refresh */}
            <button
              onClick={fetchSales}
              disabled={loading}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-all"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                showFilters
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
              )}
            >
              <Filter size={14} />
              <span>فلترة</span>
            </button>

            {/* Top menu */}
            <div className="relative top-menu-container">
              <button
                onClick={() => setShowTopMenu(!showTopMenu)}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <PlusCircle size={14} />
                إضافة
              </button>
              <AnimatePresence>
                {showTopMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.13 }}
                    className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-1.5 min-w-[200px] overflow-hidden"
                  >
                    <button
                      onClick={() => { setShowAddModal(true); setShowTopMenu(false); }}
                      className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-end gap-2.5 transition-colors font-medium"
                    >
                      فاتورة A4 جديدة <PlusCircle size={15} className="text-indigo-500" />
                    </button>
                    <button className="w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-end gap-2.5 transition-colors">
                      تصدير Excel <FileSpreadsheet size={15} className="text-emerald-500" />
                    </button>
                    <button className="w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 flex items-center justify-end gap-2.5 transition-colors">
                      تصدير PDF <FileText size={15} className="text-rose-500" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base font-bold text-gray-800 text-right leading-tight">فواتير مبيعات A4</h1>
              <p className="text-xs text-gray-400 text-right mt-0.5">إدارة وعرض فواتير المبيعات</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <FileText size={18} className="text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Info strip */}
        <div className="px-6 py-2.5 bg-indigo-50/60 border-b border-indigo-100/80 flex items-center justify-end gap-2">
          <p className="text-xs text-indigo-600 font-medium">
            البيانات الظاهرة — استخدم الفلتر لتضييق النتائج
          </p>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
        </div>

        <div className="p-6">

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mb-6"
              >
                <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/80 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'الرقم المرجعي', key: 'refNo' },
                      { label: 'رقم الفاتورة', key: 'invoiceNo' },
                      { label: 'المجموع الكلي', key: 'grandTotal' },
                    ].map(({ label, key }) => (
                      <div key={key}>
                        <label className="block text-xs font-bold text-gray-500 text-right mb-1.5">{label}</label>
                        <input type="text" value={filters[key]}
                          onChange={e => setFilters(p => ({ ...p, [key]: e.target.value }))}
                          className={inputCls} />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 text-right mb-1.5">عميل</label>
                      <select value={filters.customer}
                        onChange={e => setFilters(p => ({ ...p, customer: e.target.value }))}
                        className={inputCls}>
                        <option value="">جميع العملاء</option>
                        <option value="شخص عام">شخص عام</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 text-right mb-1.5">من تاريخ</label>
                      <input type="date" value={filters.fromDate}
                        onChange={e => setFilters(p => ({ ...p, fromDate: e.target.value }))}
                        className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 text-right mb-1.5">إلى تاريخ</label>
                      <input type="date" value={filters.toDate}
                        onChange={e => setFilters(p => ({ ...p, toDate: e.target.value }))}
                        className={inputCls} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setFilters({ refNo:'',invoiceNo:'',customer:'',branch:'',fromDate:'',toDate:'',grandTotal:'',deliveryCompany:'all' })}
                      className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors">
                      إعادة تعيين
                    </button>
                    <button onClick={fetchSales}
                      className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                      بحث
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">اظهر</span>
              <select value={showCount}
                onChange={e => { setShowCount(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-indigo-400 bg-white">
                {[10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span className="text-sm text-gray-400">سجل</span>
            </div>
            <div className="relative w-full md:w-72">
              <Search size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="بحث في الفواتير..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full border border-gray-200 rounded-xl pr-10 pl-3.5 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all text-right" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full min-w-[1100px] text-sm text-right border-collapse">
              <thead>
                <tr className="bg-gradient-to-l from-indigo-700 to-indigo-500 text-white text-xs">
                  <th className="px-3 py-3.5 w-10 text-center border-l border-white/10">
                    <input type="checkbox" className="rounded border-white/30 accent-white" />
                  </th>
                  {['رقم الفاتورة','التاريخ','الرقم المرجعي','كاشير','عميل'].map(h => (
                    <th key={h} className="px-4 py-3.5 font-semibold border-l border-white/10 whitespace-nowrap">{h}</th>
                  ))}
                  <th className="px-4 py-3.5 font-semibold border-l border-white/10 text-center whitespace-nowrap">حالة الفاتورة</th>
                  {['المجموع الكلي','مدفوع','المتبقي'].map(h => (
                    <th key={h} className="px-4 py-3.5 font-semibold border-l border-white/10 whitespace-nowrap">{h}</th>
                  ))}
                  <th className="px-4 py-3.5 font-semibold border-l border-white/10 text-center">حالة الدفع</th>
                  <th className="px-4 py-3.5 font-semibold border-l border-white/10 text-center">نوع الدفع</th>
                  <th className="px-4 py-3.5 font-semibold text-center w-28">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={13} className="text-center py-16 text-gray-400">
                      <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-indigo-400" />
                      <p className="text-sm">جاري تحميل البيانات...</p>
                    </td>
                  </tr>
                )}
                {!loading && paginated.length === 0 && (
                  <tr>
                    <td colSpan={13} className="text-center py-16 text-gray-400">
                      <FileText size={32} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">لا توجد فواتير</p>
                    </td>
                  </tr>
                )}
                {!loading && paginated.map((sale, idx) => (
                  <tr key={sale.id}
                    className={cn(
                      "border-b border-gray-50 last:border-0 transition-colors",
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50/30",
                      "hover:bg-indigo-50/30"
                    )}>
                    <td className="px-3 py-3.5 text-center border-l border-gray-100">
                      <input type="checkbox" className="rounded border-gray-300 accent-indigo-500" />
                    </td>
                    <td className="px-4 py-3.5 border-l border-gray-100">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg text-xs">#{sale.invoiceNo}</span>
                    </td>
                    <td className="px-4 py-3.5 border-l border-gray-100 text-gray-400 text-xs">{sale.date}</td>
                    <td className="px-4 py-3.5 border-l border-gray-100 font-mono text-xs text-gray-500">{sale.refNo}</td>
                    <td className="px-4 py-3.5 border-l border-gray-100 text-gray-700 text-xs">{sale.cashier}</td>
                    <td className="px-4 py-3.5 border-l border-gray-100 font-medium text-gray-800 text-xs">{sale.customer}</td>
                    <td className="px-4 py-3.5 border-l border-gray-100 text-center">
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold", statusConfig[sale.saleStatus]?.cls)}>
                        {statusConfig[sale.saleStatus]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-l border-gray-100 font-bold text-gray-800">{sale.grandTotal.toFixed(2)}</td>
                    <td className="px-4 py-3.5 border-l border-gray-100 text-gray-500">{sale.paid.toFixed(2)}</td>
                    <td className="px-4 py-3.5 border-l border-gray-100">
                      <span className={sale.remaining > 0 ? "text-rose-500 font-bold" : "text-gray-400"}>
                        {sale.remaining.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-l border-gray-100 text-center">
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold", paymentStatusConfig[sale.paymentStatus]?.cls)}>
                        {paymentStatusConfig[sale.paymentStatus]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-l border-gray-100 text-center">
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-lg">
                        {sale.paymentType}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3 text-center relative action-menu-container overflow-visible">
                      <button
                        onClick={e => { e.stopPropagation(); setActiveActionMenu(activeActionMenu === sale.id ? null : sale.id); }}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 mx-auto hover:bg-indigo-700 transition-all active:scale-95 shadow-sm"
                      >
                        الإجراءات <ChevronDown size={11} />
                      </button>
                      <AnimatePresence>
                        {activeActionMenu === sale.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.97 }}
                            transition={{ duration: 0.13 }}
                            className="absolute end-0 top-full mt-1.5 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-[200] py-1.5 text-right overflow-hidden"
                          >
                            {actionItems.map((item, i) =>
                              item === null ? (
                                <div key={`sep-${i}`} className="my-1 border-t border-gray-100" />
                              ) : (
                                <button key={item.key}
                                  onClick={() => handleActionClick(item.key, sale)}
                                  className="w-full px-4 py-2 text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-end gap-2.5 transition-colors"
                                >
                                  {item.label}
                                  <span className="text-gray-400">{item.icon}</span>
                                </button>
                              )
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </tr>
                ))}
              </tbody>

              {!loading && filtered.length > 0 && (
                <tfoot>
                  <tr className="bg-indigo-50/60 border-t-2 border-indigo-100 text-xs font-bold text-indigo-800">
                    <td colSpan={7} className="px-4 py-3.5 text-right border-l border-indigo-100">الإجمالي</td>
                    <td className="px-4 py-3.5 border-l border-indigo-100">{totals.grandTotal.toFixed(2)}</td>
                    <td className="px-4 py-3.5 border-l border-indigo-100">{totals.paid.toFixed(2)}</td>
                    <td className="px-4 py-3.5 border-l border-indigo-100 text-rose-600">{totals.remaining.toFixed(2)}</td>
                    <td colSpan={3} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 mt-5">
            <p className="text-xs text-gray-400">
              عرض <span className="font-bold text-gray-600">{Math.min((currentPage-1)*showCount+1, filtered.length)}</span> إلى <span className="font-bold text-gray-600">{Math.min(currentPage*showCount, filtered.length)}</span> من <span className="font-bold text-gray-600">{filtered.length}</span> سجل
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setCurrentPage(p => Math.max(1,p-1))} disabled={currentPage===1}
                className="px-3 py-1.5 border border-gray-200 rounded-xl text-gray-500 text-xs hover:bg-gray-50 disabled:opacity-40 flex items-center gap-1 transition-colors">
                <ChevronRight size={13} /> سابق
              </button>
              {Array.from({ length: totalPages }, (_,i) => i+1)
                .filter(p => p===1 || p===totalPages || Math.abs(p-currentPage)<=1)
                .map((page, idx, arr) => (
                  <React.Fragment key={page}>
                    {idx > 0 && arr[idx-1] !== page-1 && <span className="text-gray-300 text-xs px-1">…</span>}
                    <button onClick={() => setCurrentPage(page)}
                      className={cn("w-8 h-8 rounded-xl text-xs font-medium transition-all",
                        page === currentPage ? "bg-indigo-600 text-white shadow-sm" : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                      )}>
                      {page}
                    </button>
                  </React.Fragment>
                ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages,p+1))} disabled={currentPage===totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-xl text-gray-500 text-xs hover:bg-gray-50 disabled:opacity-40 flex items-center gap-1 transition-colors">
                التالي <ChevronLeft size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── MODALS ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <AddInvoiceModal
            onClose={() => setShowAddModal(false)}
            onSuccess={fetchSales}
            toast={toast}
          />
        )}

        {showInvoiceDetails && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowInvoiceDetails(null)}>
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 16 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl my-8 overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="bg-gradient-to-l from-indigo-700 to-indigo-500 px-7 py-5 flex justify-between items-center">
                <button onClick={() => setShowInvoiceDetails(null)} className="p-2 rounded-xl hover:bg-white/15 text-white/70 hover:text-white transition-colors"><X size={20} /></button>
                <div className="text-right text-white">
                  <p className="text-xs text-white/60 mb-0.5">تفاصيل الفاتورة</p>
                  <h2 className="text-xl font-bold">#{showInvoiceDetails.invoiceNo}</h2>
                </div>
              </div>
              <div className="p-7 space-y-6 text-right" dir="rtl">
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-gray-400">العميل</p>
                    <p className="font-bold text-gray-800">{showInvoiceDetails.customer}</p>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                      <FileText size={28} className="text-indigo-300" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-gray-400">الكاشير</p>
                    <p className="font-bold text-gray-800">{showInvoiceDetails.cashier}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50/60 px-5 py-4 flex flex-wrap justify-between gap-4">
                  {[
                    { label: 'التاريخ', value: showInvoiceDetails.date },
                    { label: 'الرقم المرجعي', value: showInvoiceDetails.refNo },
                    { label: 'حالة الفاتورة', value: statusConfig[showInvoiceDetails.saleStatus]?.label },
                    { label: 'حالة الدفع', value: paymentStatusConfig[showInvoiceDetails.paymentStatus]?.label },
                  ].map(r => (
                    <div key={r.label} className="space-y-1">
                      <p className="text-xs text-gray-400 font-medium">{r.label}</p>
                      <p className="text-sm font-semibold text-gray-700">{r.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'المجموع الكلي', value: showInvoiceDetails.grandTotal.toFixed(2), cls: 'bg-indigo-50 text-indigo-700' },
                    { label: 'مدفوع', value: showInvoiceDetails.paid.toFixed(2), cls: 'bg-emerald-50 text-emerald-700' },
                    { label: 'المتبقي', value: showInvoiceDetails.remaining.toFixed(2), cls: 'bg-rose-50 text-rose-600' },
                  ].map(c => (
                    <div key={c.label} className={cn("rounded-2xl px-5 py-4 text-center", c.cls)}>
                      <p className="text-xs font-medium opacity-70 mb-1">{c.label}</p>
                      <p className="text-xl font-black">{c.value}</p>
                      <p className="text-xs opacity-60">ر.س</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3 justify-center pt-2 border-t border-gray-100">
                  {[
                    { icon: <Printer size={15} />, label: 'طباعة' },
                    { icon: <Download size={15} />, label: 'تحميل PDF' },
                    { icon: <Mail size={15} />, label: 'إرسال' },
                  ].map(b => (
                    <button key={b.label} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 active:scale-95 transition-all shadow-sm">
                      {b.icon} {b.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showPayments && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowPayments(null)}>
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 16 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}>
              <div className="px-6 py-5 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <button onClick={() => setShowPayments(null)} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-400"><X size={20} /></button>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-0.5">المدفوعات</p>
                  <h2 className="text-sm font-bold text-indigo-600">{showPayments.refNo}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="rounded-2xl overflow-hidden border border-gray-100">
                  <table className="w-full text-sm text-right border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-l from-indigo-700 to-indigo-500 text-white text-xs">
                        {['التاريخ','الرقم المرجعي','المبلغ','نوع الدفع','الإجراءات'].map(h => (
                          <th key={h} className="px-4 py-3 font-semibold border-l border-white/10 last:border-0">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-4 py-3.5 text-gray-500 text-xs border-l border-gray-100">{showPayments.date}</td>
                        <td className="px-4 py-3.5 font-mono text-xs border-l border-gray-100">PAY-{showPayments.id}</td>
                        <td className="px-4 py-3.5 font-bold text-gray-800 border-l border-gray-100">{showPayments.paid.toFixed(2)}</td>
                        <td className="px-4 py-3.5 border-l border-gray-100 text-xs">{showPayments.paymentType}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex justify-center gap-1.5">
                            <button className="p-1.5 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                            <button className="p-1.5 text-indigo-400 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast toasts={toast.toasts} remove={toast.remove} />
    </div>
  );
}