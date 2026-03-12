import React, { useEffect, useMemo, useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Toast from './Toast';
import { useCustomers } from '@/context/CustomersContext';
import { useLanguage } from '@/context/LanguageContext';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Country = { id: number; countryName: string };
type City = { id: number; cityName?: string; name?: string };   // حسب الـ API عندك
type StateItem = { id: number; stateName?: string; name?: string };

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? ''; // عدّلها حسب مشروعك

async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    // لو عندك توكن/كوكيز:
    // credentials: 'include',
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

function getName(o: any) {
  return o?.countryName ?? o?.cityName ?? o?.stateName ?? o?.name ?? '';
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
    postalCode: '',
    isActive: true,

    // نخليها IDs + names
    countryId: 0,
    cityId: 0,
    stateId: 0,

    // لو الباك اند لسه مستني string
    city: '',
    state: '',
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [submitting, setSubmitting] = useState(false);

  // Location data
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
  };

  // 1) Load countries when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setLoadingCountries(true);
    apiGet<Country[]>('/api/Location/countries')
      .then((data) => setCountries(Array.isArray(data) ? data : []))
      .catch(() => showToast('error', t('login_network_error') || 'فشل تحميل الدول'))
      .finally(() => setLoadingCountries(false));
  }, [isOpen]);

  // 2) Load cities when country changes
  useEffect(() => {
    if (!isOpen) return;
    if (!formData.countryId) {
      setCities([]);
      setStates([]);
      return;
    }

    setLoadingCities(true);
    setCities([]);
    setStates([]);

    // reset city/state selections
    setFormData((p) => ({
      ...p,
      cityId: 0,
      stateId: 0,
      city: '',
      state: '',
    }));

    apiGet<City[]>(`/api/Location/countries/${formData.countryId}/cities`)
      .then((data) => setCities(Array.isArray(data) ? data : []))
      .catch(() => showToast('error', t('login_network_error') || 'فشل تحميل المدن'))
      .finally(() => setLoadingCities(false));
  }, [formData.countryId, isOpen]);

  // 3) Load states when city changes
  useEffect(() => {
    if (!isOpen) return;
    if (!formData.cityId) {
      setStates([]);
      return;
    }

    setLoadingStates(true);
    setStates([]);

    // reset state selection
    setFormData((p) => ({
      ...p,
      stateId: 0,
      state: '',
    }));

    apiGet<StateItem[]>(`/api/Location/cities/${formData.cityId}/states`)
      .then((data) => setStates(Array.isArray(data) ? data : []))
      .catch(() => showToast('error', t('login_network_error') || 'فشل تحميل المحافظات/الولايات'))
      .finally(() => setLoadingStates(false));
  }, [formData.cityId, isOpen]);

  const selectedCountry = useMemo(
    () => countries.find((c) => c.id === formData.countryId),
    [countries, formData.countryId]
  );
  const selectedCity = useMemo(
    () => cities.find((c: any) => c.id === formData.cityId),
    [cities, formData.cityId]
  );
  const selectedState = useMemo(
    () => states.find((s: any) => s.id === formData.stateId),
    [states, formData.stateId]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // required validation (غير required inputs العادية)
    if (!formData.countryId || !formData.cityId || !formData.stateId) {
      showToast('error', 'من فضلك اختر الدولة والمدينة والمحافظة/الولاية');
      return;
    }

    setSubmitting(true);

    const payload = {
      ...formData,
      customerName: formData.customerName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      mobile: (formData.mobile.trim() || formData.phone.trim()),
      taxNumber: formData.taxNumber.trim(),
      address: formData.address.trim(),
      postalCode: formData.postalCode.trim(),
      isActive: true,

      // نخلي الـ strings متزامنة مع الاختيارات
      city: getName(selectedCity),
      state: getName(selectedState),
      countryName: getName(selectedCountry), // لو تحب تبعته للباك
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
          postalCode: '',
          isActive: true,
          countryId: 0,
          cityId: 0,
          stateId: 0,
          city: '',
          state: '',
        });

        setCities([]);
        setStates([]);

        setTimeout(() => onClose(), 500);
      } else {
        showToast('error', res.message || (t('login_network_error') || 'فشل الإضافة'));
      }
    } catch {
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
       <Field label="الدولة *">
                <select
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] bg-white"
                  value={formData.countryId || ''}
                  onChange={(e) => setFormData({ ...formData, countryId: Number(e.target.value) || 0 })}
                  disabled={loadingCountries}
                >
                  <option value="">{loadingCountries ? 'جاري التحميل...' : 'اختر الدولة'}</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.countryName}
                    </option>
                  ))}
                </select>
              </Field>

              
              <Field label="المحافظة/الولاية  *">
                <select
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] bg-white"
                  value={formData.cityId || ''}
                  onChange={(e) => setFormData({ ...formData, cityId: Number(e.target.value) || 0 })}
                  disabled={!formData.countryId || loadingCities}
                >
                  <option value="">
                    {!formData.countryId ? 'اختر الدولة أولاً' : (loadingCities ? 'جاري التحميل...' : 'اختر المدينة')}
                  </option>
                  {cities.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {getName(c)}
                    </option>
                  ))}
                </select>
              </Field>

             
              <Field label="المدينة*">
                <select
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] bg-white"
                  value={formData.stateId || ''}
                  onChange={(e) => setFormData({ ...formData, stateId: Number(e.target.value) || 0 })}
                  disabled={!formData.cityId || loadingStates}
                >
                  <option value="">
                    {!formData.cityId ? 'اختر المحافظه/ الولاية أولاً' : (loadingStates ? 'جاري التحميل...' : 'اختر المحافظة/الولاية')}
                  </option>
                  {states.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {getName(s)}
                    </option>
                  ))}
                </select>
              </Field>
              
              <Field label="العنوان *">
                <input
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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