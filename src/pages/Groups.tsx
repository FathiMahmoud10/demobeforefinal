import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, FileText, ChevronDown, Copy, Trash2, Printer, X } from 'lucide-react';
import AddGroupModal from '@/components/AddGroupModal';
import Toast from '@/components/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { useGroups, Group } from '@/context/GroupsContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Groups = () => {
  const { t, direction } = useLanguage();
  const { groups, deleteGroup, duplicateGroup } = useGroups();
  const navigate = useNavigate();

  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number, left: number } | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  // toast state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showToast, setShowToast] = useState(false);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(groups.length);

  useEffect(() => {
    // When a new group appears, scroll container to bottom so user sees it.
    if (groups.length > prevCountRef.current) {
      tableContainerRef.current?.scrollTo({ top: tableContainerRef.current.scrollHeight, behavior: 'smooth' });
    }
    prevCountRef.current = groups.length;
  }, [groups.length]);

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

      const menuWidth = 192;
      const left = direction === 'rtl'
        ? rect.right - menuWidth
        : rect.left;

      setMenuPosition({
        top: rect.bottom + 5,
        left: Math.max(10, left)
      });
    }
  };

  const handleDeleteGroup = async (id: number) => {
    try {
      await deleteGroup(id);
      setToastMessage(direction === 'rtl' ? 'تم حذف التصنيف' : 'Group deleted');
      setToastType('success');
      setShowToast(true);
    } catch (e) {
      console.error('Delete failed:', e);
      const msg = e instanceof Error ? e.message : 'خطأ';
      setToastMessage(direction === 'rtl' ? `فشل: ${msg}` : `Failed: ${msg}`);
      setToastType('error');
      setShowToast(true);
    }
    setOpenActionId(null);
    setMenuPosition(null);
  };

  const handleDuplicateGroup = async (id: number) => {
    try {
      await duplicateGroup(id);
      setToastMessage(direction === 'rtl' ? 'تم تكرار المجموعة بنجاح' : 'Group duplicated successfully');
      setToastType('success');
      setShowToast(true);
    } catch (e) {
      console.error(e);
      setToastMessage(direction === 'rtl' ? 'فشل تكرار المجموعة' : 'Failed to duplicate group');
      setToastType('error');
      setShowToast(true);
    }
    setOpenActionId(null);
    setMenuPosition(null);
  };

  const handleRowClick = (group: Group) => {
    setSelectedGroup(group);
    setShowModal(true);
  };

  return (
    <div className="space-y-4">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('products')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('groups')}</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {t('groups')}
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <PlusCircle size={18} />
          {t('add_new_group')}
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 min-h-[400px]">
        <div ref={tableContainerRef} className="overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-500">
            <thead className="text-xs text-white uppercase bg-primary">
              <tr>
                <th scope="col" className="px-6 py-3 border border-primary-hover whitespace-nowrap">{t('group_code')}</th>
                <th scope="col" className="px-6 py-3 border border-primary-hover whitespace-nowrap">{t('group_name')}</th>
                <th scope="col" className="px-6 py-3 border border-primary-hover text-center whitespace-nowrap">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr
                  key={group.id}
                  className="bg-white border-b hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(group)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border border-gray-100">{group.code}</td>
                  <td className="px-6 py-4 border border-gray-100 whitespace-nowrap">{group.name}</td>
                  <td className="px-6 py-4 border border-gray-100 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => toggleActionMenu(group.id, e)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-medium hover:bg-primary-hover transition-colors"
                    >
                      <span>{t('actions')}</span>
                      <ChevronDown size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Floating Action Menu */}
        <AnimatePresence>
          {openActionId !== null && menuPosition && (
            <motion.div
              ref={actionMenuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`fixed bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden w-48 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
              style={{ top: menuPosition.top, left: menuPosition.left }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const group = groups.find(g => g.id === openActionId);
                if (!group) return null;
                return (
                  <>
                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => handleDuplicateGroup(group.id)}
                      className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 ${direction === 'rtl' ? 'justify-end' : 'justify-start'}`}
                    >
                      {direction === 'rtl' ? (
                        <>
                          <span>{t('duplicate_group')}</span>
                          <Copy size={14} className="text-gray-500" />
                        </>
                      ) : (
                        <>
                          <Copy size={14} className="text-gray-500" />
                          <span>{t('duplicate_group')}</span>
                        </>
                      )}
                    </button>
                    <button
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => handleDeleteGroup(group.id)}
                      className={`w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 ${direction === 'rtl' ? 'justify-end' : 'justify-start'}`}
                    >
                      {direction === 'rtl' ? (
                        <>
                          <span>{t('delete_group')}</span>
                          <Trash2 size={14} className="text-red-500" />
                        </>
                      ) : (
                        <>
                          <Trash2 size={14} className="text-red-500" />
                          <span>{t('delete_group')}</span>
                        </>
                      )}
                    </button>
                  </>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toast notification */}
        <Toast
          isOpen={showToast}
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
        {/* Details Modal */}
        <AddGroupModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

        <AnimatePresence>
          {showModal && selectedGroup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative"
                dir="rtl"
              >
                {/* Modal Header */}
                <div className="p-4 flex justify-between items-center border-b border-gray-100">
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                  >
                    <X size={24} />
                  </button>

                  <div className="flex flex-col items-center">
                    <img src="https://picsum.photos/seed/takamul/200/60" alt="Logo" className="h-12 object-contain" referrerPolicy="no-referrer" />
                    <span className="text-primary font-bold text-lg">مؤسسة تكامل</span>
                  </div>

                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    <Printer size={18} />
                    <span>طباعة</span>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-8 space-y-6">
                  {/* Info Section */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 text-right">
                      <p className="text-gray-900 font-bold">التاريخ: <span className="font-normal">19:41:00 19/02/2026</span></p>
                      <p className="text-gray-900 font-bold">الرقم المرجعي: <span className="font-normal">5556565</span></p>
                    </div>

                    <div className="flex gap-4">
                      <div className="bg-white p-2 border border-gray-200 rounded-lg">
                        <img src="https://picsum.photos/seed/qr/80/80" alt="QR Code" className="w-20 h-20" referrerPolicy="no-referrer" />
                      </div>
                      <div className="bg-white p-2 border border-gray-200 rounded-lg flex items-center">
                        <img src="https://picsum.photos/seed/barcode/150/40" alt="Barcode" className="h-10 w-32" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-hidden border border-gray-200 rounded-xl">
                    <table className="w-full text-right text-sm">
                      <thead className="bg-primary text-white">
                        <tr>
                          <th className="px-4 py-3 border-l border-white/20">لا</th>
                          <th className="px-4 py-3 border-l border-white/20">وصف</th>
                          <th className="px-4 py-3 border-l border-white/20">متغير</th>
                          <th className="px-4 py-3 border-l border-white/20">نوع</th>
                          <th className="px-4 py-3 border-l border-white/20">كمية</th>
                          <th className="px-4 py-3">التكلفة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-4 py-3 border-l border-gray-200">1</td>
                          <td className="px-4 py-3 border-l border-gray-200">60990980 - عبايه كريب مع اكمام مموجه</td>
                          <td className="px-4 py-3 border-l border-gray-200">-</td>
                          <td className="px-4 py-3 border-l border-gray-200">طرح</td>
                          <td className="px-4 py-3 border-l border-gray-200">23.00</td>
                          <td className="px-4 py-3">150.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Section */}
                  <div className="flex justify-end">
                    <div className="w-64 border border-gray-900 rounded-lg overflow-hidden">
                      <div className="flex border-b border-gray-900">
                        <div className="flex-1 p-2 bg-gray-50 font-bold border-l border-gray-900">اجمالي الكميات</div>
                        <div className="w-24 p-2 text-center font-bold">23-</div>
                      </div>
                      <div className="flex">
                        <div className="flex-1 p-2 bg-gray-50 font-bold border-l border-gray-900">اجمالي التكلفة (SR)</div>
                        <div className="w-24 p-2 text-center font-bold">3450</div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 inline-block">
                    <p className="text-red-700 font-bold">مدخل البيانات: <span className="text-gray-700 font-normal">mm .</span></p>
                    <p className="text-red-700 font-bold">التاريخ: <span className="text-gray-700 font-normal">19:41:00 19/02/2026</span></p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Groups;
