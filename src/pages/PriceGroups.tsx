import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye,
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  Filter,
  Download,
  FileText,
  Printer
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { PriceGroup } from '@/types';
import PriceGroupsModal from '@/components/PriceGroupsModal';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import Pagination from '@/components/Pagination';
import MobileDataCard from '@/components/MobileDataCard';
import { cn } from '@/lib/utils';

export default function PriceGroups() {
  const { t, direction, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<PriceGroup | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<PriceGroup | null>(null);

  // Mock data
  const [priceGroups, setPriceGroups] = useState<PriceGroup[]>([
    { id: '1', name: 'عام' },
    { id: '2', name: 'جملة' },
    { id: '3', name: 'تجزئة' },
  ]);

  const filteredGroups = useMemo(() => {
    return priceGroups.filter(group => 
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [priceGroups, searchTerm]);

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSave = (data: Partial<PriceGroup>) => {
    if (editingGroup) {
      setPriceGroups(prev => prev.map(g => g.id === editingGroup.id ? { ...g, ...data } : g));
    } else {
      const newGroup: PriceGroup = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name || '',
      };
      setPriceGroups(prev => [...prev, newGroup]);
    }
    setIsModalOpen(false);
    setEditingGroup(null);
  };

  const handleDelete = () => {
    if (groupToDelete) {
      setPriceGroups(prev => prev.filter(g => g.id !== groupToDelete.id));
      setIsDeleteModalOpen(false);
      setGroupToDelete(null);
    }
  };

  const openEditModal = (group: PriceGroup) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const openDeleteModal = (group: PriceGroup) => {
    setGroupToDelete(group);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#004d2c]/10 rounded-xl text-[#004d2c]">
            <Plus size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('pricing_groups')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('pricing_groups_desc')}</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingGroup(null);
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#004d2c] hover:bg-[#003d23] text-white rounded-xl font-bold shadow-lg shadow-green-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={20} />
          <span>{t('add_pricing_group')}</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Table Controls */}
        <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={t('search_pricing_groups')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pr-10 pl-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#004d2c] focus:border-transparent outline-none transition-all ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
              />
            </div>
            <button className="p-2.5 text-gray-500 hover:text-[#004d2c] hover:bg-[#004d2c]/5 rounded-xl transition-all border border-gray-200 dark:border-gray-600">
              <Filter size={20} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-[#004d2c] outline-none"
            >
              <option value={10}>10 {t('per_page')}</option>
              <option value={25}>25 {t('per_page')}</option>
              <option value={50}>50 {t('per_page')}</option>
            </select>
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-gray-500 hover:text-[#004d2c] hover:bg-[#004d2c]/5 rounded-xl transition-all border border-gray-200 dark:border-gray-600">
                <Printer size={20} />
              </button>
              <button className="p-2.5 text-gray-500 hover:text-[#004d2c] hover:bg-[#004d2c]/5 rounded-xl transition-all border border-gray-200 dark:border-gray-600">
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-[#004d2c] text-white">
                <th className="px-6 py-4 font-bold text-sm">{t('name')}</th>
                <th className="px-6 py-4 font-bold text-sm text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
              {paginatedGroups.map((group) => (
                <tr 
                  key={`desktop-${group.id}`}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900 dark:text-white group-hover:text-[#004d2c] transition-colors">
                      {group.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => openEditModal(group)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title={t('edit')}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(group)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title={t('delete')}
                      >
                        <Trash2 size={18} />
                      </button>
                      <button 
                        className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                        title={t('view')}
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
          {paginatedGroups.map((group) => (
            <div key={`mobile-${group.id}`} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-gray-900 dark:text-white">{group.name}</div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openEditModal(group)}
                    className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => openDeleteModal(group)}
                    className="p-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {paginatedGroups.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-400 mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('no_results')}</h3>
            <p className="text-gray-500 dark:text-gray-400">{t('no_pricing_groups_found')}</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-50 dark:border-gray-700">
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <PriceGroupsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGroup(null);
        }}
        onSave={handleSave}
        initialData={editingGroup}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        itemName={groupToDelete?.name}
      />
    </div>
  );
}
