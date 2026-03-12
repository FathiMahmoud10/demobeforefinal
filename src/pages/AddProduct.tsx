import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { 
  FileText, 
  PlusCircle, 
  Upload, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon,
  Image as ImageIcon,
  Barcode
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useProducts } from '@/context/ProductsContext';
import { useSettings } from '@/context/SettingsContext';

export default function AddProduct() {
  const { t, direction } = useLanguage();
  const { addProduct } = useProducts();
  const { systemSettings } = useSettings();
  const navigate = useNavigate();
  const [showAdditionalUnit, setShowAdditionalUnit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    brand: '',
    category: '',
    cost: '0',
    price: '0',
    unit: 'وحدة',
    alertQuantity: '0'
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code) {
      alert(direction === 'rtl' ? 'يرجى إدخال اسم الصنف وكوده' : 'Please enter product name and code');
      return;
    }

    addProduct({
      image: fileName ? "https://picsum.photos/seed/new/50/50" : "",
      code: formData.code,
      name: formData.name,
      brand: formData.brand,
      agent: "",
      category: formData.category || "عام",
      cost: formData.cost,
      price: formData.price,
      quantity: "0.00",
      unit: formData.unit,
      alertQuantity: formData.alertQuantity
    });

    alert(direction === 'rtl' ? 'تم حفظ الصنف بنجاح' : 'Product saved successfully');
    navigate('/products');
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 flex items-center gap-1">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('products')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('add_product_title')}</span>
      </div>

      {/* Page Header */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <PlusCircle size={20} className="text-primary" />
              {t('add_product_title')}
          </h1>
          <p className="text-sm text-gray-500 mt-2">{t('add_product_desc')}</p>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Right Column (RTL) */}
              <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_type')}</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                          <option>{t('general')}</option>
                          <option>{t('service')}</option>
                      </select>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_name')}</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full border border-primary rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary" 
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_name_second_lang')}</label>
                      <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_name_third_lang')}</label>
                      <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('reorder_point')}</label>
                      <input 
                        type="text" 
                        name="alertQuantity"
                        value={formData.alertQuantity}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary" 
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_code_required')}</label>
                      <div className="flex gap-2">
                          <input 
                            type="text" 
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary" 
                          />
                          <button 
                            type="button"
                            onClick={() => setFormData(prev => ({ 
                              ...prev, 
                              code: `${systemSettings.prefixes.product}${Math.floor(Math.random() * 10000000).toString()}` 
                            }))}
                            className="bg-gray-100 border border-gray-300 p-2 rounded-md hover:bg-gray-200 text-gray-600" 
                            title={t('generate_code')}
                          >
                              <Barcode size={20} />
                          </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{t('barcode_reader_hint')}</p>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('brand')}</label>
                      <select 
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                      >
                          <option value="">{t('select_brand')}</option>
                          <option value="Brand A">Brand A</option>
                          <option value="Brand B">Brand B</option>
                      </select>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_cost')}</label>
                      <input 
                        type="text" 
                        name="cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary" 
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_price')}</label>
                      <input 
                        type="text" 
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary" 
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('max_order_qty')}</label>
                      <input type="text" defaultValue="0" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary" />
                  </div>
              </div>

              {/* Left Column (RTL) */}
              <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                      <input type="checkbox" id="hasVariants" className="rounded border-gray-300 text-primary focus:ring-primary" />
                      <label htmlFor="hasVariants" className="text-sm text-gray-700">{t('has_variants_label')}</label>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('main_categories_required')}</label>
                      <select 
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                      >
                          <option value="">{t('select_main_categories')}</option>
                          <option value="عبايات سوداء">عبايات سوداء</option>
                          <option value="عبايات ملونة">عبايات ملونة</option>
                      </select>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('sub_category')}</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                          <option>{t('select_category_load')}</option>
                      </select>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_unit')}</label>
                      <select 
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                      >
                          <option value="وحدة">وحدة</option>
                          <option value="قطعة">قطعة</option>
                          <option value="درزن">درزن</option>
                      </select>
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t('default_sale_unit')}</label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                          <option>{t('select_unit')}</option>
                      </select>
                  </div>

                  <div className="pt-2">
                      <button 
                        type="button"
                        onClick={() => setShowAdditionalUnit(!showAdditionalUnit)}
                        className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary-hover transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                      >
                          <PlusCircle size={16} />
                          {t('additional_units')}
                      </button>
                  </div>

                  {showAdditionalUnit && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('default_purchase_unit')}</label>
                        <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                            <option>{t('select_unit')}</option>
                        </select>
                    </div>
                  )}
              </div>
          </div>

          <hr className="my-8 border-gray-200" />

          {/* Bottom Section */}
          <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_image')}</label>
                          <div className="flex gap-2">
                              <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
                              />
                              <button 
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary-hover transition-colors flex items-center gap-2"
                              >
                                  <Upload size={16} />
                                  {t('browse')}
                              </button>
                              <input type="text" value={fileName} className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none" readOnly />
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <div className="flex items-center gap-2">
                              <input type="checkbox" id="stock" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
                              <label htmlFor="stock" className="text-sm text-gray-700">{t('stock_item')}</label>
                          </div>
                          <div className="flex items-center gap-2">
                              <input type="checkbox" id="hidePos" className="rounded border-gray-300 text-primary focus:ring-primary" />
                              <label htmlFor="hidePos" className="text-sm text-gray-700">{t('hide_pos')}</label>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Rich Text Editors */}
              

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_details')}</label>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                      <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-2">
                          <button type="button" className="p-1 hover:bg-gray-200 rounded"><Bold size={14} /></button>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded"><Italic size={14} /></button>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded"><Underline size={14} /></button>
                          <div className="w-px bg-gray-300 h-4 my-auto"></div>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignLeft size={14} /></button>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignCenter size={14} /></button>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignRight size={14} /></button>
                          <div className="w-px bg-gray-300 h-4 my-auto"></div>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded"><List size={14} /></button>
                          <button type="button" className="p-1 hover:bg-gray-200 rounded"><LinkIcon size={14} /></button>
                      </div>
                      <textarea className="w-full p-3 h-32 outline-none resize-y" />
                  </div>
              </div>

              <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-primary text-white px-8 py-2 rounded-md font-medium hover:bg-primary-hover transition-colors shadow-sm">
                      {t('add_product_title')}
                  </button>
              </div>
          </div>
      </form>
    </div>
  );
}
