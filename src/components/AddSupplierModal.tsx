import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X as CloseIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSuppliers } from '@/context/SuppliersContext';
import Toast from './Toast';

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier?: any;
}

export default function AddSupplierModal({ isOpen, onClose, supplier }: AddSupplierModalProps) {
  const { t, direction } = useLanguage();
  const { addSupplier, updateSupplier } = useSuppliers();

  const [isLoading, setIsLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const [formData, setFormData] = useState({
    supplierName: supplier?.supplierName ?? supplier?.name ?? '',
    taxNumber: supplier?.taxNumber ?? '',
    commercialRegistration: supplier?.commercialRegistration ?? supplier?.commercialRegistration ?? '',
    openingBalance: supplier?.openingBalance ?? 0,

    email: supplier?.email ?? '',
    phone: supplier?.phone ?? '',
    mobile: supplier?.mobile ?? supplier?.phone ?? '',

    address: supplier?.address ?? '',
    city: supplier?.city ?? '',
    state: supplier?.state ?? '',
    country: supplier?.country ?? '',
    postalCode: supplier?.postalCode ?? '',

    paymentTerms: supplier?.paymentTerms ?? 30,
    isActive: supplier?.isActive ?? true,
  });

  React.useEffect(() => {
    if (supplier) {
      setFormData({
        supplierName: supplier?.supplierName ?? supplier?.name ?? '',
        taxNumber: supplier?.taxNumber ?? '',
        commercialRegistration: supplier?.commercialRegistration ?? '',
        openingBalance: supplier?.openingBalance ?? 0,

        email: supplier?.email ?? '',
        phone: supplier?.phone ?? '',
        mobile: supplier?.mobile ?? supplier?.phone ?? '',

        address: supplier?.address ?? '',
        city: supplier?.city ?? '',
        state: supplier?.state ?? '',
        country: supplier?.country ?? '',
        postalCode: supplier?.postalCode ?? '',

        paymentTerms: supplier?.paymentTerms ?? 30,
        isActive: supplier?.isActive ?? true,
      });
    } else {
      setFormData({
        supplierName: '',
        taxNumber: '',
        commercialRegistration: '',
        openingBalance: 0,

        email: '',
        phone: '',
        mobile: '',

        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',

        paymentTerms: 30,
        isActive: true,
      });
    }
  }, [supplier]);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ required validation per API
    if (!formData.supplierName.trim()) return showToast('error', 'اسم المورد مطلوب');
    if (!formData.mobile.trim()) return showToast('error', 'الموبايل مطلوب');
    if (!formData.city.trim()) return showToast('error', 'المدينة مطلوبة');
    if (!formData.state.trim()) return showToast('error', 'المحافظة/الولاية مطلوبة');
    if (!formData.country.trim()) return showToast('error', 'الدولة مطلوبة');
    if (!formData.postalCode.trim()) return showToast('error', 'الرمز البريدي مطلوب');

    setIsLoading(true);
    try {
      const payload = {
        supplierName: formData.supplierName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        mobile: formData.mobile.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim(),
        postalCode: formData.postalCode.trim(),
        taxNumber: formData.taxNumber.trim(),
        paymentTerms: Number(formData.paymentTerms || 30),
        isActive: true,

        // UI-only
        commercialRegistration: formData.commercialRegistration,
        openingBalance: formData.openingBalance,
      };

      const result = supplier
        ? await updateSupplier(supplier.id, payload as any)
        : await addSupplier(payload as any);

      if (result.ok) {
        showToast('success', supplier ? 'تم تحديث بيانات المورد بنجاح' : 'تم إضافة المورد بنجاح');

        setTimeout(() => {
          onClose();
          if (!supplier) {
            setFormData({
              supplierName: '',
              taxNumber: '',
              commercialRegistration: '',
              openingBalance: 0,
              email: '',
              phone: '',
              mobile: '',
              address: '',
              city: '',
              state: '',
              country: '',
              postalCode: '',
              paymentTerms: 30,
              isActive: true,
            });
          }
        }, 500);
      } else {
        showToast('error', result.message || 'فشلت العملية');
      }
    } catch (error) {
      showToast('error', String(error) || 'فشلت العملية');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" dir={direction}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h2 className="text-lg font-bold text-gray-800">
                  {supplier ? (t('edit_supplier') || 'تعديل مورد') : (t('add_supplier') || 'إضافة مورد')}
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <CloseIcon size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <p className="text-sm text-gray-500 mb-6 text-center">
                  برجاء ادخال المعلومات أدناه. الحقول التي تحمل علامة * إجبارية.
                </p>

                <form id="supplier-form-modal" onSubmit={handleSubmit} className="space-y-4">
                  <Field label="اسم المورد *">
                    <input
                      required
                      value={formData.supplierName}
                      onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary text-right"
                    />
                  </Field>

                  <Field label="الموبايل *">
                    <input
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary text-right"
                    />
                  </Field>

                  <Field label="هاتف">
                    <input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary text-right"
                    />
                  </Field>

                  <Field label="البريد الإلكتروني">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary text-right"
                    />
                  </Field>

                  <Field label="العنوان">
                    <input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary text-right"
                    />
                  </Field>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Field label="المدينة *">
                      <input
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary text-right"
                      />
                    </Field>

                    <Field label="المحافظة/الولاية *">
                      <input
                        required
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary text-right"
                      />
                    </Field>

                    <Field label="الدولة *">
                      <input
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary text-right"
                      />
                    </Field>

                    <Field label="الرمز البريدي *">
                      <input
                        required
                        value={formData.postalCode}
                        onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary text-right"
                      />
                    </Field>
                  </div>

                  <Field label="الرقم الضريبي">
                    <input
                      value={formData.taxNumber}
                      onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary text-right"
                    />
                  </Field>

                  <Field label="شروط الدفع (أيام)">
                    <input
                      type="number"
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData({ ...formData, paymentTerms: Number(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary text-right"
                    />
                  </Field>
                </form>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button
                  type="submit"
                  form="supplier-form-modal"
                  disabled={isLoading}
                  className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-hover transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (t('loading') || 'جاري...') : (supplier ? (t('update') || 'تحديث') : (t('add_supplier') || 'إضافة مورد'))}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {toastOpen && (
        <Toast isOpen={toastOpen} message={toastMsg} type={toastType} onClose={() => setToastOpen(false)} />
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 block text-right">{label}</label>
      {children}
    </div>
  );
}