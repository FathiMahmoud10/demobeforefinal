import React, { useState, useRef, useEffect } from 'react';
import { PlusCircle, FileText, ChevronDown, Copy, Trash2, Printer, X, Search } from 'lucide-react';
import Pagination from '@/components/Pagination';
import AddGroupModal from '@/components/AddGroupModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { useLanguage } from '@/context/LanguageContext';
import { useGroups, Group } from '@/context/GroupsContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import MobileDataCard from '@/components/MobileDataCard';

const Groups = () => {
  const { t, direction, language } = useLanguage();
  const { groups, deleteGroup, duplicateGroup } = useGroups();
  const navigate = useNavigate();

  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number, left: number } | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const handleDeleteGroup = (id: number) => {
    setGroupToDelete(id);
  };

  const confirmDelete = () => {
    if (groupToDelete !== null) {
      deleteGroup(groupToDelete);
      setGroupToDelete(null);
      setOpenActionId(null);
      setMenuPosition(null);
    }
  };

  const handleDuplicateGroup = (id: number) => {
    duplicateGroup(id);
    setOpenActionId(null);
    setMenuPosition(null);
    alert(direction === 'rtl' ? 'تم تكرار المجموعة بنجاح' : 'Group duplicated successfully');
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
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{t('show')}</span>
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
                    placeholder={t('search_placeholder')}
                    className={`w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary text-black ${direction === 'rtl' ? 'pr-8' : 'pl-8'}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${direction === 'rtl' ? 'right-2' : 'left-2'}`} size={16} />
            </div>
        </div>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-500">
            <thead className="text-xs text-white uppercase bg-primary">
              <tr>
                <th scope="col" className="px-6 py-3 border border-primary-hover">{t('group_code')}</th>
                <th scope="col" className="px-6 py-3 border border-primary-hover">{t('group_name')}</th>
                <th scope="col" className="px-6 py-3 border border-primary-hover text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedGroups.map((group) => (
                <tr 
                  key={`desktop-${group.id}`} 
                  className="bg-white border-b hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(group)}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border border-gray-100">{group.code}</td>
                  <td className="px-6 py-4 border border-gray-100">{group.name}</td>
                  <td className="px-6 py-4 border border-gray-100 text-center" onClick={(e) => e.stopPropagation()}>
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

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {paginatedGroups.map((group) => (
            <MobileDataCard
              key={`mobile-${group.id}`}
              title={group.name}
              subtitle={group.code}
              fields={[]}
              actions={
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicateGroup(group.id);
                    }}
                    className="p-2 text-primary hover:bg-primary/5 rounded-lg border border-primary/10 transition-colors"
                    title={t('duplicate_group')}
                  >
                    <Copy size={18} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGroup(group.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-colors"
                    title={t('delete_group')}
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(group);
                    }}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                  >
                    <FileText size={18} />
                  </button>
                </div>
              }
            />
          ))}
          {paginatedGroups.length === 0 && (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              {t('no_matching_results')}
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={filteredGroups.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />

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

        {/* Details Modal */}
        <AddGroupModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />

        <DeleteConfirmationModal
          isOpen={groupToDelete !== null}
          onClose={() => setGroupToDelete(null)}
          onConfirm={confirmDelete}
          itemName={groups.find(g => g.id === groupToDelete)?.name}
        />

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
