// src/pages/Additions.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAdditions } from '@/context/AdditionsContext';
import { Plus, Search, Trash2, Edit2, X, Grid3X3, ChevronRight, ChevronLeft, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Additions: React.FC = () => {
    const { t, direction } = useLanguage();
    const { additions, addAddition, updateAddition, deleteAddition } = useAdditions();
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [editingAddition, setEditingAddition] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [form, setForm] = useState({ name: '' }); // ✅ حذف code من الـ form
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const handleOpenModal = (addition?: any) => {
        if (addition) {
            setEditingAddition(addition.id);
            setForm({ name: addition.name }); // ✅ حذف code
        } else {
            setEditingAddition(null);
            setForm({ name: '' });
        }
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAddition) {
            updateAddition({ ...form, id: editingAddition });
        } else {
            addAddition(form);
        }
        setShowModal(false);
    };

    // ✅ البحث بالاسم فقط (حذفنا البحث بالكود)
    const filteredAdditions = additions.filter(a =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredAdditions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAdditions = filteredAdditions.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-4 pb-12 min-h-screen bg-gray-50" dir={direction}>

            {/* ✅ Breadcrumb */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">المشتريات</span>
                    <span className="text-gray-400">&gt;</span>
                    <span className="text-green-600 cursor-pointer hover:text-green-700">البداية</span>
                </div>
            </div>

            {/* ✅ الهيدر الرئيسي */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                    {/* العنوان على الشمال */}
                    <div className="flex items-center gap-3 text-left">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{t('additions')} (جميع الفروع)</h1>
                            <p className="text-sm text-gray-500 mt-1">الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.</p>
                        </div>
                        <Grid3X3 size={24} className="text-green-600" />
                    </div>

                    {/* زر الإضافة على اليمين */}
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-bold text-sm"
                    >
                        <Plus size={20} />
                        {t('add_addition')}
                    </button>
                </div>
            </div>

            {/* ✅ محتوى الصفحة */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* أدوات التحكم */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between gap-4">
                        {/* Items per page على الشمال */}
                        <div className="flex items-center gap-2">
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="border border-gray-300 rounded-lg py-2 px-3 text-sm bg-white outline-none focus:border-green-500"
                            >
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>
                            <span className="text-sm text-gray-600">اظهار</span>
                        </div>

                        {/* Search على اليمين */}
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="بحث..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 rounded-lg py-2 px-4 text-sm outline-none focus:border-green-500 w-64"
                            />
                            <Filter size={20} className="text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* ✅ الجدول - مع حواف منحنية */}
                <div className="overflow-hidden rounded-xl border border-gray-200">
                    <table className="w-full text-sm" dir="rtl">
                        <thead className="bg-green-600 text-white">
                            <tr>
                                {/* ✅ حذف عمود الكود */}
                                <th className="p-4 text-right">الاسم</th>
                                <th className="p-4 text-center w-32">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {paginatedAdditions.length === 0 ? (
                                <tr>
                                    {/* ✅ تحديث colSpan لـ 2 بدلاً من 3 */}
                                    <td colSpan={2} className="p-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search size={32} className="text-gray-300" />
                                            <p className="font-medium">{t('no_data_in_table')}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedAdditions.map((addition) => (
                                    <tr key={addition.id} className="hover:bg-gray-50 transition-colors">
                                        {/* ✅ حذف خلية الكود */}
                                        <td className="p-4 font-bold text-gray-800 text-right">{addition.name}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 justify-center">
                                                <button
                                                    onClick={() => handleOpenModal(addition)}
                                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                    title="تعديل"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => deleteAddition(addition.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="حذف"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ✅ الترقيم */}
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        {/* Pagination buttons على الشمال */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 text-gray-700"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <div className="bg-green-600 text-white w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold">
                                {currentPage}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 text-gray-700"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {/* Info text على اليمين */}
                        <div className="text-sm text-gray-600">
                            عرض {startIndex + 1} إلى {Math.min(startIndex + itemsPerPage, filteredAdditions.length)} من {additions.length} سجلات
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Modal - بدون حقل الكود */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                            dir="rtl"
                        >
                            <div className="bg-green-600 p-4 flex items-center justify-between text-white">
                                <div className="w-8" />
                                <span className="font-bold text-lg">
                                    {editingAddition ? 'تعديل إضافة' : 'إضافة جديدة'}
                                </span>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/80"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="text-sm text-gray-600 text-right leading-relaxed">
                                    برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية.
                                </div>

                                <div className="space-y-4 text-right">
                                    {/* ✅ حقل الاسم فقط */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5">الاسم *</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-green-100 focus:border-green-500 outline-none text-right transition-all"
                                            placeholder="أدخل اسم الإضافة..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-8 py-2.5 rounded-lg hover:bg-green-700 transition-all font-bold shadow-sm"
                                    >
                                        {editingAddition ? 'حفظ التعديلات' : 'إضافة'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        إلغاء
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Additions;