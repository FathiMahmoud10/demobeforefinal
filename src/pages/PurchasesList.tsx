import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Printer, 
  FileText, 
  FileDown, 
  LayoutGrid, 
  ChevronRight, 
  ChevronLeft,
  MoreVertical,
  Calendar,
  Filter,
  ArrowUpDown,
  CheckSquare,
  Square,
  ExternalLink,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Purchase, PurchaseStatus, PaymentStatus } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

import { initialPurchases } from '@/data';

const StatusBadge = ({ status }: { status: PurchaseStatus }) => {
  const { t } = useLanguage();
  const styles = {
    [PurchaseStatus.RECEIVED]: "bg-green-100 text-green-700 border-green-200",
    [PurchaseStatus.PENDING]: "bg-yellow-100 text-yellow-700 border-yellow-200",
    [PurchaseStatus.ORDERED]: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const labels = {
    [PurchaseStatus.RECEIVED]: t('received'),
    [PurchaseStatus.PENDING]: t('pending'),
    [PurchaseStatus.ORDERED]: t('ordered'),
  };

  return (
    <span className={cn("px-2 py-1 rounded-md text-xs font-medium border", styles[status])}>
      {labels[status]}
    </span>
  );
};

const PaymentBadge = ({ status }: { status: PaymentStatus }) => {
  const { t } = useLanguage();
  const styles = {
    [PaymentStatus.PAID]: "bg-emerald-100 text-emerald-700 border-emerald-200",
    [PaymentStatus.PARTIAL]: "bg-orange-100 text-orange-700 border-orange-200",
    [PaymentStatus.DUE]: "bg-red-100 text-red-700 border-red-200",
    [PaymentStatus.OVERDUE]: "bg-purple-100 text-purple-700 border-purple-200",
  };

  const labels = {
    [PaymentStatus.PAID]: t('paid'),
    [PaymentStatus.PARTIAL]: t('partial'),
    [PaymentStatus.DUE]: t('due'),
    [PaymentStatus.OVERDUE]: t('overdue'),
  };

  return (
    <span className={cn("px-2 py-1 rounded-md text-xs font-medium border", styles[status])}>
      {labels[status]}
    </span>
  );
};

export default function PurchasesList() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
  };

  const handleDuplicate = (id: string) => {
    const purchaseToDuplicate = purchases.find(p => p.id === id);
    if (purchaseToDuplicate) {
      const newPurchase = { ...purchaseToDuplicate, id: new Date().toISOString(), reference: `${purchaseToDuplicate.reference}-copy` };
      setPurchases(prev => [newPurchase, ...prev]);
    }
  };

  const filteredPurchases = purchases.filter(purchase =>
    Object.values(purchase).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredPurchases.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredPurchases.map(p => p.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-500" dir={direction}>
      {/* Breadcrumbs & Subscription Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <span>{t('home')}</span>
          {direction === 'rtl' ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          <span className="text-[var(--primary)] font-medium">{t('purchases')}</span>
        </div>
      </div>

      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-3">
            <LayoutGrid className="text-[var(--primary)]" />
            {t('purchases_all_branches')}
          </h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">
            {t('purchases_table_desc')}
          </p>
        </div>
        <button onClick={() => navigate('/purchases/create')} className="bg-[var(--primary)] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-md hover:opacity-90 transition-all">
          <Plus size={20} />
          <span>{t('add_purchase_operation')}</span>
        </button>
      </div>

      {/* Table Controls */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-main)]/50">
          <div className="flex items-center gap-2">
            
            <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <span>{t('show')}</span>
                <select 
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="bg-[var(--bg-card)] border border-[var(--border)] rounded-md px-2 py-1 outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
                <span>{t('records')}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search size={18} className={cn("absolute top-1/2 -translate-y-1/2 text-[var(--text-muted)]", direction === 'rtl' ? "right-3" : "left-3")} />
              <input 
                type="text" 
                placeholder={`${t('search')}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-sm text-[var(--text-main)]",
                  direction === 'rtl' ? "pr-10 pl-4" : "pl-10 pr-4"
                )}
              />
            </div>
            <button className="p-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-main)] transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className={cn("w-full border-collapse", direction === 'rtl' ? "text-right" : "text-left")}>
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-4 w-12">
                  <button onClick={toggleSelectAll} className="text-white hover:opacity-80 transition-opacity">
                    {selectedRows.length === filteredPurchases.length ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                </th>
                <th className="p-4 text-sm font-bold">
                  <div className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                    {t('date')} <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="p-4 text-sm font-bold">{t('ref_no')}</th>
                <th className="p-4 text-sm font-bold">{t('supplier')}</th>
                <th className="p-4 text-sm font-bold">{t('purchase_status')}</th>
                <th className="p-4 text-sm font-bold">{t('total_amount')}</th>
                <th className="p-4 text-sm font-bold">{t('paid')}</th>
                <th className="p-4 text-sm font-bold">{t('balance')}</th>
                <th className="p-4 text-sm font-bold">{t('payment_status')}</th>
                <th className="p-4 text-sm font-bold text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredPurchases.length > 0 ? (
                filteredPurchases.map((purchase) => (
                    <tr 
                      key={purchase.id} 
                      className={cn(
                        "hover:bg-[var(--bg-main)]/50 transition-colors group",
                        selectedRows.includes(purchase.id) && "bg-[var(--primary)]/10"
                      )}
                    >
                      <td className="p-4">
                        <button onClick={() => toggleSelectRow(purchase.id)} className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                          {selectedRows.includes(purchase.id) ? <CheckSquare size={20} className="text-[var(--primary)]" /> : <Square size={20} />}
                        </button>
                      </td>
                      <td className="p-4 text-sm text-[var(--text-main)] font-medium">{purchase.date}</td>
                      <td className="p-4 text-sm text-[var(--primary)] font-bold hover:underline cursor-pointer">{purchase.reference}</td>
                      <td className="p-4 text-sm text-[var(--text-main)]">{purchase.supplier}</td>
                      <td className="p-4"><StatusBadge status={purchase.status} /></td>
                      <td className="p-4 text-sm font-bold text-[var(--text-main)]">{purchase.total.toLocaleString(direction === 'rtl' ? 'ar-SA' : 'en-US', { minimumFractionDigits: 2 })} {t('sar')}</td>
                      <td className="p-4 text-sm font-bold text-emerald-500">{purchase.paid.toLocaleString(direction === 'rtl' ? 'ar-SA' : 'en-US', { minimumFractionDigits: 2 })} {t('sar')}</td>
                      <td className="p-4 text-sm font-bold text-red-500">{purchase.balance.toLocaleString(direction === 'rtl' ? 'ar-SA' : 'en-US', { minimumFractionDigits: 2 })} {t('sar')}</td>
                      <td className="p-4"><PaymentBadge status={purchase.paymentStatus} /></td>
                      <td className="p-4 text-center">
                        <div className="relative">
                            <button 
                              onClick={() => setOpenActionMenu(openActionMenu === purchase.id ? null : purchase.id)}
                              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-sm hover:bg-primary-hover transition-colors"
                            >
                              {t('actions')}
                            </button>
                            {openActionMenu === purchase.id && (
                              <div className={cn("absolute mt-2 w-48 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border)] z-10", direction === 'rtl' ? "left-0" : "right-0")}>
                                <button 
                                  onClick={() => navigate(`/purchases/edit/${purchase.id}`)}
                                  className={cn("w-full px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center gap-2", direction === 'rtl' ? "text-right" : "text-left")}
                                >
                                  {t('edit')}
                                </button>
                                <button 
                                  onClick={() => handleDuplicate(purchase.id)}
                                  className={cn("w-full px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center gap-2", direction === 'rtl' ? "text-right" : "text-left")}
                                >
                                  {t('duplicate_purchase')}
                                </button>
                                <button 
                                  onClick={() => handleDelete(purchase.id)}
                                  className={cn("w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2", direction === 'rtl' ? "text-right" : "text-left")}
                                >
                                  {t('delete')}
                                </button>
                              </div>
                            )}
                          </div>
                      </td>
                    </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-[var(--bg-main)] rounded-full">
                        <FileText size={48} className="text-[var(--text-muted)] opacity-30" />
                      </div>
                      <p className="text-lg font-medium">{t('no_data_in_table')}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-main)]/50">
          <p className="text-sm text-[var(--text-muted)]">
            {t('showing')} {filteredPurchases.length > 0 ? 1 : 0} {t('to')} {filteredPurchases.length} {t('of')} {filteredPurchases.length} {t('records')}
          </p>
          <div className="flex items-center gap-1">
            <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-card)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              {direction === 'rtl' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-bold shadow-sm">1</button>
            <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-card)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              {direction === 'rtl' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
