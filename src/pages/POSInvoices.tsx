import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Eye, Edit2, RotateCcw, Trash2,
  ChevronRight, ChevronLeft, Download, Printer,
  ChevronDown, LayoutGrid, PlusCircle, DollarSign,
  FileCheck, Truck, FileSpreadsheet, Mail,
  MessageCircle, X, Copy, Info, Building,
  RefreshCw, AlertCircle, CheckCircle, Clock,
  Search, Filter
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

// ─── TYPES ────────────────────────────────────────────────────────────────────
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
  paymentType: string;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const mockSales: SaleRecord[] = [
  { id: '1',  invoiceNo: '508', date: '23/02/2026 13:13:04', refNo: 'SALE/POS2026/02/0613', cashier: 'شركة اختبار', customer: 'عميل افتراضي', saleStatus: 'completed', grandTotal: 400.00, paid: 400.00, remaining: 0.00,  paymentStatus: 'paid',    paymentType: 'مدى' },
  { id: '2',  invoiceNo: '507', date: '23/02/2026 13:12:06', refNo: 'SALE/POS2026/02/0612', cashier: 'شركة اختبار', customer: 'عميل افتراضي', saleStatus: 'completed', grandTotal: 400.00, paid: 400.00, remaining: 0.00,  paymentStatus: 'paid',    paymentType: 'مدى' },
  { id: '3',  invoiceNo: '506', date: '23/02/2026 02:59:57', refNo: 'SALE/POS2026/02/0611', cashier: 'شركة اختبار', customer: 'شخص عام',      saleStatus: 'returned',  grandTotal:-500.00, paid:-500.00, remaining: 0.00,  paymentStatus: 'paid',    paymentType: 'مدى' },
  { id: '4',  invoiceNo: '505', date: '23/02/2026 02:58:48', refNo: 'SALE/POS2026/02/0611', cashier: 'شركة اختبار', customer: 'شخص عام',      saleStatus: 'completed', grandTotal: 500.00, paid: 500.00, remaining: 0.00,  paymentStatus: 'paid',    paymentType: 'مدى' },
  { id: '5',  invoiceNo: '504', date: '16/02/2026 20:39:44', refNo: 'SALE/POS2026/02/0610', cashier: 'شركة اختبار', customer: 'شخص عام',      saleStatus: 'completed', grandTotal: 150.00, paid: 150.00, remaining: 0.00,  paymentStatus: 'paid',    paymentType: 'مدى' },
  { id: '6',  invoiceNo: '503', date: '16/02/2026 20:39:34', refNo: 'SALE/POS2026/02/0609', cashier: 'شركة اختبار', customer: 'شخص عام',      saleStatus: 'completed', grandTotal: 400.00, paid: 400.00, remaining: 0.00,  paymentStatus: 'paid',    paymentType: 'مدى' },
  { id: '7',  invoiceNo: '502', date: '16/02/2026 20:25:58', refNo: 'SALE/POS2026/02/0608', cashier: 'شركة اختبار', customer: 'شخص عام',      saleStatus: 'completed', grandTotal: 500.00, paid: 500.00, remaining: 0.00,  paymentStatus: 'paid',    paymentType: 'مدى' },
  { id: '8',  invoiceNo: '501', date: '16/02/2026 20:24:03', refNo: 'SALE/POS2026/02/0607', cashier: 'شركة اختبار', customer: 'شخص عام',      saleStatus: 'completed', grandTotal: 500.00, paid: 500.00, remaining: 0.00,  paymentStatus: 'paid',    paymentType: 'مدى' },
  { id: '9',  invoiceNo: '500', date: '16/02/2026 19:13:23', refNo: 'SALE/POS2026/02/0606', cashier: 'شركة اختبار', customer: 'شخص عام',      saleStatus: 'completed', grandTotal: 250.00, paid: 250.00, remaining: 0.00,  paymentStatus: 'paid',    paymentType: 'مدى' },
  { id: '10', invoiceNo: '499', date: '12/02/2026 17:39:53', refNo: 'SALE/POS2026/02/0605', cashier: 'شركة اختبار', customer: 'شخص عام',      saleStatus: 'completed', grandTotal: 250.00, paid: 200.00, remaining: 50.00, paymentStatus: 'partial', paymentType: 'نقدي' },
];

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const statusConfig = {
  completed: { label: 'مكتملة', cls: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' },
  returned:  { label: 'مرتجع',  cls: 'bg-rose-100 text-rose-600 ring-1 ring-rose-200' },
};
const paymentStatusConfig = {
  paid:    { label: 'مدفوع',      cls: 'bg-emerald-100 text-emerald-700' },
  partial: { label: 'جزئي',       cls: 'bg-sky-100 text-sky-700' },
  unpaid:  { label: 'غير مدفوع', cls: 'bg-rose-100 text-rose-600' },
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
interface ToastItem { id: number; message: string; type: 'success' | 'error' | 'info' }

function Toast({ toasts, remove }: { toasts: ToastItem[]; remove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 left-6 z-[999] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, x: -40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -40, scale: 0.95 }}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium min-w-[260px]",
              t.type === 'success' ? "bg-emerald-600 text-white" :
              t.type === 'error'   ? "bg-rose-600 text-white" : "bg-gray-800 text-white"
            )}>
            {t.type === 'success' ? <CheckCircle size={16} /> : t.type === 'error' ? <AlertCircle size={16} /> : <Clock size={16} />}
            <span>{t.message}</span>
            <button onClick={() => remove(t.id)} className="mr-auto opacity-70 hover:opacity-100"><X size={14} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const add = useCallback((message: string, type: ToastItem['type'] = 'info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  const remove = useCallback((id: number) => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, add, remove };
}

// ─── MODAL SHELL ─────────────────────────────────────────────────────────────
function ModalShell({ onClose, title, subtitle, children, maxW = 'max-w-2xl' }: {
  onClose: () => void; title: string; subtitle?: string; children: React.ReactNode; maxW?: string;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 20 }} transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className={cn("bg-white rounded-3xl w-full shadow-2xl my-6 overflow-hidden", maxW)}
        onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-l from-indigo-700 to-indigo-500 px-7 py-5 flex justify-between items-center">
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/15 text-white/70 hover:text-white transition-colors"><X size={20} /></button>
          <div className="text-right text-white">
            {subtitle && <p className="text-xs text-white/60">{subtitle}</p>}
            <h2 className="text-lg font-bold">{title}</h2>
          </div>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

// ─── SIMPLIFIED INVOICE ───────────────────────────────────────────────────────
function SimplifiedInvoiceModal({ sale, onClose }: { sale: SaleRecord; onClose: () => void }) {
  return (
    <ModalShell onClose={onClose} title="فاتورة مبسّطة" subtitle="معاينة" maxW="max-w-sm">
      <div className="p-6 text-sm text-center space-y-4 font-mono" dir="rtl">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center">
            <Building size={30} className="text-indigo-300" />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-base text-gray-900">شركة اختبار</h3>
          <p className="text-xs text-gray-500">الرياض - الملقا - سعود بن فيصل</p>
          <p className="text-xs font-bold text-indigo-600 mt-1">فاتورة مبيعات</p>
        </div>
        <div className="text-right space-y-1 border-t border-dashed pt-3 text-xs text-gray-600">
          <p><span className="font-bold text-gray-800">رقم الفاتورة:</span> {sale.invoiceNo}</p>
          <p><span className="font-bold text-gray-800">التاريخ:</span> {sale.date}</p>
          <p><span className="font-bold text-gray-800">العميل:</span> {sale.customer}</p>
        </div>
        <table className="w-full text-right border-t border-b border-dashed py-2 text-xs">
          <thead><tr className="text-gray-500"><th className="py-1">بيان الصنف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead>
          <tbody className="text-gray-700">
            <tr><td className="py-1">عباية كريب</td><td>1.00</td><td>250.00</td><td>250.00</td></tr>
            <tr><td className="py-1">صنف جديد</td><td>1.00</td><td>150.00</td><td>150.00</td></tr>
          </tbody>
        </table>
        <div className="flex justify-between font-bold text-sm">
          <span className="text-indigo-600">{sale.grandTotal.toFixed(2)} ر.س</span>
          <span>اجمالي الفاتورة</span>
        </div>
        <p className="text-xs text-gray-400">أربعمائة ريال سعودي فقط لا غير</p>
        <div className="border-t border-dashed pt-2 text-xs text-gray-400">شكراً لزيارتكم · للإرجاع خلال 48 ساعة</div>
        <div className="flex justify-center pt-1">
          <div className="w-20 h-20 p-1 border border-gray-100 rounded-xl overflow-hidden">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=invoice-${sale.invoiceNo}`} alt="QR" className="w-full h-full" />
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
          <Printer size={15} /> طباعة
        </button>
      </div>
    </ModalShell>
  );
}

// ─── TAX INVOICE ──────────────────────────────────────────────────────────────
function TaxInvoiceModal({ sale, onClose }: { sale: SaleRecord; onClose: () => void }) {
  return (
    <ModalShell onClose={onClose} title={`فاتورة ضريبية — #${sale.invoiceNo}`} subtitle="معاينة" maxW="max-w-4xl">
      <div className="p-8 space-y-6" dir="rtl">
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <h2 className="text-lg font-bold text-indigo-700">شركة اختبار</h2>
            <p className="text-xs text-gray-500">الرياض - الملقا - سعود بن فيصل</p>
            <p className="text-xs text-gray-500">السجل التجاري: 1234123123 · هاتف: 0146580073</p>
          </div>
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
            <Building size={30} className="text-indigo-200" />
          </div>
        </div>
        <div className="bg-gradient-to-l from-indigo-700 to-indigo-500 text-white text-center py-2.5 rounded-xl font-bold text-sm">فاتورة مبيعات</div>
        <div className="rounded-2xl border border-gray-100 overflow-hidden text-xs text-center">
          <div className="grid grid-cols-4">
            {['رقم الفاتورة','الرقم المرجعي','تاريخ الإصدار','نوع الفاتورة'].map(h => (
              <div key={h} className="bg-gray-50 px-3 py-2.5 font-semibold text-gray-600 border-l border-b border-gray-100 last:border-l-0">{h}</div>
            ))}
            {[sale.invoiceNo, sale.refNo, sale.date, 'فاتورة شبكة'].map((v, i) => (
              <div key={i} className="px-3 py-2.5 text-gray-700 border-l border-gray-100 last:border-l-0">{v}</div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['م','وصف السلعة','الكمية','سعر الوحدة','الإجمالي'].map(h => (
                  <th key={h} className="p-2.5 border border-gray-100 font-semibold text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[[1,'صنف جديد','1.00','150.00','150.00'],[2,'عباية كريب مع اكمام مموجه','1.00','250.00','250.00']].map(row => (
                <tr key={String(row[0])} className="hover:bg-gray-50/50">
                  {row.map((cell, i) => <td key={i} className="p-2.5 border border-gray-100 text-gray-700">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-end">
          <div className="text-xs space-y-1">
            <p className="text-gray-500">نوع الدفع: شبكة</p>
            <p className="font-bold text-gray-800">المدفوع: {sale.paid.toFixed(2)} ر.س</p>
            <p className="text-rose-500">المتبقي: {sale.remaining.toFixed(2)} ر.س</p>
          </div>
          <p className="text-xs text-gray-400">شكراً لزيارتكم · للإرجاع خلال 48 ساعة</p>
        </div>
        <div className="grid grid-cols-4 rounded-2xl overflow-hidden border border-indigo-100">
          {[{ icon: <DollarSign size={15} />, label: 'دفع' }, { icon: <Truck size={15} />, label: 'التسليم' }, { icon: <Mail size={15} />, label: 'البريد' }, { icon: <Download size={15} />, label: 'PDF' }].map(({ icon, label }) => (
            <button key={label} className="bg-gradient-to-l from-indigo-700 to-indigo-500 text-white py-3 flex items-center justify-center gap-2 text-sm font-semibold border-l border-white/20 first:border-l-0 hover:opacity-90 transition-opacity">
              {icon} {label}
            </button>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

// ─── INVOICE DETAILS ──────────────────────────────────────────────────────────
function InvoiceDetailsModal({ sale, onClose }: { sale: SaleRecord; onClose: () => void }) {
  return (
    <ModalShell onClose={onClose} title={`#${sale.invoiceNo}`} subtitle="تفاصيل الفاتورة" maxW="max-w-4xl">
      <div className="p-7 space-y-6 text-right" dir="rtl">
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-gray-400">العميل</p>
            <p className="font-bold text-gray-800">{sale.customer}</p>
          </div>
          <div className="flex justify-center items-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <FileText size={28} className="text-indigo-300" />
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-gray-400">الكاشير</p>
            <p className="font-bold text-gray-800">{sale.cashier}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50/60 px-5 py-4 flex flex-wrap justify-between gap-4">
          {[{ label: 'التاريخ', value: sale.date }, { label: 'الرقم المرجعي', value: sale.refNo }, { label: 'حالة الفاتورة', value: statusConfig[sale.saleStatus]?.label }, { label: 'حالة الدفع', value: paymentStatusConfig[sale.paymentStatus]?.label }].map(r => (
            <div key={r.label} className="space-y-1">
              <p className="text-xs text-gray-400 font-medium">{r.label}</p>
              <p className="text-sm font-semibold text-gray-700">{r.value}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'المجموع الكلي', value: sale.grandTotal.toFixed(2), cls: 'bg-indigo-50 text-indigo-700' },
            { label: 'مدفوع',        value: sale.paid.toFixed(2),        cls: 'bg-emerald-50 text-emerald-700' },
            { label: 'المتبقي',      value: sale.remaining.toFixed(2),   cls: 'bg-rose-50 text-rose-600' },
          ].map(c => (
            <div key={c.label} className={cn('rounded-2xl px-5 py-4 text-center', c.cls)}>
              <p className="text-xs font-medium opacity-70 mb-1">{c.label}</p>
              <p className="text-xl font-black">{c.value}</p>
              <p className="text-xs opacity-60">ر.س</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 justify-center pt-2 border-t border-gray-100">
          {[{ icon: <Printer size={15} />, label: 'طباعة' }, { icon: <Download size={15} />, label: 'تحميل PDF' }, { icon: <Mail size={15} />, label: 'إرسال' }].map(b => (
            <button key={b.label} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 active:scale-95 transition-all shadow-sm">
              {b.icon} {b.label}
            </button>
          ))}
        </div>
      </div>
    </ModalShell>
  );
}

// ─── PAYMENTS MODAL ───────────────────────────────────────────────────────────
function PaymentsModal({ sale, onClose }: { sale: SaleRecord; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 16 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-400"><X size={20} /></button>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-0.5">المدفوعات</p>
            <h2 className="text-sm font-bold text-indigo-600">{sale.refNo}</h2>
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
                  <td className="px-4 py-3.5 text-gray-500 text-xs border-l border-gray-100">{sale.date}</td>
                  <td className="px-4 py-3.5 font-mono text-xs border-l border-gray-100">IPAY2026/02/0622</td>
                  <td className="px-4 py-3.5 font-bold text-gray-800 border-l border-gray-100">{sale.paid.toFixed(2)} ر.س</td>
                  <td className="px-4 py-3.5 text-xs border-l border-gray-100">{sale.paymentType}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex justify-center gap-1.5">
                      <button className="p-1.5 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      <button className="p-1.5 text-indigo-400 hover:bg-indigo-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                      <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"><Mail size={14} /></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── ADD PAYMENT MODAL ────────────────────────────────────────────────────────
function AddPaymentModal({ sale, onClose, toast }: { sale: SaleRecord; onClose: () => void; toast: ReturnType<typeof useToast> }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ date: '', refNo: `IPAY2026/02/${sale.id.padStart(4,'0')}`, amount: '0', type: 'شبكة', notes: '' });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 bg-white transition-all text-right";
  const labelCls = "block text-xs font-bold text-gray-500 text-right mb-1.5";
  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    toast.add('تم إضافة الدفع بنجاح', 'success');
    setLoading(false);
    onClose();
  };
  return (
    <ModalShell onClose={onClose} title="إضافة دفعة" subtitle={`فاتورة #${sale.invoiceNo}`} maxW="max-w-xl">
      <div className="p-7 space-y-5 text-right" dir="rtl">
        <p className="text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
          الحقول المشار إليها بـ <span className="text-rose-500 font-bold">*</span> إلزامية
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>التاريخ <span className="text-rose-500">*</span></label><input type="datetime-local" className={inputCls} value={form.date} onChange={e => set('date', e.target.value)} /></div>
          <div><label className={labelCls}>الرقم المرجعي <span className="text-rose-500">*</span></label><input type="text" className={inputCls} value={form.refNo} onChange={e => set('refNo', e.target.value)} /></div>
          <div><label className={labelCls}>المبلغ <span className="text-rose-500">*</span></label><input type="number" className={inputCls} value={form.amount} onChange={e => set('amount', e.target.value)} /></div>
          <div>
            <label className={labelCls}>نوع الدفع <span className="text-rose-500">*</span></label>
            <select className={inputCls} value={form.type} onChange={e => set('type', e.target.value)}>
              <option>شبكة</option><option>نقدي</option><option>تحويل بنكي</option>
            </select>
          </div>
        </div>
        <div><label className={labelCls}>ملاحظات</label><textarea className={cn(inputCls,'h-20 resize-none')} value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
        <div className="flex justify-end gap-3 pt-1">
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">إلغاء</button>
          <button onClick={handleSubmit} disabled={loading} className="px-7 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60 flex items-center gap-2">
            {loading && <RefreshCw size={14} className="animate-spin" />}
            {loading ? 'جاري الحفظ...' : 'إضافة الدفع'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── DELIVERY MODAL ───────────────────────────────────────────────────────────
function DeliveryModal({ sale, onClose, toast }: { sale: SaleRecord; onClose: () => void; toast: ReturnType<typeof useToast> }) {
  const [loading, setLoading] = useState(false);
  const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 bg-white transition-all text-right";
  const labelCls = "block text-xs font-bold text-gray-500 text-right mb-1.5";
  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    toast.add('تم تعديل التسليم بنجاح', 'success');
    setLoading(false);
    onClose();
  };
  return (
    <ModalShell onClose={onClose} title="تعديل تسليم" subtitle={`فاتورة #${sale.invoiceNo}`} maxW="max-w-3xl">
      <div className="p-7 space-y-5 text-right" dir="rtl">
        <div className="grid grid-cols-2 gap-4">
          <div><label className={labelCls}>التاريخ <span className="text-rose-500">*</span></label><input type="datetime-local" className={inputCls} /></div>
          <div><label className={labelCls}>الرقم المرجعي للتسليم <span className="text-rose-500">*</span></label><input type="text" defaultValue="DO2026/02/0004" className={inputCls} /></div>
          <div><label className={labelCls}>الرقم المرجعي للبيع <span className="text-rose-500">*</span></label><input type="text" defaultValue={sale.refNo} className={inputCls} /></div>
          <div><label className={labelCls}>العميل <span className="text-rose-500">*</span></label><input type="text" defaultValue={sale.customer} className={inputCls} /></div>
          <div>
            <label className={labelCls}>الحالة <span className="text-rose-500">*</span></label>
            <select className={inputCls}><option>جاري العمل عليه</option><option>تم التوصيل</option><option>فشل التوصيل</option></select>
          </div>
          <div><label className={labelCls}>تمت عملية التوصيل من قبل</label><input type="text" className={inputCls} /></div>
          <div><label className={labelCls}>تم الاستلام من قبل</label><input type="text" className={inputCls} /></div>
          <div className="col-span-2"><label className={labelCls}>ملاحظات</label><textarea className={cn(inputCls,'h-20 resize-none')} /></div>
        </div>
        <div className="flex justify-end gap-3 pt-1">
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">إلغاء</button>
          <button onClick={handleSubmit} disabled={loading} className="px-7 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60 flex items-center gap-2">
            {loading && <RefreshCw size={14} className="animate-spin" />}
            {loading ? 'جاري الحفظ...' : 'تعديل التسليم'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function POSInvoices() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const toast = useToast();

  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCount, setShowCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showTopMenu, setShowTopMenu] = useState(false);

  const [showSimplified, setShowSimplified] = useState<SaleRecord | null>(null);
  const [showTax, setShowTax] = useState<SaleRecord | null>(null);
  const [showDetails, setShowDetails] = useState<SaleRecord | null>(null);
  const [showPayments, setShowPayments] = useState<SaleRecord | null>(null);
  const [showAddPayment, setShowAddPayment] = useState<SaleRecord | null>(null);
  const [showDelivery, setShowDelivery] = useState<SaleRecord | null>(null);

  const [filters, setFilters] = useState({ refNo: '', invoiceNo: '', customer: '', fromDate: '', toDate: '', grandTotal: '' });

  const fetchSales = useCallback(() => {
    setLoading(true);
    setTimeout(() => { setSales(mockSales); setLoading(false); }, 600);
  }, []);

  useEffect(() => { fetchSales(); }, [fetchSales]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.action-menu-container')) setActiveActionMenu(null);
      if (!(e.target as HTMLElement).closest('.top-menu-container')) setShowTopMenu(false);
    };
    window.addEventListener('click', h);
    return () => window.removeEventListener('click', h);
  }, []);

  const filtered = sales.filter(s =>
    !searchTerm || s.invoiceNo.includes(searchTerm) || s.refNo.toLowerCase().includes(searchTerm.toLowerCase()) || s.customer.includes(searchTerm)
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / showCount));
  const paginated = filtered.slice((currentPage - 1) * showCount, currentPage * showCount);
  const totals = filtered.reduce((a, s) => ({ grandTotal: a.grandTotal + s.grandTotal, paid: a.paid + s.paid, remaining: a.remaining + s.remaining }), { grandTotal: 0, paid: 0, remaining: 0 });

  const actionItems = [
    { key: 'simplified',         label: 'فاتورة مبسّطة',     icon: <FileText size={14} /> },
    { key: 'tax',                label: 'فاتورة ضريبية',     icon: <FileText size={14} /> },
    { key: 'details',            label: 'تفاصيل الفاتورة',  icon: <Eye size={14} /> },
    null,
    { key: 'duplicate',          label: 'تكرار الفاتورة',    icon: <Copy size={14} /> },
    { key: 'return',             label: 'إرجاع مبيع',        icon: <RotateCcw size={14} /> },
    null,
    { key: 'payments',           label: 'عرض المدفوعات',     icon: <DollarSign size={14} /> },
    { key: 'add_payment',        label: 'إضافة دفع',         icon: <DollarSign size={14} /> },
    null,
    { key: 'warehouse_receipt',  label: 'سند مخزني',         icon: <FileCheck size={14} /> },
    { key: 'claim_receipt',      label: 'سند مطالبة',        icon: <Info size={14} /> },
    { key: 'add_delivery',       label: 'إضافة تسليم',       icon: <Truck size={14} /> },
    null,
    { key: 'download_pdf',       label: 'تحميل PDF',         icon: <FileText size={14} /> },
    { key: 'send_email',         label: 'إرسال بريد',        icon: <Mail size={14} /> },
    { key: 'send_whatsapp',      label: 'واتساب',            icon: <MessageCircle size={14} /> },
  ] as const;

  const handleAction = (action: string, sale: SaleRecord) => {
    setActiveActionMenu(null);
    if (action === 'simplified')    { setShowSimplified(sale); return; }
    if (action === 'tax')           { setShowTax(sale); return; }
    if (action === 'details')       { setShowDetails(sale); return; }
    if (action === 'payments')      { setShowPayments(sale); return; }
    if (action === 'add_payment')   { setShowAddPayment(sale); return; }
    if (action === 'add_delivery')  { setShowDelivery(sale); return; }
    if (action === 'return')        { navigate(`/sales/pos-invoices/return/${sale.id}`); return; }
    if (action === 'duplicate') {
      setSales(p => [{ ...sale, id: Math.random().toString(36).slice(2), invoiceNo: (Math.max(...p.map(s => parseInt(s.invoiceNo)||0))+1).toString(), date: new Date().toLocaleString('ar-SA') }, ...p]);
      toast.add('تم تكرار الفاتورة', 'success'); return;
    }
    toast.add('تم تنفيذ الإجراء', 'info');
  };

  const stats = [
    { label: 'إجمالي المبيعات', value: totals.grandTotal.toFixed(2), unit: 'ر.س',    color: 'from-indigo-500 to-indigo-700',   icon: <FileText size={20} /> },
    { label: 'المدفوع',         value: totals.paid.toFixed(2),       unit: 'ر.س',    color: 'from-emerald-500 to-emerald-700', icon: <CheckCircle size={20} /> },
    { label: 'المتبقي',         value: totals.remaining.toFixed(2),  unit: 'ر.س',    color: 'from-rose-500 to-rose-700',       icon: <AlertCircle size={20} /> },
    { label: 'عدد الفواتير',    value: String(filtered.length),      unit: 'فاتورة', color: 'from-violet-500 to-violet-700',   icon: <LayoutGrid size={20} /> },
  ];

  const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 bg-white transition-all text-right";

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50/70 p-5 space-y-5">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <span className="hover:text-indigo-600 cursor-pointer transition-colors">{t('الرئيسية')}</span>
        <ChevronLeft size={11} className="text-gray-300" />
        <span className="hover:text-indigo-600 cursor-pointer transition-colors">{t('نقاط البيع ')}</span>
        <ChevronLeft size={11} className="text-gray-300" />
        <span className="text-gray-700 font-semibold">{t('فاتورة ضريبيه مبسطه')}</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 text-white shadow-lg`}>
            <div className="flex justify-between items-start mb-3">
              <div className="bg-white/20 rounded-xl p-2">{s.icon}</div>
              <span className="text-xs text-white/70 font-medium">{s.label}</span>
            </div>
            <p className="text-2xl font-black tracking-tight">{s.value}</p>
            <p className="text-xs text-white/60 mt-0.5">{s.unit}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={fetchSales} disabled={loading}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-all">
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => setShowFilters(!showFilters)}
              className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
                showFilters ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600")}>
              <Filter size={14} /> فلترة
            </button>
            <div className="relative top-menu-container">
              <button onClick={() => setShowTopMenu(!showTopMenu)}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                <PlusCircle size={14} /> إضافة
              </button>
              <AnimatePresence>
                {showTopMenu && (
                  <motion.div initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.13 }}
                    className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-1.5 min-w-[200px] overflow-hidden">
                    <button onClick={() => { navigate('/sales/pos'); setShowTopMenu(false); }}
                      className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-end gap-2.5 transition-colors font-medium">
                      عملية بيع جديدة <PlusCircle size={15} className="text-indigo-500" />
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
              <h1 className="text-base font-bold text-gray-800 text-right leading-tight">{t('فواتير ضريبية مبسطة')}</h1>
              <p className="text-xs text-gray-400 text-right mt-0.5">{t('all_branches')} · {t('البيانات لاخر 30 يوم ')}</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <FileText size={18} className="text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Info strip */}
        <div className="px-6 py-2.5 bg-indigo-50/60 border-b border-indigo-100/80 flex items-center justify-end gap-2">
          <p className="text-xs text-indigo-600 font-medium">البيانات الظاهرة لآخر 30 يوم — استخدم الفلتر لتضييق النتائج</p>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
        </div>

        <div className="p-6">

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden mb-6">
                <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/80 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[{ label: 'الرقم المرجعي', key: 'refNo' }, { label: 'رقم الفاتورة', key: 'invoiceNo' }, { label: 'المجموع الكلي', key: 'grandTotal' }].map(({ label, key }) => (
                      <div key={key}>
                        <label className="block text-xs font-bold text-gray-500 text-right mb-1.5">{label}</label>
                        <input type="text" value={filters[key as keyof typeof filters]} onChange={e => setFilters(p => ({ ...p, [key]: e.target.value }))} className={inputCls} />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 text-right mb-1.5">العميل</label>
                      <select value={filters.customer} onChange={e => setFilters(p => ({ ...p, customer: e.target.value }))} className={inputCls}>
                        <option value="">جميع العملاء</option><option>عميل افتراضي</option><option>شخص عام</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 text-right mb-1.5">من تاريخ</label>
                      <input type="date" value={filters.fromDate} onChange={e => setFilters(p => ({ ...p, fromDate: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 text-right mb-1.5">إلى تاريخ</label>
                      <input type="date" value={filters.toDate} onChange={e => setFilters(p => ({ ...p, toDate: e.target.value }))} className={inputCls} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setFilters({ refNo:'',invoiceNo:'',customer:'',fromDate:'',toDate:'',grandTotal:'' })}
                      className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors">إعادة تعيين</button>
                    <button onClick={fetchSales} className="px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">بحث</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Table Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">اظهر</span>
              <select value={showCount} onChange={e => { setShowCount(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-indigo-400 bg-white">
                {[10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span className="text-sm text-gray-400">سجل</span>
            </div>
            <div className="relative w-full md:w-72">
              <Search size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="بحث في الفواتير..." value={searchTerm}
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
                    <input type="checkbox" className="rounded border-white/30" />
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
                  <tr><td colSpan={13} className="text-center py-16 text-gray-400">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-indigo-400" />
                    <p className="text-sm">جاري تحميل البيانات...</p>
                  </td></tr>
                )}
                {!loading && paginated.length === 0 && (
                  <tr><td colSpan={13} className="text-center py-16 text-gray-400">
                    <FileText size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">لا توجد فواتير</p>
                  </td></tr>
                )}
                {!loading && paginated.map((sale, idx) => (
                  <tr key={sale.id} className={cn("border-b border-gray-50 last:border-0 transition-colors", idx % 2 === 0 ? "bg-white" : "bg-gray-50/30", "hover:bg-indigo-50/30")}>
                    <td className="px-3 py-3.5 text-center border-l border-gray-100">
                      <input type="checkbox" className="rounded border-gray-300 accent-indigo-500" />
                    </td>
                    <td className="px-4 py-3.5 border-l border-gray-100">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg text-xs">#{sale.invoiceNo}</span>
                    </td>
                    <td className="px-4 py-3.5 border-l border-gray-100 text-gray-400 text-xs whitespace-nowrap">{sale.date}</td>
                    <td className="px-4 py-3.5 border-l border-gray-100 font-mono text-xs text-gray-500">{sale.refNo}</td>
                    <td className="px-4 py-3.5 border-l border-gray-100 text-gray-600 text-xs">{sale.cashier}</td>
                    <td className="px-4 py-3.5 border-l border-gray-100 font-medium text-gray-800 text-xs">{sale.customer}</td>
                    <td className="px-4 py-3.5 border-l border-gray-100 text-center">
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold", statusConfig[sale.saleStatus]?.cls)}>
                        {statusConfig[sale.saleStatus]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-l border-gray-100 font-bold text-gray-800">
                      <span className={sale.grandTotal < 0 ? 'text-rose-500' : ''}>{sale.grandTotal.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3.5 border-l border-gray-100 text-gray-500">{sale.paid.toFixed(2)}</td>
                    <td className="px-4 py-3.5 border-l border-gray-100">
                      <span className={sale.remaining > 0 ? "text-rose-500 font-bold" : "text-gray-400"}>{sale.remaining.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3.5 border-l border-gray-100 text-center">
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold", paymentStatusConfig[sale.paymentStatus]?.cls)}>
                        {paymentStatusConfig[sale.paymentStatus]?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 border-l border-gray-100 text-center">
                      <span className="inline-flex items-center bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-lg">{sale.paymentType}</span>
                    </td>
                    <td className="px-3 py-3 text-center relative action-menu-container overflow-visible">
                      <button
                        onClick={e => { e.stopPropagation(); setActiveActionMenu(activeActionMenu === sale.id ? null : sale.id); }}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 mx-auto hover:bg-indigo-700 transition-all active:scale-95 shadow-sm">
                        الإجراءات <ChevronDown size={11} className={cn("transition-transform", activeActionMenu === sale.id && "rotate-180")} />
                      </button>
                      <AnimatePresence>
                        {activeActionMenu === sale.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.13 }}
                            className="absolute end-0 top-full mt-1.5 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-[200] py-1.5 text-right overflow-hidden">
                            {actionItems.map((item, i) =>
                              item === null ? (
                                <div key={`sep-${i}`} className="my-1 border-t border-gray-100" />
                              ) : (
                                <button key={item.key} onClick={() => handleAction(item.key, sale)}
                                  className="w-full px-4 py-2 text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-end gap-2.5 transition-colors">
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
                        page === currentPage ? "bg-indigo-600 text-white shadow-sm" : "border border-gray-200 text-gray-500 hover:bg-gray-50")}>
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

      {/* Modals */}
      <AnimatePresence>
        {showSimplified  && <SimplifiedInvoiceModal sale={showSimplified}  onClose={() => setShowSimplified(null)} />}
        {showTax         && <TaxInvoiceModal         sale={showTax}         onClose={() => setShowTax(null)} />}
        {showDetails     && <InvoiceDetailsModal     sale={showDetails}     onClose={() => setShowDetails(null)} />}
        {showPayments    && <PaymentsModal           sale={showPayments}    onClose={() => setShowPayments(null)} />}
        {showAddPayment  && <AddPaymentModal         sale={showAddPayment}  onClose={() => setShowAddPayment(null)} toast={toast} />}
        {showDelivery    && <DeliveryModal           sale={showDelivery}    onClose={() => setShowDelivery(null)}   toast={toast} />}
      </AnimatePresence>

      <Toast toasts={toast.toasts} remove={toast.remove} />
    </div>
  );
}