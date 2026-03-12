import { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Trash2, 
  RefreshCw, 
  RotateCcw,
  Plus,
  Minus,
  Palette,
  Type,
  Calendar,
  DollarSign,
  Search,
  Barcode,
  PlusCircle
} from 'lucide-react';
import Layout from '../components/Layout';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../context/ProductsContext';
import MobileDataCard from '@/components/MobileDataCard';

const FormatBox = ({ title, icon: Icon, colorClass, borderColorClass, direction }: any) => {
  const { t } = useLanguage();
  const [fontSize, setFontSize] = useState(11);
  const [spacing, setSpacing] = useState(0);

  const handleFontSizeChange = (val: string) => {
    if (val === '') {
      setFontSize(0);
      return;
    }
    const num = parseInt(val);
    if (!isNaN(num)) setFontSize(num);
  };

  const handleSpacingChange = (val: string) => {
    if (val === '') {
      setSpacing(0);
      return;
    }
    const num = parseInt(val);
    if (!isNaN(num)) setSpacing(num);
  };

  return (
  <div className={`border ${borderColorClass} rounded-md p-4 bg-white`} dir={direction}>
    <div className={`flex items-center gap-2 mb-4 ${colorClass} font-medium`}>
      <Icon size={18} />
      <span>{title}</span>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="flex flex-col items-start gap-1">
        <label className="text-xs text-gray-600">{t('font_size')}</label>
        <div className="flex items-center border border-gray-300 rounded-md">
           <button 
             onClick={() => setFontSize(prev => Math.max(1, prev - 1))}
             className="px-2 py-1 hover:bg-gray-100 text-gray-600"
           >
             <Minus size={12} />
           </button>
           <input 
             type="text" 
             value={fontSize} 
             onChange={(e) => handleFontSizeChange(e.target.value)}
             className="w-10 text-center text-sm outline-none border-x border-gray-300 py-1" 
           />
           <button 
             onClick={() => setFontSize(prev => prev + 1)}
             className="px-2 py-1 hover:bg-gray-100 text-gray-600"
           >
             <Plus size={12} />
           </button>
        </div>
      </div>

      <div className="flex flex-col items-start gap-1">
        <label className="text-xs text-gray-600">{t('spacing')}</label>
        <div className="flex items-center border border-gray-300 rounded-md">
           <button 
             onClick={() => setSpacing(prev => prev - 1)}
             className="px-2 py-1 hover:bg-gray-100 text-gray-600"
           >
             <Minus size={12} />
           </button>
           <input 
             type="text" 
             value={spacing} 
             onChange={(e) => handleSpacingChange(e.target.value)}
             className="w-10 text-center text-sm outline-none border-x border-gray-300 py-1" 
           />
           <button 
             onClick={() => setSpacing(prev => prev + 1)}
             className="px-2 py-1 hover:bg-gray-100 text-gray-600"
           >
             <Plus size={12} />
           </button>
        </div>
      </div>

      <div className="flex flex-col items-start gap-1">
        <label className="text-xs text-gray-600">{t('font_color')}</label>
        <div className="flex items-center gap-2 border border-gray-300 rounded-md px-2 py-1 w-full">
           <div className="w-4 h-4 bg-black rounded-sm border border-gray-200"></div>
           <span className="text-xs text-gray-500">#000000</span>
        </div>
      </div>

      <div className="flex flex-col items-start gap-1">
        <label className="text-xs text-gray-600">{t('bg_color')}</label>
        <div className="flex items-center gap-2 border border-gray-300 rounded-md px-2 py-1 w-full">
           <div className="w-4 h-4 bg-white rounded-sm border border-gray-200"></div>
           <span className="text-xs text-gray-500">#ffffff</span>
        </div>
      </div>
    </div>
  </div>
)};

