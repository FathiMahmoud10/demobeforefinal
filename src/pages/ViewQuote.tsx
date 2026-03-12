import React, { useRef, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Mail, 
  Edit, 
  Trash2,
  PlusCircle,
  Building2,
  User,
  Download,
  X
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { motion, AnimatePresence } from 'motion/react';

export default function ViewQuote() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const quoteRef = useRef<HTMLDivElement>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  const downloadPDF = async () => {
    if (!quoteRef.current) return;

    try {
      const canvas = await html2canvas(quoteRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: quoteRef.current.scrollWidth,
        windowHeight: quoteRef.current.scrollHeight
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`quote-3.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="space-y-4" dir={direction}>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1 px-2">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('quotes')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('view_quote')}</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-[#8b0000]" />
          <h1 className="text-lg font-bold text-[#8b0000]">
            {t('quote_no_title')}. 3
          </h1>
        </div>
      </div>

      {/* Content Container */}
      <div ref={quoteRef} className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-8 pb-0">
        {/* Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Company Info */}
          <div className="text-right space-y-1 relative">
            <div className="absolute left-0 top-0 text-gray-400">
                <Building2 size={48} strokeWidth={1} />
            </div>
            <h3 className="font-bold text-gray-800">شركة اختبار</h3>
            <p className="text-sm text-gray-600">سعود بن فيصل</p>
            <p className="text-sm text-gray-600">الرياض 13251 الملقا</p>
            <p className="text-sm text-gray-600">SA</p>
            <p className="text-sm text-[#8b0000] mt-2">السجل التجاري: 1234123123</p>
            <p className="text-sm text-[#8b0000]">رخصة البلدية: 50608090</p>
            <p className="text-sm text-[#8b0000]">الهاتف: 0146580073</p>
            <p className="text-sm text-[#8b0000]">البريد الإلكتروني: info@posit2030.com</p>
          </div>

          {/* Customer Info */}
          <div className="text-right space-y-1 relative" dir="rtl">
             <div className="absolute left-0 top-0 text-gray-400">
                <User size={48} strokeWidth={1} />
            </div>
            <h3 className="font-bold text-gray-800">التوفيق</h3>
            <p className="text-sm text-gray-600">1</p>
            <p className="text-sm text-gray-600">. 00000 1</p>
            <p className="text-sm text-gray-600">SA</p>
            <p className="text-sm text-[#8b0000] mt-2">الهاتف: 056230354111</p>
            <p className="text-sm text-[#8b0000]">البريد الإلكتروني: mtawfik12b@gmail.com</p>
          </div>
        </div>

        {/* Quote Details & Barcode */}
        <div className="flex justify-between items-end mb-8">
          <div className="text-right space-y-1">
            <p className="text-sm font-bold text-[#8b0000]">{t('ref_no')}: QUOTE2025/09/0003</p>
            <p className="text-sm font-bold text-[#8b0000]">{t('date')}: 20:21:00 22/09/2025</p>
            <p className="text-sm font-bold text-[#8b0000]">{t('status')}: pending</p>
          </div>
          <div className="flex flex-col items-center">
             <img src="https://bwipjs-api.metafloor.com/?bcid=code128&text=QUOTE2025/09/0003&scale=3&incltext&textxalign=center" alt="Barcode" className="h-16" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm text-right border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 border border-primary/20 w-12 text-center">{t('item_no')}</th>
                <th className="p-3 border border-primary/20">{t('description')}</th>
                <th className="p-3 border border-primary/20">{t('quantity')}</th>
                <th className="p-3 border border-primary/20">{t('unit_price_with_vat')}</th>
                <th className="p-3 border border-primary/20">{t('product_total')}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="p-3 border-x border-gray-200 text-center">1</td>
                <td className="p-3 border-x border-gray-200">78574318 - غراء امريكي 1/8 نيبيرو</td>
                <td className="p-3 border-x border-gray-200">001 10.00</td>
                <td className="p-3 border-x border-gray-200">6.50</td>
                <td className="p-3 border-x border-gray-200">65.00</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="p-3 border-x border-gray-200 text-center">2</td>
                <td className="p-3 border-x border-gray-200">125 - كوع 3/4 حار نامات</td>
                <td className="p-3 border-x border-gray-200">001 5.00</td>
                <td className="p-3 border-x border-gray-200">1.85</td>
                <td className="p-3 border-x border-gray-200">9.25</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2 text-sm font-bold text-right">
            <div className="flex justify-between">
              <span>74.25</span>
              <span>{t('total')} (SR)</span>
            </div>
            <div className="flex justify-between">
              <span>50.00 (50)</span>
              <span>{t('discount')} (SR)</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>24.25</span>
              <span>{t('grand_total')} (SR)</span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-sm text-[#8b0000] space-y-1 text-right mb-8 bg-gray-50 p-4 rounded">
          <p>{t('data_entry')}: mm .</p>
          <p>{t('date')}: 20:21:00 22/09/2025</p>
          <p>{t('updated_by')}: ss ss</p>
          <p>{t('updated_at')}: 17:28:52 20/11/2025</p>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex flex-wrap text-white text-sm font-bold">
         <button 
            className="flex-1 bg-[#e74c3c] hover:bg-[#c0392b] py-3 px-4 flex items-center justify-center gap-2"
            onClick={() => alert('Delete')}
          >
            <Trash2 size={18} />
            {t('delete_btn')}
          </button>
          <button 
            className="flex-1 bg-[#f1c40f] hover:bg-[#f39c12] py-3 px-4 flex items-center justify-center gap-2 text-black"
            onClick={() => navigate('/quotes/create')}
          >
            <Edit size={18} />
            {t('edit_btn')}
          </button>
          <button 
            className="flex-1 bg-[#4ecdc4] hover:bg-[#45b7aa] py-3 px-4 flex items-center justify-center gap-2"
            onClick={() => setShowEmailModal(true)}
          >
            <Mail size={18} />
            {t('email_btn')}
          </button>
          <button 
            className="flex-1 bg-[#8b0000] hover:bg-[#a52a2a] py-3 px-4 flex items-center justify-center gap-2"
            onClick={downloadPDF}
          >
            <Download size={18} />
            {t('pdf_btn')}
          </button>
          <button 
            className="flex-[1.5] bg-[#8b0000] hover:bg-[#a52a2a] py-3 px-4 flex items-center justify-center gap-2 border-r border-[#a52a2a]"
            onClick={() => navigate('/sales/create')}
          >
            <PlusCircle size={18} />
            {t('create_sales_invoice')}
          </button>
      </div>

      <AnimatePresence>
        {showEmailModal && (
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
                <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-gray-600">
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
                    defaultValue={`{logo}

Quotation Details

Hello {contact_person} ({company}),

Please find the attachment for our purposed quotation ({reference_number}).

Best regards,
{site_name}`}
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
                    onClick={() => setShowEmailModal(false)}
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
    </div>
  );
}
