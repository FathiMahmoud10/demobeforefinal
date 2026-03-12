import React, { useState } from 'react';
import { 
  Search, 
  LayoutGrid, 
  ChevronRight, 
  ChevronLeft,
  Monitor,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import MobileDataCard from '@/components/MobileDataCard';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

interface InvoiceDevice {
  id: string;
  activityName: string;
  taxNumber: string;
  additionalId: string;
  address: string;
}

const initialDevices: InvoiceDevice[] = [
  {
    id: '1',
    activityName: 'تجريبي',
    taxNumber: '300000000000003',
    additionalId: '0000000000',
    address: '0-0-0'
  }
];

export default function InvoiceDevices() {
  const { t, direction, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [devices, setDevices] = useState<InvoiceDevice[]>(initialDevices);
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);

  const filteredDevices = devices.filter(device =>
    Object.values(device).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = (id: string) => {
    setDeviceToDelete(id);
  };

  const confirmDelete = () => {
    if (deviceToDelete) {
      setDevices(prev => prev.filter(d => d.id !== deviceToDelete));
      setDeviceToDelete(null);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <span>{t('home')}</span>
          {direction === 'rtl' ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          <span className="text-[var(--primary)] font-medium">{t('pos_devices')}</span>
        </div>
      </div>

      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-3">
            <Monitor className="text-[var(--primary)]" />
            {t('pos_devices')}
          </h1>
          <p className="text-[var(--text-muted)] mt-1 text-sm">
            {t('products_table_desc')}
          </p>
        </div>
        <button className="bg-[var(--primary)] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-md hover:opacity-90 transition-all">
          <Plus size={20} />
          <span>{t('add_device')}</span>
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
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search size={18} className={cn("absolute top-1/2 -translate-y-1/2 text-[var(--text-muted)]", direction === 'rtl' ? "right-3" : "left-3")} />
              <input 
                type="text" 
                placeholder={t('search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-sm text-[var(--text-main)]",
                  direction === 'rtl' ? "pr-10 pl-4" : "pl-10 pr-4"
                )}
              />
            </div>
          </div>
        </div>

        {/* The Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-4 w-12 text-center">
                   <div className="w-5 h-5 border-2 border-white/30 rounded flex items-center justify-center mx-auto">
                      <LayoutGrid size={14} className="text-white/50" />
                   </div>
                </th>
                <th className="p-4 text-sm font-bold">{t('activity_name')}</th>
                <th className="p-4 text-sm font-bold">{t('tax_number')}</th>
                <th className="p-4 text-sm font-bold">{t('additional_id') || 'المعرف الإضافي'}</th>
                <th className="p-4 text-sm font-bold">{t('address')}</th>
                <th className="p-4 text-sm font-bold text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredDevices.length > 0 ? (
                filteredDevices.map((device) => (
                  <tr key={`desktop-${device.id}`} className="hover:bg-[var(--bg-main)]/50 transition-colors group">
                    <td className="p-4 text-center">
                       <div className="w-5 h-5 border border-[var(--border)] rounded mx-auto group-hover:border-[var(--primary)] transition-colors"></div>
                    </td>
                    <td className="p-4 text-sm text-[var(--text-main)] font-medium">{device.activityName}</td>
                    <td className="p-4 text-sm text-[var(--text-main)]">{device.taxNumber}</td>
                    <td className="p-4 text-sm text-[var(--text-main)]">{device.additionalId}</td>
                    <td className="p-4 text-sm text-[var(--text-main)]">{device.address}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title={t('edit')}
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(device.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title={t('delete')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[var(--text-muted)]">
                    <p className="text-lg font-medium">{t('no_data_in_table')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-4 space-y-4">
          {filteredDevices.length > 0 ? (
            filteredDevices.map((device) => (
              <MobileDataCard
                key={`mobile-${device.id}`}
                title={`#${device.id}`}
                fields={[
                  { label: t('activity_name'), value: device.activityName, isBold: true },
                  { label: t('tax_number'), value: device.taxNumber },
                  { label: t('additional_id') || 'المعرف الإضافي', value: device.additionalId },
                  { label: t('address'), value: device.address },
                ]}
                actions={
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Edit size={16} />
                      {t('edit')}
                    </button>
                    <button 
                      onClick={() => handleDelete(device.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Trash2 size={16} />
                      {t('delete')}
                    </button>
                  </div>
                }
              />
            ))
          ) : (
            <div className="p-12 text-center text-[var(--text-muted)] bg-[var(--bg-main)]/30 rounded-xl">
              <p className="text-lg font-medium">{t('no_data_in_table')}</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-main)]/50">
          <p className="text-sm text-[var(--text-muted)]">
            {t('showing_records')} {filteredDevices.length > 0 ? 1 : 0} {t('to')} {filteredDevices.length} {t('of')} {filteredDevices.length} {t('records')}
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
      <DeleteConfirmationModal
        isOpen={deviceToDelete !== null}
        onClose={() => setDeviceToDelete(null)}
        onConfirm={confirmDelete}
        itemName={devices.find(d => d.id === deviceToDelete)?.activityName}
      />
    </div>
  );
}
