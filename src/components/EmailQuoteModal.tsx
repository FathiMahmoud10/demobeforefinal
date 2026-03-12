import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface EmailQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailQuoteModal({ isOpen, onClose }: EmailQuoteModalProps) {
  const [showBcc, setShowBcc] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg w-full max-w-2xl shadow-xl relative my-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-white border-b p-4 flex justify-between items-center rounded-t-lg">
              <h2 className="text-lg font-bold text-[#8b0000]">ارسال عرض السعر بالبريد الالكتروني</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4" dir="rtl">
              <p className="text-sm text-red-600">برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .</p>
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-[#8b0000]">إلى *</label>
                <input type="email" defaultValue="mtawfik12b@gmail.com" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
              </div>
              {showBcc && (
                <>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-[#8b0000]">شبكة</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-sm font-bold text-[#8b0000]">BCC</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
                  </div>
                </>
              )}
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-[#8b0000]">موضوع *</label>
                <input type="text" defaultValue="عرض أسعار (QUOTE2025/09/0003) من مؤسسة تكامل" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
              </div>
              <div className="space-y-2 text-right">
                <label className="text-sm font-bold text-[#8b0000]">رسالة</label>
                <textarea 
                  rows={6}
                  className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-red-600"
                  defaultValue={`{logo}\n\nQuotation Details\n\nHello {contact_person} ({company}),\n\nPlease find the attachment for our purposed quotation ({reference_number}).\n\nBest regards,\n{site_name}`}
                />
              </div>
              <div className="flex justify-between items-center pt-4">
                <button 
                  onClick={() => setShowBcc(!showBcc)}
                  className="text-sm font-bold text-[#8b0000] border border-[#8b0000] px-4 py-2 rounded hover:bg-red-50"
                >
                  {showBcc ? 'إخفاء BCC' : 'إظهار / إخفاء BCC'}
                </button>
                <button 
                  onClick={onClose}
                  className="bg-[#8b0000] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#a52a2a] transition-colors"
                >
                  ارسال البريد الإلكتروني
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
