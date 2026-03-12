import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

interface AddDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
}

export default function AddDepositModal({ isOpen, onClose, customer }: AddDepositModalProps) {
  const { t, direction } = useLanguage();
  
  const [formData, setFormData] = useState({
    date: new Date().toLocaleString('en-GB'),
    amount: '',
    employee: 'عام',
    paymentType: 'نقدي',
    branch: 'تجريبي',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to add deposit would go here
    console.log('Adding deposit:', formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md" dir={direction}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
             <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
            <div className="flex items-center gap-2 text-[#2ecc71]">
              <h2 className="text-xl font-bold">اضافة ايداع ({customer?.name || 'عميل افتراضي'})</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <p className="text-center text-gray-500 text-sm">
              برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
            </p>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#2ecc71] text-right">التاريخ *</label>
                <input 
                  type="text" 
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] text-center"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#2ecc71] text-right">المدفوع *</label>
                <input 
                  type="number" 
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] text-center"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#2ecc71] text-right">المندوب / الموظف</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] bg-gray-50"
                  value={formData.employee}
                  onChange={(e) => setFormData({...formData, employee: e.target.value})}
                >
                  <option value="عام">عام</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#2ecc71] text-right">نوع الدفع</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] bg-gray-50"
                  value={formData.paymentType}
                  onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
                >
                  <option value="نقدي">نقدي</option>
                  <option value="شبكة">شبكة</option>
                  <option value="تحويل">تحويل</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#2ecc71] text-right">الفرع</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] bg-gray-50"
                  value={formData.branch}
                  onChange={(e) => setFormData({...formData, branch: e.target.value})}
                >
                  <option value="تجريبي">تجريبي</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-bold text-[#2ecc71] text-right">مذكرة</label>
                <textarea 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#2ecc71] min-h-[100px]"
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                className="bg-[#004a2c] text-white px-10 py-2.5 rounded-lg font-bold hover:bg-[#003a22] transition-colors shadow-md"
              >
                اضافة ايداع
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
