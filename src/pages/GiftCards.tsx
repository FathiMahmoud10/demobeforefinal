import React, { useState, useEffect, useCallback } from 'react';
import { 
  Gift, 
  Menu, 
  Plus, 
  FileSpreadsheet, 
  Trash2, 
  Search, 
  ChevronRight, 
  ChevronLeft,
  X,
  Settings,
  Edit2,
  Eye,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

// ─── API Types (matching the real API response) ───────────────────────────────
interface ApiCustomer {
  id: number;
  customerCode: number;
  customerName: string;
  phone: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  taxNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiGiftCard {
  id: number;
  code: string;
  initialAmount: number;
  remainingAmount: number;
  customerId: number;
  createdAt: string;
  expiryDate: string;
  isDeleted: boolean;
  notes: string;
  customer: ApiCustomer;
  isActive: boolean;
}

// ─── Create Payload ───────────────────────────────────────────────────────────
// Field name is "amount" per the API Swagger schema (not "initialAmount")
interface CreateGiftCardPayload {
  code: string;
  amount: number;
  customerId: number | null;
  expiryDate: string;
  notes: string;
}

const API_BASE = 'http://takamulerp.runasp.net/GiftCards';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('ar-EG', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
  } catch {
    return iso;
  }
};

const formatAmount = (n: number) => n.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function GiftCards() {
  const { direction, t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<ApiGiftCard | null>(null);
  const [showViewModal, setShowViewModal] = useState<ApiGiftCard | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCount, setShowCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // ─── Data State ─────────────────────────────────────────────────────────────
  const [giftCards, setGiftCards] = useState<ApiGiftCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ─── Form State ─────────────────────────────────────────────────────────────
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    value: '',
    customer: '',
    expiryDate: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState<{ cardNumber?: string; value?: string }>({});

  // ─── Fetch Gift Cards ────────────────────────────────────────────────────────
  const fetchGiftCards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE, {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ApiGiftCard[] = await res.json();
      // Filter out soft-deleted records
      setGiftCards(data.filter(c => !c.isDeleted));
    } catch (err: any) {
      setError(err.message || 'فشل في جلب البيانات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGiftCards(); }, [fetchGiftCards]);

  // ─── Close menu on outside click ────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.menu-container')) setShowMenu(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // ─── Generate Card Number ────────────────────────────────────────────────────
  const generateCardNumber = () => {
    const num = 'GC-' + Math.random().toString(36).substr(2, 8);
    setNewCard(prev => ({ ...prev, cardNumber: num }));
  };

  // ─── Validate Form ───────────────────────────────────────────────────────────
  const validate = () => {
    const errs: typeof formErrors = {};
    if (!newCard.cardNumber.trim()) errs.cardNumber = 'رقم الكارت مطلوب';
    if (!newCard.value || isNaN(Number(newCard.value)) || Number(newCard.value) <= 0)
      errs.value = 'القيمة مطلوبة ويجب أن تكون أكبر من صفر';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ─── Add Gift Card ───────────────────────────────────────────────────────────
  const handleAddCard = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload: CreateGiftCardPayload = {
        code: newCard.cardNumber.trim(),
        amount: Number(newCard.value),           // ✅ matches API schema field name
        customerId: newCard.customer ? Number(newCard.customer) : null,
        expiryDate: newCard.expiryDate
          ? new Date(newCard.expiryDate).toISOString()
          : new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
        notes: newCard.notes.trim()
      };

      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(errBody || `HTTP ${res.status}`);
      }

      // Refresh list from server
      await fetchGiftCards();
      setShowAddModal(false);
      setNewCard({ cardNumber: '', value: '', customer: '', expiryDate: '', notes: '' });
      setFormErrors({});
    } catch (err: any) {
      setError(err.message || 'فشل في إضافة الكارت');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete Gift Card ────────────────────────────────────────────────────────
  const handleDelete = async (card: ApiGiftCard) => {
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/${card.id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setGiftCards(prev => prev.filter(c => c.id !== card.id));
      setShowDeleteConfirm(null);
    } catch (err: any) {
      setError(err.message || 'فشل في حذف الكارت');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Filter + Paginate ───────────────────────────────────────────────────────
  const filtered = giftCards.filter(c =>
    !searchTerm ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.customer?.customerName?.includes(searchTerm) ||
    c.notes?.includes(searchTerm)
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / showCount));
  const paginated = filtered.slice((currentPage - 1) * showCount, currentPage * showCount);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4" dir={direction}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm px-2 text-gray-500">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('sales')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('gift_cards')}</span>
      </div>

      {/* Global Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm"
          >
            <AlertCircle size={16} className="shrink-0" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="hover:text-red-900"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary">
            <h1 className="text-lg font-bold">{t('gift_cards_list')}</h1>
            <Gift size={20} />
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh button */}
            <button
              onClick={fetchGiftCards}
              disabled={loading}
              className="p-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
              title="تحديث"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>

            <div className="relative menu-container">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Menu size={20} />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      "absolute z-50 top-full mt-2 bg-white rounded-md shadow-xl border border-gray-100 min-w-[200px] overflow-hidden",
                      direction === 'rtl' ? "right-0" : "left-0"
                    )}
                  >
                    <button
                      onClick={() => { setShowAddModal(true); setShowMenu(false); }}
                      className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 border-b border-gray-50 transition-colors"
                    >
                      <span className="text-gray-700 text-sm font-bold">{t('add_gift_card')}</span>
                      <Plus size={16} className="text-gray-600" />
                    </button>
                    <button className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 border-b border-gray-50 transition-colors">
                      <span className="text-gray-700 text-sm font-bold">{t('export_excel')}</span>
                      <FileSpreadsheet size={16} className="text-green-600" />
                    </button>
                    <button className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 transition-colors">
                      <span className="text-gray-700 text-sm font-bold">{t('delete_gift_cards')}</span>
                      <Trash2 size={16} className="text-primary" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-primary mb-6 text-right font-medium">
            {t('gift_cards_table_desc')}
          </p>

          {/* Table Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{t('show')}</span>
              <select
                value={showCount}
                onChange={(e) => { setShowCount(Number(e.target.value)); setCurrentPage(1); }}
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
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary text-right"
                />
              </div>
              <span className="text-sm text-gray-600 whitespace-nowrap">{t('search')}</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-16 gap-3 text-gray-500">
                <Loader2 size={24} className="animate-spin text-primary" />
                <span className="text-sm">جاري التحميل...</span>
              </div>
            ) : (
              <table className="w-full min-w-[1000px] text-sm text-right border-collapse">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-3 border border-primary-hover w-10 text-center">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="p-3 border border-primary-hover whitespace-nowrap">{t('card_no')}</th>
                    <th className="p-3 border border-primary-hover whitespace-nowrap">{t('value')}</th>
                    <th className="p-3 border border-primary-hover whitespace-nowrap">{t('balance')}</th>
                    <th className="p-3 border border-primary-hover whitespace-nowrap">تاريخ الإنشاء</th>
                    <th className="p-3 border border-primary-hover whitespace-nowrap">{t('notes')}</th>
                    <th className="p-3 border border-primary-hover whitespace-nowrap">{t('customer')}</th>
                    <th className="p-3 border border-primary-hover whitespace-nowrap">{t('expiry_date')}</th>
                    <th className="p-3 border border-primary-hover whitespace-nowrap">الحالة</th>
                    <th className="p-3 border border-primary-hover whitespace-nowrap w-28 text-center">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length > 0 ? (
                    paginated.map((card) => (
                      <tr key={card.id} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                        <td className="p-3 text-center border-x border-gray-200">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="p-3 border-x border-gray-200 font-medium font-mono text-xs">{card.code}</td>
                        <td className="p-3 border-x border-gray-200 font-bold">{formatAmount(card.initialAmount)}</td>
                        <td className="p-3 border-x border-gray-200">
                          <span className={cn(
                            "font-bold",
                            card.remainingAmount === 0 ? "text-red-500" : "text-green-600"
                          )}>
                            {formatAmount(card.remainingAmount)}
                          </span>
                        </td>
                        <td className="p-3 border-x border-gray-200 text-gray-500 text-xs">
                          {formatDate(card.createdAt)}
                        </td>
                        <td className="p-3 border-x border-gray-200 text-gray-600 max-w-[150px] truncate" title={card.notes}>
                          {card.notes || '-'}
                        </td>
                        <td className="p-3 border-x border-gray-200">
                          {card.customer?.customerName || '-'}
                        </td>
                        <td className="p-3 border-x border-gray-200 text-xs">
                          {formatDate(card.expiryDate)}
                        </td>
                        <td className="p-3 border-x border-gray-200 text-center">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-medium text-white",
                            card.isActive ? "bg-green-600" : "bg-gray-400"
                          )}>
                            {card.isActive ? 'فعّال' : 'غير فعّال'}
                          </span>
                        </td>
                        <td className="p-3 border-x border-gray-200 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setShowViewModal(card)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="عرض"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(card)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="حذف"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-gray-500 font-medium border border-gray-200">
                        {searchTerm ? 'لا توجد نتائج مطابقة للبحث' : t('no_data_in_table')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && filtered.length > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
              <div className="text-sm text-gray-600">
                {t('showing_records')} {Math.min((currentPage - 1) * showCount + 1, filtered.length)} {t('to')} {Math.min(currentPage * showCount, filtered.length)} {t('of')} {filtered.length} {t('records')}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronRight size={14} /> {t('previous')}
                </button>
                {getPageNumbers().map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "px-3 py-1 border rounded text-sm",
                      page === currentPage ? "border-primary bg-primary text-white" : "border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {t('next')} <ChevronLeft size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Add Gift Card Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => { setShowAddModal(false); setFormErrors({}); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <button onClick={() => { setShowAddModal(false); setFormErrors({}); }} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
                <h2 className="text-lg font-bold text-primary">{t('add_gift_card')}</h2>
              </div>

              <div className="p-6 space-y-5" dir={direction}>
                <p className="text-sm text-primary font-medium text-right">{t('add_product_desc')}</p>

                {/* Card Number */}
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-primary text-right">{t('card_no')} *</label>
                  <div className="flex gap-2">
                    <button
                      onClick={generateCardNumber}
                      className="bg-gray-100 p-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-200 transition-colors"
                      title="توليد رقم تلقائي"
                    >
                      <Settings size={18} />
                    </button>
                    <input
                      type="text"
                      value={newCard.cardNumber}
                      onChange={e => setNewCard(prev => ({ ...prev, cardNumber: e.target.value }))}
                      className={cn(
                        "flex-1 border rounded px-3 py-2 text-sm outline-none focus:border-primary text-right",
                        formErrors.cardNumber ? "border-red-400 bg-red-50" : "border-gray-300"
                      )}
                    />
                  </div>
                  {formErrors.cardNumber && (
                    <p className="text-xs text-red-500 text-right">{formErrors.cardNumber}</p>
                  )}
                </div>

                {/* Value */}
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-primary text-right">{t('value')} *</label>
                  <input
                    type="number"
                    min="0"
                    value={newCard.value}
                    onChange={e => setNewCard(prev => ({ ...prev, value: e.target.value }))}
                    className={cn(
                      "w-full border rounded px-3 py-2 text-sm outline-none focus:border-primary text-right",
                      formErrors.value ? "border-red-400 bg-red-50" : "border-gray-300"
                    )}
                  />
                  {formErrors.value && (
                    <p className="text-xs text-red-500 text-right">{formErrors.value}</p>
                  )}
                </div>

                {/* Customer — plain text for now; wire to /Customers when available */}
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-primary text-right">{t('customer')}</label>
                  <select
                    value={newCard.customer}
                    onChange={e => setNewCard(prev => ({ ...prev, customer: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white text-right"
                  >
                    <option value="">{t('select_customer')}</option>
                    <option value="1">شركة النور للتجارة</option>
                  </select>
                </div>

                {/* Expiry Date */}
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-primary text-right">{t('expiry_date')}</label>
                  <input
                    type="date"
                    value={newCard.expiryDate}
                    onChange={e => setNewCard(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary text-right"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-primary text-right">{t('notes')}</label>
                  <textarea
                    value={newCard.notes}
                    onChange={e => setNewCard(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary h-24 text-right"
                  />
                </div>

                <button
                  onClick={handleAddCard}
                  disabled={submitting}
                  className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? 'جاري الحفظ...' : t('add_gift_card')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── View Modal ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showViewModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowViewModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <button onClick={() => setShowViewModal(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                <h2 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Gift size={18} /> تفاصيل كارت الهدية
                </h2>
              </div>
              <div className="p-6 space-y-3 text-right text-sm" dir={direction}>
                {[
                  { label: 'رقم الكارت', value: showViewModal.code },
                  { label: 'القيمة الأصلية', value: `${formatAmount(showViewModal.initialAmount)} ر.س` },
                  { label: 'الرصيد المتبقي', value: `${formatAmount(showViewModal.remainingAmount)} ر.س` },
                  { label: 'العميل', value: showViewModal.customer?.customerName || '-' },
                  { label: 'تاريخ الإنشاء', value: formatDate(showViewModal.createdAt) },
                  { label: 'تاريخ الانتهاء', value: formatDate(showViewModal.expiryDate) },
                  { label: 'الحالة', value: showViewModal.isActive ? 'فعّال' : 'غير فعّال' },
                  { label: 'ملاحظات', value: showViewModal.notes || '-' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-800 font-medium">{value}</span>
                    <span className="text-gray-500">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm Modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">تأكيد الحذف</h3>
              <p className="text-sm text-gray-600">
                هل أنت متأكد من حذف كارت الهدية <span className="font-bold text-primary">{showDeleteConfirm.code}</span>؟
                <br />لا يمكن التراجع عن هذه العملية.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  إلغاء
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={deleteLoading}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-bold flex items-center gap-2 disabled:opacity-60"
                >
                  {deleteLoading && <Loader2 size={14} className="animate-spin" />}
                  {deleteLoading ? 'جاري الحذف...' : 'حذف'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
