import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RotateCcw, 
  Search, 
  Trash2, 
  Upload, 
  Plus, 
  X,
  FileText,
  Barcode,
  Printer,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';

export default function ReturnPOSSale() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, direction } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showItemsModal, setShowItemsModal] = useState(false);
  const [payments, setPayments] = useState([
    { id: Date.now(), ref: '', amount: '0', method: 'شبكة', notes: '' }
  ]);

  const [formData, setFormData] = useState({
    date: '24/02/2026 06:07:21',
    refNo: '',
    discount: '0',
    shipping: '0',
    returnFull: false,
    returnNotes: '',
    fileName: ''
  });

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, fileName: file.name }));
    }
  };

  const addPayment = () => {
    setPayments(prev => [
      ...prev,
      { id: Date.now(), ref: '', amount: '0', method: 'شبكة', notes: '' }
    ]);
  };

  const removePayment = (id: number) => {
    if (payments.length > 1) {
      setPayments(prev => prev.filter(p => p.id !== id));
    }
  };

  const invoiceItems = [
    { code: '6666', name: 'صنف جديد', price: '150.0000', qty: '1' },
    { code: '60990980', name: 'عباية كريب مع اكمام مموجه', price: '250.0000', qty: '1' },
  ];

  return (
    <div className="space-y-6 pb-12" dir={direction}>
      {/* Subscription Banner */}
      <div className="bg-primary text-white p-2 rounded-md text-center text-sm font-medium flex items-center justify-center gap-2 cursor-pointer hover:bg-primary-hover transition-colors">
          <span>{t('subscription_expires_in')} 933 {t('days')}</span>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center justify-end gap-2 text-sm px-2">
        <span className="text-gray-800 font-medium">{t('return_pos_sale')}</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-500">{t('pos_sales')}</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-500">{t('home')}</span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary">
             <RotateCcw size={20} />
             <h1 className="text-lg font-bold">{t('return_pos_sale')}</h1>
          </div>
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <p className="text-sm text-primary text-right">{t('enter_info_below')}</p>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
            <div className="space-y-1">
              <label className="block text-sm font-bold text-primary">{t('date')} *</label>
              <input 
                type="text" 
                value={formData.date}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-gray-50" 
                readOnly
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-bold text-primary">{t('reference_no')}</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" 
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-bold text-primary">{t('discount')}</label>
              <input 
                type="text" 
                value={formData.discount}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" 
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-bold text-primary">{t('shipping')} *</label>
              <input 
                type="text" 
                value={formData.shipping}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" 
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-bold text-primary">{t('attachment')}</label>
              <div className="flex gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input 
                  type="text" 
                  value={formData.fileName}
                  placeholder={t('browse')}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-gray-50"
                  readOnly
                  onClick={handleBrowse}
                />
                <button 
                  onClick={handleBrowse}
                  className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-primary-hover"
                >
                  <Upload size={16} /> {t('browse')}
                </button>
              </div>
            </div>
            <div className="flex items-end justify-end gap-6 pb-2">
               <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-sm font-bold text-primary">{t('return_full_invoice')}</span>
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
               </label>
               <button 
                onClick={() => setShowItemsModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-700"
               >
                  {t('view_invoice_items')}
               </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className={cn(
                "absolute inset-y-0 flex items-center pointer-events-none",
                direction === 'rtl' ? "right-3" : "left-3"
            )}>
              <Barcode size={20} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder={t('barcode_search_placeholder')}
              className={cn(
                  "w-full border border-gray-300 rounded-lg py-3 outline-none focus:border-primary shadow-sm",
                  direction === 'rtl' ? "pr-10 pl-4 text-right" : "pl-10 pr-4 text-left"
              )}
            />
          </div>

          {/* Items Table */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-primary text-right">{t('return_items_instruction')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center border-collapse">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-3 border border-primary-hover w-10">
                      <Trash2 size={16} />
                    </th>
                    <th className="p-3 border border-primary-hover">{t('product')} ({t('code')})</th>
                    <th className="p-3 border border-primary-hover">{t('unit_price')}</th>
                    <th className="p-3 border border-primary-hover">{t('quantity')}</th>
                    <th className="p-3 border border-primary-hover">{t('return_quantity')}</th>
                    <th className="p-3 border border-primary-hover">{t('serial_no')}</th>
                    <th className="p-3 border border-primary-hover">{t('item_total')} (SR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-yellow-50/50 font-bold">
                    <td className="p-3 border border-gray-200"></td>
                    <td className="p-3 border border-gray-200">{t('items')}</td>
                    <td className="p-3 border border-gray-200">{t('total')}</td>
                    <td className="p-3 border border-gray-200">0</td>
                    <td className="p-3 border border-gray-200">0.00</td>
                    <td className="p-3 border border-gray-200">{t('extra_fees')}</td>
                    <td className="p-3 border border-gray-200">0.00</td>
                  </tr>
                  <tr className="bg-yellow-50/50 font-bold">
                    <td colSpan={5} className="p-3 border border-gray-200"></td>
                    <td className="p-3 border border-gray-200">{t('return_amount')}</td>
                    <td className="p-3 border border-gray-200">0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Status Banner */}
          <div className="bg-green-100 text-green-800 p-3 rounded-md text-right font-bold text-sm">
             {t('payment_status')}: paid & {t('amount_paid')} 400.00
          </div>

          {/* Payment Details Section */}
          <div className="space-y-4">
            {payments.map((payment, index) => (
              <div key={payment.id} className="relative grid grid-cols-1 md:grid-cols-3 gap-6 text-right border border-gray-200 p-6 rounded-xl bg-gray-50/30">
                {index > 0 && (
                  <button 
                    onClick={() => removePayment(payment.id)}
                    className={cn(
                        "absolute top-2 text-red-500 hover:text-red-700",
                        direction === 'rtl' ? "left-2" : "right-2"
                    )}
                  >
                    <X size={16} />
                  </button>
                )}
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-primary">{t('payment_ref_no')}</label>
                  <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-primary">{t('amount_paid')}</label>
                  <input 
                    type="text" 
                    defaultValue={payment.amount}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-bold text-primary">{t('payment_method')}</label>
                  <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                    <option>{t('network')}</option>
                    <option>{t('cash')}</option>
                  </select>
                </div>
                <div className="md:col-span-3 space-y-1">
                  <label className="block text-sm font-bold text-primary">{t('payment_note')}</label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
                      <button className="p-1 hover:bg-gray-200 rounded text-gray-600 font-serif">¶</button>
                      <div className="w-px h-4 bg-gray-300 mx-1" />
                      <button className="p-1 hover:bg-gray-200 rounded text-gray-600 font-bold">B</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-gray-600 italic">I</button>
                      <button className="p-1 hover:bg-gray-200 rounded text-gray-600 underline">U</button>
                    </div>
                    <textarea rows={2} className="w-full p-3 outline-none resize-none text-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={addPayment}
            className="w-full bg-primary text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors"
          >
            <Plus size={20} /> {t('add_more_payments')}
          </button>

          {/* Return Notes */}
          <div className="space-y-1 text-right">
            <label className="block text-sm font-bold text-primary">{t('return_note')}</label>
            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
              <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-50">
                <button className="p-1 hover:bg-gray-200 rounded text-gray-600 font-serif">¶</button>
                <div className="w-px h-4 bg-gray-300 mx-1" />
                <button className="p-1 hover:bg-gray-200 rounded text-gray-600 font-bold">B</button>
                <button className="p-1 hover:bg-gray-200 rounded text-gray-600 italic">I</button>
                <button className="p-1 hover:bg-gray-200 rounded text-gray-600 underline">U</button>
              </div>
              <textarea rows={4} className="w-full p-3 outline-none resize-none text-sm" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={() => {
                alert(t('process_completed_successfully'));
                navigate('/sales/pos-invoices');
              }}
              className="bg-primary text-white px-12 py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors"
            >
              {t('complete_process')}
            </button>
          </div>
        </div>
      </div>
      {/* Modals */}
      <AnimatePresence>
        {showItemsModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
            onClick={() => setShowItemsModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl relative overflow-hidden p-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => setShowItemsModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={32} />
                </button>
                <h2 className="text-2xl font-bold text-primary">{t('invoice_items')}</h2>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200">
                <table className="w-full text-sm text-center border-collapse">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className="p-4 border border-primary-hover">{t('quantity')}</th>
                      <th className="p-4 border border-primary-hover">{t('unit_price')}</th>
                      <th className="p-4 border border-primary-hover">{t('product')} ({t('code')})</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="p-4 border-x border-gray-100">{item.qty}</td>
                        <td className="p-4 border-x border-gray-100">{item.price}</td>
                        <td className="p-4 border-x border-gray-100 text-right">{item.code} ({item.name})</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
