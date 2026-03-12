import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { FileText, Search, ChevronDown, List as ListIcon, FileSpreadsheet, Truck, X, Edit, Trash2, Download, Printer } from 'lucide-react';

interface DeliveryRecord {
  id: string;
  date: string;
  deliveryRef: string;
  saleRef: string;
  customer: string;
  address: string;
  status: 'working' | 'received';
}

const MOCK_DELIVERIES: DeliveryRecord[] = [
  {
    id: '1',
    date: '03:44:00 24/02/2026',
    deliveryRef: 'DO2026/02/0004',
    saleRef: 'SALE/POS2026/02/0613',
    customer: 'عميل افتراضي',
    address: 'KSA Riyadh Riyadh 13248 SA\nEmail: info@posit.sa الهاتف: 00',
    status: 'working'
  },
  {
    id: '2',
    date: '18:17:00 16/09/2025',
    deliveryRef: 'DO2025/09/0003',
    saleRef: 'SALE/POS2025/09/0120',
    customer: 'عميل افتراضي',
    address: 'KSA Riyadh Riyadh 13248 SA\nEmail: info@posit.sa الهاتف: 00',
    status: 'received'
  },
  {
    id: '3',
    date: '02:21:00 20/12/2020',
    deliveryRef: 'DO2020/12/0002',
    saleRef: 'SALE2020/12/0008',
    customer: 'سعد منصور',
    address: 'KSA Riyadh ksa 1111 Egypt\nEmail: saad_ena2@hotmail.com الهاتف: 0568101255',
    status: 'received'
  }
];

