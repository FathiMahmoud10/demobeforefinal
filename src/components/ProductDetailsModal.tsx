import React from 'react';
import { X, Printer, Trash2, Edit, FileText, Barcode } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

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
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <span className="text-sm text-gray-500 dark:text-black/60">{label}</span>
    <span className="text-sm font-medium text-gray-800 dark:text-black">{value}</span>
  </div>
);

export default function ProductDetailsModal({ product, isOpen, onClose, onDelete, onEdit, onPrintPDF, onPrintBarcode }: ProductDetailsModalProps) {
  const { t, direction } = useLanguage();

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden relative dark:bg-gray-100"
        onClick={(e) => e.stopPropagation()}
        dir={direction}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 dark:bg-gray-200">
            <div className='flex items-center gap-2'>
                <h2 className="text-lg font-bold text-primary">
                    {t('product_details')}
                </h2>
                <span className='font-bold text-primary'>مؤسسة تكامل</span>
            </div>
            <div className='flex items-center gap-2'>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors text-black">
                    <Printer size={16} />
                    {t('print')}
                </button>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200">
                    <X size={24} />
                </button>
            </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-black">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-start gap-4">
                <div>
                    <img src={`https://api.bwipjs.com?bcid=qrcode&text=${product.code}&scale=3`} alt="QR Code" className="w-24 h-24" />
                    <img src={`https://api.bwipjs.com?bcid=code128&text=${product.code}&scale=1&height=10`} alt="Barcode" className="w-24 mt-1" />
                </div>
                <div className="flex-1">
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
                <h3 className="font-bold text-primary mb-2">{t('stock_quantity_in_branch')}</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-primary text-white">
                                <th className="p-2 border border-primary-hover font-medium">{t('branch_name')}</th>
                                <th className="p-2 border border-primary-hover font-medium">{t('quantity')}</th>
                            </tr>
                        </thead>
                        <tbody className="text-black">
                            <tr className='text-center'>
                                <td className="p-2 border border-gray-200">شركة دقة الحلول (WHI)</td>
                                <td className="p-2 border border-gray-200">-8.00 ( 8.0000 وحدة )</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-1 flex items-center justify-center">
            <div className="w-full max-w-[250px] h-auto p-2 border border-gray-200 rounded-lg">
                <img src={product.image || 'https://picsum.photos/seed/product/400/400'} alt={product.name} className="w-full h-full object-cover rounded" />
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-200 border-t border-gray-200 flex flex-wrap items-center justify-center gap-2">
            <button onClick={() => onDelete(product.id)} className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                <Trash2 size={16} />
                {t('delete')}
            </button>
            <button onClick={() => onEdit(product.id)} className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                <Edit size={16} />
                {t('edit')}
            </button>
            <button onClick={onPrintPDF} className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                <FileText size={16} />
                PDF
            </button>
            <button onClick={onPrintBarcode} className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                <Barcode size={16} />
                {t('print_barcode_stickers')}
            </button>
        </div>
      </motion.div>
    </div>
  );
}
