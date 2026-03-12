import React, { useState } from 'react';
import { PlusCircle, Search, ChevronDown, Trash2, Edit, Printer, Image as ImageIcon } from 'lucide-react';
import Pagination from '@/components/Pagination';
import AddCategoryModal from '@/components/AddCategoryModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { useLanguage } from '@/context/LanguageContext';
import { useCategories, Category } from '@/context/CategoriesContext';
import { motion, AnimatePresence } from 'framer-motion';
import MobileDataCard from '@/components/MobileDataCard';

const Categories = () => {
  const { t, direction, language } = useLanguage();
  const { categories, deleteCategory } = useCategories();

  const [showAddModal, setShowAddModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteCategory = (id: number) => {
    setCategoryToDelete(id);
  };

  const confirmDelete = () => {
    if (categoryToDelete !== null) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-4" dir={direction}>
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span>{direction === 'rtl' ? 'الرئيسية' : 'Home'}</span>
        <span>/</span>
        <span>{direction === 'rtl' ? 'الإعدادات' : 'Settings'}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{direction === 'rtl' ? 'التصنيفات الأساسية' : 'Basic Categories'}</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              {direction === 'rtl' ? 'التصنيفات الأساسية' : 'Basic Categories'}
          </h1>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2 text-sm font-medium"
          >
              <PlusCircle size={18} />
              {direction === 'rtl' ? 'اضافة فئة' : 'Add Category'}
          </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 min-h-[400px]">
        <div className="text-gray-600 text-sm mb-4 text-center">
            {direction === 'rtl' ? 'الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.' : 'Please use the table below to navigate or filter results.'}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{direction === 'rtl' ? 'اظهار' : 'Show'}</span>
                <select 
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded px-2 py-1 outline-none focus:border-primary text-black"
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>
            
            <div className="relative w-full sm:w-64">
                <input 
                    type="text" 
                    placeholder={direction === 'rtl' ? 'بحث' : 'Search'}
                    className={`w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary text-black ${direction === 'rtl' ? 'pr-8' : 'pl-8'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${direction === 'rtl' ? 'right-2' : 'left-2'}`} size={16} />
            </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-500 border-collapse">
            <thead className="text-xs text-white uppercase bg-primary">
              <tr>
                <th className="px-4 py-3 border border-primary-hover text-center w-10">
                   <input type="checkbox" className="w-4 h-4" />
                </th>
                <th className="px-4 py-3 border border-primary-hover text-center">{direction === 'rtl' ? 'صورة' : 'Image'}</th>
                <th className="px-4 py-3 border border-primary-hover">{direction === 'rtl' ? 'كود فئة' : 'Category Code'}</th>
                <th className="px-4 py-3 border border-primary-hover">{direction === 'rtl' ? 'اسم التصنيف' : 'Category Name'}</th>
                <th className="px-4 py-3 border border-primary-hover">Slug</th>
                <th className="px-4 py-3 border border-primary-hover">{direction === 'rtl' ? 'التصنيف الرئيسي' : 'Main Category'}</th>
                <th className="px-4 py-3 border border-primary-hover text-center">{direction === 'rtl' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="bg-green-50/20">
              {paginatedCategories.length > 0 ? (
                paginatedCategories.map((category) => (
                  <tr key={category.id} className="bg-green-50/30 border-b hover:bg-green-100/50 transition-colors">
                    <td className="px-4 py-4 border border-gray-100 text-center">
                       <input type="checkbox" className="w-4 h-4" />
                    </td>
                    <td className="px-4 py-4 border border-gray-100 text-center">
                       {category.image ? (
                         <img src={category.image} alt={category.name} className="w-8 h-8 object-cover mx-auto rounded" referrerPolicy="no-referrer" />
                       ) : (
                         <ImageIcon size={20} className="mx-auto text-gray-300" />
                       )}
                    </td>
                    <td className="px-4 py-4 border border-gray-100">{category.code}</td>
                    <td className="px-4 py-4 border border-gray-100">{category.name}</td>
                    <td className="px-4 py-4 border border-gray-100">{category.slug}</td>
                    <td className="px-4 py-4 border border-gray-100">{category.mainCategory || '-'}</td>
                    <td className="px-4 py-4 border border-gray-100 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleDeleteCategory(category.id)} className="text-red-500 hover:text-red-700 transition-colors">
                          <Trash2 size={16} />
                        </button>
                        <button className="text-blue-500 hover:text-blue-700 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 transition-colors">
                          <Printer size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                    {direction === 'rtl' ? 'لا توجد نتائج مطابقة' : 'No matching results found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {paginatedCategories.map((category) => (
            <MobileDataCard
              key={category.id}
              title={category.name}
              subtitle={category.code}
              fields={[
                { label: 'Slug', value: category.slug },
                { label: direction === 'rtl' ? 'التصنيف الرئيسي' : 'Main Category', value: category.mainCategory || '-' },
              ]}
              actions={
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors">
                    <Edit size={18} />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors">
                    <Printer size={18} />
                  </button>
                </div>
              }
            />
          ))}
          {paginatedCategories.length === 0 && (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              {direction === 'rtl' ? 'لا توجد نتائج مطابقة' : 'No matching results found'}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
                {direction === 'rtl' 
                  ? `عرض ${paginatedCategories.length} إلى ${filteredCategories.length} من ${filteredCategories.length} سجلات`
                  : `Showing ${paginatedCategories.length} to ${filteredCategories.length} of ${filteredCategories.length} records`
                }
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={filteredCategories.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
        </div>
      </div>

      <AddCategoryModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

      <DeleteConfirmationModal
        isOpen={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
        itemName={categories.find(c => c.id === categoryToDelete)?.name}
      />
    </div>
  );
};

export default Categories;