const BarcodeRow = ({ item, onRemove, onUpdateQty }: { key?: any, item: any, onRemove: () => void, onUpdateQty: (qty: number) => void }) => {
  const { t } = useLanguage();

  const handleQtyChange = (val: string) => {
    if (val === '') {
      onUpdateQty(0);
      return;
    }
    const num = parseInt(val);
    if (!isNaN(num)) onUpdateQty(num);
  };

  return (
    <tr className="border-b border-gray-200 bg-green-50/30 hover:bg-green-100/50 transition-colors">
      <td className="p-3 border border-gray-200 text-center">
        <button onClick={onRemove} className="text-red-500 hover:text-red-700">
          <Trash2 size={16} />
        </button>
      </td>
      <td className="p-3 border border-gray-200">{item.supplier || 'مؤسسة تكامل'}</td>
      <td className="p-3 border border-gray-200">-</td>
      <td className="p-3 border border-gray-200">-</td>
      <td className="p-3 border border-gray-200">
        <div className="flex items-center justify-center border border-gray-300 rounded-md w-32 mx-auto">
          <button 
            onClick={() => onUpdateQty(Math.max(0, item.qty - 1))}
            className="px-3 py-1 hover:bg-gray-100 text-gray-600 border-l border-gray-300"
          >
            <Minus size={14} />
          </button>
          <input 
            type="text" 
            value={item.qty} 
            onChange={(e) => handleQtyChange(e.target.value)}
            className="w-12 text-center text-sm outline-none py-1" 
          />
          <button 
            onClick={() => onUpdateQty(item.qty + 1)}
            className="px-3 py-1 hover:bg-gray-100 text-gray-600 border-r border-gray-300"
          >
            <Plus size={14} />
          </button>
        </div>
      </td>
      <td className="p-3 border border-gray-200">{item.code} - {item.name}</td>
    </tr>
  );
};

