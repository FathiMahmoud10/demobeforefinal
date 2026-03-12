import React, { useState, useRef, useEffect } from 'react';
import { FileText, Edit, Trash2, Printer, ChevronDown, Plus, FileSpreadsheet, Download, Menu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdjustments } from '../context/AdjustmentsContext';

const QuantityAdjustments = () => {
  const { t, direction } = useLanguage();
  const navigate = useNavigate();
  const { adjustments, deleteAdjustment } = useAdjustments();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const actionsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setShowActionsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRowClick = (adjustment: any) => {
    setSelectedAdjustment(adjustment);
    setShowDetailsModal(true);
  };

  const handleEdit = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    navigate(`/products/quantity-adjustments/edit/${id}`);
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm(direction === 'rtl' ? 'هل أنت متأكد من حذف هذا التعديل؟' : 'Are you sure you want to delete this adjustment?')) {
      deleteAdjustment(id);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(adjustments.map(a => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      alert(direction === 'rtl' ? 'يرجى اختيار عناصر أولاً' : 'Please select items first');
      return;
    }
    if (window.confirm(direction === 'rtl' ? `هل أنت متأكد من حذف ${selectedIds.length} عنصر؟` : `Are you sure you want to delete ${selectedIds.length} items?`)) {
      selectedIds.forEach(id => deleteAdjustment(id));
      setSelectedIds([]);
      setShowActionsMenu(false);
    }
  };

  return (
    <div className="space-y-4 dark:text-black">
      <div className="text-sm text-gray-500 dark:text-black/60 flex items-center gap-1">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('products')}</span>
        <span>/</span>
        <span className="text-gray-800 dark:text-black font-medium">{t('quantity_adjustments')}</span>
      </div>

      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-black">{t('quantity_adjustments')} (جميع الفروع)</h1>
          <p className="text-sm text-gray-500 dark:text-black/70 mt-1">{t('products_table_desc')}</p>
        </div>
        
        <div className="relative" ref={actionsMenuRef}>
          <button 
            onClick={() => setShowActionsMenu(!showActionsMenu)}
            className="p-2 bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Menu size={20} />
          </button>

          <AnimatePresence>
            {showActionsMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute top-full mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden ${direction === 'rtl' ? 'left-0' : 'right-0'}`}
              >
                <div className="py-1">
                  <button 
                    onClick={() => { navigate('/products/quantity-adjustments/create'); setShowActionsMenu(false); }}
                    className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 ${direction === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'}`}
                  >
                    <Plus size={16} className="text-gray-500" />
                    <span>اضافة تعديل كميات</span>
                  </button>
                  <button 
                    onClick={() => { navigate('/products/quantity-adjustments/import'); setShowActionsMenu(false); }}
                    className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 ${direction === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'}`}
                  >
                    <Plus size={16} className="text-gray-500" />
                    <span>عرض التعديل بـ CSV</span>
                  </button>
                  <button 
                    className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 ${direction === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'}`}
                  >
                    <FileSpreadsheet size={16} className="text-gray-500" />
                    <span>تصدير إلى ملف Excel</span>
                  </button>
                  <button 
                    onClick={handleBulkDelete}
                    className={`w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 ${direction === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'}`}
                  >
                    <Trash2 size={16} className="text-red-500" />
                    <span>حذف الأصناف</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 text-black">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right border-collapse">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 border border-primary/20 w-10 text-center">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedIds.length === adjustments.length && adjustments.length > 0}
                    className="rounded border-gray-300 form-checkbox accent-primary-hover"
                  />
                </th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">{t('date')}</th>
                
                <th className="p-3 border border-primary/20 whitespace-nowrap">{t('branch')}</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">{t('data_entry')}</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap">{t('note')}</th>
                <th className="p-3 border border-primary/20 whitespace-nowrap text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.map((adj) => (
                <tr key={adj.id} className="hover:bg-gray-50 transition-colors border-b border-gray-200" onClick={() => handleRowClick(adj)}>
                  <td className="p-3 text-center border-x border-gray-200" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      onChange={(e) => handleSelectOne(e, adj.id)}
                      checked={selectedIds.includes(adj.id)}
                      className="rounded border-gray-300 form-checkbox accent-primary-hover"
                    />
                  </td>
                  <td className="p-3 border-x border-gray-200 whitespace-nowrap">{adj.date}</td>
                  
                  <td className="p-3 border-x border-gray-200">{adj.branch}</td>
                  <td className="p-3 border-x border-gray-200">{adj.entry}</td>
                  <td className="p-3 border-x border-gray-200 max-w-xs truncate">{adj.note}</td>
                  <td className="p-3 border-x border-gray-200">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={(e) => handleEdit(e, adj.id)} className="p-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"><Edit size={16} /></button>
                      <button onClick={(e) => handleDelete(e, adj.id)} className="p-1.5 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showDetailsModal && selectedAdjustment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 text-black"
              onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b flex justify-between items-center bg-primary text-white rounded-t-lg">
                    <h2 className="text-lg font-semibold">مؤسسة تكامل</h2>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm bg-white text-primary px-3 py-1 rounded-md hover:bg-gray-100 transition-colors">
                            <Printer size={14} />
                            {t('print')}
                        </button>
                        <button onClick={() => setShowDetailsModal(false)} className="text-white hover:text-gray-200 transition-colors">X</button>
                    </div>
                </div>
                <div className="p-6 space-y-4 text-black">
                    <div className="flex justify-between items-start">
                        <div className="text-black">
                            <p className="text-sm font-medium">{t('date')}: {selectedAdjustment.date}</p>
                            
                        </div>
                        <div className="text-center">
                            <img src="https://picsum.photos/seed/barcode/150/50" alt="barcode" className="h-12" referrerPolicy="no-referrer" />
                        </div>
                    </div>
                    <table className="w-full text-sm text-right text-black">
                        <thead className="bg-gray-100 text-black">
                            <tr>
                                <th className="p-2">م</th>
                                <th className="p-2">وصف</th>
                                <th className="p-2">متغير</th>
                                <th className="p-2">نوع</th>
                                <th className="p-2">كمية</th>
                                <th className="p-2">التكلفة</th>
                            </tr>
                        </thead>
                        <tbody className="text-black">
                            {selectedAdjustment.items.map((item: any, index: number) => (
                              <tr key={item.id} className="border-b border-gray-100">
                                  <td className="p-2">{index + 1}</td>
                                  <td className="p-2 font-medium">{item.code} - {item.name}</td>
                                  <td className="p-2">-</td>
                                  <td className="p-2">{item.type}</td>
                                  <td className="p-2 font-bold">{item.qty}</td>
                                  <td className="p-2 font-bold">{item.cost}</td>
                              </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end">
                        <div className="w-48 text-sm text-black">
                            <div className="flex justify-between p-1 bg-gray-100 rounded-t-md">
                                <span>اجمالي الكميات</span>
                                <span className="font-bold">{selectedAdjustment.items.reduce((acc: number, item: any) => acc + parseFloat(item.qty || 0), 0)}</span>
                            </div>
                            <div className="flex justify-between p-1 bg-gray-200 rounded-b-md font-semibold">
                                <span>اجمالي التكلفة (SR)</span>
                                <span className="font-bold">{selectedAdjustment.items.reduce((acc: number, item: any) => acc + (parseFloat(item.qty || 0) * parseFloat(item.cost || 0)), 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 pt-4 border-t border-gray-100">
                        <p>مدخل البيانات: {selectedAdjustment.entry}</p>
                        <p>التاريخ: {selectedAdjustment.date}</p>
                    </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default QuantityAdjustments;
