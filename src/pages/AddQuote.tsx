import React, { useState, useRef } from 'react';
import { 
  FileText, 
  PlusCircle,
  X,
  Search,
  Barcode,
  Upload,
  Trash2,
  RefreshCcw,
  Eye,
  Edit2,
  Plus,
  UserPlus
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddQuote() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [date, setDate] = useState('14:17:00 23/02/2026');
  const [refNo, setRefNo] = useState('');
  const [cashier, setCashier] = useState('شركة اختبار');
  const [discount, setDiscount] = useState('');
  const [shipping, setShipping] = useState('');
  const [status, setStatus] = useState('pending');
  const [branch, setBranch] = useState('شركة تكامل');
  const [customer, setCustomer] = useState('');
  const [note, setNote] = useState('');
  const [isCustomerDisabled, setIsCustomerDisabled] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const handleDeleteProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4" dir={direction}>

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1 px-2">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('quotes')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('add_quote')}</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
              <PlusCircle size={20} className="text-primary" />
              <h1 className="text-lg font-bold text-primary">
                  {t('add_quote')}
              </h1>
          </div>
          <button onClick={() => navigate('/quotes')} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
          </button>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-8">
          
          <p className="text-sm text-primary mb-8 text-right font-medium">
              {t('add_product_desc')}
          </p>

          <form className="space-y-8">
              {/* Top Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2 text-right">
                      <label className="text-sm font-bold text-primary">{t('date')} *</label>
                      <input 
                        type="text" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary text-right" 
                      />
                  </div>
                  <div className="space-y-2 text-right">
                      <label className="text-sm font-bold text-primary">{t('ref_no')}</label>
                      <input 
                        type="text" 
                        value={refNo}
                        onChange={(e) => setRefNo(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary text-right" 
                      />
                  </div>
                  <div className="space-y-2 text-right">
                      <label className="text-sm font-bold text-primary">{t('cashier')} *</label>
                      <select 
                        value={cashier}
                        onChange={(e) => setCashier(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white text-right"
                      >
                          <option value="شركة اختبار">شركة اختبار</option>
                      </select>
                  </div>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2 text-right">
                      <label className="text-sm font-bold text-primary">{t('discount')}</label>
                      <input 
                        type="text" 
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary text-right" 
                      />
                  </div>
                  <div className="space-y-2 text-right">
                      <label className="text-sm font-bold text-primary">{t('shipping')}</label>
                      <input 
                        type="text" 
                        value={shipping}
                        onChange={(e) => setShipping(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary text-right" 
                      />
                  </div>
                  <div className="space-y-2 text-right">
                      <label className="text-sm font-bold text-primary">{t('status')}</label>
                      <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white text-right"
                      >
                          <option value="pending">{t('pending')}</option>
                          <option value="completed">{t('completed')}</option>
                      </select>
                  </div>
              </div>

              {/* Attachments */}
              <div className="space-y-2 text-right">
                  <label className="text-sm font-bold text-primary">{t('attach_documents')}</label>
                  <div className="flex gap-2">
                      <input type="text" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary text-right" readOnly />
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            // Handle file selection if needed
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        onClick={handleBrowseClick}
                        className="bg-primary text-white px-6 py-2 rounded text-sm hover:bg-primary-hover flex items-center gap-2"
                      >
                          <Upload size={16} />
                          {t('browse')}
                      </button>
                  </div>
              </div>

              {/* Branch & Customer Selection */}
              <div className="bg-[#fff9e6] p-6 rounded-lg border border-[#ffeeba] space-y-4">
                  <p className="text-sm text-[#856404] font-medium text-right">
                      {t('update_options_before_adding')}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2 text-right">
                          <label className="text-sm font-bold text-primary">{t('branch')} *</label>
                          <select 
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white text-right"
                          >
                              <option value="شركة تكامل">شركة تكامل</option>
                          </select>
                      </div>
                      <div className="space-y-2 text-right">
                          <label className="text-sm font-bold text-primary">{t('customer')} *</label>
                          <div className="flex gap-1">
                              <select 
                                value={customer}
                                onChange={(e) => setCustomer(e.target.value)}
                                disabled={isCustomerDisabled}
                                className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white text-right disabled:bg-gray-100 disabled:cursor-not-allowed"
                              >
                                  <option value="">{t('select_customer')}</option>
                                  <option value="1">{t('general_person')}</option>
                              </select>
                              <button 
                                type="button" 
                                onClick={() => setShowAddCustomerModal(true)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded border border-gray-200"
                              >
                                <Plus size={18} />
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setIsCustomerDisabled(true)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded border border-gray-200"
                              >
                                <Eye size={18} />
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setIsCustomerDisabled(false)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded border border-gray-200"
                              >
                                <Edit2 size={18} />
                              </button>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Product Search */}
              <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 gap-2">
                      <Barcode size={24} className="text-gray-400" />
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button 
                        type="button" 
                        onClick={() => navigate('/products/create')}
                        className="p-1 bg-primary text-white rounded-full hover:bg-primary-hover"
                      >
                        <Plus size={20} />
                      </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder={t('please_add_items')}
                    className="w-full border-2 border-blue-400 rounded-lg px-12 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 text-right"
                  />
              </div>

              {/* Products Table */}
              <div className="space-y-2">
                  <label className="text-sm font-bold text-primary text-right block">{t('products')} *</label>
                  <div className="overflow-x-auto">
                      <table className="w-full text-sm text-right border-collapse">
                          <thead>
                              <tr className="bg-primary text-white">
                                  <th className="p-3 border border-primary-hover w-10 text-center">
                                      <Trash2 size={16} className="mx-auto" />
                                  </th>
                                  <th className="p-3 border border-primary-hover">{t('product_name_code')}</th>
                                  <th className="p-3 border border-primary-hover">{t('unit_price_no_vat')}</th>
                                  <th className="p-3 border border-primary-hover">{t('unit_price_with_vat')}</th>
                                  <th className="p-3 border border-primary-hover">{t('quantity')}</th>
                                  <th className="p-3 border border-primary-hover">{t('product_total')} (SR)</th>
                              </tr>
                          </thead>
                          <tbody>
                              {products.length > 0 ? (
                                products.map((product, index) => (
                                  <tr key={index}>
                                    <td className="p-3 border border-gray-200 text-center">
                                      <button 
                                        type="button" 
                                        onClick={() => handleDeleteProduct(index)}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </td>
                                    <td className="p-3 border border-gray-200">{product.name} ({product.code})</td>
                                    <td className="p-3 border border-gray-200">{product.priceNoVat}</td>
                                    <td className="p-3 border border-gray-200">{product.priceWithVat}</td>
                                    <td className="p-3 border border-gray-200">{product.quantity}</td>
                                    <td className="p-3 border border-gray-200">{product.total}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-400 italic bg-gray-50 border border-gray-200">
                                        {t('no_products_added')}
                                    </td>
                                </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>

              {/* Note */}
              <div className="space-y-2 text-right">
                  <label className="text-sm font-bold text-primary">{t('note')}</label>
                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-2 border-b border-gray-200 flex items-center gap-2 flex-wrap">
                          <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs font-bold">B</button>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs italic">I</button>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs underline">U</button>
                          <div className="w-px h-4 bg-gray-300 mx-1" />
                          <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs">List</button>
                      </div>
                      <textarea 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full p-4 h-32 outline-none text-right text-sm"
                      />
                  </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-8">
                  <button 
                    type="button"
                    onClick={() => navigate('/quotes')}
                    className="bg-red-500 text-white px-8 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                      <RefreshCcw size={18} />
                      {t('reset')}
                  </button>
                  <button 
                    type="submit"
                    className="bg-red-800 text-white px-8 py-2 rounded-lg font-bold hover:bg-red-900 transition-colors"
                  >
                      {t('complete_process')}
                  </button>
              </div>
          </form>
      </div>

      {/* Add Customer Modal */}
      <AnimatePresence>
        {showAddCustomerModal && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <UserPlus size={20} className="text-primary" />
                  <h2 className="text-lg font-bold text-primary">{t('add_customer')}</h2>
                </div>
                <button onClick={() => setShowAddCustomerModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8" dir="rtl">
                <p className="text-sm text-primary text-center font-medium">
                  برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
                </p>

                <div className="bg-[#fff9e6] p-6 rounded-lg border border-[#ffeeba] space-y-4">
                  <p className="text-sm text-[#856404] font-bold text-center">برجاء تحديد نوع العميل</p>
                  <div className="flex justify-center gap-12">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="customerType" className="w-4 h-4 accent-primary" defaultChecked />
                      <span className="text-sm font-bold text-primary">غير مسجل بالضريبة</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="customerType" className="w-4 h-4 accent-primary" />
                      <span className="text-sm font-bold text-primary">مسجل بالضريبة</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-primary">مجموعة العملاء *</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                      <option>عام</option>
                    </select>
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-primary">مجموعة التسعيرة</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                      <option>عام</option>
                    </select>
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-primary">اسم العميل *</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>

                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-primary">هاتف</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-primary">عنوان البريد الإلكتروني</label>
                    <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-primary">السجل التجاري</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>

                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-primary">رصيد افتتاحي *( المديونية بالسالب)</label>
                    <input type="number" defaultValue="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-primary">الحد الائتماني *</label>
                    <input type="number" defaultValue="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <label className="text-sm font-bold text-primary cursor-pointer" htmlFor="stop-sale">ايقاف البيع في حالة وجود مبالغ مستحقة</label>
                  <input type="checkbox" id="stop-sale" className="w-4 h-4 accent-primary" />
                </div>

                <div className="flex justify-start pt-4">
                  <button 
                    onClick={() => setShowAddCustomerModal(false)}
                    className="bg-primary text-white px-8 py-2 rounded-lg font-bold hover:bg-primary-hover transition-colors"
                  >
                    اضافة عميل
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
