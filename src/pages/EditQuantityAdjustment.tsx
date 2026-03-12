import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FileText, Plus, Trash2, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Search } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAdjustments } from '@/context/AdjustmentsContext';
import { useProducts } from '@/context/ProductsContext';

const EditQuantityAdjustment = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { id } = useParams();
  const { adjustments, updateAdjustment } = useAdjustments();
  const { products } = useProducts();
  
  const adjustmentId = parseInt(id || '0');
  const adjustment = adjustments.find(a => a.id === adjustmentId) || adjustments[0];
  
  const [formData, setFormData] = React.useState({
    refNo: adjustment?.refNo || '',
    note: adjustment?.note || '',
    items: adjustment?.items || []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReset = () => {
    if (window.confirm(direction === 'rtl' ? 'هل أنت متأكد من إعادة تعيين الصفحة؟ سيتم فقدان جميع البيانات غير المحفوظة.' : 'Are you sure you want to reset the page? All unsaved data will be lost.')) {
      setFormData({
        refNo: adjustment?.refNo || '',
        note: adjustment?.note || '',
        items: adjustment?.items || []
      });
    }
  };

  const handleComplete = () => {
    if (adjustment) {
      updateAdjustment(adjustment.id, {
        refNo: formData.refNo,
        note: formData.note,
        items: formData.items
      });
    }
    alert(direction === 'rtl' ? 'تم حفظ التعديلات بنجاح!' : 'Changes saved successfully!');
    navigate('/products/quantity-adjustments');
  };

  const handleAddItem = (product: any) => {
    const existingItem = formData.items.find((item: any) => item.id === product.id);
    if (existingItem) {
      setFormData((prev: any) => ({
        ...prev,
        items: prev.items.map((item: any) => 
          item.id === product.id ? { ...item, qty: (parseInt(item.qty) + 1).toString() } : item
        )
      }));
    } else {
      const newItem = {
        id: product.id,
        code: product.code,
        name: product.name,
        availableQty: product.quantity?.toString() || '10.00',
        type: 'طرح',
        qty: '1',
        cost: product.cost?.toString() || '150',
        serial: ''
      };
      setFormData((prev: any) => ({
        ...prev,
        items: [...prev.items, newItem]
      }));
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleItemChange = (itemId: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item: any) => item.id === itemId ? { ...item, [field]: value } : item)
    }));
  };

  const handleRemoveItem = (itemId: number) => {
    setFormData((prev: any) => ({
      ...prev,
      items: prev.items.filter((item: any) => item.id !== itemId)
    }));
  };

  return (
    <div className="space-y-4 dark:text-black">
      <div className="text-sm text-gray-500 dark:text-black/60 flex items-center gap-1">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('products')}</span>
        <span>/</span>
        <span className="text-gray-800 dark:text-black font-medium">تغيير التعديل</span>
      </div>

      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 dark:text-black flex items-center gap-2">
            <Plus size={20} className="text-primary" />
            تغيير التعديل
        </h1>
        <p className="text-sm text-gray-500 dark:text-black/70 mt-1">برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .</p>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6 text-black">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-black mb-1">{t('date')} *</label>
                <input type="text" value={adjustment?.date || ''} className="w-full border border-gray-300 rounded-md px-3 h-10 text-sm bg-gray-50 text-black" readOnly />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-black mb-1">{t('ref_no')}</label>
                <input 
                  type="text" 
                  value={formData.refNo} 
                  onChange={(e) => setFormData(prev => ({ ...prev, refNo: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 h-10 text-sm bg-white text-black" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-black mb-1">{t('branch')} *</label>
                <select className="w-full border border-gray-300 rounded-md px-3 h-10 text-sm bg-white text-black">
                    <option>{adjustment?.branch || 'شركة دقة الحلول'}</option>
                </select>
            </div>
        </div>

        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-black mb-1">{t('attach_documents')}</label>
            <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 h-10 flex items-center justify-center rounded-md text-sm transition-colors whitespace-nowrap">
                    {t('browse')}
                    <input type="file" className="hidden" onChange={(e) => {
                        const fileName = e.target.files?.[0]?.name;
                        if (fileName) {
                            const display = e.target.parentElement?.nextElementSibling;
                            if (display) display.textContent = fileName;
                        }
                    }} />
                </label>
                <div className="border border-gray-300 rounded-md px-3 h-10 flex items-center text-sm flex-1 text-gray-500 dark:text-black/60 bg-gray-50">
                    لم يتم اختيار ملف
                </div>
            </div>
        </div>

        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-black mb-1">{t('products')} *</label>
            <div className="relative" ref={searchRef}>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="الرجاء إضافة الأصناف" 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full border border-gray-300 rounded-md px-3 h-10 text-sm text-right pr-10 bg-white text-black" 
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
              {showDropdown && searchTerm && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg z-10 mt-1 rounded-md overflow-y-auto max-h-60">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <button 
                        key={product.id}
                        onClick={() => handleAddItem(product)}
                        className="w-full p-3 text-right hover:bg-gray-50 text-sm border-b border-gray-100 last:border-0 text-black"
                      >
                        {product.code} - {product.name}
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-sm text-gray-500 dark:text-black/60">
                      لا توجد نتائج
                    </div>
                  )}
                </div>
              )}
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-black">
                <thead className="bg-red-800 text-white">
                    <tr>
                        <th className="p-2">اسم الصنف (كود الصنف)</th>
                        <th className="p-2">الكمية المتاحة</th>
                        <th className="p-2">نوع</th>
                        <th className="p-2">كمية</th>
                        <th className="p-2">التكلفة بدون ضريبة</th>
                        <th className="p-2">رقم السيريال</th>
                        <th className="p-2"><Trash2 size={16} /></th>
                    </tr>
                </thead>
                <tbody className="text-black">
                    {formData.items.map(item => (
                      <tr key={item.id} className="border-b border-gray-100">
                          <td className="p-2">{item.code} - {item.name}</td>
                          <td className="p-2 font-medium">{item.availableQty}</td>
                          <td className="p-2">
                            <select 
                              value={item.type} 
                              onChange={(e) => handleItemChange(item.id, 'type', e.target.value)}
                              className="border border-gray-300 rounded-md p-1 text-sm bg-white text-black"
                            >
                              <option>طرح</option>
                              <option>إضافة</option>
                            </select>
                          </td>
                          <td className="p-2">
                            <input 
                              type="text" 
                              value={item.qty} 
                              onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
                              className="border border-gray-300 rounded-md p-1 text-sm w-16 bg-white text-black" 
                            />
                          </td>
                          <td className="p-2">
                            <input 
                              type="text" 
                              value={item.cost} 
                              onChange={(e) => handleItemChange(item.id, 'cost', e.target.value)}
                              className="border border-gray-300 rounded-md p-1 text-sm w-20 bg-white text-black" 
                            />
                          </td>
                          <td className="p-2">
                            <input 
                              type="text" 
                              value={item.serial}
                              onChange={(e) => handleItemChange(item.id, 'serial', e.target.value)}
                              className="border border-gray-300 rounded-md p-1 text-sm w-full bg-white text-black" 
                            />
                          </td>
                          <td className="p-2"><button className="text-red-600 hover:text-red-800 transition-colors"><Trash2 size={16} /></button></td>
                      </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-black mb-1">{t('note')}</label>
            <div className="border border-gray-300 rounded-md bg-white">
                <div className="bg-gray-50 border-b p-2 flex gap-2 text-gray-700">
                    <button type="button" className="p-1 hover:bg-gray-200 rounded"><Bold size={14} /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded"><Italic size={14} /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded"><Underline size={14} /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded"><List size={14} /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignLeft size={14} /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignCenter size={14} /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignRight size={14} /></button>
                    <button type="button" className="p-1 hover:bg-gray-200 rounded"><LinkIcon size={14} /></button>
                </div>
                <textarea 
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  className="w-full p-2 h-24 outline-none bg-white text-black"
                ></textarea>
            </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
            <button 
              onClick={handleComplete}
              className="bg-red-800 text-white px-6 py-2 rounded-md font-medium hover:bg-red-900 transition-colors"
            >
              {t('complete_process')}
            </button>
            <button 
              onClick={handleReset}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              {t('reset_form')}
            </button>
        </div>

      </div>
    </div>
  );
};

export default EditQuantityAdjustment;
