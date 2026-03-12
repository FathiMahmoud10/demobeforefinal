import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Users,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Link as LinkIcon
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useCustomerGroups, CustomerGroup } from '@/context/CustomerGroupsContext';
import CustomerGroupsModal from '@/components/CustomerGroupsModal';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerGroups = () => {
  const { t, direction } = useLanguage();
  const { groups, addGroup, updateGroup, deleteGroup } = useCustomerGroups();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CustomerGroup | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentGroups = filteredGroups.slice(startIndex, startIndex + itemsPerPage);

  const handleAdd = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleEdit = (group: CustomerGroup) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleSave = (groupData: Omit<CustomerGroup, 'id'>) => {
    if (editingGroup) {
      updateGroup(editingGroup.id, groupData);
    } else {
      addGroup(groupData);
    }
  };

  return (
    <div className="space-y-6" dir={direction}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-[#00a65a]">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('customer_groups')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('customer_groups_table_desc')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button className="p-2 text-gray-400 hover:text-[#00a65a] transition-colors">
              <LinkIcon size={20} />
           </button>
           <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-[#00a65a] hover:bg-[#008d4c] text-white rounded-xl font-bold transition-all shadow-lg shadow-green-500/20"
          >
            <Plus size={20} />
            {t('add_customer_group')}
          </button>
        </div>
      </div>

      {/* Table/Cards Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{t('show')}</span>
            <select className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[#00a65a]">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span className="text-sm text-gray-500">{t('records')}</span>
          </div>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 pr-10 pl-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#00a65a] transition-all"
            />
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-[#004d2c] text-white">
                <th className="px-6 py-4 font-bold text-sm">{t('name')}</th>
                <th className="px-6 py-4 font-bold text-sm">{t('percentage')}</th>
                <th className="px-6 py-4 font-bold text-sm text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              <AnimatePresence mode="popLayout">
                {currentGroups.map((group) => (
                  <motion.tr 
                    key={`desktop-${group.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {group.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {group.percentage}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(group)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title={t('edit')}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteGroup(group.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title={t('delete')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden p-4 space-y-4">
          {currentGroups.map((group) => (
            <div key={`mobile-${group.id}`} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{group.name}</h3>
                  <p className="text-sm text-gray-500">{t('percentage')}: {group.percentage}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(group)}
                    className="p-2 text-blue-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteGroup(group.id)}
                    className="p-2 text-red-600 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            {t('showing_records')} {startIndex + 1} {t('to')} {Math.min(startIndex + itemsPerPage, filteredGroups.length)} {t('of')} {filteredGroups.length} {t('records')}
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                    currentPage === i + 1 
                      ? "bg-[#00a65a] text-white shadow-md" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>
      </div>

      <CustomerGroupsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingGroup}
      />
    </div>
  );
};

export default CustomerGroups;
