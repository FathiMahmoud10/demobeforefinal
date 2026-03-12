import React, { useState, useRef } from 'react';
import { Upload, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useLogo } from '@/context/LogoContext';
import { cn } from '@/lib/utils';
import ResponsiveModal from './ResponsiveModal';

interface LogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LogoModal({ isOpen, onClose }: LogoModalProps) {
  const { t, direction } = useLanguage();
  const { updateLogo } = useLogo();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    if (previewUrl) {
      updateLogo(previewUrl);
      onClose();
    }
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('change_logo')}
      maxWidth="max-w-2xl"
    >
      <div className="p-6 space-y-6" dir={direction}>
        <p className="text-center text-gray-500 text-sm">
          برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
          <br />
          ماكس. حجم الملف 1024KB و(العرض = 400px) س (الارتفاع = 300px).
        </p>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#2ecc71] text-right">
            شعار الكاشير *
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded-lg transition-colors font-bold shrink-0"
            >
              <Upload size={18} />
              <span>استعراض ...</span>
            </button>
            <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 truncate text-right">
              {selectedFile ? selectedFile.name : ''}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right">
            يرجى تعديل الفواتير بعد تحميل الشعار الجديد وتحديد شعار المحدثة حديثا.
          </p>
        </div>

        {previewUrl && (
          <div className="flex justify-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
            <img src={previewUrl} alt="Preview" className="max-h-40 object-contain" />
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button
            onClick={handleUpdate}
            disabled={!previewUrl}
            className={cn(
              "flex items-center gap-2 px-10 py-2.5 rounded-lg transition-all font-bold shadow-md",
              previewUrl 
                ? "bg-[#00a65a] hover:bg-[#008d4c] text-white" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            <Check size={20} />
            <span>تحديث الشعار</span>
          </button>
        </div>
      </div>
    </ResponsiveModal>
  );
}