export default function Deliveries() {
  const { t, direction } = useLanguage();
  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(() => {
    const saved = localStorage.getItem('takamul_deliveries');
    return saved ? JSON.parse(saved) : MOCK_DELIVERIES;
  });
  const [showCount, setShowCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryRecord | null>(null);

  const filteredDeliveries = deliveries.filter(d => 
    d.deliveryRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.saleRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActionClick = (action: string, delivery: DeliveryRecord) => {
    setActiveActionMenu(null);
    if (action === 'details') {
      setSelectedDelivery(delivery);
    } else if (action === 'edit') {
      console.log('Edit', delivery.id);
    } else if (action === 'pdf') {
      console.log('PDF', delivery.id);
    } else if (action === 'delete') {
      if (window.confirm('هل أنت متأكد من حذف هذا التسليم؟')) {
        setDeliveries(deliveries.filter(d => d.id !== delivery.id));
      }
    }
  };

  return (
    <div className="space-y-4" dir={direction}>

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1 px-2">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('sales')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">الشحن والتسليم</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
              <Truck size={20} className="text-primary" />
              <h1 className="text-lg font-bold text-primary">
                  الشحن والتسليم
              </h1>
          </div>
          <div className="flex items-center gap-1">
              <div className='relative action-menu-container'>
                <button 
                  className="p-1.5 bg-white text-gray-600 hover:bg-gray-100 rounded border border-gray-200 w-9 h-9 flex items-center justify-center transition-colors"
                  onClick={() => setActiveActionMenu(activeActionMenu === 'main' ? null : 'main')}
                >
                    <ListIcon size={18} />
                </button>
                {activeActionMenu === 'main' && (
                  <div className='absolute z-50 top-full end-0 mt-2 bg-white rounded-md shadow-xl border border-gray-100 min-w-[220px] overflow-hidden'>
                    <div className='flex flex-col'>
                      <button className='w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 border-b border-gray-50 transition-colors'>
                        <span className="text-gray-700">تصدير إلى ملف Excel</span>
                        <FileSpreadsheet size={18} className="text-green-600" />
                      </button>
                      <button className='w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 transition-colors'>
                        <span className="text-gray-700">تصدير إلى ملف pdf</span>
                        <FileText size={18} className="text-primary" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
          </div>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm text-primary mb-6 text-right font-medium">
              الرجاء استخدام الجدول أدناه للتنقل أو تصفية النتائج.
          </p>

          {/* Table Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">اظهر</span>
                  <select 
                    value={showCount}
                    onChange={(e) => setShowCount(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-primary bg-white"
                  >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                  </select>
              </div>
              <div className="relative w-full md:w-80 flex items-center gap-2">
                  <div className="relative flex-1">
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary text-right" 
                    />
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">بحث</span>
              </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto pb-64">
              <table className="w-full min-w-[1200px] text-sm text-right border-collapse">
                  <thead>
                      <tr className="bg-primary text-white">
                          <th className="p-3 border border-primary-hover w-10 text-center">
                              <input type="checkbox" className="rounded border-gray-300" />
                          </th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">التاريخ</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">الرقم المرجعي للتسليم</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">الرقم المرجعي للبيع</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">عميل</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap">العنوان</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap text-center">الحالة</th>
                          <th className="p-3 border border-primary-hover whitespace-nowrap w-24 text-center">الإجراءات</th>
                      </tr>
                  </thead>
                  <tbody>
                      {filteredDeliveries.map((delivery, index) => (
                          <tr 
                            key={`${delivery.id}-${index}`} 
                            className="hover:bg-gray-50 transition-colors border-b border-gray-200 cursor-pointer"
                            onClick={() => handleActionClick('details', delivery)}
                          >
                              <td className="p-3 text-center border-x border-gray-200" onClick={(e) => e.stopPropagation()}>
                                  <input type="checkbox" className="rounded border-gray-300" />
                              </td>
                              <td className="p-3 border-x border-gray-200">{delivery.date}</td>
                              <td className="p-3 border-x border-gray-200">{delivery.deliveryRef}</td>
                              <td className="p-3 border-x border-gray-200">{delivery.saleRef}</td>
                              <td className="p-3 border-x border-gray-200">{delivery.customer}</td>
                              <td className="p-3 border-x border-gray-200 whitespace-pre-line">{delivery.address}</td>
                              <td className="p-3 border-x border-gray-200 text-center">
                                  <span className={`px-2 py-1 rounded text-xs font-medium text-white ${delivery.status === 'working' ? 'bg-[#f0ad4e]' : 'bg-[#5cb85c]'}`}>
                                      {delivery.status === 'working' ? 'جاري العمل عليه' : 'تم الاستلام'}
                                  </span>
                              </td>
                              <td className="p-3 border-x border-gray-200 text-center relative action-menu-container" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex justify-center items-center gap-2">
                                    {delivery.status === 'received' && (
                                      <button className="text-primary hover:bg-red-50 p-1 rounded">
                                        <FileText size={16} />
                                      </button>
                                    )}
                                    <button 
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveActionMenu(activeActionMenu === delivery.id ? null : delivery.id);
                                      }}
                                      className="bg-primary text-white px-3 py-1 rounded text-xs flex items-center gap-1 mx-auto hover:bg-primary-hover transition-colors"
                                    >
                                        الإجراءات
                                        <ChevronDown size={14} />
                                    </button>
                                  </div>
                                  
                                  {activeActionMenu === delivery.id && (
                                      <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-xl z-50 py-1 text-right">
                                          <button 
                                            onClick={() => handleActionClick('details', delivery)}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                          >
                                              تفاصيل التسليم
                                              <ListIcon size={16} />
                                          </button>
                                          <button 
                                            onClick={() => handleActionClick('edit', delivery)}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                          >
                                              تعديل تسليم
                                              <Edit size={16} />
                                          </button>
                                          <button 
                                            onClick={() => handleActionClick('pdf', delivery)}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                          >
                                              تحميل بصيغة PDF
                                              <Download size={16} />
                                          </button>
                                          <button 
                                            onClick={() => handleActionClick('delete', delivery)}
                                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-end gap-2"
                                          >
                                              حذف تسليم
                                              <Trash2 size={16} />
                                          </button>
                                      </div>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
              <div className="text-sm text-gray-600">
                  عرض 1 إلى {filteredDeliveries.length} من {filteredDeliveries.length} سجلات
              </div>
              <div className="flex items-center gap-1">
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 text-sm">
                      سابق
                  </button>
                  <button className="px-3 py-1 border border-primary bg-primary text-white rounded text-sm">1</button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 text-sm">
                      التالي
                  </button>
              </div>
          </div>
      </div>

      {/* Delivery Details Modal */}
      {selectedDelivery && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
              <button 
                onClick={() => setSelectedDelivery(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm">
                <Printer size={16} />
                طباعة
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="flex justify-center mb-8">
                {/* Placeholder for cart logo */}
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
                  <Truck size={64} className="text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-4 text-sm mb-8 text-right">
                <div className="font-medium text-gray-900">{selectedDelivery.date}</div>
                <div className="text-gray-600 font-bold">التاريخ</div>
                
                <div className="font-medium text-gray-900">{selectedDelivery.deliveryRef}</div>
                <div className="text-gray-600 font-bold">الرقم المرجعي للتسليم</div>
                
                <div className="font-medium text-gray-900">{selectedDelivery.saleRef}</div>
                <div className="text-gray-600 font-bold">الرقم المرجعي للبيع</div>
                
                <div className="font-medium text-gray-900">{selectedDelivery.customer}</div>
                <div className="text-gray-600 font-bold">عميل</div>
                
                <div className="font-medium text-gray-900 whitespace-pre-line">{selectedDelivery.address}</div>
                <div className="text-gray-600 font-bold">العنوان</div>
                
                <div className="font-medium text-gray-900">{selectedDelivery.status === 'working' ? 'جاري العمل عليه' : 'تم الاستلام'}</div>
                <div className="text-gray-600 font-bold">الحالة</div>
              </div>

              <h3 className="text-primary font-bold text-right mb-4 border-b border-gray-200 pb-2">الاصناف</h3>
              
              <table className="w-full text-sm text-right mb-8">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="p-3 w-24">كمية</th>
                    <th className="p-3">وصف</th>
                    <th className="p-3 w-16">لا</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-3">003 1.00</td>
                    <td className="p-3">60990980 - عبايه كريب مع اكمام مموجه</td>
                    <td className="p-3">1</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3">003 1.00</td>
                    <td className="p-3">6666 - صنف جديد</td>
                    <td className="p-3">2</td>
                  </tr>
                </tbody>
              </table>

              <div className="grid grid-cols-3 gap-4 text-center text-primary font-bold mt-12">
                <div>
                  <div className="mb-16">تم الاستلام من قبل:</div>
                  <div className="border-t border-gray-200 pt-2">الختم أو التوقيع</div>
                </div>
                <div>
                  <div className="mb-16">تمت عمليه التوصيل من قبل:</div>
                  <div className="border-t border-gray-200 pt-2">الختم أو التوقيع</div>
                </div>
                <div>
                  <div className="mb-16">أعدها : mm .</div>
                  <div className="border-t border-gray-200 pt-2">الختم أو التوقيع</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
