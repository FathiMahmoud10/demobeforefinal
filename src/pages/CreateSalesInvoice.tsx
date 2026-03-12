import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useProducts, Product } from '@/context/ProductsContext';
import { useSettings } from '@/context/SettingsContext';
import { 
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  Plus,
  UserPlus,
  X,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import MobileDataCard from '@/components/MobileDataCard';

export default function CreateSalesInvoice() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { products: allProducts } = useProducts();
  const { systemSettings } = useSettings();
  const searchRef = useRef<HTMLDivElement>(null);

  const [date, setDate] = useState('16:39:21 23/02/2026');
  const [refNo, setRefNo] = useState(`${systemSettings.prefixes.sale}${Math.floor(Math.random() * 1000000).toString()}`);
  const [cashier, setCashier] = useState('شركة اختبار');
  const [branch, setBranch] = useState('شركة تكامل');
  const [customer, setCustomer] = useState('التوفيق(التوفيق)');
  const [delegate, setDelegate] = useState('عام');
  const [poNumber, setPoNumber] = useState('');
  const [projectName, setProjectName] = useState('');
  const [discount, setDiscount] = useState('50');
  const [status, setStatus] = useState('completed');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isCustomerDisabled, setIsCustomerDisabled] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredProducts = allProducts.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (product: Product) => {
    const existingProduct = products.find(p => p.id === product.id);
    if (existingProduct) {
      setProducts(products.map(p => 
        p.id === product.id ? { ...p, qty: p.qty + 1, totalNoVat: (p.qty + 1) * p.priceNoVat } : p
      ));
    } else {
      const price = parseFloat(product.price);
      setProducts([...products, {
        id: product.id,
        name: `${product.code} - ${product.name}`,
        priceNoVat: price,
        priceWithVat: price,
        qty: 1,
        totalNoVat: price,
        total: price
      }]);
    }
    setSearchQuery('');
    setShowResults(false);
  };

  const [payments, setPayments] = useState([
    { amount: '0', method: 'شبكة' }
  ]);

  const addPayment = () => {
    setPayments([...payments, { amount: '0', method: 'شبكة' }]);
  };

  const removePayment = (index: number) => {
    if (payments.length > 1) {
      setPayments(payments.filter((_, i) => i !== index));
    }
  };

  const updatePayment = (index: number, field: 'amount' | 'method', value: string) => {
    const newPayments = [...payments];
    newPayments[index][field] = value;
    setPayments(newPayments);
  };

  const [products, setProducts] = useState([
    {
      id: 1,
      name: '78574318 - غراء امريكي 1/8 نيبيرو',
      priceNoVat: 6.50,
      priceWithVat: 6.50,
      qty: 10,
      totalNoVat: 65,
      total: 0
    },
    {
      id: 2,
      name: '125 - كوع 3/4 حار نامات',
      priceNoVat: 1.85,
      priceWithVat: 1.85,
      qty: 5,
      totalNoVat: 9.25,
      total: 0
    }
  ]);

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleUpdateQuantity = (id: number, newQty: number) => {
    if (newQty < 1) return;
    setProducts(products.map(p => 
      p.id === id ? { ...p, qty: newQty, totalNoVat: newQty * p.priceNoVat } : p
    ));
  };

  const totalQty = products.reduce((sum, p) => sum + p.qty, 0);
  const subtotal = products.reduce((sum, p) => sum + p.totalNoVat, 0);
  const totalVat = subtotal * 0.15;
  const grandTotal = subtotal + totalVat;

  return (
    <div className="space-y-4" dir={direction}>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1 px-2">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('quotes')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">اضافة عمليه بيع</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Plus size={20} className="text-green-600" />
          <h1 className="text-lg font-bold text-green-600">
            اضافة عمليه بيع
          </h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-8">
        <form className="space-y-8">
          
          {/* Top Section */}
          <div className="bg-green-50/30 p-6 rounded-lg border border-green-100 mb-6 shadow-sm">
            <p className="text-sm text-green-600 font-bold text-right mb-6">
              {t('please_enter_info_below')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date */}
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-green-600 block">{t('date')}</label>
                <input 
                  type="text" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-600 text-right bg-gray-50 shadow-sm transition-all" 
                  readOnly
                />
              </div>

              {/* Reference Number */}
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-green-600 block">{t('ref_no')}</label>
                <input 
                  type="text" 
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-600 text-right shadow-sm transition-all" 
                />
              </div>

              {/* Cashier */}
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-green-600 block">{t('cashier')} *</label>
                <select 
                  value={cashier}
                  onChange={(e) => setCashier(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-600 bg-white text-right shadow-sm transition-all"
                >
                  <option value="شركة اختبار">شركة اختبار</option>
                </select>
              </div>
            </div>
          </div>

          {/* Middle Section */}
          <div className="bg-[#fff9e6] p-6 rounded-lg border border-[#ffeeba] mb-6 shadow-sm">
            <p className="text-sm text-[#856404] font-bold text-right mb-6">
              {t('update_options_before_adding')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Branch */}
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-green-600 block">{t('branch')} *</label>
                <select 
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-600 bg-white text-right shadow-sm transition-all"
                >
                  <option value="شركة تكامل">شركة دقة الحلول</option>
                </select>
              </div>

              {/* Customer */}
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-green-600 block">{t('customer_label')} *</label>
                <div className="flex shadow-sm rounded-lg overflow-hidden border border-gray-300 focus-within:border-green-600 transition-all bg-white">
                  <select 
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    disabled={isCustomerDisabled}
                    className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent text-right border-none disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
                  >
                    <option value="التوفيق(التوفيق)">التوفيق(التوفيق)</option>
                  </select>
                  
                  {/* Icons Container */}
                  <div className="flex items-stretch bg-gray-50 border-r border-gray-200 flex-shrink-0">
                    <button 
                      type="button" 
                      onClick={() => setShowAddCustomerModal(true)} 
                      className="text-green-600 hover:bg-green-100 w-10 flex items-center justify-center transition-colors border-l border-gray-200" 
                      title={t('add_customer')}
                    >
                      <Plus size={18} strokeWidth={2.5} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsCustomerDisabled(!isCustomerDisabled)} 
                      className="w-10 flex items-center justify-center transition-colors text-green-600 hover:bg-green-100" 
                      title={isCustomerDisabled ? t('enable') : t('disable')}
                    >
                      {isCustomerDisabled ? (
                        <EyeOff size={18} strokeWidth={2.5} />
                      ) : (
                        <Eye size={18} strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Delegate / Employee */}
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-green-600 block">{t('delegate_employee')} *</label>
                <select 
                  value={delegate}
                  onChange={(e) => setDelegate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-600 bg-white text-right shadow-sm transition-all"
                >
                  <option value="عام">عام</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Name */}
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-green-600 block">{t('project_name')}</label>
                <input 
                  type="text" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-600 text-right shadow-sm transition-all" 
                />
              </div>

              {/* PO Number */}
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-green-600 block">{t('po_number')}</label>
                <input 
                  type="text" 
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-600 text-right shadow-sm transition-all" 
                />
              </div>
            </div>
          </div>

          {/* Product Search */}
          <div className="mb-6" ref={searchRef}>
            <div className="relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                placeholder={t('please_add_items')} 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-right outline-none focus:border-green-600 pr-12 shadow-sm transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </div>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 border-r border-gray-200 pl-2">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2z"></path><path d="M7 7h1v10H7z"></path><path d="M10 7h2v10h-2z"></path><path d="M13 7h1v10h-1z"></path><path d="M16 7h1v10h-1z"></path></svg>
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showResults && searchQuery.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                  >
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleSelectProduct(product)}
                          className="w-full px-4 py-3 hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-0 transition-colors"
                        >
                          <span className="text-green-600 font-bold">{product.price} ر.س</span>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-800">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.code}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        {t('no_results_found') || 'لا توجد نتائج'}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Products Table */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-green-600 text-right block">{t('products')} *</label>
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="w-full text-sm text-right border-collapse">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-3 border border-primary/20 w-10 text-center">
                      <Trash2 size={16} className="mx-auto" />
                    </th>
                    <th className="p-3 border border-primary/20">{t('product_code_name')}</th>
                    <th className="p-3 border border-primary/20">{t('unit_price_no_tax')}</th>
                    <th className="p-3 border border-primary/20">{t('unit_price_with_tax')}</th>
                    <th className="p-3 border border-primary/20">{t('sold_quantity')}</th>
                    <th className="p-3 border border-primary/20">{t('total_no_tax')}</th>
                    <th className="p-3 border border-primary/20">{t('total_product_sr')}</th>
                  </tr>
                </thead>
                <tbody className="bg-green-50/20">
                  {products.map((product) => (
                    <tr key={product.id} className="bg-green-50/30 hover:bg-green-100/50 transition-colors">
                      <td className="p-3 border border-gray-200 text-center">
                        <button 
                          type="button" 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-gray-800 hover:text-red-600 font-bold text-lg transition-colors"
                        >
                          ×
                        </button>
                      </td>
                      <td className="p-3 border border-gray-200 text-right">
                        <span>{product.name}</span>
                      </td>
                      <td className="p-3 border border-gray-200">
                        <input 
                          type="number" 
                          value={product.priceNoVat} 
                          className="w-full border border-gray-300 rounded px-2 py-1 text-center outline-none focus:border-green-600 bg-white"
                          readOnly
                        />
                      </td>
                      <td className="p-3 border border-gray-200">
                        <input 
                          type="number" 
                          value={product.priceWithVat} 
                          className="w-full border border-gray-300 rounded px-2 py-1 text-center outline-none focus:border-green-600 bg-white"
                          readOnly
                        />
                      </td>
                      <td className="p-3 border border-gray-200">
                        <input 
                          type="number" 
                          value={product.qty} 
                          onChange={(e) => handleUpdateQuantity(product.id, parseInt(e.target.value) || 1)}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-center outline-none focus:border-green-600 bg-white"
                        />
                      </td>
                      <td className="p-3 border border-gray-200 text-center">{product.totalNoVat.toFixed(2)}</td>
                      <td className="p-3 border border-gray-200 text-center">{(product.totalNoVat * 1.15).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-white font-bold">
                    <td className="p-3 border border-gray-200 text-center">
                      <Trash2 size={16} className="mx-auto text-gray-400" />
                    </td>
                    <td className="p-3 border border-gray-200 text-center">{t('total')}</td>
                    <td className="p-3 border border-gray-200 text-center">0.00</td>
                    <td className="p-3 border border-gray-200 text-center">0.00</td>
                    <td className="p-3 border border-gray-200 text-center">{totalQty.toFixed(2)}</td>
                    <td className="p-3 border border-gray-200 text-center">{subtotal.toFixed(2)}</td>
                    <td className="p-3 border border-gray-200 text-center">{grandTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {products.map((product) => (
                <MobileDataCard
                  key={product.id}
                  title={product.name}
                  subtitle={`${t('unit_price_no_tax')}: ${product.priceNoVat.toFixed(2)}`}
                  fields={[
                    { 
                      label: t('sold_quantity'), 
                      value: (
                        <div className="flex items-center gap-2">
                          <button 
                            type="button"
                            onClick={() => handleUpdateQuantity(product.id, product.qty + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200 text-primary font-bold"
                          >
                            +
                          </button>
                          <input 
                            type="number" 
                            className="w-12 text-center border-b border-gray-300 outline-none focus:border-primary font-bold" 
                            value={product.qty}
                            onChange={(e) => handleUpdateQuantity(product.id, parseInt(e.target.value) || 1)}
                          />
                          <button 
                            type="button"
                            onClick={() => handleUpdateQuantity(product.id, Math.max(1, product.qty - 1))}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200 text-primary font-bold"
                          >
                            -
                          </button>
                        </div>
                      ) 
                    },
                    { label: t('total_no_tax'), value: product.totalNoVat.toFixed(2) },
                    { label: t('total_product_sr'), value: (product.totalNoVat * 1.15).toFixed(2), isBold: true },
                  ]}
                  actions={
                    <div className="flex justify-end">
                      <button 
                        type="button"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-colors flex items-center gap-1 text-xs font-bold"
                      >
                        <Trash2 size={16} />
                        {t('delete')}
                      </button>
                    </div>
                  }
                />
              ))}
              {products.length > 0 && (
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('total_quantity')}:</span>
                    <span className="font-bold text-primary">{totalQty.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('total_no_tax')}:</span>
                    <span className="font-bold text-primary">{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-gray-800 font-bold">{t('grand_total')}:</span>
                    <span className="font-bold text-primary text-lg">{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}
              {products.length === 0 && (
                <div className="p-8 text-center text-gray-400 italic bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  {t('no_products_added')}
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2 text-right">
              <label className="text-sm font-bold text-green-600">{t('discount')}</label>
              <input 
                type="text" 
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-600 text-right shadow-sm transition-all" 
              />
            </div>
            <div className="space-y-2 text-right">
              <label className="text-sm font-bold text-green-600">{t('sale_status')}</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-600 bg-white text-right shadow-sm transition-all"
              >
                <option value="completed">{t('completed')}</option>
                <option value="pending">{direction === 'rtl' ? 'معلقة' : 'Pending'}</option>
              </select>
            </div>
            <div className="space-y-2 text-right">
              <label className="text-sm font-bold text-green-600">{t('due_date')}</label>
              <input 
                type="text" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-600 text-right shadow-sm transition-all" 
              />
            </div>
          </div>

          <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-inner">
            {payments.map((payment, index) => (
              <div key={index} className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                {index > 0 && (
                  <button 
                    type="button"
                    onClick={() => removePayment(index)}
                    className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg z-10"
                  >
                    <X size={14} />
                  </button>
                )}
                <div className="space-y-2 text-right">
                  <label className="text-sm font-bold text-green-600">{t('paid_amount')}</label>
                  <input 
                    type="text" 
                    value={payment.amount}
                    onChange={(e) => updatePayment(index, 'amount', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-600 text-right shadow-sm transition-all" 
                  />
                </div>
                <div className="space-y-2 text-right">
                  <label className="text-sm font-bold text-green-600">{t('payment_by')}</label>
                  <select 
                    value={payment.method}
                    onChange={(e) => updatePayment(index, 'method', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-600 bg-white text-right shadow-sm transition-all"
                  >
                    <option value="شبكة">{t('network')}</option>
                    <option value="نقدي">{t('cash')}</option>
                    <option value="تحويل بنكي">{t('bank_transfer')}</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Add More Payments Button */}
          <div className="flex justify-center">
            <button 
              type="button"
              onClick={addPayment}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              {t('add_more_payments')}
            </button>
          </div>

          {/* Notes */}
          <div className="space-y-2 text-right">
            <label className="text-sm font-bold text-green-600">{t('sale_notes')}</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4 h-32 outline-none focus:border-green-600 text-right text-sm shadow-sm transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-8 border-t border-gray-100">
            <button 
              type="submit"
              className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-bold hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              {t('complete_operation')}
            </button>
            <button 
              type="button"
              className="bg-[#5cb85c] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#4cae4c] transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              {t('preview_invoice')}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/quotes')}
              className="bg-[#d9534f] text-white px-8 py-2.5 rounded-lg font-bold hover:bg-[#c9302c] transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              {t('reset_form')}
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
                  <UserPlus size={20} className="text-green-600" />
                  <h2 className="text-lg font-bold text-green-600">{t('add_customer')}</h2>
                </div>
                <button onClick={() => setShowAddCustomerModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8" dir="rtl">
                <p className="text-sm text-green-600 text-center font-medium">
                  برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
                </p>

                <div className="bg-[#fff9e6] p-6 rounded-lg border border-[#ffeeba] space-y-4">
                  <p className="text-sm text-[#856404] font-bold text-center">برجاء تحديد نوع العميل</p>
                  <div className="flex justify-center gap-12">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="customerType" className="w-4 h-4 accent-green-600" defaultChecked />
                      <span className="text-sm font-bold text-green-600">غير مسجل بالضريبة</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="customerType" className="w-4 h-4 accent-green-600" />
                      <span className="text-sm font-bold text-green-600">مسجل بالضريبة</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-green-600">مجموعة العملاء *</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-600 bg-white">
                      <option>عام</option>
                    </select>
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-green-600">مجموعة التسعيرة</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-600 bg-white">
                      <option>عام</option>
                    </select>
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-green-600">اسم العميل *</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-600" />
                  </div>

                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-green-600">هاتف</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-600" />
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-green-600">عنوان البريد الإلكتروني</label>
                    <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-600" />
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-green-600">السجل التجاري</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-600" />
                  </div>

                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-green-600">رصيد افتتاحي *( المديونية بالسالب)</label>
                    <input type="number" defaultValue="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-600" />
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-green-600">الحد الائتماني *</label>
                    <input type="number" defaultValue="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-600" />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <label className="text-sm font-bold text-green-600 cursor-pointer" htmlFor="stop-sale">ايقاف البيع في حالة وجود مبالغ مستحقة</label>
                  <input type="checkbox" id="stop-sale" className="w-4 h-4 accent-green-600" />
                </div>

                <div className="flex justify-start pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddCustomerModal(false)}
                    className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
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
