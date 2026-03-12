// import React, { useState } from 'react';
// import { useLanguage } from '@/context/LanguageContext';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Trash2,
//   Pencil,
//   Eye,
//   Plus,
//   UserPlus,
//   X
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function CreateSalesInvoice() {
//   const { t, direction } = useLanguage();
//   const navigate = useNavigate();

//   const [date, setDate] = useState('16:39:21 23/02/2026');
//   const [refNo, setRefNo] = useState('');
//   const [cashier, setCashier] = useState('شركة اختبار');
//   const [branch, setBranch] = useState('شركة تكامل');
//   const [customer, setCustomer] = useState('التوفيق(التوفيق)');
//   const [delegate, setDelegate] = useState('عام');
//   const [poNumber, setPoNumber] = useState('');
//   const [projectName, setProjectName] = useState('');
//   const [discount, setDiscount] = useState('50');
//   const [status, setStatus] = useState('completed');
//   const [dueDate, setDueDate] = useState('');
//   const [notes, setNotes] = useState('');
//   const [isCustomerDisabled, setIsCustomerDisabled] = useState(false);
//   const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

//   const [payments, setPayments] = useState([
//     { amount: '0', method: 'شبكة' }
//   ]);

//   const addPayment = () => {
//     setPayments([...payments, { amount: '0', method: 'شبكة' }]);
//   };

//   const removePayment = (index: number) => {
//     if (payments.length > 1) {
//       setPayments(payments.filter((_, i) => i !== index));
//     }
//   };

//   const updatePayment = (index: number, field: 'amount' | 'method', value: string) => {
//     const newPayments = [...payments];
//     newPayments[index][field] = value;
//     setPayments(newPayments);
//   };

//   const [products, setProducts] = useState([
//     {
//       id: 1,
//       name: '78574318 - غراء امريكي 1/8 نيبيرو',
//       priceNoVat: 6.50,
//       priceWithVat: 6.50,
//       qty: 10,
//       totalNoVat: 65,
//       total: 0
//     },
//     {
//       id: 2,
//       name: '125 - كوع 3/4 حار نامات',
//       priceNoVat: 1.85,
//       priceWithVat: 1.85,
//       qty: 5,
//       totalNoVat: 9.25,
//       total: 0
//     }
//   ]);

//   const handleDeleteProduct = (id: number) => {
//     setProducts(products.filter(p => p.id !== id));
//   };

//   const totalQty = products.reduce((sum, p) => sum + p.qty, 0);

//   return (
//     <div className="space-y-4" dir={direction}>
//       {/* Breadcrumb */}
//       <div className="text-sm text-gray-500 flex items-center gap-1 px-2">
//         <span>{t('home')}</span>
//         <span>/</span>
//         <span>{t('quotes')}</span>
//         <span>/</span>
//         <span className="text-gray-800 font-medium">اضافة عمليه بيع</span>
//       </div>

//       {/* Page Header */}
//       <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <Plus size={20} className="text-[#8b0000]" />
//           <h1 className="text-lg font-bold text-[#8b0000]">
//             اضافة عمليه بيع
//           </h1>
//         </div>
//       </div>

//       {/* Form Container */}
//       <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-8">
//         <form className="space-y-8">
          
//           {/* Top Section */}
//           <div className="bg-red-50/30 p-4 rounded-lg border border-red-100 mb-6">
//             <p className="text-sm text-[#8b0000] font-bold text-right mb-4">
//               برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
//             </p>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="space-y-2 text-right">
//                 <label className="text-sm font-bold text-[#8b0000] block">التاريخ</label>
//                 <input 
//                   type="text" 
//                   value={date}
//                   onChange={(e) => setDate(e.target.value)}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 text-right bg-gray-50" 
//                   readOnly
//                 />
//               </div>
//               <div className="space-y-2 text-right">
//                 <label className="text-sm font-bold text-[#8b0000] block">الرقم المرجعي</label>
//                 <input 
//                   type="text" 
//                   value={refNo}
//                   onChange={(e) => setRefNo(e.target.value)}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 text-right" 
//                 />
//               </div>
//               <div className="space-y-2 text-right">
//                 <label className="text-sm font-bold text-[#8b0000] block">كاشير *</label>
//                 <select 
//                   value={cashier}
//                   onChange={(e) => setCashier(e.target.value)}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white text-right"
//                 >
//                   <option value="شركة اختبار">شركة اختبار</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Middle Section */}
//           <div className="bg-[#fff9e6] p-4 rounded-lg border border-[#ffeeba] mb-6">
//             <p className="text-sm text-[#856404] font-bold text-right mb-4">
//               برجاء تحديث هذه الخيارات قبل إضافة أي منتج
//             </p>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//               <div className="space-y-2 text-right">
//                 <label className="text-sm font-bold text-[#8b0000] block">الفرع *</label>
//                 <select 
//                   value={branch}
//                   onChange={(e) => setBranch(e.target.value)}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white text-right"
//                 >
//                   <option value="شركة تكامل">شركة دقة الحلول</option>
//                 </select>
//               </div>
//               <div className="space-y-2 text-right">
//                 <label className="text-sm font-bold text-[#8b0000] block">عميل *</label>
//                 <div className="flex gap-1">
//                   <select 
//                     value={customer}
//                     onChange={(e) => setCustomer(e.target.value)}
//                     disabled={isCustomerDisabled}
//                     className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white text-right disabled:bg-gray-100 disabled:cursor-not-allowed"
//                   >
//                     <option value="التوفيق(التوفيق)">التوفيق(التوفيق)</option>
//                   </select>
//                   <div className="flex items-center gap-1 border border-gray-300 rounded px-1 bg-white">
//                     <button type="button" onClick={() => setShowAddCustomerModal(true)} className="text-[#8b0000] hover:text-red-700 p-1 border-l border-gray-200" title="إضافة عميل"><Plus size={16} /></button>
//                     <button type="button" onClick={() => setIsCustomerDisabled(true)} className={`p-1 border-l border-gray-200 ${isCustomerDisabled ? 'text-gray-400' : 'text-[#8b0000] hover:text-red-700'}`} title="تعطيل"><Eye size={16} /></button>
//                     <button type="button" onClick={() => setIsCustomerDisabled(false)} className={`p-1 ${!isCustomerDisabled ? 'text-gray-400' : 'text-[#8b0000] hover:text-red-700'}`} title="تفعيل"><Pencil size={16} /></button>
//                   </div>
//                 </div>
//               </div>
//               <div className="space-y-2 text-right">
//                 <label className="text-sm font-bold text-[#8b0000] block">المندوب / الموظف *</label>
//                 <select 
//                   value={delegate}
//                   onChange={(e) => setDelegate(e.target.value)}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white text-right"
//                 >
//                   <option value="عام">عام</option>
//                 </select>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-2 text-right">
//                 <label className="text-sm font-bold text-[#8b0000] block">اسم المشروع</label>
//                 <input 
//                   type="text" 
//                   value={projectName}
//                   onChange={(e) => setProjectName(e.target.value)}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 text-right" 
//                 />
//               </div>
//               <div className="space-y-2 text-right">
//                 <label className="text-sm font-bold text-[#8b0000] block">رقم أمر الشراء</label>
//                 <input 
//                   type="text" 
//                   value={poNumber}
//                   onChange={(e) => setPoNumber(e.target.value)}
//                   className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 text-right" 
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Product Search */}
//           <div className="mb-6">
//             <div className="relative">
//               <input 
//                 type="text" 
//                 placeholder="الرجاء إضافة الأصناف" 
//                 className="w-full border border-gray-300 rounded-lg px-4 py-3 text-right outline-none focus:border-red-600 pr-12"
//               />
//               <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
//                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M3 4H21V6H3V4ZM3 10H21V12H3V10ZM3 16H21V18H3V16ZM3 20H21V22H3V20Z" fill="currentColor"/>
//                 </svg>
//               </div>
//               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 border-r border-gray-200 pl-2">
//                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2z"></path><path d="M7 7h1v10H7z"></path><path d="M10 7h2v10h-2z"></path><path d="M13 7h1v10h-1z"></path><path d="M16 7h1v10h-1z"></path></svg>
//               </div>
//             </div>
//           </div>

