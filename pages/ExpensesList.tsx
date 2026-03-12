import React, { useState } from 'react';
import { DollarSign, Menu, Search, Link as LinkIcon, ChevronDown, ChevronUp, Edit2, Trash2, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import MobileDataCard from '@/components/MobileDataCard';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

export default function ExpensesList() {
  const { t, direction, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesCount, setEntriesCount] = useState(10);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <button className="p-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors">
            <Menu size={20} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-800">المصروفات</h1>
          <DollarSign className="text-green-700" size={24} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Table Description */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <p className="text-sm text-gray-600 text-right">
            الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.
          </p>
        </div>

        {/* Controls */}
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4" dir="rtl">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm text-gray-600">إظهار</span>
            <div className="relative">
              <select
                value={entriesCount}
                onChange={(e) => setEntriesCount(Number(e.target.value))}
                className="appearance-none bg-white border border-gray-300 rounded-md py-1 pl-8 pr-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                dir="ltr"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-sm text-gray-600">بحث</span>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-48 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-right text-sm"
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-right" dir="rtl">
            <thead>
              <tr className="bg-[#0f5132] text-white">
                <th className="p-3 w-12 text-center border-r border-white/10">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="p-3 font-medium border-r border-white/10">
                  <div className="flex items-center justify-between">
                    <span>التاريخ</span>
                    <div className="flex flex-col">
                      <ChevronUp size={12} className="text-white/50 cursor-pointer hover:text-white" />
                      <ChevronDown size={12} className="text-white/50 cursor-pointer hover:text-white" />
                    </div>
                  </div>
                </th>
                <th className="p-3 font-medium border-r border-white/10">
                  <div className="flex items-center justify-between">
                    <span>مرجع</span>
                    <div className="flex flex-col">
                      <ChevronUp size={12} className="text-white/50 cursor-pointer hover:text-white" />
                      <ChevronDown size={12} className="text-white/50 cursor-pointer hover:text-white" />
                    </div>
                  </div>
                </th>
                <th className="p-3 font-medium border-r border-white/10">
                  <div className="flex items-center justify-between">
                    <span>تصنيف المصروف</span>
                    <div className="flex flex-col">
                      <ChevronUp size={12} className="text-white/50 cursor-pointer hover:text-white" />
                      <ChevronDown size={12} className="text-white/50 cursor-pointer hover:text-white" />
                    </div>
                  </div>
                </th>
                <th className="p-3 font-medium border-r border-white/10">
                  <div className="flex items-center justify-between">
                    <span>المدفوع</span>
                    <div className="flex flex-col">
                      <ChevronUp size={12} className="text-white/50 cursor-pointer hover:text-white" />
                      <ChevronDown size={12} className="text-white/50 cursor-pointer hover:text-white" />
                    </div>
                  </div>
                </th>
                <th className="p-3 font-medium border-r border-white/10">
                  <div className="flex items-center justify-between">
                    <span>وصف</span>
                    <div className="flex flex-col">
                      <ChevronUp size={12} className="text-white/50 cursor-pointer hover:text-white" />
                      <ChevronDown size={12} className="text-white/50 cursor-pointer hover:text-white" />
                    </div>
                  </div>
                </th>
                <th className="p-3 font-medium border-r border-white/10">
                  <div className="flex items-center justify-between">
                    <span>مدخل البيانات</span>
                    <div className="flex flex-col">
                      <ChevronUp size={12} className="text-white/50 cursor-pointer hover:text-white" />
                      <ChevronDown size={12} className="text-white/50 cursor-pointer hover:text-white" />
                    </div>
                  </div>
                </th>
                <th className="p-3 text-center border-r border-white/10">
                  <LinkIcon size={16} className="mx-auto" />
                </th>
                <th className="p-3 font-medium text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty State Row */}
              <tr className="border-b border-gray-100 bg-gray-50/30">
                <td colSpan={9} className="p-4 text-center text-sm text-gray-500">
                  لا توجد بيانات في الجدول
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4 p-4">
          <div className="p-8 text-center text-gray-400 italic bg-gray-50 rounded-lg border border-dashed border-gray-200">
            لا توجد بيانات في الجدول
          </div>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-100" dir="rtl">
          <div className="text-sm text-gray-600">
            عرض 0 إلى 0 من 0 سجلات
          </div>
          <div className="flex gap-1" dir="ltr">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              &lt; السابق
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              التالي &gt;
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={expenseToDelete !== null}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={() => {
          // In a real app, delete the expense
          setExpenseToDelete(null);
        }}
        itemName={language === 'ar' ? 'هذا المصروف' : 'this expense'}
      />
    </div>
  );
}
