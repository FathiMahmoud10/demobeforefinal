import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { 
  Plus, 
  Trash2, 
  X,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link as LinkIcon,
  Code
} from 'lucide-react';

interface Payment {
  ref: string;
  amount: string;
  method: string;
  notes: string;
}

interface Product {
  id: string;
  name: string;
  unitPrice: number;
  qty: number;
  returnQty: number;
  serial: string;
  total: number;
}

export default function ReturnSale() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();

  const [date, setDate] = useState(new Date().toLocaleString('en-GB'));
  const [refNo, setRefNo] = useState('');
  const [discount, setDiscount] = useState('0');
  const [shipping, setShipping] = useState('0');
  const [returnFullInvoice, setReturnFullInvoice] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  
  const [payments, setPayments] = useState<Payment[]>([{
    ref: '',
    amount: '0',
    method: 'شبكة',
    notes: ''
  }]);

  const [returnNote, setReturnNote] = useState('');

  const handleAddPayment = () => {
    setPayments([...payments, { ref: '', amount: '0', method: 'شبكة', notes: '' }]);
  };

  const handleRemovePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const handlePaymentChange = (index: number, field: keyof Payment, value: string) => {
    const newPayments = [...payments];
    newPayments[index][field] = value;
    setPayments(newPayments);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save logic here
    alert(direction === 'rtl' ? 'تم حفظ عملية الإرجاع بنجاح' : 'Return operation saved successfully');
    navigate('/sales');
  };

  const RichTextToolbar = () => (
    <div className="flex items-center gap-1 border-b border-gray-200 p-2 bg-gray-50 rounded-t-lg">
      <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignLeft size={16} /></button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignCenter size={16} /></button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignRight size={16} /></button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignJustify size={16} /></button>
      <div className="w-px h-4 bg-gray-300 mx-1"></div>
      <button type="button" className="p-1 hover:bg-gray-200 rounded font-serif font-bold">B</button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded font-serif italic">I</button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded font-serif underline">U</button>
      <div className="w-px h-4 bg-gray-300 mx-1"></div>
      <button type="button" className="p-1 hover:bg-gray-200 rounded"><List size={16} /></button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded"><ListOrdered size={16} /></button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded"><LinkIcon size={16} /></button>
      <button type="button" className="p-1 hover:bg-gray-200 rounded"><Code size={16} /></button>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto" dir={direction}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <span className="hover:text-gray-900 cursor-pointer">{t('home')}</span>
        <span>/</span>
        <span className="hover:text-gray-900 cursor-pointer">{t('sales')}</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">{t('return_sale')}</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">{t('return_sale')}</h1>
          <button className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-primary font-bold mb-6">
            {t('enter_info_below')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Top Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">{t('date')} *</label>
                <input 
                  type="text" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary bg-gray-50"
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">{t('reference_no')}</label>
                <input 
                  type="text" 
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">{t('discount')}</label>
                <input 
                  type="text" 
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">{t('shipping')} *</label>
                <input 
                  type="text" 
                  value={shipping}
                  onChange={(e) => setShipping(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary">{t('attachment')}</label>
                <div className="flex">
                  <input 
                    type="text" 
                    className={cn(
                        "flex-1 border border-gray-300 px-3 py-2 outline-none focus:border-primary",
                        direction === 'rtl' ? "rounded-r" : "rounded-l"
                    )}
                    readOnly
                  />
                  <button type="button" className={cn(
                      "bg-primary text-white px-4 py-2 flex items-center gap-2 hover:bg-primary-hover",
                      direction === 'rtl' ? "rounded-l" : "rounded-r"
                  )}>
                    <Upload size={16} />
                    {t('browse')}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200 h-[42px]">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="returnFull" 
                    checked={returnFullInvoice}
                    onChange={(e) => setReturnFullInvoice(e.target.checked)}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <label htmlFor="returnFull" className="text-sm font-bold text-primary">{t('return_full_invoice')}</label>
                </div>
                <button type="button" className="bg-[#5cb85c] text-white px-4 py-1 rounded text-sm hover:bg-[#4cae4c]">
                  {t('view_invoice_items')}
                </button>
              </div>
            </div>

            {/* Product Search */}
            <div className="relative">
              <input 
                type="text" 
                placeholder={t('barcode_search_placeholder')} 
                className={cn(
                    "w-full border border-gray-300 rounded px-4 py-3 outline-none focus:border-primary",
                    direction === 'rtl' ? "pr-12" : "pl-12"
                )}
              />
              <div className={cn(
                  "absolute top-1/2 -translate-y-1/2 text-gray-400",
                  direction === 'rtl' ? "right-4" : "left-4"
              )}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4H21V6H3V4ZM3 10H21V12H3V10ZM3 16H21V18H3V16ZM3 20H21V22H3V20Z" fill="currentColor"/>
                </svg>
              </div>
            </div>

            {/* Products Table */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">{t('return_items_instruction')}</label>
              <div className="overflow-x-auto border border-gray-200 rounded">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary text-white">
                      <th className={cn(
                          "p-3",
                          direction === 'rtl' ? "text-right" : "text-left"
                      )}>{t('product')} ({t('code')})</th>
                      <th className="p-3 text-center">{t('unit_price')}</th>
                      <th className="p-3 text-center">{t('quantity')}</th>
                      <th className="p-3 text-center">{t('return_quantity')}</th>
                      <th className="p-3 text-center">{t('serial_no')}</th>
                      <th className="p-3 text-center">{t('item_total')} (SR)</th>
                      <th className="p-3 text-center w-10">
                        <Trash2 size={16} className="mx-auto" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-gray-500">{t('no_items_found')}</td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="border-b border-gray-200">
                          {/* Product row details would go here */}
                        </tr>
                      ))
                    )}
                    <tr className="bg-[#fff9e6] font-bold border-t border-gray-200">
                      <td className={cn(
                          "p-3",
                          direction === 'rtl' ? "text-right" : "text-left"
                      )}>{t('items')}</td>
                      <td className="p-3 text-center">0</td>
                      <td className="p-3 text-center">{t('total')}</td>
                      <td className="p-3 text-center">0.00</td>
                      <td className="p-3 text-center">{t('extra_fees')}</td>
                      <td className="p-3 text-center">0.00</td>
                      <td className="p-3 text-center">{t('return_amount')}</td>
                      <td className="p-3 text-center">0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Status */}
            <div className="bg-[#dff0d8] border border-[#d6e9c6] text-[#3c763d] p-3 rounded flex justify-between items-center font-bold">
              <span>{t('payment_status')}: paid & {t('amount_paid')} 400.00</span>
            </div>

            {/* Payments List */}
            <div className="space-y-4">
              {payments.map((payment, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative">
                  {index > 0 && (
                    <button 
                      type="button"
                      onClick={() => handleRemovePayment(index)}
                      className={cn(
                          "absolute -top-2 bg-white text-gray-400 hover:text-red-600 rounded-full p-1 border border-gray-200 shadow-sm",
                          direction === 'rtl' ? "-left-2" : "-right-2"
                      )}
                    >
                      <X size={16} />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">{t('payment_ref_no')}</label>
                      <input 
                        type="text" 
                        value={payment.ref}
                        onChange={(e) => handlePaymentChange(index, 'ref', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">{t('amount_paid')}</label>
                      <input 
                        type="text" 
                        value={payment.amount}
                        onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">{t('payment_method')}</label>
                      <select 
                        value={payment.method}
                        onChange={(e) => handlePaymentChange(index, 'method', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary bg-white"
                      >
                        <option value="شبكة">{t('network')}</option>
                        <option value="نقدي">{t('cash')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary">{t('payment_note')}</label>
                    <div className="border border-gray-300 rounded bg-white">
                      <RichTextToolbar />
                      <textarea 
                        value={payment.notes}
                        onChange={(e) => handlePaymentChange(index, 'notes', e.target.value)}
                        className="w-full p-3 h-24 outline-none resize-y"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Payment Button */}
            <button 
              type="button"
              onClick={handleAddPayment}
              className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              {t('add_more_payments')}
            </button>

            {/* Return Note */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">{t('return_note')}</label>
              <div className="border border-gray-300 rounded bg-white">
                <RichTextToolbar />
                <textarea 
                  value={returnNote}
                  onChange={(e) => setReturnNote(e.target.value)}
                  className="w-full p-3 h-32 outline-none resize-y"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                className="bg-primary text-white px-8 py-2 rounded font-bold hover:bg-primary-hover transition-colors"
              >
                {t('complete_process')}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
