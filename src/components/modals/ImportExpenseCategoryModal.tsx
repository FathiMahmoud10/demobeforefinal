import React, { useState } from 'react';
import { Upload, Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import ResponsiveModal from '@/components/ResponsiveModal';

interface ImportExpenseCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportExpenseCategoryModal({ isOpen, onClose }: ImportExpenseCategoryModalProps) {
  const { t, direction } = useLanguage();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle import logic here
    console.log('Importing file:', file);
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('import_expense_categories')}
      maxWidth="max-w-2xl"
    >
      <div className="p-6" dir={direction}>
        <div className="flex justify-end mb-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#004d3d] text-white rounded-lg text-sm font-bold hover:bg-[#003d30] transition-colors">
            <Download size={16} />
            <span>{direction === 'rtl' ? 'تحميل عينة الملف' : 'Download Sample File'}</span>
          </button>
        </div>

        <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg mb-6">
          <p className="text-sm text-orange-800 leading-relaxed">
            {direction === 'rtl' 
              ? 'ينبغي أن يظل السطر الأول في ملف CSV الذي يتم تحميله كما هو. يرجى عدم تغيير ترتيب الأعمدة. ترتيب الأعمدة الصحيح (الكود, اسم) . يجب اتباع هذا. إذا كنت تستخدم أي لغة أخرى غير الإنجليزية، يرجى التأكد من ملف CSV هو UTF-8 ترميز وليس حفظها مع علامة ترتيب بايت (BOM)'
              : 'The first line in the CSV file being uploaded should remain as is. Please do not change the order of columns. Correct column order (Code, Name). This must be followed. If you are using any language other than English, please make sure the CSV file is UTF-8 encoded and not saved with a Byte Order Mark (BOM)'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">
              {t('attachments')} *
            </label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-4 py-2 bg-[#004d3d] text-white rounded-lg cursor-pointer hover:bg-[#003d30] transition-colors font-bold text-sm">
                <Upload size={16} />
                <span>{t('browse')} ...</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept=".csv" />
              </label>
              <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 truncate">
                {file ? file.name : t('no_file_chosen')}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!file}
            className="px-6 py-2 bg-[#004d3d] hover:bg-[#003d30] text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {direction === 'rtl' ? 'استيراد' : 'Import'}
          </button>
        </form>
      </div>
    </ResponsiveModal>
  );
}
