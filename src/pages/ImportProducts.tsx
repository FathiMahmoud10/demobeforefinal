import { useState, useRef } from 'react';
import { FileText, FileDown, Upload, FileSpreadsheet } from 'lucide-react';
import Layout from '@/components/Layout';
import { useLanguage } from '@/context/LanguageContext';

export default function ImportProducts() {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('products')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('import_products_csv')}</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-primary" />
              {t('import_products_csv')}
          </h1>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
          
          {/* Instructions Box */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                  <button onClick={handleFileSelect} className="bg-[#054C28] text-white px-4 py-2 rounded-md text-sm hover:bg-[#043b1f] transition-colors flex items-center gap-2 whitespace-nowrap">
                      <FileDown size={16} />
                      {t('download_sample_file')}
                  </button>
                  
                  <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
                      <p>
                          {t('csv_instruction_1')}
                      </p>
                      <p>
                          {t('csv_instruction_2')}
                      </p>
                      <p>
                          {t('csv_instruction_3')}
                      </p>
                      <p>
                          {t('csv_instruction_4')}
                      </p>
                  </div>
              </div>
          </div>

          {/* Upload Form */}
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('upload_file')} *</label>
                  <div className="flex gap-2">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                      />
                      <button onClick={handleFileSelect} className="bg-[#054C28] text-white px-6 py-2 rounded-md text-sm hover:bg-[#043b1f] transition-colors flex items-center gap-2">
                          <Upload size={16} />
                          {t('browse')}
                      </button>
                      <input type="text" value={fileName} className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none bg-white" readOnly />
                  </div>
              </div>

              <div className="flex justify-end pt-4">
                  <button className="bg-[#054C28] text-white px-8 py-2 rounded-md font-medium hover:bg-[#043b1f] transition-colors shadow-sm">
                      {t('import')}
                  </button>
              </div>
          </div>

      </div>
    </div>
  );
}
