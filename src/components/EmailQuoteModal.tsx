import React, { useState } from 'react';
import ResponsiveModal from './ResponsiveModal';

interface EmailQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailQuoteModal({ isOpen, onClose }: EmailQuoteModalProps) {
  const [showBcc, setShowBcc] = useState(false);

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="ارسال عرض السعر بالبريد الالكتروني"
      maxWidth="max-w-2xl"
    >
      <div className="p-6 space-y-4" dir="rtl">
        <p className="text-sm text-red-600">برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .</p>
        <div className="space-y-2 text-right">
          <label className="text-sm font-bold text-green-600">إلى *</label>
          <input type="email" defaultValue="mtawfik12b@gmail.com" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-600" />
        </div>
        {showBcc && (
          <>
            <div className="space-y-2 text-right">
              <label className="text-sm font-bold text-green-600">شبكة</label>
              <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-600" />
            </div>
            <div className="space-y-2 text-right">
              <label className="text-sm font-bold text-green-600">BCC</label>
              <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-600" />
            </div>
          </>
        )}
        <div className="space-y-2 text-right">
          <label className="text-sm font-bold text-green-600">موضوع *</label>
          <input type="text" defaultValue="عرض أسعار (QUOTE2025/09/0003) من مؤسسة تكامل" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-green-600" />
        </div>
        <div className="space-y-2 text-right">
          <label className="text-sm font-bold text-green-600">رسالة</label>
          <textarea 
            rows={6}
            className="w-full border border-gray-300 rounded p-3 text-sm outline-none focus:border-green-600"
            defaultValue={`{logo}\n\nQuotation Details\n\nHello {contact_person} ({company}),\n\nPlease find the attachment for our purposed quotation ({reference_number}).\n\nBest regards,\n{site_name}`}
          />
        </div>
        <div className="flex justify-between items-center pt-4">
          <button 
            onClick={() => setShowBcc(!showBcc)}
            className="text-sm font-bold text-green-600 border border-green-600 px-4 py-2 rounded hover:bg-green-50"
          >
            {showBcc ? 'إخفاء BCC' : 'إظهار / إخفاء BCC'}
          </button>
          <button 
            onClick={onClose}
            className="bg-green-500 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors"
          >
            ارسال البريد الإلكتروني
          </button>
        </div>
      </div>
    </ResponsiveModal>
  );
}
