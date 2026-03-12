import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Trash2, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Upload, Download, FolderOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAdjustments } from '@/context/AdjustmentsContext';

const ImportQuantityAdjustment = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { addAdjustment } = useAdjustments();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toLocaleString('en-GB').replace(',', ''),
    refNo: '',
    branch: 'شركة دقة الحلول',
    note: '',
    fileName: ''
  });

  const handleReset = () => {
    if (window.confirm(direction === 'rtl' ? 'هل أنت متأكد من إعادة تعيين الصفحة؟ سيتم فقدان جميع البيانات غير المحفوظة.' : 'Are you sure you want to reset the page? All unsaved data will be lost.')) {
      setFormData({
        date: new Date().toLocaleString('en-GB').replace(',', ''),
        refNo: '',
        branch: 'شركة دقة الحلول',
        note: '',
        fileName: ''
      });
    }
  };

  const handleComplete = () => {
    if (!formData.fileName) {
      alert(direction === 'rtl' ? 'يرجى اختيار ملف أولاً' : 'Please select a file first');
      return;
    }
    
    // Mock importing from CSV
    addAdjustment({
      date: formData.date,
      refNo: formData.refNo || `CSV-${Math.floor(Math.random() * 100000)}`,
      branch: formData.branch,
      entry: 'Admin',
      note: formData.note,
      items: [
        {
          id: Date.now(),
          code: '60990980',
          name: 'عبايه كريب مع اكمام مموجه (من CSV)',
          availableQty: '10.00',
          type: 'طرح',
          qty: '5',
          cost: '150',
          serial: ''
        }
      ]
    });

    alert(direction === 'rtl' ? 'تم استيراد التعديل بنجاح!' : 'Adjustment imported successfully!');
    navigate('/products/quantity-adjustments');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, fileName: file.name }));
    }
  };

  return (
    <div className="space-y-4 dark:text-black">
      <div className="text-sm text-gray-500 dark:text-black/60 flex items-center gap-1">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('products')}</span>
        <span>/</span>
        <span className="text-gray-800 dark:text-black font-medium">عرض التعديل بـ CSV</span>
      </div>

      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-black flex items-center gap-2">
            <Plus size={20} className="text-primary" />
            عرض التعديل بـ CSV
        </h1>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6 text-black">
        <p className="text-sm text-gray-500 dark:text-black/70 mb-6">برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-black mb-1">{t('date')} *</label>
                <input type="text" value={formData.date} className="w-full border border-gray-300 rounded-md px-3 h-10 text-sm bg-gray-50 text-black" readOnly />
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
                <select 
                  value={formData.branch}
                  onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 h-10 text-sm bg-white text-black"
                >
                    <option>شركة دقة الحلول</option>
                </select>
            </div>
        </div>

        <div className="bg-[#FFF8F8] border border-[#FFDADA] rounded-md p-6 mb-8 text-center">
            <div className="flex flex-col items-center gap-4">
                <button className="bg-[#2ecc71] text-white px-4 py-2 rounded-md text-sm hover:bg-[#27ae60] transition-colors flex items-center gap-2">
                    <Download size={16} />
                    تحميل عينة الملف
                </button>
                <div className="text-sm text-[#A01B1B] space-y-2 leading-relaxed max-w-2xl">
                    <p>ينبغي أن يظل السطر الأول في ملف CSV الذي يتم تحميله كما هو. يرجى عدم تغيير ترتيب الأعمدة.</p>
                    <p className="font-bold">ترتيب الأعمدة الصحيح (كود الصنف, كمية, متغير ) . يجب اتباع هذا. إذا كنت تستخدم أي لغة أخرى غير الإنجليزية، يرجى التأكد من ملف CSV هو UTF-8 ترميز وليس حفظها مع علامة ترتيب بايت (BOM)</p>
                    <p className="font-bold">Please set the quantity in negative (-1) for subtraction and positive (1) for addition. Variant column is optional</p>
                </div>
            </div>
        </div>

        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-black mb-1">تحميل الملف *</label>
            <div className="flex items-center gap-2">
                <label className="cursor-pointer bg-[#2ecc71] hover:bg-[#27ae60] text-white px-4 h-10 flex items-center justify-center rounded-md text-sm transition-colors whitespace-nowrap gap-2">
                    <FolderOpen size={16} />
                    استعراض ...
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden" 
                      accept=".csv"
                    />
                </label>
                <input 
                  type="text" 
                  value={formData.fileName}
                  className="border border-gray-300 rounded-md px-3 h-10 flex items-center text-sm flex-1 bg-white text-black outline-none" 
                  readOnly 
                  placeholder={direction === 'rtl' ? 'لم يتم اختيار ملف' : 'No file selected'}
                />
            </div>
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
              className="bg-[#2ecc71] text-white px-6 py-2 rounded-md font-medium hover:bg-[#27ae60] transition-colors"
            >
              اتمام العملية
            </button>
            <button 
              onClick={handleReset}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-medium hover:bg-gray-300 transition-colors"
            >
              إعادة تعيين
            </button>
        </div>

      </div>
    </div>
  );
};

export default ImportQuantityAdjustment;
