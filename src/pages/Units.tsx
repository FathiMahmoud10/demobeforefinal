import React, { useState, useRef, useEffect } from 'react';
import { FileText, ChevronDown, Edit, Trash2, PlusCircle, Search } from 'lucide-react';
import Pagination from '@/components/Pagination';
import AddUnitModal from '@/components/AddUnitModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import MobileDataCard from '@/components/MobileDataCard';

const Units = () => {
  const { t, direction, language } = useLanguage();
  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number, left: number } | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  const [units, setUnits] = useState([
    { id: 1, code: 'U-001', name: 'قطعة' },
    { id: 2, code: 'U-002', name: 'كيلو' },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUnits = filteredUnits.slice(
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

  const handleAddUnit = (unitName: string) => {
    const newUnit = {
      id: units.length > 0 ? Math.max(...units.map(u => u.id)) + 1 : 1,
      code: `U-00${units.length + 1}`,
      name: unitName,
    };
    setUnits([...units, newUnit]);
  };

  const handleDelete = (id: number) => {
    setUnitToDelete(id);
  };

  const confirmDelete = () => {
    if (unitToDelete !== null) {
      setUnits(units.filter(u => u.id !== unitToDelete));
      setUnitToDelete(null);
      setOpenActionId(null);
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

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              {t('units')}
          </h1>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2 text-sm font-medium"
          >
              <PlusCircle size={18} />
              {t('add_new_unit')}
          </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 min-h-[300px]">
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
        {/* Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-right text-gray-500">
            <thead className="text-xs text-white uppercase bg-primary">
              <tr>
                <th scope="col" className="px-6 py-3 border border-primary-hover">{t('unit_code')}</th>
                <th scope="col" className="px-6 py-3 border border-primary-hover">{t('unit_name')}</th>
                <th scope="col" className="px-6 py-3 border border-primary-hover text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="bg-green-50/20">
              {paginatedUnits.map((unit) => (
                <tr key={unit.id} className="bg-green-50/30 border-b hover:bg-green-100/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border border-gray-100">{unit.code}</td>
                  <td className="px-6 py-4 border border-gray-100">{unit.name}</td>
                  <td className="px-6 py-4 border border-gray-100 text-center">
                    <button 
                      onClick={(e) => toggleActionMenu(unit.id, e)}
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
          {paginatedUnits.map((unit) => (
            <MobileDataCard
              key={unit.id}
              title={unit.name}
              subtitle={unit.code}
              fields={[]}
              actions={
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => handleDelete(unit.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors">
                    <Edit size={18} />
                  </button>
                </div>
              }
            />
          ))}
          {paginatedUnits.length === 0 && (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              {t('no_results_found')}
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={filteredUnits.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />

        {/* Floating Action Menu */}
        <AddUnitModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onAddUnit={handleAddUnit} 
        />

        <DeleteConfirmationModal
          isOpen={unitToDelete !== null}
          onClose={() => setUnitToDelete(null)}
          onConfirm={confirmDelete}
          itemName={units.find(u => u.id === unitToDelete)?.name}
        />

        {/* Floating Action Menu */}
        <AnimatePresence>
          {openActionId !== null && menuPosition && (
            <motion.div 
              ref={actionMenuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`fixed bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden w-40 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
              style={{ top: menuPosition.top, left: menuPosition.left }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onMouseDown={(e) => e.stopPropagation()}
                className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 ${direction === 'rtl' ? 'justify-end' : 'justify-start'}`}
              >
                {direction === 'rtl' ? (
                  <><span>{t('edit')}</span><Edit size={14} className="text-gray-500" /></>
                ) : (
                  <><Edit size={14} className="text-gray-500" /><span>{t('edit')}</span></>
                )}
              </button>
              <button 
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => handleDelete(openActionId)}
                className={`w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 ${direction === 'rtl' ? 'justify-end' : 'justify-start'}`}
              >
                {direction === 'rtl' ? (
                  <><span>{t('delete')}</span><Trash2 size={14} className="text-red-500" /></>
                ) : (
                  <><Trash2 size={14} className="text-red-500" /><span>{t('delete')}</span></>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Units;
