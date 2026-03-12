import React, { useState } from 'react';
import {
  FileText, 
  Search, 
  ChevronDown,
  Menu,
  LayoutGrid,
  List as ListIcon,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  Printer,
  Link as LinkIcon,
  Heart,
  Star,
  Mail,
  Edit2,
  Trash2,
  RefreshCw,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import EmailQuoteModal from '../components/EmailQuoteModal';

interface QuoteRecord {
  id: string;
  quoteNo: string;
  date: string;
  refNo: string;
  cashier: string;
  customer: string;
  total: number;
  status: 'pending' | 'completed';
}

const mockQuotes: QuoteRecord[] = [
  { id: '1', quoteNo: '3', date: '22/09/2025 20:21:00', refNo: 'QUOTE2025/09/0003', cashier: 'شركة فن الفيصلية التجارية', customer: 'التوفيق', total: 24.25, status: 'pending' },
  { id: '2', quoteNo: '2', date: '14/09/2025 19:58:00', refNo: 'QUOTE2025/09/0002', cashier: 'شركة فن الفيصلية التجارية', customer: 'شخص عام', total: 2500.00, status: 'pending' },
];

export default function QuotesList() {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCount, setShowCount] = useState(10);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [quotes, setQuotes] = useState<QuoteRecord[]>(mockQuotes);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  // Close menu on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.action-menu-container')) {
        setActiveActionMenu(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDeleteQuote = (id: string) => {
    setQuotes(quotes.filter(q => q.id !== id));
    setShowDeleteModal(null);
    setActiveActionMenu(null);
  };

  const filteredQuotes = quotes.filter(quote => 
    quote.quoteNo.includes(searchTerm) || 
    quote.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.customer.includes(searchTerm)
  );

  const downloadPDF = async (quote: QuoteRecord) => {
    const element = document.getElementById(`quote-template-${quote.id}`);
    if (!element) return;

    // Temporarily show the element to capture it
    element.style.display = 'block';
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`quote-${quote.quoteNo}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      element.style.display = 'none';
    }
  };

  return (
    <div className="space-y-4">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1 px-2" dir={direction}>
        <span>{t('home')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('quotes')}</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center" dir={direction}>
          <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-gray-100 rounded" onClick={() => setQuotes(mockQuotes)}>
                  <RefreshCw size={20} className="text-gray-600" />
              </button>
              <h1 className="text-lg font-bold text-[#8b0000]">
                  {t('quotes')} ({t('all_branches')})
              </h1>
          </div>
          <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/quotes/create')}
                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded border border-gray-200"
              >
                  <PlusCircle size={18} />
              </button>
              <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded border border-gray-200">
                  <ListIcon size={18} />
              </button>
              <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded border border-gray-200">
                  <LayoutGrid size={18} />
              </button>
          </div>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
          
          <p className="text-sm text-[#8b0000] mb-6 text-right font-medium">
              {t('sales_table_desc')}
          </p>

          {/* Table Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6" dir={direction}>
              <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{t('show')}</span>
                  <select 
                    value={showCount}
                    onChange={(e) => setShowCount(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-primary bg-white"
                  >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                  </select>
              </div>
              <div className="relative w-full md:w-80 flex items-center gap-2">
                  <div className="relative flex-1">
                    <input 
                        type="text" 
                        placeholder={t('search_placeholder')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary text-right" 
                    />
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">{t('search')}</span>
              </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto pb-64">
              <table className="w-full min-w-[1000px] text-sm text-right border-collapse">
                  <thead>
                      <tr className="bg-[#8b0000] text-white">
                          <th className="p-3 border border-[#a52a2a] w-10 text-center">
                              <input type="checkbox" className="rounded border-gray-300" />
                          </th>
                          <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('quote_no')}</th>
                          <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('date')}</th>
                          <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('ref_no')}</th>
                          <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('cashier')}</th>
                          <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('customer')}</th>
                          <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('total')}</th>
                          <th className="p-3 border border-[#a52a2a] whitespace-nowrap">{t('status')}</th>
                          <th className="p-3 border border-[#a52a2a] whitespace-nowrap w-10 text-center">
                              <LinkIcon size={14} />
                          </th>
                          <th className="p-3 border border-[#a52a2a] whitespace-nowrap w-24 text-center">{t('actions')}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {filteredQuotes.map((quote) => (
                          <tr key={quote.id} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                              <td className="p-3 text-center border-x border-gray-200">
                                  <input type="checkbox" className="rounded border-gray-300" />
                              </td>
                              <td className="p-3 border-x border-gray-200 font-medium">{quote.quoteNo}</td>
                              <td className="p-3 border-x border-gray-200 text-gray-600">{quote.date}</td>
                              <td className="p-3 border-x border-gray-200 text-gray-600">{quote.refNo}</td>
                              <td className="p-3 border-x border-gray-200">{quote.cashier}</td>
                              <td className="p-3 border-x border-gray-200">{quote.customer}</td>
                              <td className="p-3 border-x border-gray-200 font-bold">{quote.total.toFixed(2)}</td>
                              <td className="p-3 border-x border-gray-200">
                                  <span className={cn(
                                      "px-2 py-1 rounded text-xs font-medium",
                                      quote.status === 'pending' ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
                                  )}>
                                      {t(quote.status)}
                                  </span>
                              </td>
                              <td className="p-3 border-x border-gray-200 text-center">
                                  <LinkIcon size={14} className="text-gray-400 mx-auto" />
                              </td>
                              <td className={cn("p-3 border-x border-gray-200 text-center relative action-menu-container", activeActionMenu === quote.id && "z-[60]")}>
                                  <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveActionMenu(activeActionMenu === quote.id ? null : quote.id);
                                    }}
                                    className="bg-[#8b0000] text-white px-3 py-1 rounded text-xs flex items-center gap-1 mx-auto hover:bg-[#a52a2a] transition-colors"
                                  >
                                      {t('actions')}
                                      <ChevronDown size={14} />
                                  </button>
                                  
                                  <AnimatePresence>
                                    {activeActionMenu === quote.id && (
                                        <motion.div 
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: -10 }}
                                          className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-xl z-50 py-1 text-right"
                                        >
                                            <button 
                                              onClick={() => navigate(`/quotes/view/${quote.id}`)}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-start gap-2"
                                            >
                                                <FileText size={16} />
                                                {t('view_quote')}
                                            </button>
                                            <button 
                                              onClick={() => navigate('/quotes/create')}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-start gap-2"
                                            >
                                                <Edit2 size={16} />
                                                {t('edit_quote_action')}
                                            </button>
                                            <button 
                                              onClick={() => navigate('/sales/create')}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-start gap-2"
                                            >
                                                <Heart size={16} />
                                                {t('create_sales_invoice')}
                                            </button>
                                            <button 
                                              onClick={() => alert(t('create_purchase_invoice'))}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-start gap-2"
                                            >
                                                <Star size={16} />
                                                {t('create_purchase_invoice')}
                                            </button>
                                            <button 
                                              onClick={() => downloadPDF(quote)}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-start gap-2"
                                            >
                                                <FileText size={16} />
                                                {t('download_pdf_quote')}
                                            </button>
                                            <button 
                                              onClick={() => { setShowEmailModal(true); setActiveActionMenu(null); }}
                                              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-start gap-2"
                                            >
                                                <Mail size={16} />
                                                {t('send_email_quote')}
                                            </button>
                                            <button 
                                              onClick={() => { setShowDeleteModal(quote.id); setActiveActionMenu(null); }}
                                              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center justify-start gap-2"
                                            >
                                                <Trash2 size={16} />
                                                {t('delete_quote_action')}
                                            </button>
                                        </motion.div>
                                    )}
                                  </AnimatePresence>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6" dir={direction}>
              <div className="text-sm text-red-700 font-bold">
                  {t('showing_records')} 1 {t('to')} {filteredQuotes.length} {t('of')} {filteredQuotes.length} {t('records')}
              </div>
              <div className="flex items-center gap-1">
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 text-sm">
                      {t('previous')}
                  </button>
                  <button className="px-3 py-1 border border-[#8b0000] bg-[#8b0000] text-white rounded text-sm">1</button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 text-sm">
                      {t('next')}
                  </button>
              </div>
          </div>

      </div>
      {/* Hidden PDF Templates */}
      <div className="hidden">
        {quotes.map(quote => (
          <div 
            key={quote.id} 
            id={`quote-template-${quote.id}`} 
            className="bg-white p-8 w-[210mm] text-sm" 
            dir="rtl"
            style={{ display: 'none', fontFamily: 'sans-serif' }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-right">
                <h2 className="text-lg font-bold">شركة اختبار</h2>
                <p>الرياض - الملقا - سعود بن فيصل</p>
                <p>السجل التجاري: 1234123123</p>
                <p>هاتف: 0146580073</p>
                <p>رخصة البلدية: 50608090</p>
              </div>
              <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
            </div>

            <div className="text-center bg-gray-100 py-2 mb-4">
              <h3 className="font-bold">عرض أسعار</h3>
            </div>

            <table className="w-full mb-4 text-xs">
              <tbody>
                <tr className="bg-gray-100">
                  <td className="p-1 font-bold text-right border">رقم عرض السعر</td>
                  <td className="p-1 text-right border">{quote.quoteNo}</td>
                  <td className="p-1 font-bold text-right border">الرقم المرجعي</td>
                  <td className="p-1 text-right border">{quote.refNo}</td>
                  <td className="p-1 font-bold text-right border">تاريخ اصدار الفاتورة</td>
                  <td className="p-1 text-right border">{quote.date}</td>
                </tr>
                <tr>
                  <td className="p-1 font-bold text-right border">ملاحظات</td>
                  <td colSpan={5} className="p-1 text-right border">يتم الاستلام فورا بعد الدفع</td>
                </tr>
              </tbody>
            </table>

            <div className="text-center bg-gray-100 py-1 mb-4">
              <h4 className="font-bold text-xs">بيانات العميل</h4>
            </div>

            <table className="w-full mb-4 text-xs">
              <tbody>
                <tr className="bg-gray-100">
                  <td className="p-1 font-bold text-right border">رقم العميل</td>
                  <td className="p-1 font-bold text-right border">اسم العميل</td>
                  <td className="p-1 font-bold text-right border">الرقم الضريبي للعميل</td>
                  <td className="p-1 font-bold text-right border">رقم الجوال</td>
                  <td className="p-1 font-bold text-right border">المدينة</td>
                  <td className="p-1 font-bold text-right border">الحي</td>
                  <td className="p-1 font-bold text-right border">اسم الشارع</td>
                  <td className="p-1 font-bold text-right border">الرمز البريدي</td>
                  <td className="p-1 font-bold text-right border">رقم المبنى</td>
                  <td className="p-1 font-bold text-right border">الرقم الاضافي</td>
                </tr>
                <tr>
                  <td className="p-1 text-right border">1</td>
                  <td className="p-1 text-right border">عميل افتراضي</td>
                  <td className="p-1 text-right border"></td>
                  <td className="p-1 text-right border">00</td>
                  <td className="p-1 text-right border">Riyadh</td>
                  <td className="p-1 text-right border"></td>
                  <td className="p-1 text-right border">KSA</td>
                  <td className="p-1 text-right border"></td>
                  <td className="p-1 text-right border"></td>
                  <td className="p-1 text-right border">13248</td>
                </tr>
              </tbody>
            </table>

            <table className="w-full mb-4 text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-1 font-bold border">م</th>
                  <th className="p-1 font-bold border">وصف</th>
                  <th className="p-1 font-bold border">كمية</th>
                  <th className="p-1 font-bold border">سعر الوحدة</th>
                  <th className="p-1 font-bold border">السعر الكلي</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-1 text-center border">1</td>
                  <td className="p-1 text-right border">83821969 - جلبة 3/4</td>
                  <td className="p-1 text-center border">500.00 وحدة</td>
                  <td className="p-1 text-center border">3.50</td>
                  <td className="p-1 text-center border">1750.00</td>
                </tr>
                <tr>
                  <td className="p-1 text-center border">2</td>
                  <td className="p-1 text-right border">68823714 - صنف تجريبي</td>
                  <td className="p-1 text-center border">5.00 وحدة</td>
                  <td className="p-1 text-center border">150.00</td>
                  <td className="p-1 text-center border">750.00</td>
                </tr>
              </tbody>
            </table>

            <p className="text-center mb-4 text-xs">فقط وقدره: ألفان و خمسمائة ريال سعودي</p>

            <div className="flex justify-start">
              <table className="text-xs w-64">
                <tbody>
                  <tr>
                    <td className="p-1 border text-right font-bold">الإجمالي</td>
                    <td className="p-1 border text-right">2500.00 ر.س</td>
                  </tr>
                  <tr>
                    <td className="p-1 border text-right font-bold">الإجمالي الكلي</td>
                    <td className="p-1 border text-right">2500.00 ر.س</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-xs text-right">
              <p>معد العرض: mm .</p>
              <p>شكراً لزيارتكم ننتظركم مرة أخرى للإرجاع والاستبدال خلال 48 ساعة يجب احضار الفاتورة</p>
            </div>
          </div>
        ))}
      </div>
      <EmailQuoteModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} />

      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg w-full max-w-sm shadow-xl p-6 text-center"
            >
              <h3 className="text-lg font-bold mb-4">هل انت متأكد من حذف عرض السعر</h3>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => handleDeleteQuote(showDeleteModal)}
                  className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition-colors"
                >
                  نعم
                </button>
                <button 
                  onClick={() => setShowDeleteModal(null)}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded font-bold hover:bg-gray-300 transition-colors"
                >
                  لا
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
