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
import MobileDataCard from '@/components/MobileDataCard';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

import Pagination from '../components/Pagination';

import { useQuotes, QuoteRecord } from '../context/QuotesContext';

export default function QuotesList() {
  const { t, direction } = useLanguage();
  const { quotes, deleteQuote } = useQuotes();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCount, setShowCount] = useState(10);
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
    deleteQuote(id);
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

  const paginatedQuotes = filteredQuotes.slice(
    (currentPage - 1) * showCount,
    currentPage * showCount
  );

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
              <button className="p-1 hover:bg-gray-100 rounded">
                  <RefreshCw size={20} className="text-gray-600" />
              </button>
              <h1 className="text-lg font-bold text-green-600">
                  {t('quotes')} ({t('all_branches')})
              </h1>
          </div>
          <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/quotes/create')}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-primary-hover transition-colors flex items-center gap-2"
              >
                  <PlusCircle size={18} />
                  {t('add_quote')}
              </button>
          </div>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
          
          <p className="text-sm text-green-600 mb-6 text-right font-medium">
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

          {/* Table - Desktop */}
          <div className="hidden md:block overflow-x-auto pb-64">
              <table className="w-full min-w-[1000px] text-sm text-right border-collapse">
                  <thead>
                      <tr className="bg-green-500 text-white">
                          <th className="p-3 border border-green-600 w-10 text-center">
                              <input type="checkbox" className="rounded border-gray-300" />
                          </th>
                          <th className="p-3 border border-green-600 whitespace-nowrap">{t('quote_no')}</th>
                          <th className="p-3 border border-green-600 whitespace-nowrap">{t('date')}</th>
                          <th className="p-3 border border-green-600 whitespace-nowrap">{t('ref_no')}</th>
                          <th className="p-3 border border-green-600 whitespace-nowrap">{t('cashier')}</th>
                          <th className="p-3 border border-green-600 whitespace-nowrap">{t('customer')}</th>
                          <th className="p-3 border border-green-600 whitespace-nowrap">{t('total')}</th>
                          <th className="p-3 border border-green-600 whitespace-nowrap">{t('status')}</th>
                          <th className="p-3 border border-green-600 whitespace-nowrap w-10 text-center">
                              <LinkIcon size={14} />
                          </th>
                          <th className="p-3 border border-green-600 whitespace-nowrap w-24 text-center">{t('actions')}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {paginatedQuotes.map((quote) => (
                          <tr key={`desktop-${quote.id}`} className="hover:bg-gray-50 transition-colors border-b border-gray-200">
                              <td className="p-3 text-center border-x border-gray-200">
                                  <input type="checkbox" className="rounded border-gray-300" />
                              </td>
                              <td className="p-3 border-x border-gray-200 font-medium">{quote.quoteNo}</td>
                              <td className="p-3 border-x border-gray-200 text-gray-600">{quote.date}</td>
                              <td className="p-3 border-x border-gray-200 text-gray-600">{quote.refNo}</td>
                              <td className="p-3 border-x border-gray-200">{quote.cashier}</td>
                              <td className="p-3 border-x border-gray-200">{quote.customer}</td>
                              <td className="p-3 border-x border-gray-200 font-bold">{(quote.total || 0).toFixed(2)}</td>
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
                                    className="bg-green-500 text-white px-3 py-1 rounded text-xs flex items-center gap-1 mx-auto hover:bg-green-600 transition-colors"
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
                                          className={cn(
                                            "absolute top-full mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-xl z-50 py-1 text-right",
                                            direction === "rtl" ? "left-0" : "right-0"
                                          )}
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
                                              onClick={() => navigate('/sales/create-from-quote')}
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

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {paginatedQuotes.map((quote) => (
              <MobileDataCard
                key={`mobile-${quote.id}`}
                title={quote.quoteNo}
                subtitle={quote.refNo}
                status={quote.status}
                fields={[
                  { label: t('date'), value: quote.date },
                  { label: t('customer'), value: quote.customer },
                  { label: t('total'), value: (quote.total || 0).toFixed(2), isBold: true },
                ]}
                actions={
                  <div className="flex flex-wrap justify-end gap-2">
                    <button 
                      onClick={() => navigate(`/quotes/view/${quote.id}`)}
                      className="p-2 text-primary hover:bg-primary/5 rounded-lg border border-primary/10 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <FileText size={16} />
                      {t('view')}
                    </button>
                    <button 
                      onClick={() => navigate('/quotes/create')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Edit2 size={16} />
                      {t('edit')}
                    </button>
                    <button 
                      onClick={() => { setShowDeleteModal(quote.id); }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <Trash2 size={16} />
                      {t('delete')}
                    </button>
                  </div>
                }
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalItems={filteredQuotes.length}
            itemsPerPage={showCount}
            onPageChange={setCurrentPage}
          />

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

      <DeleteConfirmationModal
        isOpen={showDeleteModal !== null}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={() => {
          if (showDeleteModal) {
            handleDeleteQuote(showDeleteModal);
          }
        }}
        itemName={quotes.find(q => q.id === showDeleteModal)?.quoteNo}
      />
    </div>
  );
}
