import React, { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useProducts, Product } from "@/context/ProductsContext";
import Toast from "./Toast";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function EditProductModal({ isOpen, onClose, product }: EditProductModalProps) {
  const { t, direction } = useLanguage();
  const { updateProduct } = useProducts();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "",
    cost: 0,
    price: 0,
    quantity: 0,
    unit: "",
    alertQuantity: 0,
    productType: "1",
    description: "",
    imageUrl: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return formData.imageUrl || "";
  }, [imageFile, formData.imageUrl]);

  useEffect(() => {
    return () => {
      if (imageFile) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

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
    if (!product || !isOpen) return;

    setImageFile(null);

    setFormData({
      name: product.name ?? "",
      code: product.code ?? "",
      category: product.category ?? "",
      cost: Number(product.cost ?? 0),
      price: Number(product.price ?? 0),
      quantity: Number(product.quantity ?? 0),
      unit: product.unit ?? "",
      alertQuantity: Number(product.alertQuantity ?? 0),
      productType: (product.productType ?? "1").toString(),
      description: (product.description ?? "").toString(),
      imageUrl: product.image ?? "",
    });
  }, [product, isOpen]);

  const onPickImage = () => {
    fileInputRef.current?.click();
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (!f) return;

    // optional: تحقق بسيط
    if (!f.type.startsWith("image/")) {
      showToast("error", "من فضلك اختر ملف صورة صحيح");
      return;
    }

    setImageFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || submitting) return;

    // validation بسيط للمستخدم
    if (!formData.name.trim()) {
      showToast("error", "من فضلك اكتب اسم المنتج");
      return;
    }
    if (!formData.category.trim()) {
      showToast("error", "من فضلك اكتب/اختر التصنيف الرئيسي");
      return;
    }
    if (!Number.isFinite(Number(formData.price))) {
      showToast("error", "سعر البيع غير صحيح");
      return;
    }

    setSubmitting(true);

    const updates: any = {
      name: formData.name.trim(),
      code: formData.code.trim(),
      category: formData.category.trim(),
      cost: Number(formData.cost),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      unit: formData.unit,
      alertQuantity: Number(formData.alertQuantity),
      productType: formData.productType,
      description: formData.description,
      // ✅ نرسل الملف (لو اتغير)
      imageFile: imageFile ?? null,
    };

    const res = await updateProduct(product.id, updates);

    if (res.ok) {
      showToast("success", res.message || (t("operation_completed_successfully") as string) || "تم الحفظ بنجاح");
      setTimeout(() => onClose(), 400);
    } else {
      showToast("error", res.message || "فشل حفظ التعديلات");
    }

    setSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md"
        dir={direction}
      >
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
              <h2 className="text-xl font-bold">{t("edit_product") || "تعديل الصنف"}</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <p className="text-center text-gray-500 text-sm">
              برجاء إدخال المعلومات أدناه. الحقول التي تحمل علامة * هي حقول إجبارية.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left */}
              <div className="space-y-4 border border-gray-100 p-4 rounded-xl">
                <Field label="اسم الصنف *">
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Field>

                <Field label="كود الصنف">
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </Field>

                <Field label="التصنيف الرئيسي *">
                  <input
                    type="text"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </Field>

                <Field label="وحدة">
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </Field>

                <Field label="Product Type *">
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71]"
                    value={formData.productType}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                  />
                </Field>
              </div>

              {/* Right */}
              <div className="space-y-4 border border-gray-100 p-4 rounded-xl">
                <Field label="التكلفة">
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] text-center"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                  />
                </Field>

                <Field label="سعر البيع *">
                  <input
                    type="number"
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] text-center"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  />
                </Field>

                <Field label="الكمية">
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] text-center"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  />
                </Field>

                <Field label="تنبيهات بكميات المخزون">
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] text-center"
                    value={formData.alertQuantity}
                    onChange={(e) => setFormData({ ...formData, alertQuantity: Number(e.target.value) })}
                  />
                </Field>

                {/* ✅ صورة المنتج + تغيير من الملفات */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-[#2ecc71] text-right">
                    صورة المنتج *
                  </label>

                  <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                    <div className="w-full h-44 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
                      {previewUrl ? (
                        <img src={previewUrl} alt="preview" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-gray-400 text-sm">لا يوجد صورة</span>
                      )}
                    </div>

                    <div className="flex justify-end mt-3">
                      <button
                        type="button"
                        onClick={onPickImage}
                        className="bg-[#00a65a] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#008d4c] transition-colors"
                      >
                        تغيير الصورة
                      </button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onImageChange}
                    />
                  </div>
                </div>
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