import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Printer,
  FileText,
  Search,
  ChevronDown,
  Edit,
  Plus,
  Upload,
  Barcode,
  Trash2,
  X,
  Copy,
  DollarSign,
  Menu,
  PlusCircle,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useProducts, Product } from '../context/ProductsContext';
import ProductDetailsModal from '../components/ProductDetailsModal';

export default function ProductsList() {
  const navigate = useNavigate();
  const { t, direction } = useLanguage();
  const { products, addProduct, deleteProduct, deleteMultipleProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [showPriceUpdate, setShowPriceUpdate] = useState(false);
  const [showBranchPrices, setShowBranchPrices] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number, left: number } | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const bulkActionsRef = useRef<HTMLDivElement>(null);

  const productsList = products;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionId(null);
        setMenuPosition(null);
      }
      if (bulkActionsRef.current && !bulkActionsRef.current.contains(event.target as Node)) {
        setShowBulkActions(false);
      }
    };

    const handleScroll = () => {
      if (openActionId !== null) {
        setOpenActionId(null);
        setMenuPosition(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { capture: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [openActionId]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(productsList.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id: number) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pId => pId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      alert(direction === 'rtl' ? 'يرجى اختيار أصناف أولاً' : 'Please select items first');
      return;
    }

    const confirmMsg = direction === 'rtl'
      ? `هل أنت متأكد من حذف ${selectedProducts.length} صنف؟`
      : `Are you sure you want to delete ${selectedProducts.length} items?`;

    if (window.confirm(confirmMsg)) {
      await deleteMultipleProducts(selectedProducts);
      setSelectedProducts([]);
      setShowBulkActions(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const confirmMsg = direction === 'rtl'
      ? 'هل أنت متأكد من حذف هذا الصنف؟'
      : 'Are you sure you want to delete this product?';

    if (window.confirm(confirmMsg)) {
      await deleteProduct(id);
      setOpenActionId(null);
      setMenuPosition(null);
    }
  };

  const handleDuplicateProduct = async (product: Product) => {
    const { id, ...productData } = product;
    try {
      await addProduct({
        ...productData,
        name: `${product.name} ${t('copy_suffix')}`,
        code: `${product.code}-copy`
      });
    } catch (err) {
      console.error(err);
      alert(direction === 'rtl' ? 'فشل نسخ الصنف' : 'Failed to duplicate product');
    }
    setOpenActionId(null);
    setMenuPosition(null);
  };

  const toggleActionMenu = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (openActionId === id) {
      setOpenActionId(null);
      setMenuPosition(null);
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setOpenActionId(id);

      // In RTL, we want the right edge of the menu to align with the right edge of the button
      // Menu width is w-48 (192px)
      const menuWidth = 192;
      const left = direction === 'rtl'
        ? rect.right - menuWidth
        : rect.left;

      setMenuPosition({
        top: rect.bottom + 5,
        left: Math.max(10, left) // Ensure it doesn't go off-screen
      });
    }
  };

  return (
    <div className="space-y-4" onClick={() => { setOpenActionId(null); setMenuPosition(null); }}>
      {/* Price Update Notification */}
      <AnimatePresence>
        {showPriceUpdate && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPriceUpdate(false)}
              className={`absolute top-2 text-blue-400 hover:text-blue-600 ${direction === 'rtl' ? 'left-2' : 'right-2'}`}
            >
              <X size={18} />
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <Upload size={24} />
              </div>
              <div className={`flex-1 text-center ${direction === 'rtl' ? 'sm:text-right' : 'sm:text-left'}`}>
                <h3 className="font-bold text-blue-800">{t('update_prices_title')}</h3>
                <p className="text-sm text-blue-600">{t('update_prices_desc')}</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <label className="flex-1 sm:flex-none cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                  <Upload size={16} />
                  {t('choose_file')}
                  <input type="file" className="hidden" accept=".xlsx,.xls,.csv" />
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span>{t('home')}</span>
        <span>/</span>
        <span className="text-gray-800 dark:text-black font-medium">{t('products')}</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-black flex items-center gap-2">
            {t('products_all_branches')}
            <PlusCircle size={20} className="text-primary" />
          </h1>
          <div className="relative" ref={bulkActionsRef}>
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="p-2 bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Menu size={20} />
            </button>

            <AnimatePresence>
              {showBulkActions && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-[60] overflow-hidden ${direction === 'rtl' ? 'left-0' : 'right-0'}`}
                >
                  <div className="py-1">
                    <button
                      onClick={() => { navigate('/products/create'); setShowBulkActions(false); }}
                      className={`w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 ${direction === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <PlusCircle size={18} className="text-gray-500" />
                      <span className="flex-1">إضافة الصنف</span>
                    </button>

                    <button
                      onClick={() => { setShowPriceUpdate(true); setShowBulkActions(false); }}
                      className={`w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 ${direction === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <FileSpreadsheet size={18} className="text-gray-500" />
                      <span className="flex-1">تحديث الأسعار</span>
                    </button>

                    <button
                      onClick={() => { navigate('/products/barcode'); setShowBulkActions(false); }}
                      className={`w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 ${direction === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <Printer size={18} className="text-gray-500" />
                      <span className="flex-1">طباعة باركود - الملصقات</span>
                    </button>

                    <button
                      onClick={() => { alert('Exporting to Excel...'); setShowBulkActions(false); }}
                      className={`w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 ${direction === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <Download size={18} className="text-gray-500" />
                      <span className="flex-1">تصدير إلى ملف Excel</span>
                    </button>

                    <button
                      onClick={() => { handleBulkDelete(); setShowBulkActions(false); }}
                      disabled={selectedProducts.length === 0}
                      className={`w-full px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${selectedProducts.length === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'} ${direction === 'rtl' ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <Trash2 size={18} className={selectedProducts.length === 0 ? 'text-gray-300' : 'text-red-500'} />
                      <span className="flex-1">حذف الأصناف {selectedProducts.length > 0 && `(${selectedProducts.length})`}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-black mt-1">{t('products_table_desc')}</p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 min-h-[400px]">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-black">
            <span>{t('show')}</span>
            <select className="border border-gray-300 rounded px-2 py-1 outline-none focus:border-primary text-black">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder={t('search_placeholder')}
              className={`w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary text-black ${direction === 'rtl' ? 'pr-8' : 'pl-8'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${direction === 'rtl' ? 'right-2' : 'left-2'}`} size={16} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className={`w-full min-w-[1200px] text-sm ${direction === 'rtl' ? 'text-right' : 'text-left'} border-collapse`}>
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 border border-primary-hover w-10 text-center whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded w-4 h-4 accent-white"
                    checked={selectedProducts.length === productsList.length && productsList.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-3 border border-primary-hover whitespace-nowrap">{t('image')}</th>
                <th className="p-3 border border-primary-hover whitespace-nowrap">{t('product_code')}</th>
                <th className="p-3 border border-primary-hover whitespace-nowrap">{t('name')}</th>

                <th className="p-3 border border-primary-hover whitespace-nowrap">{t('main_categories')}</th>
                <th className="p-3 border border-primary-hover whitespace-nowrap">{t('cost')}</th>
                <th className="p-3 border border-primary-hover whitespace-nowrap">{t('selling_price')}</th>
                <th className="p-3 border border-primary-hover whitespace-nowrap">{t('quantity')}</th>
                <th className="p-3 border border-primary-hover whitespace-nowrap">{t('unit')}</th>
                <th className="p-3 border border-primary-hover whitespace-nowrap">{t('stock_alerts')}</th>
                <th className="p-3 border border-primary-hover w-24 whitespace-nowrap">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="dark:text-black">
              {productsList.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 text-gray-700 dark:text-black cursor-pointer" onClick={() => setSelectedProductDetails(product)}>
                  <td className="p-2 border border-gray-200 text-center whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="rounded w-4 h-4 accent-primary"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                  </td>
                  <td className="p-2 border border-gray-200 text-center whitespace-nowrap">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-8 h-8 object-cover mx-auto rounded" />
                    ) : (
                      <div className="w-8 h-8 bg-gray-100 mx-auto rounded flex items-center justify-center text-gray-400">
                        <FileText size={16} />
                      </div>
                    )}
                  </td>
                  <td className="p-2 border border-gray-200 whitespace-nowrap">{product.code}</td>
                  <td className="p-2 border border-gray-200 font-medium whitespace-nowrap">{product.name}</td>

                  <td className="p-2 border border-gray-200 whitespace-nowrap">{product.category}</td>
                  <td className="p-2 border border-gray-200 font-bold whitespace-nowrap">{product.cost}</td>
                  <td className="p-2 border border-gray-200 font-bold whitespace-nowrap">{product.price}</td>
                  <td className="p-2 border border-gray-200 whitespace-nowrap" dir="ltr">{product.quantity}</td>
                  <td className="p-2 border border-gray-200 whitespace-nowrap">{product.unit}</td>
                  <td className="p-2 border border-gray-200 whitespace-nowrap">{product.alertQuantity}</td>
                  <td className="p-2 border border-gray-200 text-center whitespace-nowrap">
                    <button
                      onClick={(e) => toggleActionMenu(product.id, e)}
                      className="bg-primary text-white px-2 py-1 rounded text-xs flex items-center gap-1 mx-auto hover:bg-primary-hover transition-colors"
                    >
                      {t('actions')}
                      <ChevronDown size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 text-sm text-gray-600">
          <div>
            {t('showing_records')} 1 {t('to')} {productsList.length} {t('of')} {productsList.length} {t('records')}
          </div>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>{t('previous')}</button>
            <button className="px-3 py-1 bg-primary text-white rounded border border-primary">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50" disabled>{t('next')}</button>
          </div>
        </div>
      </div>

      {/* Floating Action Menu */}
      <AnimatePresence>
        {openActionId !== null && menuPosition && (
          <motion.div
            ref={actionMenuRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className={`fixed bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden w-48 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
            style={{ top: menuPosition.top, left: menuPosition.left }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const product = productsList.find(p => p.id === openActionId);
              if (!product) return null;
              return (
                <>
                  <button
                    onClick={() => handleDuplicateProduct(product)}
                    className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 ${direction === 'rtl' ? 'justify-end' : 'justify-start'}`}
                  >
                    {direction === 'rtl' ? (
                      <>
                        <span>{t('duplicate_product')}</span>
                        <Copy size={14} className="text-gray-500" />
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="text-gray-500" />
                        <span>{t('duplicate_product')}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => navigate('/products/create')}
                    className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 ${direction === 'rtl' ? 'justify-end' : 'justify-start'}`}
                  >
                    {direction === 'rtl' ? (
                      <>
                        <span>{t('edit_product')}</span>
                        <Edit size={14} className="text-gray-500" />
                      </>
                    ) : (
                      <>
                        <Edit size={14} className="text-gray-500" />
                        <span>{t('edit_product')}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => navigate('/products/barcode')}
                    className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 ${direction === 'rtl' ? 'justify-end' : 'justify-start'}`}
                  >
                    {direction === 'rtl' ? (
                      <>
                        <span>{t('print_barcode_labels')}</span>
                        <Printer size={14} className="text-gray-500" />
                      </>
                    ) : (
                      <>
                        <Printer size={14} className="text-gray-500" />
                        <span>{t('print_barcode_labels')}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => { setShowBranchPrices(product); setOpenActionId(null); }}
                    className={`w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 ${direction === 'rtl' ? 'justify-end' : 'justify-start'}`}
                  >
                    {direction === 'rtl' ? (
                      <>
                        <span>{t('branch_prices')}</span>
                        <DollarSign size={14} className="text-gray-500" />
                      </>
                    ) : (
                      <>
                        <DollarSign size={14} className="text-gray-500" />
                        <span>{t('branch_prices')}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className={`w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 ${direction === 'rtl' ? 'justify-end' : 'justify-start'}`}
                  >
                    {direction === 'rtl' ? (
                      <>
                        <span>{t('delete_product')}</span>
                        <Trash2 size={14} className="text-red-500" />
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} className="text-red-500" />
                        <span>{t('delete_product')}</span>
                      </>
                    )}
                  </button>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Branch Prices Modal */}
      <AnimatePresence>
        {showBranchPrices && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden"
              dir={direction}
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowBranchPrices(null)} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                  <h2 className="text-lg font-bold text-red-700">
                    {showBranchPrices.name} - {t('branch_prices')}
                  </h2>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  <Printer size={16} />
                  {t('print')}
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="w-full md:w-64">
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-primary text-sm">
                      <option>شركة دقة الحلول</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="available" className="w-4 h-4 accent-blue-600" defaultChecked />
                    <label htmlFor="available" className="text-sm font-bold text-red-700 cursor-pointer">
                      {t('product_available_in_branch')}
                    </label>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-red-800 text-white">
                        <th className="p-3 border border-red-900">{t('branch')}</th>
                        <th className="p-3 border border-red-900">{t('unit')}</th>
                        <th className="p-3 border border-red-900">{t('internal_units_count')}</th>
                        <th className="p-3 border border-red-900">{t('barcode')}</th>
                        <th className="p-3 border border-red-900">{t('selling_price')}</th>
                        <th className="p-3 border border-red-900">{t('wholesale_price')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-center">
                        <td className="p-3 border border-gray-200 text-red-700 font-medium">شركة دقة الحلول</td>
                        <td className="p-3 border border-gray-200 text-red-700 font-medium">{showBranchPrices.unit}</td>
                        <td className="p-3 border border-gray-200 text-red-700 font-medium">1</td>
                        <td className="p-3 border border-gray-200 text-red-700 font-medium">{showBranchPrices.code}</td>
                        <td className="p-3 border border-gray-200">
                          <input
                            type="text"
                            defaultValue={showBranchPrices.price}
                            className="w-24 border border-gray-300 rounded px-2 py-1 text-center outline-none focus:border-primary"
                          />
                        </td>
                        <td className="p-3 border border-gray-200">
                          <input
                            type="text"
                            defaultValue="0.00"
                            className="w-24 border border-gray-300 rounded px-2 py-1 text-center outline-none focus:border-primary"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className={`flex ${direction === 'rtl' ? 'justify-start' : 'justify-end'}`}>
                  <button
                    onClick={() => {
                      navigate('/products/create');
                      setShowBranchPrices(null);
                    }}
                    className="bg-red-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-900 transition-colors"
                  >
                    {t('edit_product_btn')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ProductDetailsModal
        isOpen={!!selectedProductDetails}
        onClose={() => setSelectedProductDetails(null)}
        product={selectedProductDetails}
        onDelete={(id) => {
          handleDeleteProduct(id);
          setSelectedProductDetails(null);
        }}
        onEdit={(id) => {
          navigate(`/products/create`);
          setSelectedProductDetails(null);
        }}
        onPrintPDF={() => alert('Printing PDF...')}
        onPrintBarcode={() => {
          navigate('/products/barcode');
          setSelectedProductDetails(null);
        }}
      />
    </div>
  );
}
