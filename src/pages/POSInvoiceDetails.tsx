import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Printer, 
  Download, 
  Mail, 
  DollarSign, 
  Truck, 
  Building, 
  User,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

export default function POSInvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, direction } = useLanguage();

  // Mock data for the specific invoice
  const invoice = {
    invoiceNo: '507',
    date: '23/02/2026 13:12:06',
    refNo: 'SALE/POS2026/02/0612',
    customer: 'عميل افتراضي',
    customerPhone: '00',
    customerEmail: 'info@posit.sa',
    company: 'شركة اختبار',
    companyAddress: 'سعود بن فيصل',
    companyTaxNo: '50608090',
    companyRegNo: '1234123123',
    companyPhone: '0146580073',
    companyEmail: 'info@posit2030.com',
    status: 'مكتملة',
    paymentStatus: 'مدفوع',
    items: [
      { id: 1, code: '6666', name: 'صنف جديد', qty: '1.00', price: '150.00', tax: '0.00', total: '150.00' },
      { id: 2, code: '60990980', name: 'عباية كريب مع اكمام مموجه', qty: '1.00', price: '250.00', tax: '0.00', total: '250.00' },
    ],
    total: 400.00,
    paid: 400.00,
    remaining: 0.00,
    payments: [
      { date: '23/02/2026 13:12:06', ref: 'IPAY2026/02/0621', type: 'شبكة ()', amount: '400.00', user: 'saad mansor', note: 'تم الاستلام' }
    ]
  };

  return (
    <div className="space-y-6 pb-12" dir={direction}>
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">{t('home')}</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-500">{t('pos_sales')}</span>
          <span className="text-gray-300">/</span>
          <span className="text-primary font-bold">{t('view')}</span>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-primary">{t('invoice_no')} {invoice.invoiceNo}</h1>
          <FileText size={20} className="text-primary" />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Top Info Section */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-100">
          {/* Company Info */}
          <div className={cn(
              "flex items-start gap-4",
              direction === 'rtl' ? "text-right" : "text-left"
          )}>
            <div className="flex-1 space-y-1">
              <h2 className="font-bold text-lg text-primary">{invoice.company}</h2>
              <p className="text-sm text-gray-600">{invoice.companyAddress}</p>
              <p className="text-xs text-gray-500">{t('commercial_register')}: {invoice.companyRegNo}</p>
              <p className="text-xs text-gray-500">{t('tax_no')}: {invoice.companyTaxNo}</p>
              <p className="text-xs text-gray-500">{t('phone')}: {invoice.companyPhone}</p>
              <p className="text-xs text-gray-500">{t('email')}: {invoice.companyEmail}</p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
              <Building size={24} className="text-gray-400" />
            </div>
          </div>

          {/* Logo Placeholder */}
          <div className="flex justify-center items-center">
             <div className="w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center border border-dashed border-gray-200">
                <LayoutGrid size={48} className="text-gray-200" />
             </div>
          </div>

          {/* Customer Info */}
          <div className={cn(
              "flex items-start gap-4",
              direction === 'rtl' ? "text-right justify-end" : "text-left justify-start"
          )}>
            <div className="flex-1 space-y-1">
              <h2 className="font-bold text-lg text-primary">{invoice.customer}</h2>
              <p className="text-sm text-gray-600">{t('phone')}: {invoice.customerPhone}</p>
              <p className="text-xs text-gray-500">{t('email')}: {invoice.customerEmail}</p>
            </div>
            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
              <User size={24} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Invoice Meta Section */}
        <div className="p-8 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
                <FileText size={24} className="text-gray-400" />
             </div>
             <div className={direction === 'rtl' ? "text-right" : "text-left"}>
                <p className="text-sm font-bold text-primary">{t('reference_no')}: {invoice.refNo}</p>
                <p className="text-xs text-gray-500">{t('date')}: {invoice.date}</p>
                <p className="text-xs font-bold text-green-600">{t('sale_status')}: {invoice.status}</p>
                <p className="text-xs font-bold text-green-600">{t('payment_status')} : {invoice.paymentStatus}</p>
             </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 border border-primary-hover w-12">#</th>
                <th className="p-3 border border-primary-hover">{t('description')} ({t('code')})</th>
                <th className="p-3 border border-primary-hover">{t('quantity')}</th>
                <th className="p-3 border border-primary-hover">{t('serial_no')}</th>
                <th className="p-3 border border-primary-hover">{t('unit_price')}</th>
                <th className="p-3 border border-primary-hover">{t('total_before_tax')}</th>
                <th className="p-3 border border-primary-hover">{t('tax')}</th>
                <th className="p-3 border border-primary-hover">{t('grand_total')}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="p-3 border-x border-gray-100">{item.id}</td>
                  <td className={cn(
                      "p-3 border-x border-gray-100",
                      direction === 'rtl' ? "text-right" : "text-left"
                  )}>{item.code} - {item.name}</td>
                  <td className="p-3 border-x border-gray-100">{item.qty}</td>
                  <td className="p-3 border-x border-gray-100">{item.qty}</td>
                  <td className="p-3 border-x border-gray-100">{item.price}</td>
                  <td className="p-3 border-x border-gray-100">{item.total}</td>
                  <td className="p-3 border-x border-gray-100">{item.tax}</td>
                  <td className="p-3 border-x border-gray-100 font-bold">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User Info */}
        <div className={cn(
            "p-4 bg-gray-50 border-y border-gray-100 text-xs space-y-1",
            direction === 'rtl' ? "text-right" : "text-left"
        )}>
           <p className="text-primary font-bold">{t('data_entry')}: saad mansor</p>
           <p className="text-gray-500">{t('date')}: {invoice.date}</p>
        </div>

        {/* Payments Table */}
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-2 border border-primary-hover">{t('date')}</th>
                <th className="p-2 border border-primary-hover">{t('payment_ref_no')}</th>
                <th className="p-2 border border-primary-hover">{t('amount')}</th>
                <th className="p-2 border border-primary-hover">{t('payment_type')}</th>
                <th className="p-2 border border-primary-hover">{t('data_entry')}</th>
                <th className="p-2 border border-primary-hover">{t('type')}</th>
              </tr>
            </thead>
            <tbody>
              {invoice.payments.map((payment, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="p-2 border-x border-gray-100">{payment.date}</td>
                  <td className="p-2 border-x border-gray-100">{payment.ref}</td>
                  <td className="p-2 border-x border-gray-100 font-bold">{payment.amount}</td>
                  <td className="p-2 border-x border-gray-100">{payment.type}</td>
                  <td className="p-2 border-x border-gray-100">{payment.user}</td>
                  <td className="p-2 border-x border-gray-100">{payment.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="bg-primary flex text-white text-sm font-bold">
          <button className="flex-1 py-4 flex items-center justify-center gap-2 hover:bg-primary-hover border-l border-white/20">
            <LayoutGrid size={18} /> {t('view_payments')}
          </button>
          <button className="flex-1 py-4 flex items-center justify-center gap-2 hover:bg-primary-hover border-l border-white/20">
            <DollarSign size={18} /> {t('add_payment')}
          </button>
          <button className="flex-1 py-4 flex items-center justify-center gap-2 hover:bg-primary-hover border-l border-white/20">
            <Mail size={18} /> {t('email')}
          </button>
          <button className="flex-1 py-4 flex items-center justify-center gap-2 hover:bg-primary-hover border-l border-white/20">
            <Download size={18} /> PDF
          </button>
          <button className="flex-1 py-4 flex items-center justify-center gap-2 hover:bg-primary-hover">
            <Truck size={18} /> {t('add_delivery')}
          </button>
        </div>
      </div>
    </div>
  );
}