//           {/* Products Table */}
//           <div className="space-y-2">
//             <label className="text-sm font-bold text-[#8b0000] text-right block">الأصناف *</label>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm text-right border-collapse">
//                 <thead>
//                   <tr className="bg-primary text-white">
//                     <th className="p-3 border border-primary/20 w-10 text-center">
//                       <Trash2 size={16} className="mx-auto" />
//                     </th>
//                     <th className="p-3 border border-primary/20">صنف (كود - اسم)</th>
//                     <th className="p-3 border border-primary/20">سعر الوحدة بدون ضريبة</th>
//                     <th className="p-3 border border-primary/20">سعر الوحدة بالضريبة</th>
//                     <th className="p-3 border border-primary/20">الكمية المباعة</th>
//                     <th className="p-3 border border-primary/20">الاجمالي بدون ضريبة</th>
//                     <th className="p-3 border border-primary/20">اجمالي الصنف (SR)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {products.map((product) => (
//                     <tr key={product.id} className="bg-red-50/30">
//                       <td className="p-3 border border-gray-200 text-center">
//                         <button 
//                           type="button" 
//                           onClick={() => handleDeleteProduct(product.id)}
//                           className="text-gray-800 hover:text-red-600 font-bold text-lg"
//                         >
//                           ×
//                         </button>
//                       </td>
//                       <td className="p-3 border border-gray-200 text-right">
//                         <span>{product.name}</span>
//                       </td>
//                       <td className="p-3 border border-gray-200">
//                         <input 
//                           type="number" 
//                           value={product.priceNoVat} 
//                           className="w-full border border-gray-300 rounded px-2 py-1 text-center outline-none focus:border-red-600 bg-white"
//                           readOnly
//                         />
//                       </td>
//                       <td className="p-3 border border-gray-200">
//                         <input 
//                           type="number" 
//                           value={product.priceWithVat} 
//                           className="w-full border border-gray-300 rounded px-2 py-1 text-center outline-none focus:border-red-600 bg-white"
//                           readOnly
//                         />
//                       </td>
//                       <td className="p-3 border border-gray-200">
//                         <input 
//                           type="number" 
//                           value={product.qty} 
//                           className="w-full border border-gray-300 rounded px-2 py-1 text-center outline-none focus:border-red-600 bg-white"
//                           readOnly
//                         />
//                       </td>
//                       <td className="p-3 border border-gray-200 text-center">{product.totalNoVat}</td>
//                       <td className="p-3 border border-gray-200 text-center">{product.total}</td>
//                     </tr>
//                   ))}
//                   <tr className="bg-white font-bold">
//                     <td className="p-3 border border-gray-200 text-center">
//                       <Trash2 size={16} className="mx-auto text-gray-400" />
//                     </td>
//                     <td className="p-3 border border-gray-200 text-center">Total</td>
//                     <td className="p-3 border border-gray-200 text-center">0</td>
//                     <td className="p-3 border border-gray-200 text-center">0</td>
//                     <td className="p-3 border border-gray-200 text-center">{totalQty.toFixed(2)}</td>
//                     <td className="p-3 border border-gray-200 text-center">0</td>
//                     <td className="p-3 border border-gray-200 text-center">0</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Form Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="space-y-2 text-right">
//               <label className="text-sm font-bold text-[#8b0000]">الخصم</label>
//               <input 
//                 type="text" 
//                 value={discount}
//                 onChange={(e) => setDiscount(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 text-right" 
//               />
//             </div>
//             <div className="space-y-2 text-right">
//               <label className="text-sm font-bold text-[#8b0000]">حالة فاتورة المبيعات *</label>
//               <select 
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white text-right"
//               >
//                 <option value="completed">مكتملة</option>
//                 <option value="pending">معلقة</option>
//               </select>
//             </div>
//             <div className="space-y-2 text-right">
//               <label className="text-sm font-bold text-[#8b0000]">أجل الاستحقاق</label>
//               <input 
//                 type="text" 
//                 value={dueDate}
//                 onChange={(e) => setDueDate(e.target.value)}
//                 className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 text-right" 
//               />
//             </div>
//           </div>

