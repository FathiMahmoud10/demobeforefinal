import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSuppliers } from '@/context/SuppliersContext';
import ResponsiveModal from './ResponsiveModal';

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: any; // Optional supplier for editing
}

export default function AddSupplierModal({ isOpen, onClose, supplier }: AddSupplierModalProps) {
  const { t, direction } = useLanguage();
  const { addSupplier, updateSupplier } = useSuppliers();

  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    taxNumber: supplier?.taxNumber || '',
    commercialRegistration: supplier?.commercialRegistration || '',
    openingBalance: supplier?.openingBalance || 0,
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || ''
  });

  // Update form data when supplier prop changes
  useEffect(() => {
    if (supplier) {
      setFormData({
        name: supplier.name || '',
        taxNumber: supplier.taxNumber || '',
        commercialRegistration: supplier.commercialRegistration || '',
        openingBalance: supplier.openingBalance || 0,
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || ''
      });
    } else {
      setFormData({
        name: '',
        taxNumber: '',
        commercialRegistration: '',
        openingBalance: 0,
        email: '',
        phone: '',
        address: ''
      });
    }
  }, [supplier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert(t('please_enter_supplier_name') || 'الرجاء إدخال اسم المورد');
      return;
    }

    if (supplier) {
      updateSupplier(supplier.id, formData);
      alert(t('supplier_updated_successfully') || 'تم تحديث بيانات المورد بنجاح');
    } else {
      addSupplier(formData);
      alert(t('supplier_added_successfully') || 'تم إضافة المورد بنجاح');
    }
    
    onClose();
    if (!supplier) {
      setFormData({
        name: '',
        taxNumber: '',
        commercialRegistration: '',
        openingBalance: 0,
        email: '',
        phone: '',
        address: ''
      });
    }
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={supplier ? (t('edit_supplier') || 'تعديل مورد') : (t('add_supplier') || 'إضافة مورد')}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-3 p-6" dir={direction}>
        <p className="text-xs text-gray-500 mb-4 text-center">
          {t('please_enter_info_below') || 'برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block text-right">
              {t('supplier_name') || 'اسم المورد'} *
            </label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block text-right">
              {t('tax_number') || 'الرقم الضريبي'}
            </label>
            <input 
              type="text" 
              value={formData.taxNumber}
              onChange={(e) => setFormData({...formData, taxNumber: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block text-right">
              {t('commercial_registration') || 'السجل التجاري'}
            </label>
            <input 
              type="text" 
              value={formData.commercialRegistration}
              onChange={(e) => setFormData({...formData, commercialRegistration: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block text-right">
              {t('opening_balance') || 'رصيد افتتاحي'} *
            </label>
            <input 
              type="number" 
              required
              value={formData.openingBalance}
              onChange={(e) => setFormData({...formData, openingBalance: Number(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block text-right">
              {t('email_address') || 'عنوان البريد الإلكتروني'}
            </label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 block text-right">
              {t('phone') || 'هاتف'}
            </label>
            <input 
              type="text" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700 block text-right">
            {t('address') || 'العنوان'}
          </label>
          <input 
            type="text" 
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-right"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit"
            className="bg-primary text-white px-8 py-2 rounded-lg font-bold hover:bg-primary-hover transition-all shadow-md text-sm"
          >
            {supplier ? (t('update') || 'تحديث') : (t('add_supplier') || 'إضافة مورد')}
          </button>
        </div>
      </form>
    </ResponsiveModal>
  );
}
