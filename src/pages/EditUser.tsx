import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, Image as ImageIcon, Edit3, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useUsers } from '@/context/UsersContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'edit' | 'password' | 'avatar';

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const { t, direction } = useLanguage();
  const { users, updateUser } = useUsers();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('edit');

  const user = users.find(u => u.id === id);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    phone: '',
    gender: 'male' as 'male' | 'female',
    usernameEmail: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        phone: user.phone,
        gender: user.gender,
        usernameEmail: user.usernameEmail,
        email: user.email,
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">{t('user_not_found') || 'المستخدم غير موجود'}</p>
        <button 
          onClick={() => navigate('/users')}
          className="mt-4 text-primary font-bold hover:underline"
        >
          {t('back_to_users') || 'العودة لقائمة المستخدمين'}
        </button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(user.id, formData);
    alert(t('operation_completed_successfully'));
    navigate('/users');
  };

  const inputClasses = "w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="max-w-6xl mx-auto" dir={direction}>
      {/* Breadcrumb */}
      <div className="text-xs text-gray-500 flex items-center gap-1 mb-6 px-2">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('users')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('profile')}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
            <div className="relative inline-block mb-4">
              <img 
                src="https://picsum.photos/seed/avatar/200/200" 
                alt="User" 
                className="w-32 h-32 rounded-full border-4 border-gray-50 shadow-sm mx-auto object-cover"
              />
              <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
            <h2 className="text-lg font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
            <p className="text-sm text-gray-500 mb-4">{user.group}</p>
            
            <div className="pt-4 border-t border-gray-50 space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                <span className="truncate">{user.email}</span>
                <Mail size={14} className="text-primary" />
              </div>
              <p className="text-[10px] text-gray-400">{t('login_to_email') || 'الدخول الى البريد الالكتروني'}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-gray-100/50 p-1 rounded-lg w-fit mb-2">
            <button 
              onClick={() => setActiveTab('edit')}
              className={cn(
                "px-6 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === 'edit' ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t('edit') || 'تعديل'}
            </button>
            <button 
              onClick={() => setActiveTab('password')}
              className={cn(
                "px-6 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === 'password' ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t('change_password') || 'تغيير كلمة المرور'}
            </button>
            <button 
              onClick={() => setActiveTab('avatar')}
              className={cn(
                "px-6 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === 'avatar' ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t('avatar') || 'الصورة الرمزية'}
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-8 text-primary border-b border-gray-50 pb-4">
                <Edit3 size={20} />
                <h3 className="font-bold">{t('edit_profile') || 'تعديل الملف الشخصي'}</h3>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'edit' && (
                  <motion.form 
                    key="edit"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 gap-6">
                      {/* First Name */}
                      <div>
                        <label className={labelClasses}>{t('first_name')} *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={inputClasses}
                          required
                        />
                      </div>

                      {/* Last Name */}
                      <div>
                        <label className={labelClasses}>{t('last_name')} *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={inputClasses}
                          required
                        />
                      </div>

                      {/* Company */}
                      <div>
                        <label className={labelClasses}>{t('company')} *</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className={inputClasses}
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className={labelClasses}>{t('phone')} *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={inputClasses}
                          required
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className={labelClasses}>{t('gender')} *</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className={inputClasses}
                          required
                        >
                          <option value="male">{t('male')}</option>
                          <option value="female">{t('female')}</option>
                        </select>
                      </div>

                      {/* Username */}
                      <div>
                        <label className={labelClasses}>{t('username') || 'اسم المستخدم'} *</label>
                        <input
                          type="text"
                          name="usernameEmail"
                          value={formData.usernameEmail}
                          onChange={handleChange}
                          className={inputClasses}
                          required
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className={labelClasses}>{t('email')} *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={inputClasses}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        className="px-10 py-2.5 bg-[#0f5132] hover:bg-[#0a3d26] text-white rounded-lg font-bold shadow-sm transition-all flex items-center gap-2"
                      >
                        {t('update') || 'تحديث'}
                      </button>
                    </div>
                  </motion.form>
                )}

                {activeTab === 'password' && (
                  <motion.div
                    key="password"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className={labelClasses}>{t('current_password') || 'كلمة المرور الحالية'}</label>
                        <input type="password" className={inputClasses} />
                      </div>
                      <div>
                        <label className={labelClasses}>{t('new_password') || 'كلمة المرور الجديدة'}</label>
                        <input type="password" className={inputClasses} />
                      </div>
                      <div>
                        <label className={labelClasses}>{t('confirm_password')}</label>
                        <input type="password" className={inputClasses} />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button className="px-10 py-2.5 bg-[#0f5132] hover:bg-[#0a3d26] text-white rounded-lg font-bold shadow-sm transition-all">
                        {t('update')}
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'avatar' && (
                  <motion.div
                    key="avatar"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-32 h-32 rounded-full bg-gray-100 mx-auto flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                      <ImageIcon size={48} />
                    </div>
                    <p className="text-sm text-gray-500">{t('upload_avatar_hint') || 'قم برفع صورة رمزية جديدة'}</p>
                    <button className="px-6 py-2 bg-primary text-white rounded-lg font-bold text-sm">
                      {t('browse')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