//           <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
//             {payments.map((payment, index) => (
//               <div key={index} className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
//                 {index > 0 && (
//                   <button 
//                     type="button"
//                     onClick={() => removePayment(index)}
//                     className="absolute -top-2 -left-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors shadow-md"
//                   >
//                     <X size={14} />
//                   </button>
//                 )}
//                 <div className="space-y-2 text-right">
//                   <label className="text-sm font-bold text-[#8b0000]">المدفوع</label>
//                   <input 
//                     type="text" 
//                     value={payment.amount}
//                     onChange={(e) => updatePayment(index, 'amount', e.target.value)}
//                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 text-right" 
//                   />
//                 </div>
//                 <div className="space-y-2 text-right">
//                   <label className="text-sm font-bold text-[#8b0000]">الدفع بواسطة *</label>
//                   <select 
//                     value={payment.method}
//                     onChange={(e) => updatePayment(index, 'method', e.target.value)}
//                     className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white text-right"
//                   >
//                     <option value="شبكة">شبكة</option>
//                     <option value="نقدي">نقدي</option>
//                   </select>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Add More Payments Button */}
//           <div className="flex justify-center">
//             <button 
//               type="button"
//               onClick={addPayment}
//               className="w-full bg-[#8b0000] text-white py-2 rounded font-bold hover:bg-[#a52a2a] transition-colors flex items-center justify-center gap-2"
//             >
//               <Plus size={20} />
//               إضافة المزيد من المدفوعات
//             </button>
//           </div>

//           {/* Notes */}
//           <div className="space-y-2 text-right">
//             <label className="text-sm font-bold text-[#8b0000]">ملاحظات فاتورة المبيعات</label>
//             <textarea 
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg p-4 h-32 outline-none focus:border-red-600 text-right text-sm"
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end gap-2 pt-8">
//             <button 
//               type="submit"
//               className="bg-[#8b0000] text-white px-6 py-2 rounded font-bold hover:bg-[#a52a2a] transition-colors"
//             >
//               اتمام العملية
//             </button>
//             <button 
//               type="button"
//               className="bg-[#5cb85c] text-white px-6 py-2 rounded font-bold hover:bg-[#4cae4c] transition-colors"
//             >
//               معاينة الفاتورة
//             </button>
//             <button 
//               type="button"
//               onClick={() => navigate('/quotes')}
//               className="bg-[#d9534f] text-white px-6 py-2 rounded font-bold hover:bg-[#c9302c] transition-colors"
//             >
//               إعادة تعيين
//             </button>
//           </div>
//         </form>
//       </div>
//       {/* Add Customer Modal */}
//       <AnimatePresence>
//         {showAddCustomerModal && (
//           <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto">
//             <motion.div 
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.95 }}
//               className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden my-8"
//               onClick={e => e.stopPropagation()}
//             >
//               <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                   <UserPlus size={20} className="text-[#8b0000]" />
//                   <h2 className="text-lg font-bold text-[#8b0000]">{t('add_customer')}</h2>
//                 </div>
//                 <button onClick={() => setShowAddCustomerModal(false)} className="text-gray-400 hover:text-gray-600">
//                   <X size={24} />
//                 </button>
//               </div>

//               <div className="p-8 space-y-8" dir="rtl">
//                 <p className="text-sm text-[#8b0000] text-center font-medium">
//                   برجاء ادخال المعلومات أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
//                 </p>

//                 <div className="bg-[#fff9e6] p-6 rounded-lg border border-[#ffeeba] space-y-4">
//                   <p className="text-sm text-[#856404] font-bold text-center">برجاء تحديد نوع العميل</p>
//                   <div className="flex justify-center gap-12">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input type="radio" name="customerType" className="w-4 h-4 accent-[#8b0000]" defaultChecked />
//                       <span className="text-sm font-bold text-[#8b0000]">غير مسجل بالضريبة</span>
//                     </label>
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input type="radio" name="customerType" className="w-4 h-4 accent-[#8b0000]" />
//                       <span className="text-sm font-bold text-[#8b0000]">مسجل بالضريبة</span>
//                     </label>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div className="space-y-2 text-right">
//                     <label className="text-sm font-bold text-[#8b0000]">مجموعة العملاء *</label>
//                     <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white">
//                       <option>عام</option>
//                     </select>
//                   </div>
//                   <div className="space-y-2 text-right">
//                     <label className="text-sm font-bold text-[#8b0000]">مجموعة التسعيرة</label>
//                     <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600 bg-white">
//                       <option>عام</option>
//                     </select>
//                   </div>
//                   <div className="space-y-2 text-right">
//                     <label className="text-sm font-bold text-[#8b0000]">اسم العميل *</label>
//                     <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
//                   </div>

//                   <div className="space-y-2 text-right">
//                     <label className="text-sm font-bold text-[#8b0000]">هاتف</label>
//                     <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
//                   </div>
//                   <div className="space-y-2 text-right">
//                     <label className="text-sm font-bold text-[#8b0000]">عنوان البريد الإلكتروني</label>
//                     <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
//                   </div>
//                   <div className="space-y-2 text-right">
//                     <label className="text-sm font-bold text-[#8b0000]">السجل التجاري</label>
//                     <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
//                   </div>

//                   <div className="space-y-2 text-right">
//                     <label className="text-sm font-bold text-[#8b0000]">رصيد افتتاحي *( المديونية بالسالب)</label>
//                     <input type="number" defaultValue="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
//                   </div>
//                   <div className="space-y-2 text-right">
//                     <label className="text-sm font-bold text-[#8b0000]">الحد الائتماني *</label>
//                     <input type="number" defaultValue="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-red-600" />
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-end gap-2">
//                   <label className="text-sm font-bold text-[#8b0000] cursor-pointer" htmlFor="stop-sale">ايقاف البيع في حالة وجود مبالغ مستحقة</label>
//                   <input type="checkbox" id="stop-sale" className="w-4 h-4 accent-[#8b0000]" />
//                 </div>

//                 <div className="flex justify-start pt-4">
//                   <button 
//                     type="button"
//                     onClick={() => setShowAddCustomerModal(false)}
//                     className="bg-[#8b0000] text-white px-8 py-2 rounded-lg font-bold hover:bg-[#a52a2a] transition-colors"
//                   >
//                     اضافة عميل
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }



import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2, Pencil, Eye, Plus, UserPlus, X,
  FileText, ChevronRight, Save, RotateCcw,
  DollarSign, Package, Building2,
  CheckCircle, AlertCircle, Loader2, Search,
  ShoppingCart, CreditCard, StickyNote, Calendar,
  Hash, Percent, Receipt, ChevronDown
} from 'lucide-react';

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE = 'http://takamulerp.runasp.net/api';

