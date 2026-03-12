import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export default function RecentTransactions() {
  const [activeTab, setActiveTab] = useState('sales');
  const { t, direction } = useLanguage();

  const tabs = [
    { id: 'sales', label: t('sales') },
    { id: 'quotes', label: t('quotes') },
    { id: 'purchases', label: t('purchases') },
    { id: 'transfers', label: t('stock_transfers') },
    { id: 'customers', label: t('customers') },
    { id: 'suppliers', label: t('suppliers') },
  ];

  const salesData = [
    { id: 1, date: '16/02/2026 20:39:44', invoice: '504', ref: 'SALE/POS2026/02/0610', customer: t('general_person'), status: t('completed'), total: '150.00', payment: t('paid') },
    { id: 2, date: '16/02/2026 20:39:34', invoice: '503', ref: 'SALE/POS2026/02/0609', customer: t('general_person'), status: t('completed'), total: '400.00', payment: t('paid') },
    { id: 3, date: '16/02/2026 20:25:58', invoice: '502', ref: 'SALE/POS2026/02/0608', customer: t('general_person'), status: t('completed'), total: '500.00', payment: t('paid') },
    { id: 4, date: '16/02/2026 20:24:03', invoice: '501', ref: 'SALE/POS2026/02/0607', customer: t('general_person'), status: t('completed'), total: '500.00', payment: t('paid') },
    { id: 5, date: '16/02/2026 19:13:23', invoice: '500', ref: 'SALE/POS2026/02/0606', customer: t('general_person'), status: t('completed'), total: '250.00', payment: t('paid') },
  ];

  return (
    <div className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
      <div className="border-b border-[var(--border)]">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative",
                activeTab === tab.id 
                  ? "text-[var(--primary)]" 
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-main)]/50"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        {activeTab === 'sales' && (
          <table className={`w-full min-w-[1200px] text-sm ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
            <thead className="bg-[var(--bg-main)]/50 text-[var(--text-muted)] font-medium">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">{t('id')}</th>
                <th className="px-6 py-3 whitespace-nowrap">{t('date')}</th>
                <th className="px-6 py-3 whitespace-nowrap">{t('invoice_no')}</th>
                <th className="px-6 py-3 whitespace-nowrap">{t('ref_no')}</th>
                <th className="px-6 py-3 whitespace-nowrap">{t('customer')}</th>
                <th className="px-6 py-3 text-center whitespace-nowrap">{t('status')}</th>
                <th className="px-6 py-3 whitespace-nowrap">{t('total')}</th>
                <th className="px-6 py-3 text-center whitespace-nowrap">{t('payment_status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {salesData.map((item) => (
                <tr key={item.id} className="hover:bg-[var(--bg-main)]/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-[var(--text-main)]">{item.id}</td>
                  <td className="px-6 py-4 text-[var(--text-muted)] whitespace-nowrap" dir="ltr">{item.date}</td>
                  <td className="px-6 py-4 font-medium whitespace-nowrap text-[var(--text-main)]">{item.invoice}</td>
                  <td className="px-6 py-4 text-[var(--text-muted)] whitespace-nowrap">{item.ref}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-[var(--text-main)]">{item.customer}</td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold whitespace-nowrap text-[var(--text-main)]">{item.total}</td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                      {item.payment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {activeTab !== 'sales' && (
            <div className="p-8 text-center text-[var(--text-muted)]">
                {t('no_data_display')}
            </div>
        )}
      </div>
    </div>
  );
}
