import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from './Toast';
import { useCustomers } from '@/context/CustomersContext';
import { useLanguage } from '@/context/LanguageContext';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCustomerModal({ isOpen, onClose }: AddCustomerModalProps) {
  const { t, direction } = useLanguage();
  const { addCustomer } = useCustomers();

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    mobile: '',
    taxNumber: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    isActive: true,
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [submitting, setSubmitting] = useState(false);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const payload = {
      ...formData,
      customerName: formData.customerName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      mobile: (formData.mobile.trim() || formData.phone.trim()),
      taxNumber: formData.taxNumber.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      postalCode: formData.postalCode.trim(),
      isActive: true,
    };

    try {
      const res = await addCustomer(payload as any);
      if (res.ok) {
        showToast('success', t('operation_completed_successfully') || 'تم الإضافة بنجاح');
        setFormData({
          customerName: '',
          email: '',
          phone: '',
          mobile: '',
          taxNumber: '',
          address: '',
          city: '',
          state: '',
          postalCode: '',
          isActive: true,
        });
        setTimeout(() => onClose(), 500);
      } else {
        showToast('error', res.message || (t('login_network_error') || 'فشل الإضافة'));
      }
    } catch (err) {
      showToast('error', t('login_network_error') || 'فشل الإضافة');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md" dir={direction}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
            <div className="flex items-center gap-2 text-[#2ecc71]">
              <h2 className="text-xl font-bold">اضافة عميل</h2>
              <UserPlus size={24} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <p className="text-center text-gray-500 text-sm">
              برجاء ادخال المعلومات أدناه. الحقول التي تحمل علامة * إجبارية.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="اسم العميل *">
                <input
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </Field>

              <Field label="عنوان البريد الإلكتروني">
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Field>

              <Field label="هاتف">
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Field>

              <Field label="موبايل">
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </Field>

              <Field label="الرقم الضريبي">
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                  value={formData.taxNumber}
                  onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                />
              </Field>

              <div />

              {/* ✅ required fields */}
              <Field label="العنوان *">
                <input
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </Field>

              <Field label="المدينة *">
                <input
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </Field>

              <Field label="المحافظة/الولاية *">
                <input
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </Field>

              <Field label="الرمز البريدي">
                <input
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </Field>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#00a65a] text-white px-10 py-2.5 rounded-lg font-bold hover:bg-[#008d4c] transition-colors shadow-md disabled:opacity-60"
              >
                {t('add_customer_button') || 'اضافة عميل'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <Toast isOpen={toastOpen} message={toastMsg} type={toastType} onClose={() => setToastOpen(false)} />
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-bold text-[#2ecc71] text-right">{label}</label>
      {children}
    </div>
  );
}