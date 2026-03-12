import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Hash, 
  FileText, 
  CheckCircle2, 
  Building2, 
  Upload, 
  UserPlus, 
  Eye, 
  Plus, 
  Search, 
  Barcode, 
  Trash2, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List as ListIcon, 
  Link as LinkIcon,
  PlusCircle,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useProducts, Product } from '@/context/ProductsContext';
import { useSuppliers } from '@/context/SuppliersContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import AddSupplierModal from '@/components/AddSupplierModal';

interface PurchaseItem {
  id: string;
  code: string;
  name: string;
  expiryDate: string;
  unitCost: number;
  quantity: number;
  free: number;
  totalNoVat: number;
  vatRate: number;
  vatAmount: number;
  totalSr: number;
  publicPrice: number;
}

export default function AddPurchase() {
  const { t, direction } = useLanguage();
  const { products: allProducts } = useProducts();
  const { suppliers, addSupplier } = useSuppliers();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [fileName, setFileName] = useState('');

  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);

  const [formData, setFormData] = useState({
    date: '2026-02-26T05:09:00',
    refNo: '',
    purchaseType: 'warehouse',
    status: 'received',
    branch: 'main',
    supplier: '',
    discountBeforeVat: 0,
    discountAfterVat: 0,
    amountPaid: 0,
    paymentType: 'credit',
    paymentTerms: '',
    notes: ''
  });

  const [items, setItems] = useState<PurchaseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = searchQuery.trim() === '' 
    ? [] 
    : allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.code.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleSelectProduct = (product: Product) => {
    const existingItemIndex = items.findIndex(item => item.id === product.id.toString());
    
    if (existingItemIndex !== -1) {
      const updatedItems = [...items];
      const item = updatedItems[existingItemIndex];
      item.quantity += 1;
      // Recalculate totals
      const cost = item.unitCost;
      const qty = item.quantity;
      item.totalNoVat = cost * qty;
      item.vatAmount = item.totalNoVat * (item.vatRate / 100);
      item.totalSr = item.totalNoVat + item.vatAmount;
      setItems(updatedItems);
    } else {
      const cost = parseFloat(product.cost) || 0;
      const vatRate = 15;
      const totalNoVat = cost;
      const vatAmount = totalNoVat * (vatRate / 100);
      const totalSr = totalNoVat + vatAmount;

      const newItem: PurchaseItem = {
        id: product.id.toString(),
        code: product.code,
        name: product.name,
        expiryDate: '',
        unitCost: cost,
        quantity: 1,
        free: 0,
        totalNoVat: totalNoVat,
        vatRate: vatRate,
        vatAmount: vatAmount,
        totalSr: totalSr,
        publicPrice: parseFloat(product.price) || 0
      };
      setItems([...items, newItem]);
    }
    setSearchQuery('');
    setShowResults(false);
  };

  const updateItem = (id: string, field: keyof PurchaseItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate totals if cost or quantity changed
        if (field === 'unitCost' || field === 'quantity') {
          const cost = field === 'unitCost' ? parseFloat(value) || 0 : item.unitCost;
          const qty = field === 'quantity' ? parseFloat(value) || 0 : item.quantity;
          updatedItem.totalNoVat = cost * qty;
          updatedItem.vatAmount = updatedItem.totalNoVat * (updatedItem.vatRate / 100);
          updatedItem.totalSr = updatedItem.totalNoVat + updatedItem.vatAmount;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData, items);
    // In a real app, you'd save this to a database or context
    alert(t('operation_completed_successfully'));
    navigate('/purchases');
  };

  const handleReset = () => {
    if (confirm(t('confirm_reset_form') || 'Are you sure you want to reset the form?')) {
      setFormData({
        date: '2026-02-26T05:09:00',
        refNo: '',
        purchaseType: 'warehouse',
        status: 'received',
        branch: 'main',
        supplier: '',
        discountBeforeVat: 0,
        discountAfterVat: 0,
        amountPaid: 0,
        paymentType: 'credit',
        paymentTerms: '',
        notes: ''
      });
      setItems([]);
      setFileName('');
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-20"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-lg font-bold text-primary flex items-center gap-2">
          <Plus size={20} />
          {t('add_purchase', { lng: direction === 'rtl' ? 'ar' : 'en' })}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <p className="text-sm text-gray-600">
            {t('add_product_desc')}
          </p>
        </div>

        <form onSubmit={handleComplete} className="p-6 space-y-8">
          {/* Top Section - Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                {t('date')} *
              </label>
              <div className="relative">
                <input 
                  type="datetime-local" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary text-right"
                  required
                />
              </div>
            </div>

            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                {t('branch')} *
              </label>
              <select 
                value={formData.branch}
                onChange={(e) => setFormData({...formData, branch: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                required
              >
                <option value="main">{t('اختر الفرع ')}</option>
                <option value="branch1">{t('فرع 1')}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                {t('attachments')}
              </label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary-hover transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <Upload size={16} />
                  {t('browse')}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                />
                <input 
                  type="text" 
                  value={fileName} 
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none bg-gray-50" 
                  readOnly 
                  placeholder={t('no_file_chosen') || 'لم يتم اختيار ملف'}
                />
              </div>
            </div>
          </div>

          {/* Supplier Section */}
          <div className="bg-orange-50/30 p-4 rounded-lg border border-orange-100 space-y-4">
            <p className="text-sm text-orange-800 font-medium">
              {t('update_options_before_adding')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {t('supplier')}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <select 
                      value={formData.supplier}
                      onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white appearance-none"
                    >
                      <option value="">{t('اختر المورد....')}</option>
                      {suppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowAddSupplierModal(true)}
                    className="p-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
                  >
                    <UserPlus size={18} />
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {t('رصيد المورد') || 'الربح المتوقع'}
                </label>
                <div className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-center font-bold">
                  0
                </div>
              </div>
            </div>
          </div>

          {/* Product Search */}
          <div className="relative">
            <div className="relative" ref={searchRef}>
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
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                className="w-full border-2 border-blue-400 rounded-lg px-12 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 text-right"
              />

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showResults && filteredProducts.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                  >
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelectProduct(product)}
                        className="w-full text-right px-4 py-3 hover:bg-gray-50 flex items-center justify-between border-b border-gray-100 last:border-0 transition-colors"
                      >
                        <span className="text-primary font-bold">{product.price} {t('sar')}</span>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-800">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.code}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-700">{t('items') || 'الأصناف'}</h3>
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm text-right border-collapse">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="p-3 border border-primary-hover w-10 text-center">{t('m')}</th>
                    <th className="p-3 border border-primary-hover min-w-[200px]">{t('product_code_name')}</th>
                    <th className="p-3 border border-primary-hover">{t('expiry_date') || 'تاريخ انتهاء الصلاحية'}</th>
                    <th className="p-3 border border-primary-hover">{t('unit_cost') || 'تكلفة الوحدة'}</th>
                    <th className="p-3 border border-primary-hover">{t('quantity')}</th>
                    <th className="p-3 border border-primary-hover">{t('free') || 'المجاني'}</th>
                    <th className="p-3 border border-primary-hover">{t('total_no_tax')}</th>
                    <th className="p-3 border border-primary-hover">{t('vat_rate') || 'نسبة الضريبة'}</th>
                    <th className="p-3 border border-primary-hover">{t('item_vat') || 'ضريبة الصنف'}</th>
                    <th className="p-3 border border-primary-hover">{t('total_product_sr')}</th>
                    <th className="p-3 border border-primary-hover">{t('public_price') || 'سعر الجمهور'}</th>
                    <th className="p-3 border border-primary-hover w-10 text-center">
                      <Trash2 size={16} className="mx-auto" />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="p-8 text-center text-gray-400 italic">
                        {t('no_products_added')}
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 border-l border-gray-100 text-center">{index + 1}</td>
                        <td className="p-3 border-l border-gray-100 font-medium">{item.code} - {item.name}</td>
                        <td className="p-3 border-l border-gray-100">
                          <input 
                            type="date" 
                            className="w-full border-none bg-transparent outline-none text-right" 
                            value={item.expiryDate}
                            onChange={(e) => updateItem(item.id, 'expiryDate', e.target.value)}
                          />
                        </td>
                        <td className="p-3 border-l border-gray-100">
                          <input 
                            type="number" 
                            className="w-20 border-none bg-transparent outline-none text-center" 
                            value={item.unitCost}
                            onChange={(e) => updateItem(item.id, 'unitCost', e.target.value)}
                          />
                        </td>
                        <td className="p-3 border-l border-gray-100">
                          <input 
                            type="number" 
                            className="w-16 border-none bg-transparent outline-none text-center" 
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                          />
                        </td>
                        <td className="p-3 border-l border-gray-100">
                          <input 
                            type="number" 
                            className="w-16 border-none bg-transparent outline-none text-center" 
                            value={item.free}
                            onChange={(e) => updateItem(item.id, 'free', e.target.value)}
                          />
                        </td>
                        <td className="p-3 border-l border-gray-100 text-center">{item.totalNoVat.toFixed(2)}</td>
                        <td className="p-3 border-l border-gray-100 text-center">{item.vatRate}%</td>
                        <td className="p-3 border-l border-gray-100 text-center">{item.vatAmount.toFixed(2)}</td>
                        <td className="p-3 border-l border-gray-100 text-center font-bold">{item.totalSr.toFixed(2)}</td>
                        <td className="p-3 border-l border-gray-100">
                          <input 
                            type="number" 
                            className="w-24 border-none bg-transparent outline-none text-center" 
                            value={item.publicPrice}
                            onChange={(e) => updateItem(item.id, 'publicPrice', e.target.value)}
                          />
                        </td>
                        <td className="p-3 text-center">
                          <button 
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Section - Totals & Payments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {t('خصم بالنسبة  (قبل الضريبة)') || 'خصم بالنسبة أو بالرقم (قبل الضريبة)'}
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {t('خصم بالنسبة (بعد الضريبة)') || 'خصم بالنسبة أو بالرقم (بعد الضريبة)'}
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {t('paid_amount')}
                </label>
                <input 
                  type="number" 
                  value={formData.amountPaid}
                  onChange={(e) => setFormData({...formData, amountPaid: Number(e.target.value)})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {t('payment_type')}
                </label>
                <select 
                  value={formData.paymentType}
                  onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                >
                  <option value="credit">{t('شبكه')}</option>
                  <option value="cash">{t('cash')}</option>
                  <option value="bank">{t('bank_transfer')}</option>
                </select>
              </div>
           
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {t('notes')}
                </label>
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-2">
                    <button type="button" className="p-1 hover:bg-gray-200 rounded"><Bold size={14} /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded"><Italic size={14} /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded"><Underline size={14} /></button>
                    <div className="w-px bg-gray-300 h-4 my-auto"></div>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignLeft size={14} /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignCenter size={14} /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignRight size={14} /></button>
                    <div className="w-px bg-gray-300 h-4 my-auto"></div>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded"><ListIcon size={14} /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded"><LinkIcon size={14} /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded text-xs font-bold">{"</>"}</button>
                  </div>
                  <textarea 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full p-3 h-40 outline-none resize-none text-sm"
                    placeholder={t('add_notes_here') || 'أضف ملاحظاتك هنا...'}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <button 
              type="submit"
              className="bg-primary text-white px-8 py-2.5 rounded-md font-bold hover:bg-primary-hover transition-all shadow-md flex items-center gap-2"
            >
              <CheckCircle2 size={18} />
              {t('complete_operation')}
            </button>
            <button 
              type="button"
              onClick={handleReset}
              className="bg-red-500 text-white px-8 py-2.5 rounded-md font-bold hover:bg-red-600 transition-all shadow-md"
            >
              {t('reset_form')}
            </button>
          </div>
        </form>
      </div>

      <AddSupplierModal 
        isOpen={showAddSupplierModal}
        onClose={() => setShowAddSupplierModal(false)}
      />
    </motion.div>
  );
}
