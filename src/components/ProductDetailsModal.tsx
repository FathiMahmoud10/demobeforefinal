import React from 'react';
import { Printer, Trash2, Edit, FileText, Barcode } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import ResponsiveModal from './ResponsiveModal';

interface Product {
  id: number;
  image: string;
  code: string;
  name: string;
  brand: string;
  agent: string;
  category: string;
  cost: string;
  price: string;
  quantity: string;
  unit: string;
  alertQuantity: string;
}

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onPrintPDF: () => void;
  onPrintBarcode: () => void;
}

const DetailRow: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
    <span className="text-xs text-gray-500 dark:text-black/60">{label}</span>
    <span className="text-xs font-medium text-gray-800 dark:text-black text-right">{value}</span>
  </div>
);

export default function ProductDetailsModal({ product, isOpen, onClose, onDelete, onEdit, onPrintPDF, onPrintBarcode }: ProductDetailsModalProps) {
  const { t, direction } = useLanguage();

  if (!product) return null;

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('product_details')}
      maxWidth="max-w-3xl"
    >
      <div className="flex flex-col h-full text-black" dir={direction}>
        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <div className="flex justify-end mb-2">
            <button className="flex items-center gap-2 px-2 py-1 border border-gray-300 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors text-black">
              <Printer size={14} />
              {t('print')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex flex-col items-center sm:items-start shrink-0">
                  <img src={`https://api.bwipjs.com?bcid=qrcode&text=${product.code}&scale=2`} alt="QR Code" className="w-20 h-20" />
                  <img src={`https://api.bwipjs.com?bcid=code128&text=${product.code}&scale=1&height=8`} alt="Barcode" className="w-20 mt-1" />
                </div>
                <div className="flex-1 w-full">
                  <DetailRow label={t('response_code')} value={t('quick_barcode')} />
                  <DetailRow label={t('type')} value={'عام'} />
                  <DetailRow label={t('product_name')} value={product.name} />
                  <DetailRow label={t('product_code')} value={product.code} />
                  <DetailRow label={t('brand')} value={product.brand || 'N/A'} />
                  <DetailRow label={t('main_categories')} value={product.category} />
                  <DetailRow label={t('unit')} value={`${product.unit} (003)`} />
                  <DetailRow label={t('cost')} value={product.cost} />
                  <DetailRow label={t('selling_price')} value={product.price} />
                  <DetailRow label={t('tax_rate')} value={t('without')} />
                  <DetailRow label={t('tax_method')} value={t('inclusive')} />
                  <DetailRow label={t('stock_alerts')} value={product.alertQuantity} />
                </div>
              </div>
              
              <div>
                <h3 className="font-bold text-primary mb-2 text-sm">{t('stock_quantity_in_branch')}</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-primary text-white">
                        <th className="p-2 border-l border-white/20 font-medium text-right">{t('branch_name')}</th>
                        <th className="p-2 font-medium text-center">{t('quantity')}</th>
                      </tr>
                    </thead>
                    <tbody className="text-black">
                      <tr className='text-center'>
                        <td className="p-2 border-l border-gray-200 text-right">شركة دقة الحلول (WHI)</td>
                        <td className="p-2">-8.00 ( 8.0000 وحدة )</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="md:col-span-1 flex flex-col items-center gap-2">
              <div className="w-full max-w-[200px] aspect-square p-1 border border-gray-200 rounded-lg overflow-hidden">
                <img src={product.image || 'https://picsum.photos/seed/product/400/400'} alt={product.name} className="w-full h-full object-cover rounded" />
              </div>
              <p className="text-[10px] text-gray-400 italic">صورة الصنف</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-200 border-t border-gray-200 flex flex-wrap items-center justify-center gap-2 shrink-0">
          <button onClick={() => onDelete(product.id)} className="flex-1 min-w-[80px] bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 text-xs font-bold">
            <Trash2 size={14} />
            {t('delete')}
          </button>
          <button onClick={() => onEdit(product.id)} className="flex-1 min-w-[80px] bg-yellow-500 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-1.5 text-xs font-bold">
            <Edit size={14} />
            {t('edit')}
          </button>
          <button onClick={onPrintPDF} className="flex-1 min-w-[80px] bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center gap-1.5 text-xs font-bold">
            <FileText size={14} />
            PDF
          </button>
          <button onClick={onPrintBarcode} className="flex-1 min-w-[80px] bg-gray-800 text-white px-3 py-1.5 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-1.5 text-xs font-bold">
            <Barcode size={14} />
            {t('print_barcode_stickers')}
          </button>
        </div>
      </div>
    </ResponsiveModal>
  );
}