export default function PrintBarcode() {
  const { t, direction } = useLanguage();
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([
    { id: '1', name: 'عبايه كريب مع اكمام مموجه', code: '60990980', qty: 1 }
  ]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduct = (product: any) => {
    const existingItem = selectedItems.find(item => item.id === product.id);
    if (existingItem) {
      setSelectedItems(selectedItems.map(item => 
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setSelectedItems([...selectedItems, { ...product, qty: 1 }]);
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const handleUpdateQty = (id: string, qty: number) => {
    setSelectedItems(selectedItems.map(item => 
      item.id === id ? { ...item, qty } : item
    ));
  };

  const handleUpdate = () => {
    setShowPreview(true);
  };

  return (
    <div className="space-y-4" dir={direction}>

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('products')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('print_barcode')}</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#8b0000] flex items-center gap-2">
              {t('print_barcode_labels_title')}
          </h1>
          <button className="p-2 text-gray-500 hover:text-[#8b0000] border border-gray-200 rounded-md hover:bg-gray-50">
              <Printer size={20} />
          </button>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
          
          <p className="text-sm text-gray-600 mb-6 text-right">
              {t('print_barcode_desc')}
          </p>

          {/* Add Product Section */}
          <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
              <div className="mb-4 relative" ref={searchRef}>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 gap-2">
                      <Barcode size={24} className="text-gray-400" />
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <button 
                        type="button" 
                        className="p-1 bg-primary text-white rounded-full hover:bg-primary-hover"
                      >
                        <Plus size={20} />
                      </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder={t('please_add_items')}
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full border-2 border-blue-400 rounded-lg px-12 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 text-right"
                  />
                  
                  {showDropdown && searchTerm && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                          <div 
                            key={product.id}
                            onClick={() => handleSelectProduct(product)}
                            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-right border-b border-gray-100 last:border-0"
                          >
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.code}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          لا توجد نتائج
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {/* Table - Desktop */}
              <div className="hidden md:block overflow-x-auto">
                  <table className="w-full min-w-[800px] text-sm text-right border-collapse">
                      <thead>
                          <tr className="bg-primary text-white">
                              <th className="p-3 border border-primary-hover w-10 text-center whitespace-nowrap">
                                  <Trash2 size={16} className="mx-auto" />
                              </th>
                              <th className="p-3 border border-primary-hover whitespace-nowrap">{t('activity_name')}</th>
                              <th className="p-3 border border-primary-hover whitespace-nowrap">{t('expiry')}</th>
                              <th className="p-3 border border-primary-hover whitespace-nowrap">{t('production')}</th>
                              <th className="p-3 border border-primary-hover whitespace-nowrap">{t('quantity')}</th>
                              <th className="p-3 border border-primary-hover whitespace-nowrap">{t('product_name_code')}</th>
                          </tr>
                      </thead>
                      <tbody>
                          {selectedItems.map(item => (
                            <BarcodeRow 
                              key={item.id}
                              item={item}
                              onRemove={() => handleRemoveItem(item.id)}
                              onUpdateQty={(qty) => handleUpdateQty(item.id, qty)}
                            />
                          ))}
                          {selectedItems.length === 0 && (
                            <tr>
                              <td colSpan={6} className="p-4 text-center text-gray-500 border border-gray-200">
                                لم يتم اختيار أي أصناف
                              </td>
                            </tr>
                          )}
                      </tbody>
                  </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {selectedItems.map((item) => (
                  <MobileDataCard
                    key={item.id}
                    title={item.name}
                    subtitle={item.code}
                    fields={[
                      { label: t('activity_name'), value: item.supplier || 'مؤسسة تكامل' },
                      { label: t('expiry'), value: '-' },
                      { label: t('production'), value: '-' },
                    ]}
                    actions={
                      <div className="flex items-center justify-between w-full gap-4">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button 
                            onClick={() => handleUpdateQty(item.id, Math.max(0, item.qty - 1))}
                            className="px-3 py-1 hover:bg-gray-100 text-gray-600 border-l border-gray-300"
                          >
                            <Minus size={14} />
                          </button>
                          <input 
                            type="text" 
                            value={item.qty} 
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val)) handleUpdateQty(item.id, val);
                            }}
                            className="w-12 text-center text-sm outline-none py-1" 
                          />
                          <button 
                            onClick={() => handleUpdateQty(item.id, item.qty + 1)}
                            className="px-3 py-1 hover:bg-gray-100 text-gray-600 border-r border-gray-300"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg border border-red-100 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    }
                  />
                ))}
                {selectedItems.length === 0 && (
                  <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    لم يتم اختيار أي أصناف
                  </div>
                )}
              </div>
          </div>

          {/* Print Settings */}
          <div className="space-y-6">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 text-right">{t('print_method')} *</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#8b0000] bg-white text-right" dir="rtl">
                      <option>{t('continuous_print')}</option>
                      <option>{t('a4_paper')}</option>
                  </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" dir="rtl">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('width')}</label>
                      <div className="flex gap-2">
                          <input type="text" defaultValue="50" className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#8b0000]" />
                          <span className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-md text-sm text-gray-600">{t('mm')}</span>
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('height')}</label>
                      <div className="flex gap-2">
                          <input type="text" defaultValue="25" className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#8b0000]" />
                          <span className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-md text-sm text-gray-600">{t('mm')}</span>
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('barcode_height')}</label>
                      <div className="flex gap-2">
                          <input type="text" defaultValue="28" className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#8b0000]" />
                          <span className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-md text-sm text-gray-600">{t('px')}</span>
                      </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('barcode_orientation')}</label>
                      <div className="flex gap-2 items-center">
                          <select className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-[#8b0000] bg-white">
                              <option>{t('vertical')}</option>
                              <option>{t('horizontal')}</option>
                          </select>
                          <div className="flex items-center gap-1 mr-2">
                              <input type="checkbox" id="promo" className="rounded border-gray-300 text-[#8b0000] focus:ring-[#8b0000]" />
                              <label htmlFor="promo" className="text-xs text-gray-700 whitespace-nowrap">{t('check_promo_price')}</label>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Print Options */}
              <div className="flex flex-wrap gap-4 border-t border-gray-200 pt-4" dir="rtl">
                  {[
                      'print', 
                      'company_name', 
                      'product_name', 
                      'selling_price', 
                      'currencies', 
                      'tax_inclusive', 
                      'production', 
                      'expiry'
                  ].map((key) => (
                      <div key={key} className="flex items-center gap-2">
                          <label className="text-sm text-gray-700">{t(key)}</label>
                          <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#8b0000] focus:ring-[#8b0000]" />
                      </div>
                  ))}
              </div>

              <h3 className="text-lg font-bold text-gray-800 text-right mt-6 border-b border-gray-200 pb-2">{t('font_formatting')}</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormatBox 
                      title={t('format_product_name')} 
                      icon={Palette} 
                      colorClass="text-green-500" 
                      borderColorClass="border-green-500" 
                  />
                  <FormatBox 
                      title={t('format_activity_name')} 
                      icon={Type} 
                      colorClass="text-blue-500" 
                      borderColorClass="border-blue-500" 
                  />
                  <FormatBox 
                      title={t('format_dates')} 
                      icon={Calendar} 
                      colorClass="text-purple-500" 
                      borderColorClass="border-purple-500" 
                  />
                  <FormatBox 
                      title={t('format_price')} 
                      icon={DollarSign} 
                      colorClass="text-red-500" 
                      borderColorClass="border-red-500" 
                  />
              </div>

              <div className="flex justify-start gap-3 pt-6 flex-row-reverse">
                  <button 
                    onClick={handleUpdate}
                    className="bg-[#8b0000] text-white px-6 py-2 rounded-md font-medium hover:bg-[#a52a2a] transition-colors shadow-sm flex items-center gap-2"
                  >
                      {t('update')}
                  </button>
                  <button 
                    onClick={() => {
                        setSelectedItems([]);
                        setShowPreview(false);
                    }}
                    className="bg-red-500 text-white px-6 py-2 rounded-md font-medium hover:bg-red-600 transition-colors shadow-sm flex items-center gap-2"
                  >
                      {t('reset')}
                  </button>
              </div>

              {showPreview && (
                  <div className="mt-8 border border-gray-200 rounded-md overflow-hidden">
                      <div className="bg-[#8b0000] text-white py-2 px-4 flex justify-center items-center gap-2">
                          <Printer size={20} />
                          <span className="font-bold">{t('print')}</span>
                      </div>
                      <div className="p-8 bg-white flex justify-center items-center min-h-[200px]">
                          {selectedItems.length > 0 ? (
                              <div className="flex flex-wrap gap-4 justify-center">
                                  {selectedItems.map((item, index) => (
                                      <div key={index} className="border border-dashed border-gray-400 p-4 text-center w-[200px] flex flex-col items-center justify-center bg-white">
                                          <div className="font-bold text-sm mb-1">{item.supplier || 'مؤسسة تكامل'}</div>
                                          <div className="text-xs font-bold mb-1">{item.name}</div>
                                          <div className="font-bold text-sm mb-1">{item.price} - شامل ضريبة</div>
                                          <div className="text-[10px] font-bold mb-1">انتاج: انتهاء:</div>
                                          <div className="mt-2">
                                              {/* Placeholder for actual barcode */}
                                              <div className="h-10 w-32 bg-black flex flex-col justify-between">
                                                  <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IndoaXRlIi8+PHBhdGggZD0iTTAgMGgxMHYxMDBIMHptMjAgMGg1djEwMGgtNXptMTAgMGgxMHYxMDBIMTB6bTIwIDBoNXYxMDBoLTV6bTEwIDBoMTB2MTAwSDEwem0yMCAwaDV2MTAwaC01em0xMCAwaDEwdjEwMEgxMHoiIGZpbGw9ImJsYWNrIi8+PC9zdmc+')] bg-repeat-x bg-contain"></div>
                                              </div>
                                              <div className="text-[10px] font-bold mt-1 tracking-widest">{item.code || '60990980'}</div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          ) : (
                              <div className="text-gray-500">لا توجد أصناف للطباعة</div>
                          )}
                      </div>
                  </div>
              )}
          </div>

      </div>
    </div>
  );
}
