import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomers } from "@/context/CustomersContext";
import { useLanguage } from "@/context/LanguageContext";
import Toast from "../Toast";

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
}

export default function EditCustomerModal({ isOpen, onClose, customer }: EditCustomerModalProps) {
  const { t, direction } = useLanguage();
  const { updateCustomer } = useCustomers();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pricingGroup: "عام",
    customerGroup: "عام",
    taxNumber: "",
    actualBalance: 0,
    commercialRegister: "",
    creditLimit: 0,
    stopSellingOverdue: false,
    isTaxable: false,

    address: "",
    city: "",
    state: "",
    postalCode: "",
    isActive: true,
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [submitting, setSubmitting] = useState(false);

  const showToast = (type: "success" | "error", msg: string) => {
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
  };

  useEffect(() => {
    if (!customer || !isOpen) return;

    const name = customer.name ?? customer.customerName ?? "";
    const email = customer.email ?? "";
    const phone = customer.phone ?? customer.mobile ?? "";
    const taxNumber = customer.taxNumber ?? "";

    setFormData({
      name,
      email,
      phone,
      pricingGroup: customer.pricingGroup || "عام",
      customerGroup: customer.customerGroup || "عام",
      taxNumber,
      actualBalance: customer.actualBalance || 0,
      commercialRegister: customer.commercialRegister || "",
      creditLimit: customer.creditLimit || 0,
      stopSellingOverdue: customer.stopSellingOverdue || false,
      isTaxable: !!taxNumber,

      address: customer.address ?? "",
      city: customer.city ?? "",
      state: customer.state ?? "",
      postalCode: customer.postalCode ?? "",
      isActive: customer.isActive ?? true,
    });
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || submitting) return;

    const id = customer?.id ?? customer?.customerId ?? customer?._id;
    if (!id) {
      showToast("error", "Customer id is missing");
      return;
    }

    const address = formData.address.trim();
    const city = formData.city.trim();
    const state = formData.state.trim();

    if (!address || !city || !state) {
      showToast("error", "العنوان + المدينة + المحافظة/الولاية حقول إجبارية");
      return;
    }

    if (formData.isTaxable && !formData.taxNumber.trim()) {
      showToast("error", "الرقم الضريبي مطلوب");
      return;
    }

    setSubmitting(true);

    const updates = {
      // ✅ API mapping
      customerName: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      mobile: formData.phone.trim(),
      taxNumber: formData.isTaxable ? formData.taxNumber.trim() : "",

      address,
      city,
      state,
      postalCode: formData.postalCode.trim(),
      isActive: formData.isActive,

      // UI-only (لو بتحتاجها داخليًا)
      pricingGroup: formData.pricingGroup,
      customerGroup: formData.customerGroup,
      actualBalance: formData.actualBalance,
      commercialRegister: formData.commercialRegister,
      creditLimit: formData.creditLimit,
      stopSellingOverdue: formData.stopSellingOverdue,
      isTaxable: formData.isTaxable,
    };

    try {
      const res = await updateCustomer(id, updates as any);

      if (res?.ok || res === true) {
        showToast("success", t("operation_completed_successfully") || "تم التعديل بنجاح");
        setTimeout(() => onClose(), 400);
      } else {
        showToast("error", res?.message || "فشل التعديل");
      }
    } catch {
      showToast("error", "فشل التعديل");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md" dir={direction}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
            <div className="flex items-center gap-2 text-[#2ecc71]">
              <h2 className="text-xl font-bold">{t("edit_customer") || "تعديل العميل"}</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <p className="text-center text-gray-500 text-sm">
              برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
            </p>

            {/* Customer Type */}
            <div className="bg-[#fff9e6] p-4 rounded-xl border border-[#ffeeba] space-y-3">
              <p className="text-center font-bold text-[#856404]">برجاء تحديد نوع العميل</p>
              <div className="flex justify-center gap-8 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isTaxable"
                    checked={!formData.isTaxable}
                    onChange={() => setFormData({ ...formData, isTaxable: false, taxNumber: "" })}
                    className="w-4 h-4 accent-[#2ecc71]"
                  />
                  <span className="text-sm font-medium text-gray-700">فرد / شركة (غير مسجل بالضريبة)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isTaxable"
                    checked={formData.isTaxable}
                    onChange={() => setFormData({ ...formData, isTaxable: true })}
                    className="w-4 h-4 accent-[#2ecc71]"
                  />
                  <span className="text-sm font-medium text-gray-700">شركة (مسجل بالضريبة)</span>
                </label>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* UI block */}
              <div className="space-y-4 border border-gray-100 p-4 rounded-xl">
                <Field label="مجموعة العملاء">
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] bg-gray-50"
                    value={formData.customerGroup}
                    onChange={(e) => setFormData({ ...formData, customerGroup: e.target.value })}
                  >
                    <option value="عام">عام</option>
                  </select>
                </Field>

                <Field label="مجموعة التسعيرة">
                  <select
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] bg-gray-50"
                    value={formData.pricingGroup}
                    onChange={(e) => setFormData({ ...formData, pricingGroup: e.target.value })}
                  >
                    <option value="عام">عام</option>
                  </select>
                </Field>

                <Field label="اسم العميل *">
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Field>

                <Field label="هاتف">
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

                <Field label="السجل التجاري">
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.commercialRegister}
                    onChange={(e) => setFormData({ ...formData, commercialRegister: e.target.value })}
                  />
                </Field>

                <Field label="رصيد افتتاحي *( المديونية بالسالب)">
                  <input
                    type="number"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] text-center"
                    value={formData.actualBalance}
                    onChange={(e) => setFormData({ ...formData, actualBalance: Number(e.target.value) })}
                  />
                </Field>

                <Field label="الحد الائتماني">
                  <input
                    type="number"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] text-center"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                  />
                </Field>

                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm font-bold text-[#2ecc71]">ايقاف البيع في حالة وجود مبالغ مستحقة</span>
                  <input
                    type="checkbox"
                    checked={formData.stopSellingOverdue}
                    onChange={(e) => setFormData({ ...formData, stopSellingOverdue: e.target.checked })}
                    className="w-4 h-4 accent-[#2ecc71]"
                  />
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <span className="text-sm font-bold text-[#2ecc71]">{t("active") || "نشط"}</span>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 accent-[#2ecc71]"
                  />
                </div>
              </div>

              {/* API required block */}
              <div className="space-y-4 border border-gray-100 p-4 rounded-xl">
                <Field label="العنوان *">
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </Field>

                <Field label="المدينة *">
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </Field>

                <Field label="المحافظة/الولاية *">
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </Field>

                <Field label="الرمز البريدي">
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  />
                </Field>

                {formData.isTaxable && (
                  <Field label="الرقم الضريبي *">
                    <input
                      type="text"
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                      value={formData.taxNumber}
                      onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                    />
                  </Field>
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#00a65a] text-white px-10 py-2.5 rounded-lg font-bold hover:bg-[#008d4c] transition-colors shadow-md disabled:opacity-60"
              >
                {submitting ? "جارٍ الحفظ..." : "حفظ التعديلات"}
              </button>
            </div>
          </form>
        </motion.div>

        <Toast isOpen={toastOpen} message={toastMsg} type={toastType} onClose={() => setToastOpen(false)} />
      </div>
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