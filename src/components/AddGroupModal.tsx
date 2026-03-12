import React, { useState, useRef } from 'react';
import { PlusCircle, Upload, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useGroups } from '@/context/GroupsContext';
import { motion } from 'framer-motion';
import Toast from './Toast';

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ isOpen, onClose }) => {
  const { t, direction } = useLanguage();
  const { addGroup } = useGroups();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [groupName, setGroupName] = useState('');
  const [groupNameSecondary, setGroupNameSecondary] = useState('');
  const [groupNameUr, setGroupNameUr] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showToast, setShowToast] = useState(false);

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setToastMessage(direction === 'rtl' ? 'يرجى إدخال اسم التصنيف' : 'Please enter category name');
      setToastType('error');
      setShowToast(true);
      return;
    }

    try {
      await addGroup(groupName, groupNameSecondary || undefined, description || undefined, groupNameUr || undefined, imageFile || undefined);
      setToastMessage(direction === 'rtl' ? 'تم إضافة التصنيف بنجاح' : 'Category added successfully');
      setToastType('success');
      setShowToast(true);

      // Close modal after success
      setTimeout(() => {
        onClose();
        setGroupName('');
        setGroupNameSecondary('');
        setGroupNameUr('');
        setDescription('');
        setFileName('');
        setImageFile(null);
      }, 1000);
    } catch (err) {
      console.error('addGroup error:', err);
      const msg = err instanceof Error ? err.message : 'فشل إضافة التصنيف';
      setToastMessage(
        direction === 'rtl'
          ? `فشل إضافة التصنيف: ${msg}`
          : `Failed to add category: ${msg}`
      );
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setImageFile(file);
    }
  };
  // Render Toast outside of the modal DOM so it remains visible even after
  // the modal closes (the modal unmount previously hid the toast immediately).
  const toastElement = (
    <Toast
      isOpen={showToast}
      message={toastMessage}
      type={toastType}
      onClose={() => setShowToast(false)}
    />
  );

  if (!isOpen) return <>{toastElement}</>;

  return (
    <>
      {toastElement}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
          dir={direction}
        >
          <div className="p-4 flex justify-between items-center border-b border-gray-100">
            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <PlusCircle size={20} className="text-primary" />
              {t('add_new_group')}
            </h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-6">
            <form onSubmit={handleAddGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('group_name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full border border-primary rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('group_name_secondary_lang')}
                </label>
                <input
                  type="text"
                  value={groupNameSecondary}
                  onChange={(e) => setGroupNameSecondary(e.target.value)}
                  className="w-full border border-primary rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                  placeholder="English name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('product_name_third_lang')}
                </label>
                <input
                  type="text"
                  value={groupNameUr}
                  onChange={(e) => setGroupNameUr(e.target.value)}
                  className="w-full border border-primary rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Urdu name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('description')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-primary rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('group_image')}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary-hover transition-colors flex items-center gap-2"
                  >
                    <Upload size={16} />
                    {t('browse')}
                  </button>
                  <input
                    type="text"
                    value={fileName}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none bg-gray-50"
                    readOnly
                    placeholder={direction === 'rtl' ? 'لم يتم اختيار ملف' : 'No file selected'}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-primary text-white px-8 py-2 rounded-md font-medium hover:bg-primary-hover transition-colors shadow-sm"
                >
                  {t('add_new_group')}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AddGroupModal;
