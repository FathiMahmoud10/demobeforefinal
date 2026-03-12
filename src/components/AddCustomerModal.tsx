import React, { useState } from 'react';
import { useCustomers } from '@/context/CustomersContext';
import { useLanguage } from '@/context/LanguageContext';
import ResponsiveModal from './ResponsiveModal';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCustomerModal({ isOpen, onClose }: AddCustomerModalProps) {
  const { direction } = useLanguage();
  const { addCustomer } = useCustomers();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pricingGroup: 'عام',
    customerGroup: 'عام',
    taxNumber: '',
    actualBalance: 0,
    commercialRegister: '',
    creditLimit: 0,
    stopSellingOverdue: false,
    isTaxable: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({
      ...formData,
      totalPoints: 0
    });
    onClose();
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      pricingGroup: 'عام',
      customerGroup: 'عام',
      taxNumber: '',
      actualBalance: 0,
      commercialRegister: '',
      creditLimit: 0,
      stopSellingOverdue: false,
      isTaxable: false
    });
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="اضافة عميل"
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-6" dir={direction}>
        <p className="text-center text-gray-500 text-xs">
          برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
        </p>

        {/* Customer Type Selection */}
        <div className="bg-[#fff9e6] p-3 rounded-xl border border-[#ffeeba] space-y-2">
          <p className="text-center font-bold text-[#856404] text-sm">برجاء تحديد نوع العميل</p>
          <div className="flex justify-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="isTaxable" 
                checked={!formData.isTaxable} 
                onChange={() => setFormData({...formData, isTaxable: false})}
                className="w-4 h-4 accent-[#2ecc71]"
              />
              <span className="text-xs font-medium text-gray-700">غير مسجل بالضريبة</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="isTaxable" 
                checked={formData.isTaxable} 
                onChange={() => setFormData({...formData, isTaxable: true})}
                className="w-4 h-4 accent-[#2ecc71]"
              />
              <span className="text-xs font-medium text-gray-700">مسجل بالضريبة</span>
            </label>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#2ecc71] text-right">مجموعة العملاء *</label>
            <select 
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#2ecc71] bg-gray-50"
              value={formData.customerGroup}
              onChange={(e) => setFormData({...formData, customerGroup: e.target.value})}
            >
              <option value="عام">عام</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#2ecc71] text-right">مجموعة التسعيرة</label>
            <select 
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#2ecc71] bg-gray-50"
              value={formData.pricingGroup}
              onChange={(e) => setFormData({...formData, pricingGroup: e.target.value})}
            >
              <option value="عام">عام</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#2ecc71] text-right">اسم العميل *</label>
            <input 
              type="text" 
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#2ecc71]"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#2ecc71] text-right">هاتف</label>
            <input 
              type="text" 
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#2ecc71]"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#2ecc71] text-right">عنوان البريد الإلكتروني</label>
            <input 
              type="email" 
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#2ecc71]"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#2ecc71] text-right">السجل التجاري</label>
            <input 
              type="text" 
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#2ecc71]"
              value={formData.commercialRegister}
              onChange={(e) => setFormData({...formData, commercialRegister: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#2ecc71] text-right">رصيد افتتاحي *( المديونية بالسالب)</label>
            <input 
              type="number" 
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#2ecc71] text-center"
              value={formData.actualBalance}
              onChange={(e) => setFormData({...formData, actualBalance: Number(e.target.value)})}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#2ecc71] text-right">الحد الائتماني *</label>
            <input 
              type="number" 
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#2ecc71] text-center"
              value={formData.creditLimit}
              onChange={(e) => setFormData({...formData, creditLimit: Number(e.target.value)})}
            />
          </div>
          {formData.isTaxable && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#2ecc71] text-right">الرقم الضريبي *</label>
              <input 
                type="text" 
                required={formData.isTaxable}
                className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#2ecc71]"
                value={formData.taxNumber}
                onChange={(e) => setFormData({...formData, taxNumber: e.target.value})}
              />
            </div>
          )}
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2 justify-end">
          <span className="text-xs font-bold text-[#2ecc71]">ايقاف البيع في حالة وجود مبالغ مستحقة</span>
          <input 
            type="checkbox" 
            checked={formData.stopSellingOverdue}
            onChange={(e) => setFormData({...formData, stopSellingOverdue: e.target.checked})}
            className="w-4 h-4 accent-[#2ecc71]"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button 
            type="submit"
            className="bg-[#00a65a] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#008d4c] transition-colors shadow-md text-sm"
          >
            اضافة عميل
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
