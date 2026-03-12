import React, { useState } from 'react';
import { UserPlus, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useUsers } from '@/context/UsersContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function AddUser() {
  const { t, direction } = useLanguage();
  const { addUser } = useUsers();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'male' as 'male' | 'female',
    company: '',
    phone: '',
    email: '',
    usernameEmail: '',
    password: '',
    confirmPassword: '',
    status: 'active' as 'active' | 'inactive',
    group: 'owner',
    defaultPaymentMethod: 'network',
    defaultPaymentCompany: 'none',
    defaultInvoiceType: 'delivery',
    notifyEmail: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert(t('passwords_do_not_match') || 'كلمات المرور غير متطابقة');
      return;
    }

    const { confirmPassword, password, ...userData } = formData;
    addUser(userData);
    
    alert(t('operation_added_successfully'));
    navigate('/users');
  };

  const inputClasses = "w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="max-w-4xl mx-auto" dir={direction}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <UserPlus size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('add_user')}</h1>
            <p className="text-sm text-gray-500">{t('add_user')}</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Username / Email */}
            <div>
              <label className={labelClasses}>{t('username_email')} *</label>
              <input
                type="text"
                name="usernameEmail"
                value={formData.usernameEmail}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className={labelClasses}>{t('password')} *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={inputClasses}
                required
              />
              <p className="mt-1 text-xs text-gray-400">{t('password_hint')}</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClasses}>{t('confirm_password')} *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className={labelClasses}>{t('status')} *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="active">{t('active')}</option>
                <option value="inactive">{t('inactive')}</option>
              </select>
            </div>

            {/* Group */}
            <div>
              <label className={labelClasses}>{t('group')} *</label>
              <select
                name="group"
                value={formData.group}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="owner">owner</option>
                <option value="admin">admin</option>
                <option value="cashier">cashier</option>
              </select>
            </div>

            {/* Default Payment Method */}
            <div>
              <label className={labelClasses}>{t('default_payment_method')} *</label>
              <select
                name="defaultPaymentMethod"
                value={formData.defaultPaymentMethod}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="network">{t('network')}</option>
                <option value="cash">{t('cash')}</option>
              </select>
            </div>

            {/* Default Payment Company */}
            <div>
              <label className={labelClasses}>{t('default_payment_company')} *</label>
              <select
                name="defaultPaymentCompany"
                value={formData.defaultPaymentCompany}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="none">بدون</option>
                <option value="mada">مدى</option>
              </select>
            </div>

            {/* Default Invoice Type */}
            <div>
              <label className={labelClasses}>{t('default_invoice_type')} *</label>
              <select
                name="defaultInvoiceType"
                value={formData.defaultInvoiceType}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="delivery">توصيل</option>
                <option value="takeaway">سفري</option>
                <option value="dinein">محلي</option>
              </select>
            </div>
          </div>

          {/* Notify Checkbox */}
          <div className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              id="notifyEmail"
              name="notifyEmail"
              checked={formData.notifyEmail}
              onChange={handleChange}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="notifyEmail" className="text-sm font-medium text-gray-700 cursor-pointer">
              {t('notify_user_email')}
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              type="submit"
              className="px-8 py-2.5 bg-[#0f5132] hover:bg-[#0a3d26] text-white rounded-lg font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <UserPlus size={20} />
              {t('add_user_btn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
