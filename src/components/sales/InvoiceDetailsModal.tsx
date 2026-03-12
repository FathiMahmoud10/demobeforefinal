import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, X, LayoutGrid, Printer, Download, Mail, DollarSign } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type SalesOrderStatus = string;

interface SalesOrderDTO {
  id: number;
  orderNumber: string;
  customerName: string;
  warehouseName: string;
  orderDate: string;
  subTotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  orderStatus: SalesOrderStatus;
}

type SalesOrderDetailsDTO = SalesOrderDTO & {
  items?: Array<{
    itemName?: string;
    description?: string;
    productName?: string;
    quantity?: number;
    qty?: number;
    unitPrice?: number;
    price?: number;
    vat?: number;
    tax?: number;
    total?: number;
    totalPrice?: number;
  }>;
  lines?: Array<any>;
  details?: Array<any>;
};

export interface SaleRecord {
  id: string;
  invoiceNo: string;
  date: string;
  refNo: string;
  cashier: string;
  customer: string;
  saleStatus: 'completed' | 'returned';
  grandTotal: number;
  paid: number;
  remaining: number;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
  paymentType: 'mada' | 'cash' | 'bank_transfer';
  apiOrderStatus?: string;
  subTotal?: number;
  taxAmount?: number;
  discountAmount?: number;
  warehouseName?: string;
  orderNumber?: string;
  orderDateISO?: string;
}

interface InvoiceDetailsModalProps {
  open: boolean;
  sale: SaleRecord | null;
  onClose: () => void;
  t: (key: string) => string;
  direction: 'rtl' | 'ltr';
  apiBase: string;
  onAddPayment?: (sale: SaleRecord) => void;
}

function safeNumber(n: any) {
  const x = Number(n);
  return Number.isFinite(x) ? x : 0;
}

