import React, { useEffect, useMemo, useState } from 'react';
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
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { AUTH_API_BASE, cn } from '@/lib/utils';

interface GiftCardApi {
  id: number;
  code: string;
  initialAmount: number;
  remainingAmount: number;
  customerId: number | null;
  createdAt: string;
  expiryDate: string | null;
  isDeleted: boolean;
  notes: string | null;
  customer?: {
    id: number;
    customerName: string;
  } | null;
  isActive: boolean;
  createdByName?: string;
}

interface CustomerApi {
  id: number;
  customerName: string;
  isActive?: boolean;
}

interface GiftCardRow {
  id: number;
  cardNumber: string;
  value: number;
  balance: number;
  dataEntry: string;
  notes: string;
  customer: string;
  customerId: number | '';
  expiryDate: string;
  createdAt: string;
  isActive: boolean;
}

interface FormState {
  cardNumber: string;
  value: string;
  useEmployeePoints: boolean;
  customer: string;
  expiryDate: string;
  notes: string;
}

type ModalMode = 'add' | 'edit' | 'view';

const DEFAULT_FORM: FormState = {
  cardNumber: '',
  value: '',
  useEmployeePoints: false,
  customer: '',
  expiryDate: '',
  notes: ''
};

export default function GiftCards() {
  const { direction, t } = useLanguage();

  const [showMenu, setShowMenu] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('add');

  const [searchTerm, setSearchTerm] = useState('');
  const [showCount, setShowCount] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [giftCards, setGiftCards] = useState<GiftCardRow[]>([]);
  const [customers, setCustomers] = useState<CustomerApi[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [formData, setFormData] = useState<FormState>(DEFAULT_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingCard, setViewingCard] = useState<GiftCardRow | null>(null);

  const [loading, setLoading] = useState(true);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteLoadingIds, setDeleteLoadingIds] = useState<number[]>([]);

  const [pageMessage, setPageMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [modalMessage, setModalMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [confirmState, setConfirmState] = useState<{
    open: boolean;
    type: 'single' | 'multiple';
    id?: number;
  }>({
    open: false,
    type: 'single'
  });
const [showQuickCreateModal, setShowQuickCreateModal] = useState(false);

const [quickCreateData, setQuickCreateData] = useState({
  code: '',
  amount: '',
  customerId: '',
  expiryDate: '',
  notes: ''
});

const [quickCreateLoading, setQuickCreateLoading] = useState(false);
const [quickCreateMessage, setQuickCreateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.menu-container')) {
        setShowMenu(false);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    void fetchGiftCards();
    void fetchCustomers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, showCount]);

  const showPageSuccess = (text: string) => setPageMessage({ type: 'success', text });
  const showPageError = (text: string) => setPageMessage({ type: 'error', text });
  const showModalError = (text: string) => setModalMessage({ type: 'error', text });

  const mapApiToRow = (item: GiftCardApi): GiftCardRow => ({
    id: item.id,
    cardNumber: item.code ?? '',
    value: Number(item.initialAmount ?? 0),
    balance: Number(item.remainingAmount ?? 0),
    dataEntry: item.createdByName || '-',
    notes: item.notes || '',
    customer: item.customer?.customerName || '—',
    customerId: item.customerId ?? '',
    expiryDate: formatDateForDisplay(item.expiryDate),
    createdAt: item.createdAt,
    isActive: item.isActive
  });

  async function fetchGiftCards() {
    try {
      setLoading(true);
      const res = await fetch(`${AUTH_API_BASE}/api/GiftCards`, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error('فشل تحميل كروت الهدايا');

      const data: GiftCardApi[] = await res.json();
      const cleanData = Array.isArray(data)
        ? data.filter((item) => !item.isDeleted).map(mapApiToRow)
        : [];

      setGiftCards(cleanData);
    } catch (error) {
      console.error(error);
      showPageError('حدث خطأ أثناء تحميل كروت الهدايا');
    } finally {
      setLoading(false);
    }
  }

  async function fetchCustomers() {
    try {
      setCustomersLoading(true);

      const res = await fetch(`${AUTH_API_BASE}/api/Customer`, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        setCustomers([]);
        return;
      }

      const data: CustomerApi[] = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setCustomers([]);
    } finally {
      setCustomersLoading(false);
    }
  }

  async function fetchGiftCardById(id: number) {
    const res = await fetch(`${AUTH_API_BASE}/api/GiftCards/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      const errorText = await safeReadError(res);
      throw new Error(errorText || 'فشل تحميل بيانات الكارت');
    }

    const data: GiftCardApi = await res.json();
    return data;
  }

  function resetForm() {
    setFormData(DEFAULT_FORM);
    setEditingId(null);
    setViewingCard(null);
    setModalMessage(null);
  }

  function closeFormModal() {
    setShowFormModal(false);
    resetForm();
  }

  function openAddModal() {
    resetForm();
    setModalMode('add');
    setShowFormModal(true);
    setShowMenu(false);
  }

  async function openEditModal(card: GiftCardRow) {
    try {
      setModalMode('edit');
      setShowFormModal(true);
      setFormLoading(true);
      setModalMessage(null);
      setShowMenu(false);

      const fullCard = await fetchGiftCardById(card.id);

      setEditingId(fullCard.id);
      setFormData({
        cardNumber: fullCard.code || '',
        value: String(fullCard.initialAmount ?? ''),
        useEmployeePoints: false,
        customer: fullCard.customerId ? String(fullCard.customerId) : '',
        expiryDate: toInputDate(fullCard.expiryDate),
        notes: fullCard.notes || ''
      });
    } catch (error: any) {
      console.error(error);
      showModalError(error?.message || 'فشل تحميل بيانات الكارت');
    } finally {
      setFormLoading(false);
    }
  }
function resetQuickCreateForm() {
  setQuickCreateData({
    code: '',
    amount: '',
    customerId: '',
    expiryDate: '',
    notes: ''
  });
  setQuickCreateMessage(null);
}

function openQuickCreateModal() {
  resetQuickCreateForm();
  setShowQuickCreateModal(true);
}

function closeQuickCreateModal() {
  setShowQuickCreateModal(false);
  resetQuickCreateForm();
}

function generateQuickCardNumber() {
  const code = `GC-${Math.random().toString(16).slice(2, 10)}`;
  setQuickCreateData((prev) => ({ ...prev, code }));
}

async function handleQuickCreateGiftCard() {
  try {
    setQuickCreateMessage(null);

    if (!quickCreateData.code.trim()) {
      setQuickCreateMessage({ type: 'error', text: 'رقم البطاقة مطلوب' });
      return;
    }

    if (!quickCreateData.amount || Number(quickCreateData.amount) <= 0) {
      setQuickCreateMessage({ type: 'error', text: 'قيمة البطاقة يجب أن تكون أكبر من صفر' });
      return;
    }

    setQuickCreateLoading(true);

    const payload = {
      code: quickCreateData.code.trim(),
      amount: Number(quickCreateData.amount),
      customerId: quickCreateData.customerId ? Number(quickCreateData.customerId) : 0,
      expiryDate: quickCreateData.expiryDate
        ? new Date(quickCreateData.expiryDate).toISOString()
        : null,
      notes: quickCreateData.notes.trim()
    };

    const res = await fetch(`${AUTH_API_BASE}/api/GiftCards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await safeReadError(res);
      throw new Error(errorText || 'فشل إنشاء بطاقة الهدية');
    }

    await fetchGiftCards();
    closeQuickCreateModal();
    showPageSuccess('تم إنشاء بطاقة الهدية بنجاح');
  } catch (error: any) {
    console.error(error);
    setQuickCreateMessage({
      type: 'error',
      text: error?.message || 'حدث خطأ أثناء إنشاء بطاقة الهدية'
    });
  } finally {
    setQuickCreateLoading(false);
  }
}
  async function openViewModal(card: GiftCardRow) {
    try {
      setModalMode('view');
      setShowFormModal(true);
      setFormLoading(true);
      setModalMessage(null);

      const fullCard = await fetchGiftCardById(card.id);
      setViewingCard(mapApiToRow(fullCard));
    } catch (error: any) {
      console.error(error);
      showModalError(error?.message || 'فشل تحميل بيانات الكارت');
    } finally {
      setFormLoading(false);
    }
  }

  function generateCardNumber() {
    const num = `GC-${Math.random().toString(16).slice(2, 10)}`;
    setFormData((prev) => ({ ...prev, cardNumber: num }));
  }

  function validateForm() {
    if (!formData.cardNumber.trim()) {
      showModalError('رقم الكارت مطلوب');
      return false;
    }

    if (!formData.value || Number(formData.value) <= 0) {
      showModalError('القيمة يجب أن تكون أكبر من صفر');
      return false;
    }

    return true;
  }

  function buildCreatePayload() {
    const value = Number(formData.value || 0);

    return {
      code: formData.cardNumber.trim(),
      initialAmount: value,
      remainingAmount: value,
      customerId: formData.customer ? Number(formData.customer) : null,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
      notes: formData.notes.trim(),
      isActive: true
    };
  }

  function buildUpdatePayload() {
    const value = Number(formData.value || 0);

    return {
      id: editingId,
      code: formData.cardNumber.trim(),
      initialAmount: value,
      remainingAmount: value,
      customerId: formData.customer ? Number(formData.customer) : null,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
      notes: formData.notes.trim(),
      isActive: true
    };
  }

  async function handleSubmit() {
  if (!validateForm()) return;

  try {
    setSaving(true);
    setModalMessage(null);

    const isEdit = modalMode === 'edit' && editingId !== null;

    if (!isEdit) {
      showModalError('هذا النموذج مخصص للتعديل فقط');
      return;
    }

    const res = await fetch(`${AUTH_API_BASE}/api/GiftCards`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildUpdatePayload())
    });

    if (!res.ok) {
      const errorText = await safeReadError(res);
      throw new Error(errorText || 'فشل تعديل الكارت');
    }

    await fetchGiftCards();
    closeFormModal();
    showPageSuccess('تم تعديل كارت الهدية بنجاح');
  } catch (error: any) {
    console.error(error);
    showModalError(error?.message || 'حدث خطأ أثناء حفظ البيانات');
  } finally {
    setSaving(false);
  }
}

  async function handleDelete(id: number) {
    try {
      setDeleteLoadingIds((prev) => [...prev, id]);

      const res = await fetch(`${AUTH_API_BASE}/api/GiftCards/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const errorText = await safeReadError(res);
        throw new Error(errorText || 'فشل حذف الكارت');
      }

      setGiftCards((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
      showPageSuccess('تم حذف كارت الهدية بنجاح');
    } catch (error: any) {
      console.error(error);
      showPageError(error?.message || 'حدث خطأ أثناء حذف الكارت');
    } finally {
      setDeleteLoadingIds((prev) => prev.filter((item) => item !== id));
    }
  }

  async function handleBulkDelete() {
    if (selectedIds.length === 0) {
      showPageError('اختر كارت واحد على الأقل للحذف');
      return;
    }

    try {
      setSaving(true);

      await Promise.all(
        selectedIds.map(async (id) => {
          const res = await fetch(`${AUTH_API_BASE}/api/GiftCards/${id}`, {
            method: 'DELETE'
          });

          if (!res.ok) {
            const errorText = await safeReadError(res);
            throw new Error(errorText || `فشل حذف الكارت رقم ${id}`);
          }
        })
      );

      setGiftCards((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setSelectedIds([]);
      showPageSuccess('تم حذف الكروت المحددة بنجاح');
    } catch (error: any) {
      console.error(error);
      showPageError(error?.message || 'حدث خطأ أثناء حذف الكروت المحددة');
    } finally {
      setSaving(false);
    }
  }

  const filteredCards = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return giftCards;

    return giftCards.filter((card) => {
      return (
        card.cardNumber.toLowerCase().includes(q) ||
        String(card.value).includes(q) ||
        String(card.balance).includes(q) ||
        (card.customer || '').toLowerCase().includes(q) ||
        (card.notes || '').toLowerCase().includes(q) ||
        (card.expiryDate || '').toLowerCase().includes(q)
      );
    });
  }, [giftCards, searchTerm]);

  const totalRecords = filteredCards.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / showCount));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedCards = useMemo(() => {
    const start = (safeCurrentPage - 1) * showCount;
    const end = start + showCount;
    return filteredCards.slice(start, end);
  }, [filteredCards, safeCurrentPage, showCount]);

  const allCurrentPageSelected =
    paginatedCards.length > 0 && paginatedCards.every((item) => selectedIds.includes(item.id));

  function toggleSelectAllCurrentPage() {
    if (allCurrentPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !paginatedCards.some((item) => item.id === id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...paginatedCards.map((item) => item.id)])));
    }
  }

  function toggleSelectOne(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function openDeleteConfirm(id: number) {
    setConfirmState({
      open: true,
      type: 'single',
      id
    });
  }

  function openBulkDeleteConfirm() {
    if (selectedIds.length === 0) {
      showPageError('اختر كارت واحد على الأقل للحذف');
      return;
    }

    setShowMenu(false);
    setConfirmState({
      open: true,
      type: 'multiple'
    });
  }

  async function confirmDelete() {
    const { type, id } = confirmState;
    setConfirmState({ open: false, type: 'single' });

    if (type === 'single' && id) {
      await handleDelete(id);
      return;
    }

    if (type === 'multiple') {
      await handleBulkDelete();
    }
  }

  function handleExportExcel() {
    showPageError('التصدير Excel غير مفعل حاليًا لأن endpoint التصدير غير متوفر');
    setShowMenu(false);
  }

  return (
    <div className="space-y-4" dir={direction}>
      <div className="flex items-center gap-2 text-sm px-2 text-gray-500">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('sales')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('gift_cards')}</span>
      </div>

      {pageMessage && (
        <div
          className={cn(
            'rounded-xl border px-4 py-3 text-sm font-medium',
            pageMessage.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <span>{pageMessage.text}</span>
            <button
              onClick={() => setPageMessage(null)}
              className="text-current hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary">
            <h1 className="text-lg font-bold">{t('gift_cards_list')}</h1>
            <Gift size={20} />
          </div>

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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={cn(
                    'absolute z-50 top-full mt-2 bg-white rounded-md shadow-xl border border-gray-100 min-w-[220px] overflow-hidden',
                    direction === 'rtl' ? 'right-0' : 'left-0'
                  )}
                >
                  
                  <button
                    onClick={openAddModal}
                    className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 border-b border-gray-50 transition-colors"
                  >
                    <span className="text-gray-700 text-sm font-bold">{t('add_gift_card')}</span>
                    <Plus size={16} className="text-gray-600" />
                  </button>

                  <button
                    onClick={handleExportExcel}
                    className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 border-b border-gray-50 transition-colors"
                  >
                    <span className="text-gray-700 text-sm font-bold">{t('export_excel')}</span>
                    <FileSpreadsheet size={16} className="text-green-600" />
                  </button>

                  <button
                    onClick={openBulkDeleteConfirm}
                    className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 transition-colors"
                  >
                    <span className="text-gray-700 text-sm font-bold">{t('delete_gift_cards')}</span>
                    <Trash2 size={16} className="text-primary" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
<div className="flex justify-end mb-4">
  <button
    onClick={openQuickCreateModal}
    className="bg-primary text-white px-4 py-2.5 rounded-lg font-bold hover:bg-primary-hover transition-colors flex items-center gap-2"
  >
    <Plus size={18} />
    <span>إنشاء بطاقة هدايا</span>
  </button>
</div>
        <div className="p-6">
          <p className="text-sm text-primary mb-6 text-right font-medium">
            {t('gift_cards_table_desc')}
          </p>

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
                <Search
                  size={16}
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 text-gray-400',
                    direction === 'rtl' ? 'left-3' : 'right-3'
                  )}
                />
              </div>
              <span className="text-sm text-gray-600 whitespace-nowrap">{t('search')}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm text-right border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-3 border border-primary-hover w-10 text-center">
                    <input
                      type="checkbox"
                      checked={allCurrentPageSelected}
                      onChange={toggleSelectAllCurrentPage}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="p-3 border border-primary-hover whitespace-nowrap">{t('card_no')}</th>
                  <th className="p-3 border border-primary-hover whitespace-nowrap">{t('value')}</th>
                  <th className="p-3 border border-primary-hover whitespace-nowrap">{t('balance')}</th>
                  <th className="p-3 border border-primary-hover whitespace-nowrap">{t('data_entry')}</th>
                  <th className="p-3 border border-primary-hover whitespace-nowrap">{t('notes')}</th>
                  <th className="p-3 border border-primary-hover whitespace-nowrap">{t('customer')}</th>
                  <th className="p-3 border border-primary-hover whitespace-nowrap">{t('expiry_date')}</th>
                  <th className="p-3 border border-primary-hover whitespace-nowrap w-24 text-center">{t('actions')}</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="p-10 text-center border border-gray-200">
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        <Loader2 size={18} className="animate-spin" />
                        <span>جارٍ تحميل البيانات...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedCards.length > 0 ? (
                  paginatedCards.map((card) => {
                    const deleting = deleteLoadingIds.includes(card.id);

                    return (
                      <tr key={card.id} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                        <td className="p-3 text-center border-x border-gray-200">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(card.id)}
                            onChange={() => toggleSelectOne(card.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="p-3 border-x border-gray-200 font-medium">{card.cardNumber}</td>
                        <td className="p-3 border-x border-gray-200">{card.value.toFixed(2)}</td>
                        <td className="p-3 border-x border-gray-200">{card.balance.toFixed(2)}</td>
                        <td className="p-3 border-x border-gray-200">{card.dataEntry || '-'}</td>
                        <td className="p-3 border-x border-gray-200">{card.notes || '-'}</td>
                        <td className="p-3 border-x border-gray-200">{card.customer || '-'}</td>
                        <td className="p-3 border-x border-gray-200">{card.expiryDate || '-'}</td>
                        <td className="p-3 border-x border-gray-200 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(card)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="تعديل"
                            >
                              <Edit2 size={14} />
                            </button>

                            <button
                              onClick={() => openViewModal(card)}
                              className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                              title="عرض"
                            >
                              <Eye size={14} />
                            </button>

                            <button
                              onClick={() => openDeleteConfirm(card.id)}
                              disabled={deleting}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                              title="حذف"
                            >
                              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500 font-medium border border-gray-200">
                      {t('no_data_in_table')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
            <div className="text-sm text-gray-600">
              {t('showing_records')} {totalRecords === 0 ? 0 : (safeCurrentPage - 1) * showCount + 1} {t('to')}{' '}
              {Math.min(safeCurrentPage * showCount, totalRecords)} {t('of')} {totalRecords} {t('records')}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} /> {t('previous')}
              </button>

              <div className="px-3 py-1 text-sm text-gray-700">
                {safeCurrentPage} / {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('next')} <ChevronLeft size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFormModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[200] flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeFormModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <button onClick={closeFormModal} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>

                <h2 className="text-lg font-bold text-primary">
                  {modalMode === 'add'
                    ? t('add_gift_card')
                    : modalMode === 'edit'
                    ? 'تعديل كارت هدية'
                    : 'تفاصيل كارت الهدية'}
                </h2>
              </div>

              <div className="p-6 space-y-5" dir={direction}>
                {modalMessage && (
                  <div
                    className={cn(
                      'rounded-xl border px-4 py-3 text-sm font-medium',
                      modalMessage.type === 'success'
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span>{modalMessage.text}</span>
                      <button
                        onClick={() => setModalMessage(null)}
                        className="text-current hover:opacity-70 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {formLoading ? (
                  <div className="py-10 flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 size={18} className="animate-spin" />
                    <span>جارٍ تحميل البيانات...</span>
                  </div>
                ) : modalMode === 'view' && viewingCard ? (
                  <>
                    <InfoRow label={t('card_no')} value={viewingCard.cardNumber} />
                    <InfoRow label={t('value')} value={viewingCard.value.toFixed(2)} />
                    <InfoRow label={t('balance')} value={viewingCard.balance.toFixed(2)} />
                    <InfoRow label={t('customer')} value={viewingCard.customer || '-'} />
                    <InfoRow label={t('expiry_date')} value={viewingCard.expiryDate || '-'} />
                    <InfoRow label={t('notes')} value={viewingCard.notes || '-'} />
                    <InfoRow label={t('data_entry')} value={viewingCard.dataEntry || '-'} />

                    <button
                      onClick={closeFormModal}
                      className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors"
                    >
                      إغلاق
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-primary font-medium text-right">
                      {modalMode === 'add' ? 'أدخل بيانات كارت الهدية الجديد' : 'عدّل بيانات كارت الهدية'}
                    </p>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-primary text-right">
                          {t('card_no')} *
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={generateCardNumber}
                            className="bg-gray-100 p-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            <Settings size={18} />
                          </button>

                          <input
                            type="text"
                            value={formData.cardNumber}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, cardNumber: e.target.value }))
                            }
                            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary text-right"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-primary text-right">
                          {t('value')} *
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={formData.value}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, value: e.target.value }))
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary text-right"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <label className="text-sm font-bold text-primary">
                          {t('use_employee_points_program')}
                        </label>
                        <input
                          type="checkbox"
                          checked={formData.useEmployeePoints}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              useEmployeePoints: e.target.checked
                            }))
                          }
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-primary text-right">
                          {t('customer')}
                        </label>
                        <select
                          value={formData.customer}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, customer: e.target.value }))
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white text-right"
                        >
                          <option value="">{t('select_customer')}</option>
                          {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                              {customer.customerName}
                            </option>
                          ))}
                        </select>

                        {customersLoading && (
                          <p className="text-xs text-gray-500 text-right mt-1">جارٍ تحميل العملاء...</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-primary text-right">
                          {t('expiry_date')}
                        </label>
                        <input
                          type="date"
                          value={formData.expiryDate}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary text-right"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-bold text-primary text-right">
                          {t('notes')}
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, notes: e.target.value }))
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary h-24 text-right"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {saving && <Loader2 size={18} className="animate-spin" />}
                      <span>{modalMode === 'add' ? t('add_gift_card') : 'حفظ التعديلات'}</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmState.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[210] flex items-center justify-center p-4"
            onClick={() => setConfirmState({ open: false, type: 'single' })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                  <AlertTriangle size={26} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
                  <p className="text-sm text-gray-600">
                    {confirmState.type === 'single'
                      ? 'هل أنت متأكد أنك تريد حذف كارت الهدية؟'
                      : `هل أنت متأكد أنك تريد حذف ${selectedIds.length} كارت/كروت محددة؟`}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={() => setConfirmState({ open: false, type: 'single' })}
                    className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    إلغاء
                  </button>

                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
  {showQuickCreateModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-[205] flex items-center justify-center p-4 overflow-y-auto"
      onClick={closeQuickCreateModal}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <button onClick={closeQuickCreateModal} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>

          <h2 className="text-lg font-bold text-primary">إنشاء بطاقة هدايا</h2>
        </div>

        <div className="p-5 space-y-4" dir={direction}>
          {quickCreateMessage && (
            <div
              className={cn(
                'rounded-xl border px-4 py-3 text-sm font-medium',
                quickCreateMessage.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span>{quickCreateMessage.text}</span>
                <button
                  onClick={() => setQuickCreateMessage(null)}
                  className="text-current hover:opacity-70 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-bold text-primary text-right">
              رقم البطاقة *
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={generateQuickCardNumber}
                className="bg-gray-100 p-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Settings size={18} />
              </button>

              <input
                type="text"
                value={quickCreateData.code}
                onChange={(e) =>
                  setQuickCreateData((prev) => ({ ...prev, code: e.target.value }))
                }
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary text-right"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-primary text-right">
              القيمة *
            </label>
            <input
              type="number"
              min="0"
              value={quickCreateData.amount}
              onChange={(e) =>
                setQuickCreateData((prev) => ({ ...prev, amount: e.target.value }))
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary text-right"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-primary text-right">
              العميل
            </label>
            <select
              value={quickCreateData.customerId}
              onChange={(e) =>
                setQuickCreateData((prev) => ({ ...prev, customerId: e.target.value }))
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white text-right"
            >
              <option value="">اختر عميل</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.customerName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-primary text-right">
              تاريخ الانتهاء
            </label>
            <input
              type="date"
              value={quickCreateData.expiryDate}
              onChange={(e) =>
                setQuickCreateData((prev) => ({ ...prev, expiryDate: e.target.value }))
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary text-right"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-bold text-primary text-right">
              ملاحظات
            </label>
            <textarea
              value={quickCreateData.notes}
              onChange={(e) =>
                setQuickCreateData((prev) => ({ ...prev, notes: e.target.value }))
              }
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary h-24 text-right"
            />
          </div>

          <button
            onClick={handleQuickCreateGiftCard}
            disabled={quickCreateLoading}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {quickCreateLoading && <Loader2 size={18} className="animate-spin" />}
            <span>إنشاء بطاقة هدايا</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-4 border border-gray-100 rounded-xl p-4">
      <div className="text-sm font-bold text-primary">{label}</div>
      <div className="text-sm text-gray-700 break-words">{value}</div>
    </div>
  );
}

function formatDateForDisplay(date?: string | null) {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-GB');
}

function toInputDate(date?: string | null) {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().split('T')[0];
}

async function safeReadError(res: Response) {
  try {
    const text = await res.text();
    return text || '';
  } catch {
    return '';
  }
}