async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      mode: 'cors',
      ...options,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`خطأ ${res.status}: ${text || res.statusText}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch (err) {
    if (err.name === 'TypeError') {
      throw new Error('تعذّر الاتصال بالخادم — تأكد من الشبكة أو إعدادات CORS');
    }
    throw err;
  }
}

const cn = (...c) => c.filter(Boolean).join(' ');

// ─── TOAST ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = 'info') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 5000);
  }, []);
  const remove = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, add, remove };
}

function Toasts({ toasts, remove }) {
  return (
    <div className="fixed bottom-6 left-6 z-[999] space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id}
            initial={{ opacity: 0, x: -30, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -30, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className={cn(
              'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold min-w-[300px] max-w-[420px]',
              t.type === 'success' ? 'bg-emerald-700 text-white' :
              t.type === 'error'   ? 'bg-rose-700 text-white'    : 'bg-gray-900 text-white'
            )}>
            {t.type === 'success' ? <CheckCircle size={18} className="shrink-0" /> :
             t.type === 'error'   ? <AlertCircle size={18} className="shrink-0" /> :
                                    <Loader2 size={18} className="animate-spin shrink-0" />}
            <span className="flex-1 leading-snug">{t.msg}</span>
            <button onClick={() => remove(t.id)} className="opacity-60 hover:opacity-100 pointer-events-auto shrink-0">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Field({ label, required, children, icon }) {
  return (
    <div className="space-y-1.5 text-right">
      <label className="flex items-center justify-end gap-1.5 text-xs font-bold text-gray-600">
        {required && <span className="text-rose-500 text-sm leading-none">*</span>}
        {label}
        {icon && <span className="text-gray-400">{icon}</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls  = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-rose-800 focus:ring-2 focus:ring-rose-800/10 bg-white transition-all text-right placeholder:text-gray-300";
const selectCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-rose-800 focus:ring-2 focus:ring-rose-800/10 bg-white transition-all text-right";

function Section({ title, icon, accent = 'rose', children }) {
  const colors = {
    rose:    { border: 'border-rose-100',    bg: 'bg-rose-50/50',    dot: 'bg-rose-800',    title: 'text-rose-900',    iconBg: 'bg-rose-100',    iconColor: 'text-rose-700' },
    amber:   { border: 'border-amber-100',   bg: 'bg-amber-50/50',   dot: 'bg-amber-500',   title: 'text-amber-900',   iconBg: 'bg-amber-100',   iconColor: 'text-amber-700' },
    slate:   { border: 'border-slate-100',   bg: 'bg-slate-50/50',   dot: 'bg-slate-500',   title: 'text-slate-800',   iconBg: 'bg-slate-100',   iconColor: 'text-slate-600' },
    emerald: { border: 'border-emerald-100', bg: 'bg-emerald-50/30', dot: 'bg-emerald-600', title: 'text-emerald-900', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-700' },
  };
  const c = colors[accent] || colors.rose;
  return (
    <div className={cn('rounded-2xl border p-5 space-y-5', c.border, c.bg)}>
      <div className="flex items-center justify-end gap-2.5">
        <h3 className={cn('text-sm font-bold', c.title)}>{title}</h3>
        <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', c.iconBg)}>
          <span className={c.iconColor}>{icon}</span>
        </div>
        <div className={cn('w-1 h-5 rounded-full', c.dot)} />
      </div>
      {children}
    </div>
  );
}

// ─── PRODUCT SEARCH ───────────────────────────────────────────────────────────
function ProductSearchInput({ onAdd, toast }) {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);
  const wrapRef    = useRef(null);
  const debounceRef= useRef(null);

  useEffect(() => {
    const h = e => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Normalize any product shape from the API into a consistent object
  const normalize = item => ({
    id:            item.id ?? item.productId,
    unitId:        item.unitId ?? 1,
    productName:   item.productName ?? item.name ?? item.itemName ?? `منتج #${item.id}`,
    barcode:       item.barcode ?? item.productCode ?? item.code ?? item.sku ?? '',
    salePrice:     Number(item.salePrice ?? item.sellingPrice ?? item.price ?? item.unitPrice ?? 0),
    taxPercentage: Number(item.taxPercentage ?? item.tax ?? item.vatPercentage ?? 14),
    stockQuantity: item.stockQuantity ?? item.stock ?? null,
  });

