import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCategories } from '@/context/CategoriesContext';
import ResponsiveModal from './ResponsiveModal';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose }) => {
  const { direction } = useLanguage();
  const { addCategory } = useCategories();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    slug: '',
    description: '',
    mainCategory: '',
    showInPOS: true,
    branchAvailability: [
      { branchName: 'تجريبي', status: true }
    ]
  });

  const [imageName, setImageName] = useState('');
  const [bannerName, setBannerName] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCategory({
      ...formData,
      image: imageName,
    });
    alert(direction === 'rtl' ? 'تمت إضافة الفئة بنجاح' : 'Category added successfully');
    onClose();
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title={direction === 'rtl' ? 'إضافة فئة' : 'Add Category'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-6" dir={direction}>
        <div className="text-gray-600 text-sm mb-4">
          {direction === 'rtl' ? 'برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .' : 'Please enter the information below. Field labels marked with * are mandatory.'}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {direction === 'rtl' ? 'كود فئة *' : 'Category Code *'}
            </label>
            <input 
              type="text" 
              required
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {direction === 'rtl' ? 'اسم التصنيف *' : 'Category Name *'}
            </label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug *
            </label>
            <input 
              type="text" 
              required
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {direction === 'rtl' ? 'وصف *' : 'Description *'}
            </label>
            <textarea 
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary min-h-[80px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {direction === 'rtl' ? 'الفئة صورة' : 'Category Image'}
            </label>
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-primary-hover transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Upload size={16} />
                {direction === 'rtl' ? 'استعراض ...' : 'Browse ...'}
              </button>
              <input 
                type="text" 
                readOnly 
                value={imageName}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none bg-gray-50"
              />
              <input 
                type="file" 
                ref={imageInputRef} 
                className="hidden" 
                onChange={(e) => setImageName(e.target.files?.[0]?.name || '')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Banner
            </label>
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-primary-hover transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                <Upload size={16} />
                {direction === 'rtl' ? 'استعراض ...' : 'Browse ...'}
              </button>
              <input 
                type="text" 
                readOnly 
                value={bannerName}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none bg-gray-50"
              />
              <input 
                type="file" 
                ref={bannerInputRef} 
                className="hidden" 
                onChange={(e) => setBannerName(e.target.files?.[0]?.name || '')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {direction === 'rtl' ? 'التصنيف الرئيسي' : 'Main Category'}
            </label>
            <select 
              value={formData.mainCategory}
              onChange={(e) => setFormData({...formData, mainCategory: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">{direction === 'rtl' ? 'اختر التصنيف الرئيسي' : 'Select Main Category'}</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="showInPOS"
              checked={formData.showInPOS}
              onChange={(e) => setFormData({...formData, showInPOS: e.target.checked})}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="showInPOS" className="text-sm font-medium text-gray-700">
              {direction === 'rtl' ? 'يظهر في نقاط البيع' : 'Show in POS'}
            </label>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-2 border-b border-gray-200 text-center font-bold text-sm">
              {direction === 'rtl' ? 'إتاحة التصنيف في الفروع' : 'Category Availability in Branches'}
            </div>
            <table className="w-full text-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-2 border-l border-white/20">{direction === 'rtl' ? 'اسم الفرع' : 'Branch Name'}</th>
                  <th className="p-2">{direction === 'rtl' ? 'الحالة' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {formData.branchAvailability.map((branch, idx) => (
                  <tr key={idx} className="border-t border-gray-200">
                    <td className="p-2 border-l border-gray-200 text-center">{branch.branchName}</td>
                    <td className="p-2">
                      <select 
                        value={branch.status ? 'yes' : 'no'}
                        onChange={(e) => {
                          const newBranches = [...formData.branchAvailability];
                          newBranches[idx].status = e.target.value === 'yes';
                          setFormData({...formData, branchAvailability: newBranches});
                        }}
                        className="w-full border border-gray-300 rounded px-2 py-1 outline-none"
                      >
                        <option value="yes">{direction === 'rtl' ? 'نعم' : 'Yes'}</option>
                        <option value="no">{direction === 'rtl' ? 'لا' : 'No'}</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md font-bold hover:bg-primary-hover transition-colors"
            >
              {direction === 'rtl' ? 'إضافة فئة' : 'Add Category'}
            </button>
          </div>
        </div>
      </form>
    </ResponsiveModal>
  );
};

export default AddCategoryModal;
