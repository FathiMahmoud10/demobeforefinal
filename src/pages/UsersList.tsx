import React, { useState } from 'react';
import { Users, Search, Plus, Edit2, Trash2, MoreVertical, Shield, UserCheck, UserX } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useUsers } from '@/context/UsersContext';
import { useNavigate } from 'react-router-dom';
import MobileDataCard from '@/components/MobileDataCard';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { cn } from '@/lib/utils';

export default function UsersList() {
  const { t, direction } = useLanguage();
  const { users, deleteUser } = useUsers();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const filteredUsers = users.filter(user => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.usernameEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6" dir={direction}>
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
        itemName={users.find(u => u.id === userToDelete)?.firstName + ' ' + users.find(u => u.id === userToDelete)?.lastName}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('users_list')}</h1>
            <p className="text-sm text-gray-500">{t('users_list')}</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/users/create')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-bold shadow-sm"
        >
          <Plus size={20} />
          {t('add_user')}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-right" dir="rtl">
            <thead>
              <tr className="bg-[#0f5132] text-white">
                <th className="p-4 font-bold border-r border-white/10">{t('name')}</th>
                <th className="p-4 font-bold border-r border-white/10">{t('username_email')}</th>
                <th className="p-4 font-bold border-r border-white/10">{t('group')}</th>
                <th className="p-4 font-bold border-r border-white/10">{t('phone')}</th>
                <th className="p-4 font-bold border-r border-white/10">{t('status')}</th>
                <th className="p-4 font-bold text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={`desktop-${user.id}`} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary font-bold">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{user.usernameEmail}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                      <Shield size={12} />
                      {user.group}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{user.phone}</td>
                  <td className="p-4">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border",
                      user.status === 'active' 
                        ? "bg-green-100 text-green-700 border-green-200" 
                        : "bg-red-100 text-red-700 border-red-200"
                    )}>
                      {user.status === 'active' ? <UserCheck size={12} /> : <UserX size={12} />}
                      {user.status === 'active' ? t('active') : t('inactive')}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/users/edit/${user.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={t('edit')}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => setUserToDelete(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t('delete')}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-500 italic">
                    {t('no_data_in_table')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {filteredUsers.map((user) => (
          <MobileDataCard
            key={`mobile-${user.id}`}
            title={`${user.firstName} ${user.lastName}`}
            subtitle={user.email}
            status={{
              label: user.status === 'active' ? t('active') : t('inactive'),
              type: user.status === 'active' ? 'success' : 'danger'
            }}
            fields={[
              { label: t('username_email'), value: user.usernameEmail },
              { label: t('group'), value: user.group, isBadge: true, badgeType: 'info' },
              { label: t('phone'), value: user.phone },
              { label: t('company'), value: user.company }
            ]}
            actions={
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate(`/users/edit/${user.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 text-blue-600 bg-blue-50 rounded-lg font-bold text-sm"
                >
                  <Edit2 size={16} />
                  {t('edit')}
                </button>
                <button 
                  onClick={() => setUserToDelete(user.id)}
                  className="flex-1 flex items-center justify-center gap-2 p-2 text-red-600 bg-red-50 rounded-lg font-bold text-sm"
                >
                  <Trash2 size={16} />
                  {t('delete')}
                </button>
              </div>
            }
          />
        ))}
        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-gray-500 italic bg-white rounded-xl border border-gray-100 shadow-sm">
            {t('no_data_in_table')}
          </div>
        )}
      </div>
    </div>
  );
}
