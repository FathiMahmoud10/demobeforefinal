import React, { useEffect, useState } from "react";
import { X, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

type UnitOfMeasure = {
  id: number;
  name: string;
  description?: string;
};

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;

  // ✅ هنستخدم نفس المودال للإضافة والتعديل
  unit?: UnitOfMeasure | null;

  // ✅ بدل onAddUnit: اسم موحد
  onSubmit: (name: string) => void;
}

export default function AddUnitModal({ isOpen, onClose, unit, onSubmit }: AddUnitModalProps) {
  const { t, direction } = useLanguage();
  const [unitName, setUnitName] = useState("");

  useEffect(() => {
    if (unit) setUnitName(unit.name || "");
    else setUnitName("");
  }, [unit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitName.trim()) return;
    onSubmit(unitName.trim());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className={`w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden ${
              direction === "rtl" ? "text-right" : "text-left"
            }`}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-2">
                <PlusCircle className="text-primary" size={20} />
                <h2 className="text-lg font-bold text-gray-800">
                  {unit ? (t("edit_unit") || "تعديل وحدة") : (t("add_new_unit") || "إضافة وحدة جديدة")}
                </h2>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("unit_name") || "اسم الوحدة"} <span className="text-red-500">*</span>
                </label>
                <input
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t("unit_name") || "اسم الوحدة"}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {t("cancel") || "إلغاء"}
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover"
                >
                  {unit ? (t("save_changes") || "حفظ التعديلات") : (t("add_new_unit") || "إضافة وحدة جديدة")}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}