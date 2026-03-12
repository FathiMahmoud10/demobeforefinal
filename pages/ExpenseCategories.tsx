import React, { useState } from 'react';
import { 
  Folder, 
  Search, 
  Edit, 
  Trash2, 
  Plus, 
  FileUp, 
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useExpenseCategories } from '@/context/ExpenseCategoriesContext';
import AddExpenseCategoryModal from '@/components/modals/AddExpenseCategoryModal';
import ImportExpenseCategoryModal from '@/components/modals/ImportExpenseCategoryModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { ExpenseCategory } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import MobileDataCard from '@/components/MobileDataCard';

export default function ExpenseCategories() {
  const { t, direction, language } = useLanguage();
  const { categories, deleteCategory } = useExpenseCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleEdit = (category: ExpenseCategory) => {
    setSelectedCategory(category);
    setIsAddModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsAddModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleImport = () => {
    setIsImportModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  const filteredCategories = categories.filter(category => 
    category.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
            <Folder size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-main)]">
              {direction === 'rtl' ? 'تصنيفات المصروفات' : 'Expense Categories'}
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              {direction === 'rtl' ? 'الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.' : 'Please use the table below to navigate or filter results.'}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-main)] rounded-lg transition-colors border border-[var(--border)]"
          >
            <Menu size={24} />
          </button>
          
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={cn(
                    "absolute top-full mt-2 w-56 bg-[var(--bg-card)] rounded-lg shadow-xl border border-[var(--border)] py-2 z-20",
                    direction === 'rtl' ? "left-0" : "right-0"
                  )}
                >
                  <button 
                    onClick={handleAdd}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] transition-colors text-right"
                  >
                    <Plus size={18} className="text-emerald-600" />
                    <span className="font-bold">{t('add_expense_category')}</span>
                  </button>
                  <button 
                    onClick={handleImport}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] transition-colors text-right"
                  >
                    <FileUp size={18} className="text-emerald-600" />
                    <span className="font-bold">{t('import_expense_categories')}</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-muted)]">{t('show')}</span>
            <select 
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="bg-[var(--bg-main)] border border-[var(--border)] rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-[var(--text-muted)]">{t('records')}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder={t('search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-[var(--bg-main)] border border-[var(--border)] rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
            <span className="text-sm text-[var(--text-muted)] whitespace-nowrap">{direction === 'rtl' ? 'بحث' : 'Search'}</span>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#004d3d] text-white">
                <th className="p-4 text-sm font-bold border-b border-white/10 w-12">
                  <input type="checkbox" className="rounded border-white/20 text-emerald-600 focus:ring-emerald-500" />
                </th>
                <th className="p-4 text-sm font-bold border-b border-white/10">{t('category_code')}</th>
                <th className="p-4 text-sm font-bold border-b border-white/10">{t('category_name')}</th>
                <th className="p-4 text-sm font-bold border-b border-white/10 w-32">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={`desktop-${category.id}`} className="hover:bg-[var(--bg-main)] transition-colors group">
                    <td className="p-4 text-sm">
                      <input type="checkbox" className="rounded border-[var(--border)] text-emerald-600 focus:ring-emerald-500" />
                    </td>
                    <td className="p-4 text-sm font-medium">{category.code}</td>
                    <td className="p-4 text-sm">{category.name}</td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(category)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                          title={t('edit')}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(category.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title={t('delete')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[var(--text-muted)]">
                    <div className="flex flex-col items-center gap-2">
                      <Folder size={48} className="opacity-20" />
                      <p>{t('no_data_in_table')}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-4 space-y-4">
          {filteredCategories.map((category) => (
            <MobileDataCard
              key={`mobile-${category.id}`}
              title={category.name}
              subtitle={category.code}
              fields={[]}
              actions={
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => handleEdit(category)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-100 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              }
            />
          ))}
          {filteredCategories.length === 0 && (
            <div className="p-8 text-center text-[var(--text-muted)] bg-[var(--bg-main)] rounded-xl border border-dashed border-[var(--border)]">
              {t('no_data_in_table')}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-muted)]">
            {direction === 'rtl' ? `عرض 1 إلى ${filteredCategories.length} من ${filteredCategories.length} سجلات` : `Showing 1 to ${filteredCategories.length} of ${filteredCategories.length} records`}
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-main)] disabled:opacity-50 transition-colors">
              {direction === 'rtl' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-[#2ecc71] text-white rounded-lg text-sm font-bold">
              1
            </button>
            <button className="p-2 border border-[var(--border)] rounded-lg hover:bg-[var(--bg-main)] disabled:opacity-50 transition-colors">
              {direction === 'rtl' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddExpenseCategoryModal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedCategory(null);
        }} 
        category={selectedCategory}
      />

      <ImportExpenseCategoryModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <DeleteConfirmationModal
        isOpen={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
        itemName={categories.find(c => c.id === categoryToDelete)?.name}
      />
    </div>
  );
}