export default function InvoiceDetailsModal({
  open,
  sale,
  onClose,
  t,
  direction,
  apiBase,
  onAddPayment,
}: InvoiceDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [details, setDetails] = useState<SalesOrderDetailsDTO | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  async function fetchSalesOrderDetails(id: string) {
    setLoading(true);
    setError('');
    setDetails(null);

    try {
      const res = await fetch(`${apiBase}/api/SalesOrders/${id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`API Error (${res.status}): ${text || res.statusText}`);
      }

      const data = (await res.json()) as SalesOrderDetailsDTO;
      setDetails(data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load invoice details');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open && sale?.id) {
      fetchSalesOrderDetails(sale.id);
    } else {
      setDetails(null);
      setError('');
      setLoading(false);
    }
  }, [open, sale?.id]);

  const items = useMemo(() => {
    return details?.items || details?.lines || details?.details || [];
  }, [details]);

  const handlePrint = () => {
    if (!printRef.current) return;

    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) return;

    const html = printRef.current.innerHTML;
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${sale?.invoiceNo || ''}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 24px;
              direction: ${direction};
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 16px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: right;
            }
            th {
              background: #8b0000;
              color: white;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 8px;
              margin-top: 12px;
            }
            .summary-card {
              border: 1px solid #ddd;
              padding: 10px;
              border-radius: 8px;
            }
          </style>
        </head>
        <body>
          ${html}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); }
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;

    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`invoice-${sale?.invoiceNo || 'details'}.pdf`);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Invoice ${sale?.invoiceNo || ''}`);
    const body = encodeURIComponent(
      `Invoice details\n\nInvoice No: ${sale?.invoiceNo || ''}\nCustomer: ${sale?.customer || ''}\nGrand Total: ${sale?.grandTotal?.toFixed?.(2) || '0.00'}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  };

  if (!open || !sale) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl w-full max-w-5xl shadow-2xl relative overflow-hidden my-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-primary text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FileText size={20} />
              <h2 className="text-lg font-bold">
                {t('invoice_details')} {sale.invoiceNo}
              </h2>
            </div>
            <button onClick={onClose} className="hover:bg-white/10 p-1 rounded">
              <X size={24} />
            </button>
          </div>

          <div ref={printRef} className="p-8 space-y-8 bg-white" dir={direction}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2 text-right">
                <h3 className="font-bold text-primary">{t('customer_default')}</h3>
                <p className="text-sm text-gray-600">{t('phone')}: 00</p>
                <p className="text-sm text-gray-600">{t('email')}: info@posit.sa</p>
              </div>

              <div className="flex justify-center">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <LayoutGrid size={48} className="text-gray-300" />
                </div>
              </div>

              <div className="space-y-2 text-right">
                <h3 className="font-bold text-primary">{t('test_company')}</h3>
                <p className="text-sm text-gray-600">{t('cr_no')}: 1234123123</p>
                <p className="text-sm text-gray-600">{t('vat_no')}: 50608090</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-right space-y-1">
                <p className="text-sm font-bold text-primary">{t('ref_no')}: {sale.refNo}</p>
                <p className="text-xs text-gray-500">{t('date')}: {sale.date}</p>
                {details?.orderStatus && (
                  <p className="text-xs text-gray-500">
                    Status: <span className="font-bold">{details.orderStatus}</span>
                  </p>
                )}
              </div>

              <div className="text-right space-y-1">
                <p className="text-sm font-bold">
                  {t('sale_status')}: <span className="text-primary">{t(sale.saleStatus)}</span>
                </p>
                <p className="text-sm font-bold">
                  {t('payment_status')}: <span className="text-green-600">{t(sale.paymentStatus)}</span>
                </p>
              </div>
            </div>

            {loading && (
              <p className="text-sm text-gray-500 text-right">
                {direction === 'rtl' ? 'جاري تحميل تفاصيل الفاتورة...' : 'Loading invoice details...'}
              </p>
            )}

            {error && (
              <p className="text-sm text-red-600 text-right">
                {direction === 'rtl' ? 'خطأ: ' : 'Error: '}
                {error}
              </p>
            )}

            {!!details && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white border border-gray-200 rounded p-3">
                  <div className="text-[11px] text-gray-500">{direction === 'rtl' ? 'الإجمالي قبل الضريبة' : 'SubTotal'}</div>
                  <div className="font-bold">{safeNumber(details.subTotal).toFixed(2)}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-3">
                  <div className="text-[11px] text-gray-500">{direction === 'rtl' ? 'الضريبة' : 'Tax'}</div>
                  <div className="font-bold">{safeNumber(details.taxAmount).toFixed(2)}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-3">
                  <div className="text-[11px] text-gray-500">{direction === 'rtl' ? 'الخصم' : 'Discount'}</div>
                  <div className="font-bold">{safeNumber(details.discountAmount).toFixed(2)}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-3">
                  <div className="text-[11px] text-gray-500">{direction === 'rtl' ? 'الإجمالي النهائي' : 'Grand Total'}</div>
                  <div className="font-bold">{safeNumber(details.grandTotal).toFixed(2)}</div>
                </div>
              </div>
            )}

            <table className="w-full text-sm text-right border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-3 border border-primary-hover">{t('item_no')}</th>
                  <th className="p-3 border border-primary-hover">{t('description')}</th>
                  <th className="p-3 border border-primary-hover">{t('quantity')}</th>
                  <th className="p-3 border border-primary-hover">{t('unit_price')}</th>
                  <th className="p-3 border border-primary-hover">{t('total_without_vat')}</th>
                  <th className="p-3 border border-primary-hover">{t('vat')}</th>
                  <th className="p-3 border border-primary-hover">{t('total_price')}</th>
                </tr>
              </thead>

              <tbody>
                {items.length === 0 ? (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 border-x border-gray-200">1</td>
                    <td className="p-3 border-x border-gray-200">--</td>
                    <td className="p-3 border-x border-gray-200">--</td>
                    <td className="p-3 border-x border-gray-200">--</td>
                    <td className="p-3 border-x border-gray-200">--</td>
                    <td className="p-3 border-x border-gray-200">--</td>
                    <td className="p-3 border-x border-gray-200 font-bold">--</td>
                  </tr>
                ) : (
                  items.map((it: any, idx: number) => {
                    const name = it.itemName || it.productName || it.description || '--';
                    const qty = safeNumber(it.quantity ?? it.qty);
                    const unit = safeNumber(it.unitPrice ?? it.price);
                    const vat = safeNumber(it.vat ?? it.tax);
                    const total = safeNumber(it.total ?? it.totalPrice);

                    return (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="p-3 border-x border-gray-200">{idx + 1}</td>
                        <td className="p-3 border-x border-gray-200">{name}</td>
                        <td className="p-3 border-x border-gray-200">{qty ? qty.toFixed(2) : '--'}</td>
                        <td className="p-3 border-x border-gray-200">{unit ? unit.toFixed(2) : '--'}</td>
                        <td className="p-3 border-x border-gray-200">{qty && unit ? (qty * unit).toFixed(2) : '--'}</td>
                        <td className="p-3 border-x border-gray-200">{vat ? vat.toFixed(2) : '--'}</td>
                        <td className="p-3 border-x border-gray-200 font-bold">{total ? total.toFixed(2) : '--'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            <div className="flex flex-wrap gap-2 justify-center pt-4 border-t border-gray-100">
              <button
                onClick={handlePrint}
                className="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-primary-hover transition-colors"
              >
                <Printer size={18} /> {t('print')}
              </button>

              <button
                onClick={handleDownloadPdf}
                className="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-primary-hover transition-colors"
              >
                <Download size={18} /> {t('download_pdf')}
              </button>

              <button
                onClick={handleSendEmail}
                className="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-primary-hover transition-colors"
              >
                <Mail size={18} /> {t('send_email')}
              </button>

              <button
                onClick={() => onAddPayment?.(sale)}
                className="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2 hover:bg-primary-hover transition-colors"
              >
                <DollarSign size={18} /> {t('add_payment')}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}