import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Edit, Trash2, PlusCircle, Save, X, Loader2 } from 'lucide-react';
import AddUnitModal from '@/components/AddUnitModal';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

// تعريف نوع البيانات للوحدة
interface Unit {
  id: number;
  code: string;
  name: string;
  description?: string;
}

const Units = () => {
  const { t, direction } = useLanguage();

  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number, left: number } | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  const [units, setUnits] = useState<Unit[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // حالات التعديل
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // تحميل الوحدات من API
  const loadUnits = async () => {
    try {
      const res = await fetch("http://takamulerp.runasp.net/UnitOfMeasure");
      const data = await res.json();

      const formattedUnits = data.items.map((item: any, index: number) => ({
        id: item.id,
        code: `${index + 1}`,
        name: item.name,
        description: item.description || ''
      }));

      setUnits(formattedUnits);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadUnits();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionId(null);
        setMenuPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleActionMenu = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (openActionId === id) {
      setOpenActionId(null);
      setMenuPosition(null);
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setOpenActionId(id);

      const menuWidth = 160;
      const left = direction === 'rtl'
        ? rect.right - menuWidth
        : rect.left;

      setMenuPosition({
        top: rect.bottom + 5,
        left: Math.max(10, left)
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm(t('confirm_delete_unit') || 'Are you sure you want to delete this unit?')) {
      setUnits(units.filter(u => u.id !== id));
      setOpenActionId(null);
      // ملاحظة: يفضل هنا استدعاء API الحذف الفعلي
    }
  };

  // فتح نافذة التعديل
  const handleEditClick = (unit: Unit) => {
    setEditingUnit(unit);
    setIsEditModalOpen(true);
    setOpenActionId(null); // إغلاق القائمة العائمة
    setEditError(null);
  };

  // حفظ التعديلات
  const handleSaveEdit = async () => {
    if (!editingUnit) return;

    if (!editingUnit.name.trim()) {
      setEditError(t('unit_name_required') || 'Unit Name is required');
      return;
    }

    setIsSaving(true);
    setEditError(null);

    try {
      const response = await fetch(
        `http://takamulerp.runasp.net/UnitOfMeasure?id=${editingUnit.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: editingUnit.name,
            description: editingUnit.description || ''
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update unit');
      }

      // تحديث القائمة محلياً
      setUnits(prev => prev.map(u => 
        u.id === editingUnit.id ? { ...editingUnit } : u
      ));

      setIsEditModalOpen(false);
      // يمكن إعادة تحميل البيانات من السيرفر للتأكد من التحديث
      // await loadUnits(); 

    } catch (error) {
      console.error(error);
      setEditError(t('save_error') || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('products')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('units')}</span>
      </div>

      {/* Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">
          {t('units')}
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-opacity-90 transition"
        >
          <PlusCircle size={18} />
          {t('add_new_unit')}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 min-h-[300px]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-500">
            <thead className="text-xs text-white uppercase bg-primary">
              <tr>
                <th className="px-6 py-3">{t('unit_code')}</th>
                <th className="px-6 py-3">{t('unit_name')}</th>
                <th className="px-6 py-3 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {unit.code}
                  </td>
                  <td className="px-6 py-4">
                    {unit.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => toggleActionMenu(unit.id, e)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-md text-xs hover:bg-opacity-90 transition"
                    >
                      {t('actions')}
                      <ChevronDown size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Modal */}
        <AddUnitModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          refreshUnits={loadUnits}
        />

        {/* Floating Menu */}
        <AnimatePresence>
          {openActionId !== null && menuPosition && (
            <motion.div
              ref={actionMenuRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed bg-white rounded-md shadow-lg border w-40 z-50"
              style={{ top: menuPosition.top, left: menuPosition.left }}
            >
              <button
                onClick={() => handleEditClick(units.find(u => u.id === openActionId)!)}
                className="w-full px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 border-b"
              >
                <Edit size={14} />
                {t('edit')}
              </button>
              <button
                onClick={() => handleDelete(openActionId)}
                className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={14} />
                {t('delete')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Unit Modal */}
      <AnimatePresence>
        {isEditModalOpen && editingUnit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-bold text-gray-800">{t('edit_unit') || 'تعديل الوحدة'}</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {editError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                    {editError}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('unit_name') || 'اسم الوحدة'}
                  </label>
                  <input
                    type="text"
                    value={editingUnit.name}
                    onChange={(e) => setEditingUnit({ ...editingUnit, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                    dir={direction}
                    placeholder={t('enter_unit_name') || 'أدخل اسم الوحدة'}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('unit_description') || 'الوصف'}
                  </label>
                  <textarea
                    value={editingUnit.description || ''}
                    onChange={(e) => setEditingUnit({ ...editingUnit, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition resize-none"
                    rows={3}
                    dir={direction}
                    placeholder={t('enter_description') || 'أدخل الوصف'}
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition"
                >
                  {t('cancel') || 'إلغاء'}
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-opacity-90 transition flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {t('saving') || 'جاري الحفظ...'}
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {t('save') || 'حفظ'}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Units;