const search = useCallback(async (q) => {

  if (!q.trim()) {
    setResults([]);
    setOpen(false);
    return;
  }

  setLoading(true);

  try {

    const res = await fetch("http://takamulerp.runasp.net/Products");
    const data = await res.json();

    const lower = q.toLowerCase();

    const filtered = data.filter(p =>
      (p.productNameAr || "").toLowerCase().includes(lower) ||
      (p.productCode || "").toString().includes(lower)
    );

    const normalized = filtered.map(item => ({
      id: item.id,
      unitId: 1,
      productName: item.productNameAr,
      barcode: item.productCode,
      salePrice: Number(item.sellingPrice),
      taxPercentage: 14,
      stockQuantity: null
    }));

    setResults(normalized.slice(0, 20));
    setOpen(true);

  } catch (e) {
    toast.add("خطأ في تحميل الأصناف", "error");
  }

  setLoading(false);

}, [toast]);

  const handleChange = e => {
    const v = e.target.value;
    setQuery(v);
    clearTimeout(debounceRef.current);
    if (v.trim().length >= 2) {
      debounceRef.current = setTimeout(() => search(v), 600);
    } else {
      setResults([]); setOpen(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') { e.preventDefault(); clearTimeout(debounceRef.current); search(query); }
    if (e.key === 'Escape') setOpen(false);
  };

  const handleSelect = item => {
    onAdd({
      id:          Date.now(),
      productId:   item.id,
      unitId:      item.unitId,
      name:        [item.barcode, item.productName].filter(Boolean).join(' - '),
      priceNoVat:  item.salePrice,
      priceWithVat:item.salePrice * (1 + item.taxPercentage / 100),
      qty:         1,
      discountPct: 0,
      tax:         item.taxPercentage,
    });
    setQuery(''); setResults([]); setOpen(false);
    toast.add(`✓ تمت إضافة: ${item.productName}`, 'success');
  };

  return (
    <div ref={wrapRef} className="relative">
      <div className="relative flex items-center">
        <input type="text" value={query} onChange={handleChange} onKeyDown={handleKeyDown}
          placeholder="ابحث بالباركود أو اسم الصنف... (اضغط Enter للبحث)"
          className={cn(inputCls, 'pl-24 pr-12')} />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
          {loading
            ? <Loader2 size={16} className="animate-spin text-rose-400" />
            : <Search size={16} />}
        </span>
        <div className="absolute left-2 top-1/2 -translate-y-1/2">
          <button type="button" disabled={loading}
            onClick={() => { clearTimeout(debounceRef.current); search(query); }}
            className="flex items-center gap-1.5 bg-rose-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-800 transition-colors disabled:opacity-60">
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Search size={12} />} بحث
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[300] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-50 bg-gray-50/60 flex items-center justify-between">
              <button onClick={() => setOpen(false)} className="text-gray-300 hover:text-gray-500 transition-colors">
                <X size={14} />
              </button>
              <p className="text-xs text-gray-400 font-semibold">{results.length} نتيجة — انقر على الصنف لإضافته</p>
            </div>
            <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
              {results.map((item, i) => (
                <button key={item.id ?? i} type="button" onClick={() => handleSelect(item)}
                  className="w-full text-right px-4 py-3 hover:bg-rose-50/60 transition-colors flex items-center justify-between gap-3 group">
                  <span className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Plus size={14} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.productName}</p>
                    <div className="flex items-center justify-end gap-3 mt-0.5 flex-wrap">
                      {item.barcode && (
                        <span className="text-[10px] text-gray-400 font-mono">{item.barcode}</span>
                      )}
                      <span className="text-xs text-emerald-600 font-bold">
                        {item.salePrice.toFixed(2)} ر.س
                      </span>
                      {item.stockQuantity != null && (
                        <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-medium',
                          item.stockQuantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500')}>
                          مخزون: {item.stockQuantity}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-rose-100 flex items-center justify-center shrink-0 transition-colors">
                    <Package size={14} className="text-gray-400 group-hover:text-rose-500 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── ADD CUSTOMER MODAL ───────────────────────────────────────────────────────
// Fields match the API schema: { customerName, phone, mobile, address, city, state, postalCode, taxNumber }
function AddCustomerModal({ onClose, onAdded, toast }) {
  const [loading,        setLoading]        = useState(false);
  const [taxRegistered,  setTaxRegistered]  = useState(false);
  const [form, setForm] = useState({
    customerName: '', phone: '', mobile: '',
    address: '', city: '', state: '', postalCode: '', taxNumber: '',
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    if (!form.customerName.trim()) { toast.add('اسم العميل مطلوب', 'error'); return; }
    setLoading(true);
    try {
      const data = await apiFetch('/Customer', {
        method: 'POST',
        body: JSON.stringify({ ...form, isActive: true, taxRegistered }),
      });
      toast.add(`تم إضافة العميل "${form.customerName}" بنجاح ✓`, 'success');
      onAdded?.(data);
      onClose();
    } catch (e) {
      toast.add(`فشل إضافة العميل: ${e.message}`, 'error');
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl my-8 overflow-hidden"
        onClick={e => e.stopPropagation()}>

        <div className="bg-gradient-to-l from-rose-900 to-rose-700 px-7 py-5 flex justify-between items-center">
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/15 text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <div className="flex items-center gap-3 text-white">
            <div className="text-right">
              <p className="text-xs text-white/60 leading-none mb-1">إنشاء سجل جديد</p>
              <h2 className="text-lg font-bold leading-none">إضافة عميل جديد</h2>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <UserPlus size={20} />
            </div>
          </div>
        </div>

        <div className="p-7 space-y-5" dir="rtl">
          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
            <p className="text-xs font-bold text-amber-700 text-center mb-3">نوع العميل الضريبي</p>
            <div className="flex justify-center gap-10">
              {[{ v: false, l: 'غير مسجل بالضريبة' }, { v: true, l: 'مسجل بالضريبة' }].map(opt => (
                <label key={String(opt.v)} className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => setTaxRegistered(opt.v)}>
                  <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
                    taxRegistered === opt.v ? 'border-rose-700 bg-rose-700' : 'border-gray-300 group-hover:border-rose-400')}>
                    {taxRegistered === opt.v && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{opt.l}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { k: 'customerName', l: 'اسم العميل',         req: true,  ph: 'شركة النور للتجارة' },
              { k: 'phone',        l: 'هاتف',                req: false, ph: '0841234567'          },
              { k: 'mobile',       l: 'جوال',                req: false, ph: '01012345678'         },
              { k: 'taxNumber',    l: 'الرقم الضريبي',       req: false, ph: '302-456-789'         },
              { k: 'address',      l: 'العنوان',             req: false, ph: 'شارع الجمهورية'      },
              { k: 'city',         l: 'المدينة',             req: false, ph: 'الفيوم'              },
              { k: 'state',        l: 'المحافظة / الولاية',  req: false, ph: 'الفيوم'              },
              { k: 'postalCode',   l: 'الرمز البريدي',       req: false, ph: '63511'               },
            ].map(({ k, l, req, ph }) => (
              <Field key={k} label={l} required={req}>
                <input className={inputCls} value={form[k]} placeholder={ph}
                  onChange={e => set(k, e.target.value)} />
              </Field>
            ))}
          </div>

          <div className="flex justify-start pt-2">
            <button onClick={handleSubmit} disabled={loading}
              className="flex items-center gap-2 bg-rose-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-800 transition-colors shadow-sm disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {loading ? 'جاري الإضافة...' : 'إضافة العميل'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function CreateSalesInvoice() {
  const toast = useToast();

  // ── Customers ──────────────────────────────────────────────────────────────
  const [productsList, setProductsList] = useState([]);
const [productsLoading, setProductsLoading] = useState(false);
  const [customers,        setCustomers]        = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [showAddCustomer,  setShowAddCustomer]  = useState(false);
  const [customerDisabled, setCustomerDisabled] = useState(false);

  const fetchCustomers = useCallback(() => {
    setCustomersLoading(true);
    fetch('http://takamulerp.runasp.net/Customer')
      .then(res => res.json())
      .then(data => {
        // API returns flat array: [{ id, customerName, phone, city, ... }, ...]
        setCustomers(Array.isArray(data) ? data : []);
        setCustomersLoading(false);
      })
      .catch(err => {
        console.error('Error loading customers:', err);
        toast.add('فشل تحميل العملاء', 'error');
        setCustomersLoading(false);
      });
  }, []); // eslint-disable-line


  const fetchProducts = useCallback(() => {
  setProductsLoading(true);

  fetch('http://takamulerp.runasp.net/Products')
    .then(res => res.json())
    .then(data => {
      setProductsList(Array.isArray(data) ? data : []);
      setProductsLoading(false);
    })
    .catch(err => {
      console.error('Error loading products:', err);
      toast.add('فشل تحميل الأصناف', 'error');
      setProductsLoading(false);
    });

}, []);
useEffect(() => {
  fetchCustomers();
  fetchProducts();
}, []);
  // ── Form ───────────────────────────────────────────────────────────────────
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    date:            new Date().toLocaleString('ar-SA'),
    refNo:           '',
    cashier:         '',
    branch:          '',
    warehouseId:     '1',
    customerId:      '',
    delegate:        'عام',
    poNumber:        '',
    projectName:     '',
    shippingAddress: '',
    discount:        '0',
    status:          'completed',
    dueDate:         '',
    notes:           '',
  });
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Derive selected customer object for info strip
  const selectedCustomer = customers.find(c => String(c.id) === String(form.customerId)) ?? null;

  // ── Payments ───────────────────────────────────────────────────────────────
  const [payments, setPayments] = useState([{ amount: '0', method: 'شبكة' }]);
  const addPayment = ()        => setPayments(p => [...p, { amount: '0', method: 'شبكة' }]);
  const removePay  = i         => payments.length > 1 && setPayments(p => p.filter((_, idx) => idx !== i));
  const updatePay  = (i, k, v) => { const p = [...payments]; p[i][k] = v; setPayments(p); };

  // ── Products — starts EMPTY (no mock data) ─────────────────────────────────
  const [products, setProducts] = useState([]);
  const addProduct    = p          => setProducts(prev => [...prev, p]);
  const deleteProduct = id         => setProducts(p => p.filter(pr => pr.id !== id));
  const updateProduct = (id, k, v) => setProducts(p => p.map(pr => pr.id === id ? { ...pr, [k]: Number(v) } : pr));

  // ── Calculations ───────────────────────────────────────────────────────────
  const calcNoVat   = p => { const b = p.qty * p.priceNoVat; return b - b * (p.discountPct / 100); };
  const calcTotal   = p => { const n = calcNoVat(p); return n + n * (p.tax / 100); };
  const subtotal    = products.reduce((s, p) => s + calcNoVat(p), 0);
  const totalTax    = products.reduce((s, p) => s + calcNoVat(p) * (p.tax / 100), 0);
  const discountAmt = Number(form.discount) || 0;
  const grandTotal  = subtotal + totalTax - discountAmt;
  const totalPaid   = payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
  const remaining   = grandTotal - totalPaid;

  // ── Submit ─────────────────────────────────────────────────────────────────
const handleSubmit = async e => {
    e?.preventDefault();
    if (!form.customerId)      { toast.add('يرجى اختيار العميل', 'error'); return; }
    if (!form.warehouseId)     { toast.add('يرجى تحديد المستودع', 'error'); return; }
    if (products.length === 0) { toast.add('يرجى إضافة منتج واحد على الأقل', 'error'); return; }

    setSubmitting(true);
    try {
      const body = {
        customerId:      Number(form.customerId),
        orderDate:       new Date().toISOString(),
        warehouseId:     Number(form.warehouseId),
        shippingAddress: form.shippingAddress || '',
        notes:           form.notes || '',
        items: products.map(p => ({
          productId:          Number(p.productId),
          unitId:             Number(p.unitId) || 1,
          quantity:           Number(p.qty),
          unitPrice:          Number(p.priceNoVat),
          discountPercentage: Number(p.discountPct) || 0,
          discountValue:      0,
          taxPercentage:      Number(p.tax) || 14,
        })),
      };

      console.log('📤 Sending to API:', JSON.stringify(body, null, 2)); // للـ debug

      const res = await fetch('http://takamulerp.runasp.net/SalesOrders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`خطأ ${res.status}: ${errText || res.statusText}`);
      }

      toast.add('تم إنشاء الفاتورة بنجاح ✓', 'success');
      setProducts([]);
      setPayments([{ amount: '0', method: 'شبكة' }]);
      setForm(f => ({ ...f, refNo: '', notes: '', discount: '0', dueDate: '', shippingAddress: '', customerId: '' }));

    } catch (e) {
      toast.add(`فشل حفظ الفاتورة: ${e.message}`, 'error');
      console.error('❌ API Error:', e);
    } finally { 
      setSubmitting(false); 
    }
  };

  const handleReset = () => {
    setProducts([]);
    setPayments([{ amount: '0', method: 'شبكة' }]);
    setForm(f => ({ ...f, refNo: '', notes: '', discount: '0', dueDate: '', shippingAddress: '', customerId: '' }));
    toast.add('تم إعادة تعيين النموذج', 'info');
  };

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-5 space-y-5">

      {/* BREADCRUMB */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <span className="hover:text-rose-900 cursor-pointer transition-colors">الرئيسية</span>
        <ChevronRight size={12} className="rotate-180 text-gray-300" />
        <span className="hover:text-rose-900 cursor-pointer transition-colors">المبيعات</span>
        <ChevronRight size={12} className="rotate-180 text-gray-300" />
        <span className="text-gray-700 font-semibold">إضافة فاتورة مبيعات</span>
      </div>

      {/* PAGE HEADER */}
      <div className="bg-gradient-to-l from-rose-900 to-rose-700 rounded-2xl px-7 py-5 flex justify-between items-center shadow-lg shadow-rose-900/20">
        <div className="hidden md:flex items-center gap-2">
          {[
            { label: 'الإجمالي', value: grandTotal.toFixed(2), ex: '' },
            { label: 'مدفوع',   value: totalPaid.toFixed(2),  ex: '' },
            { label: 'المتبقي', value: remaining.toFixed(2),  ex: remaining > 0 ? 'bg-rose-500/40' : '' },
          ].map(s => (
            <div key={s.label} className={cn('rounded-xl px-3.5 py-2 text-center min-w-[80px] bg-white/15', s.ex)}>
              <p className="text-[10px] text-white/60 leading-none mb-0.5">{s.label}</p>
              <p className="text-sm font-black text-white">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 text-white">
          <div className="text-right">
            <p className="text-xs text-white/60 leading-none mb-0.5">إنشاء سجل جديد</p>
            <h1 className="text-xl font-black leading-none">فاتورة مبيعات A4</h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
            <Receipt size={22} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── SECTION 1 ───────────────────────────────────────────────────── */}
        <Section title="بيانات الفاتورة" icon={<FileText size={16} />} accent="rose">
          <p className="text-xs text-rose-700/70">
            الحقول المميزة بـ <span className="text-rose-600 font-bold">*</span> إلزامية
          </p>    
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="التاريخ" icon={<Calendar size={12} />}>
              <input value={form.date} readOnly className={cn(inputCls, 'bg-gray-50 cursor-default text-gray-500')} />
            </Field>
            <Field label="الرقم المرجعي" icon={<Hash size={12} />}>
              <input value={form.refNo} onChange={e => setF('refNo', e.target.value)} className={inputCls} placeholder="اختياري" />
            </Field>
            <Field label="كاشير" required>
              <input value={form.cashier} onChange={e => setF('cashier', e.target.value)} className={inputCls} placeholder="اسم الكاشير" />
            </Field>
          </div>
        </Section>

        {/* ── SECTION 2 ───────────────────────────────────────────────────── */}
        <Section title="العميل والفرع" icon={<Building2 size={16} />} accent="amber">
          <p className="text-xs text-amber-700/70 font-medium">برجاء تحديث هذه الخيارات قبل إضافة أي منتج</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <Field label="الفرع" required>
              <input value={form.branch} onChange={e => setF('branch', e.target.value)} className={inputCls} placeholder="اسم الفرع / المستودع" />
            </Field>

            {/* ── Customer Dropdown ─────────────────────────────────────── */}
            <Field label="عميل" required>
              <div className="space-y-2">
                <div className="flex gap-1.5">
                  <div className="relative flex-1">
                    <select
                      value={form.customerId}
                      onChange={e => setF('customerId', e.target.value)}
                      disabled={customerDisabled || customersLoading}
                      className={cn(
                        selectCls, 'appearance-none pr-3.5 pl-9',
                        (customerDisabled || customersLoading) && 'bg-gray-50 opacity-70 cursor-not-allowed'
                      )}
                    >
                      <option value="">
                        {customersLoading
                          ? 'جاري التحميل...'
                          : customers.length === 0
                            ? '— لا يوجد عملاء —'
                            : `— اختر عميلاً (${customers.length}) —`}
                      </option>
                      {/* ✅ customerName is the correct field from GET /Customer */}
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.customerName ?? c.name ?? `عميل #${c.id}`}
                        </option>
                      ))}
                    </select>
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      {customersLoading
                        ? <Loader2 size={14} className="animate-spin text-rose-400" />
                        : <ChevronDown size={14} />}
                    </span>
                  </div>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
                    <button type="button" onClick={() => setShowAddCustomer(true)}
                      title="إضافة عميل جديد"
                      className="px-2.5 py-2.5 text-rose-800 hover:bg-rose-50 border-l border-gray-100 transition-colors">
                      <Plus size={15} />
                    </button>
                    <button type="button" onClick={fetchCustomers}
                      title="تحديث قائمة العملاء"
                      className="px-2.5 py-2.5 text-rose-800 hover:bg-rose-50 border-l border-gray-100 transition-colors">
                      <RotateCcw size={13} className={customersLoading ? 'animate-spin' : ''} />
                    </button>
                    <button type="button" onClick={() => setCustomerDisabled(v => !v)}
                      title={customerDisabled ? 'تفعيل' : 'تعطيل'}
                      className={cn('px-2.5 py-2.5 transition-colors',
                        customerDisabled ? 'text-rose-800 hover:bg-rose-50' : 'text-gray-300 hover:bg-gray-50')}>
                      {customerDisabled ? <Eye size={15} /> : <Pencil size={15} />}
                    </button>
                  </div>
                </div>

                {/* Selected customer info strip */}
                {selectedCustomer && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-amber-50/80 rounded-xl border border-amber-100 px-3 py-2.5 flex items-center justify-end gap-3 flex-wrap">
                    {selectedCustomer.phone && (
                      <span className="text-[11px] text-amber-600 font-mono">{selectedCustomer.phone}</span>
                    )}
                    {selectedCustomer.city && (
                      <span className="text-[11px] text-amber-500">{selectedCustomer.city}</span>
                    )}
                    <span className="text-xs font-bold text-amber-800">{selectedCustomer.customerName}</span>
                  </motion.div>
                )}
              </div>
            </Field>

            <Field label="المندوب / الموظف" required>
              <select value={form.delegate} onChange={e => setF('delegate', e.target.value)} className={selectCls}>
                <option value="عام">عام</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="اسم المشروع">
              <input value={form.projectName} onChange={e => setF('projectName', e.target.value)} className={inputCls} placeholder="اختياري" />
            </Field>
            <Field label="رقم أمر الشراء" icon={<Hash size={12} />}>
              <input value={form.poNumber} onChange={e => setF('poNumber', e.target.value)} className={inputCls} placeholder="PO-XXXX" />
            </Field>
            <Field label="عنوان الشحن">
              <input value={form.shippingAddress} onChange={e => setF('shippingAddress', e.target.value)} className={inputCls} placeholder="المدينة - الحي" />
            </Field>
          </div>
        </Section>

        {/* ── SECTION 3 ───────────────────────────────────────────────────── */}
        <Section title="الأصناف" icon={<Package size={16} />} accent="slate">
          <ProductSearchInput onAdd={addProduct} toast={toast} />

          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm text-right border-collapse min-w-[860px]">
              <thead>
                <tr className="bg-gradient-to-l from-gray-800 to-gray-700 text-white text-xs">
                  {['', 'صنف (كود - اسم)', 'سعر بدون ضريبة', 'سعر بالضريبة', 'الكمية', 'خصم %', 'إجمالي بدون ضريبة', 'الإجمالي (SR)'].map((h, i) => (
                    <th key={i} className={cn('px-3 py-3.5 font-semibold border-l border-white/10 last:border-0',
                      i === 0 ? 'w-10 text-center' : i >= 2 ? 'text-center' : '')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-14 text-center">
                      <ShoppingCart size={32} className="mx-auto mb-2 text-gray-200" />
                      <p className="text-sm text-gray-300 font-medium">ابحث بالباركود أو اسم الصنف لإضافة منتجات</p>
                    </td>
                  </tr>
                ) : products.map((p, idx) => (
                  <tr key={p.id}
                    className={cn('border-b border-gray-50 last:border-0 group transition-colors',
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40', 'hover:bg-rose-50/20')}>
                    <td className="px-3 py-3 text-center border-l border-gray-100">
                      <button type="button" onClick={() => deleteProduct(p.id)}
                        className="w-7 h-7 rounded-lg bg-rose-50 text-rose-300 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center mx-auto transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 size={13} />
                      </button>
                    </td>
                    <td className="px-4 py-3 border-l border-gray-100 max-w-[200px]">
                      <span className="text-gray-700 text-xs font-medium truncate block">{p.name}</span>
                    </td>
                    <td className="px-3 py-3 border-l border-gray-100 text-center">
                      <input type="number" value={p.priceNoVat} min="0"
                        onChange={e => updateProduct(p.id, 'priceNoVat', e.target.value)}
                        className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center outline-none focus:border-rose-400 bg-white" />
                    </td>
                    <td className="px-3 py-3 border-l border-gray-100 text-center">
                      <input type="number" value={(p.priceNoVat * (1 + p.tax / 100)).toFixed(2)} readOnly
                        className="w-24 border border-gray-100 rounded-lg px-2 py-1.5 text-xs text-center bg-gray-50 text-gray-400 cursor-default" />
                    </td>
                    <td className="px-3 py-3 border-l border-gray-100 text-center">
                      <input type="number" value={p.qty} min="1"
                        onChange={e => updateProduct(p.id, 'qty', e.target.value)}
                        className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center outline-none focus:border-rose-400 bg-white font-bold" />
                    </td>
                    <td className="px-3 py-3 border-l border-gray-100 text-center">
                      <input type="number" value={p.discountPct} min="0" max="100"
                        onChange={e => updateProduct(p.id, 'discountPct', e.target.value)}
                        className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center outline-none focus:border-rose-400 bg-white" />
                    </td>
                    <td className="px-3 py-3 border-l border-gray-100 text-center text-gray-600 text-xs font-medium">
                      {calcNoVat(p).toFixed(2)}
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-gray-800 text-xs">
                      {calcTotal(p).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              {products.length > 0 && (
                <tfoot>
                  <tr className="bg-gray-800 text-white text-xs font-bold">
                    <td colSpan={4} className="px-4 py-3 text-right border-l border-white/10">المجموع الكلي</td>
                    <td className="px-4 py-3 text-center border-l border-white/10">
                      {products.reduce((s, p) => s + p.qty, 0)}
                    </td>
                    <td className="px-4 py-3 border-l border-white/10" />
                    <td className="px-4 py-3 text-center border-l border-white/10">{subtotal.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">{(subtotal + totalTax).toFixed(2)}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </Section>

        {/* ── SECTION 4 ───────────────────────────────────────────────────── */}
        <Section title="المدفوعات وإعدادات الفاتورة" icon={<CreditCard size={16} />} accent="emerald">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="الخصم (SR)" icon={<Percent size={12} />}>
              <input type="number" value={form.discount} onChange={e => setF('discount', e.target.value)} className={inputCls} min="0" />
            </Field>
            <Field label="حالة الفاتورة" required>
              <select value={form.status} onChange={e => setF('status', e.target.value)} className={selectCls}>
                <option value="completed">مكتملة</option>
                <option value="pending">معلقة</option>
              </select>
            </Field>
            <Field label="أجل الاستحقاق" icon={<Calendar size={12} />}>
              <input type="text" value={form.dueDate} onChange={e => setF('dueDate', e.target.value)} className={inputCls} placeholder="مثال: 30 يوم" />
            </Field>
          </div>

          <div className="space-y-3">
            {payments.map((pay, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="relative grid grid-cols-1 md:grid-cols-2 gap-5 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                {i > 0 && (
                  <button type="button" onClick={() => removePay(i)}
                    className="absolute -top-2.5 -left-2.5 bg-rose-600 text-white rounded-full p-1 hover:bg-rose-700 shadow-md transition-all">
                    <X size={13} />
                  </button>
                )}
                <Field label={`المبلغ المدفوع${i > 0 ? ` (${i + 1})` : ''}`} icon={<DollarSign size={12} />}>
                  <input type="number" value={pay.amount} onChange={e => updatePay(i, 'amount', e.target.value)} className={inputCls} min="0" />
                </Field>
                <Field label="طريقة الدفع" required>
                  <select value={pay.method} onChange={e => updatePay(i, 'method', e.target.value)} className={selectCls}>
                    <option value="شبكة">شبكة (مدى / VISA)</option>
                    <option value="نقدي">نقدي</option>
                    <option value="تحويل">تحويل بنكي</option>
                    <option value="آجل">آجل</option>
                  </select>
                </Field>
              </motion.div>
            ))}
          </div>

          <button type="button" onClick={addPayment}
            className="w-full border-2 border-dashed border-emerald-200 text-emerald-700 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 hover:border-emerald-300 transition-all flex items-center justify-center gap-2">
            <Plus size={16} /> إضافة طريقة دفع أخرى
          </button>

          <div className="bg-gray-900 rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { l: 'المجموع بدون ضريبة', v: subtotal.toFixed(2),          c: 'text-white' },
              { l: 'إجمالي الضريبة',      v: totalTax.toFixed(2),          c: 'text-amber-400' },
              { l: 'الخصم',               v: `-${discountAmt.toFixed(2)}`, c: 'text-rose-400' },
              { l: 'الإجمالي النهائي',    v: grandTotal.toFixed(2),        c: 'text-emerald-400', big: true },
            ].map(s => (
              <div key={s.l} className="space-y-1">
                <p className="text-[10px] text-gray-500 font-medium">{s.l}</p>
                <p className={cn('font-black', s.c, s.big ? 'text-xl' : 'text-base')}>{s.v}</p>
                <p className="text-[10px] text-gray-600">ر.س</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── SECTION 5 ───────────────────────────────────────────────────── */}
        <Section title="ملاحظات" icon={<StickyNote size={16} />} accent="slate">
          <textarea value={form.notes} onChange={e => setF('notes', e.target.value)}
            className={cn(inputCls, 'h-28 resize-none')} placeholder="ملاحظات إضافية على الفاتورة..." />
        </Section>

        {/* ── ACTIONS ─────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex flex-wrap items-center justify-end gap-3">
          <button type="button" onClick={handleReset}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
            <RotateCcw size={15} /> إعادة تعيين
          </button>
          <button type="button"
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
            <Eye size={15} /> معاينة الفاتورة
          </button>
          <button type="submit" disabled={submitting}
            className="flex items-center gap-2 bg-rose-900 text-white px-7 py-2.5 rounded-xl text-sm font-bold hover:bg-rose-800 transition-colors shadow-sm shadow-rose-900/30 disabled:opacity-60">
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {submitting ? 'جاري الحفظ...' : 'اتمام العملية'}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {showAddCustomer && (
          <AddCustomerModal
            onClose={() => setShowAddCustomer(false)}
            onAdded={data => {
              fetchCustomers(); // reload list
              if (data?.id) setF('customerId', String(data.id)); // auto-select
            }}
            toast={toast}
          />
        )}
      </AnimatePresence>

      <Toasts toasts={toast.toasts} remove={toast.remove} />
    </div>
  );
}