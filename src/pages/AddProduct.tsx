// import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
// import {
//   FileText,
//   PlusCircle,
//   Upload,
//   Bold,
//   Italic,
//   Underline,
//   List,
//   AlignLeft,
//   AlignCenter,
//   AlignRight,
//   Link as LinkIcon,
//   Image as ImageIcon,
//   Barcode
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useLanguage } from '@/context/LanguageContext';
// import { useProducts } from '@/context/ProductsContext';
// import { useGroups } from '@/context/GroupsContext';

// export default function AddProduct() {
//   const { t, direction } = useLanguage();
//   const { addProduct } = useProducts();
//   const { groups } = useGroups();
//   const navigate = useNavigate();
//   const [showAdditionalUnit, setShowAdditionalUnit] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [fileName, setFileName] = useState('');

//   // Form state
//   const [formData, setFormData] = useState({
//     name: '',               // arabic name
//     nameAr: '',
//     nameEn: '',
//     nameUr: '',
//     code: '',
//     brand: '',
//     categoryId: '',
//     description: '',
//     productType: '1',       // 1 = general, 2 = service etc.
//     cost: '0',
//     price: '0',
//     unit: 'وحدة',
//     alertQuantity: '0'
//   });

//   const [errors, setErrors] = useState<{
//     name?: string;
//     nameEn?: string;
//     nameAr?: string;
//     code?: string;
//     categoryId?: string;
//     cost?: string;
//     price?: string;
//   }>({});

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     const newErrors: typeof errors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = direction === 'rtl' ? 'اسم الصنف مطلوب' : 'Product name is required';
//     }
//     // arabic/english names optional now – backend will fall back to primary name
//     if (!formData.code.trim()) {
//       newErrors.code = direction === 'rtl' ? 'كود الصنف مطلوب' : 'Product code is required';
//     }
//     if (!formData.categoryId) {
//       newErrors.categoryId = direction === 'rtl' ? 'يرجى اختيار التصنيف الرئيسي' : 'Please select a main category';
//     }
//     if (!formData.cost.trim() || isNaN(Number(formData.cost))) {
//       newErrors.cost = direction === 'rtl' ? 'التكلفة يجب أن تكون رقمًا' : 'Cost must be a number';
//     }
//     if (!formData.price.trim() || isNaN(Number(formData.price))) {
//       newErrors.price = direction === 'rtl' ? 'سعر البيع يجب أن يكون رقمًا' : 'Price must be a number';
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     setErrors({});

//     const selectedGroup = groups.find(g => String(g.id) === String(formData.categoryId));

//     try {
//       await addProduct({
//         image: fileName ? "https://picsum.photos/seed/new/50/50" : "",
//         code: formData.code,
//         name: formData.name,
//         nameAr: formData.nameAr,
//         nameEn: formData.nameEn,
//         nameUr: formData.nameUr,
//         brand: formData.brand,
//         agent: "",
//         category: selectedGroup?.name || "عام",
//         categoryId: selectedGroup?.id,
//         description: formData.description,
//         productType: formData.productType,
//         cost: formData.cost,
//         price: formData.price,
//         quantity: "0.00",
//         unit: formData.unit,
//         alertQuantity: formData.alertQuantity
//       });
//       navigate('/products');
//     } catch (err) {
//       console.error(err);
//       alert(direction === 'rtl' ? 'فشل إضافة الصنف' : 'Failed to add product');
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* Breadcrumb */}
//       <div className="text-sm text-gray-500 flex items-center gap-1">
//         <span>{t('home')}</span>
//         <span>/</span>
//         <span>{t('products')}</span>
//         <span>/</span>
//         <span className="text-gray-800 font-medium">{t('add_product_title')}</span>
//       </div>

//       {/* Page Header */}
//       <div className="bg-white p-4 rounded-t-xl border-b border-gray-200">
//         <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//           <PlusCircle size={20} className="text-primary" />
//           {t('add_product_title')}
//         </h1>
//         <p className="text-sm text-gray-500 mt-2">{t('add_product_desc')}</p>
//       </div>

//       {/* Form Container */}
//       <form onSubmit={handleSubmit} className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Right Column (RTL) */}
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_type')}</label>
//               <select
//                 name="productType"
//                 value={formData.productType}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white"
//               >
//                 <option value="1">{t('general')}</option>
//                 <option value="2">{t('service')}</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_name')}</label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="w-full border border-primary rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
//               />
//               {errors.name && (
//                 <p className="mt-1 text-xs text-red-600">{errors.name}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_name_second_lang')}</label>
//               <input
//                 type="text"
//                 name="nameEn"
//                 value={formData.nameEn}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
//               />
//               {errors.nameEn && (
//                 <p className="mt-1 text-xs text-red-600">{errors.nameEn}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_name_third_lang')}</label>
//               <input
//                 type="text"
//                 name="nameUr"
//                 value={formData.nameUr}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
//                 rows={3}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">{t('reorder_point')}</label>
//               <input
//                 type="text"
//                 name="alertQuantity"
//                 value={formData.alertQuantity}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_code_required')}</label>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   name="code"
//                   value={formData.code}
//                   onChange={handleInputChange}
//                   className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setFormData(prev => ({ ...prev, code: Math.floor(Math.random() * 100000000).toString() }))}
//                   className="bg-gray-100 border border-gray-300 p-2 rounded-md hover:bg-gray-200 text-gray-600"
//                   title={t('generate_code')}
//                 >
//                   <Barcode size={20} />
//                 </button>
//               </div>
//               <p className="text-xs text-gray-500 mt-1">{t('barcode_reader_hint')}</p>
//               {errors.code && (
//                 <p className="mt-1 text-xs text-red-600">{errors.code}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">{t('brand')}</label>
//               <select
//                 name="brand"
//                 value={formData.brand}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white"
//               >
//                 <option value="">{t('select_brand')}</option>
//                 <option value="Brand A">Brand A</option>
//                 <option value="Brand B">Brand B</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_cost')}</label>
//               <input
//                 type="text"
//                 name="cost"
//                 value={formData.cost}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
//               />
//               {errors.cost && (
//                 <p className="mt-1 text-xs text-red-600">{errors.cost}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_price')}</label>
//               <input
//                 type="text"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
//               />
//               {errors.price && (
//                 <p className="mt-1 text-xs text-red-600">{errors.price}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">{t('max_order_qty')}</label>
//               <input type="text" defaultValue="0" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary" />
//             </div>
//           </div>

//           {/* Left Column (RTL) */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-2 mb-6">
//               <input type="checkbox" id="hasVariants" className="rounded border-gray-300 text-primary focus:ring-primary" />
//               <label htmlFor="hasVariants" className="text-sm text-gray-700">{t('has_variants_label')}</label>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">{t('main_categories_required')}</label>
//               <select
//                 name="categoryId"
//                 value={formData.categoryId}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white text-black"
//               >
//                 <option value="" disabled className="text-gray-500">{t('select_main_categories')}</option>
//                 {groups.length === 0 ? (
//                   <option disabled className="text-gray-500">{t('no_categories')}</option>
//                 ) : (
//                   groups.map((g) => (
//                     <option key={g.id} value={g.id} className="text-black">
//                       {g.name}
//                     </option>
//                   ))
//                 )}
//               </select>
//               {errors.categoryId && (
//                 <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">{t('sub_category')}</label>
//               <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white">
//                 <option>{t('select_category_load')}</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_unit')}</label>
//               <select
//                 name="unit"
//                 value={formData.unit}
//                 onChange={handleInputChange}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white"
//               >
//                 <option value="وحدة">وحدة</option>
//                 <option value="قطعة">قطعة</option>
//                 <option value="درزن">درزن</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">{t('default_sale_unit')}</label>
//               <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white">
//                 <option>{t('select_unit')}</option>
//               </select>
//             </div>

//             <div className="pt-2">
//               <button
//                 type="button"
//                 onClick={() => setShowAdditionalUnit(!showAdditionalUnit)}
//                 className="bg-[#054C28] text-white px-4 py-2 rounded-md text-sm hover:bg-[#043b1f] transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
//               >
//                 <PlusCircle size={16} />
//                 {t('additional_units')}
//               </button>
//             </div>

//             {showAdditionalUnit && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">{t('default_purchase_unit')}</label>
//                 <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white">
//                   <option>{t('select_unit')}</option>
//                 </select>
//               </div>
//             )}
//           </div>
//         </div>

//         <hr className="my-8 border-gray-200" />

//         {/* Bottom Section */}
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_image')}</label>
//                 <div className="flex gap-2">
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     className="hidden"
//                     onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => fileInputRef.current?.click()}
//                     className="bg-[#054C28] text-white px-4 py-2 rounded-md text-sm hover:bg-[#043b1f] transition-colors flex items-center gap-2"
//                   >
//                     <Upload size={16} />
//                     {t('browse')}
//                   </button>
//                   <input type="text" value={fileName} className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none" readOnly />
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <input type="checkbox" id="stock" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
//                   <label htmlFor="stock" className="text-sm text-gray-700">{t('stock_item')}</label>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <input type="checkbox" id="hidePos" className="rounded border-gray-300 text-primary focus:ring-primary" />
//                   <label htmlFor="hidePos" className="text-sm text-gray-700">{t('hide_pos')}</label>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Rich Text Editors */}


//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_details')}</label>
//             <div className="border border-gray-300 rounded-md overflow-hidden">
//               <div className="bg-gray-50 border-b border-gray-300 p-2 flex gap-2">
//                 <button type="button" className="p-1 hover:bg-gray-200 rounded"><Bold size={14} /></button>
//                 <button type="button" className="p-1 hover:bg-gray-200 rounded"><Italic size={14} /></button>
//                 <button type="button" className="p-1 hover:bg-gray-200 rounded"><Underline size={14} /></button>
//                 <div className="w-px bg-gray-300 h-4 my-auto"></div>
//                 <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignLeft size={14} /></button>
//                 <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignCenter size={14} /></button>
//                 <button type="button" className="p-1 hover:bg-gray-200 rounded"><AlignRight size={14} /></button>
//                 <div className="w-px bg-gray-300 h-4 my-auto"></div>
//                 <button type="button" className="p-1 hover:bg-gray-200 rounded"><List size={14} /></button>
//                 <button type="button" className="p-1 hover:bg-gray-200 rounded"><LinkIcon size={14} /></button>
//               </div>
//               <textarea className="w-full p-3 h-32 outline-none resize-y" />
//             </div>
//           </div>

//           <div className="flex justify-end pt-4">
//             <button type="submit" className="bg-[#054C28] text-white px-8 py-2 rounded-md font-medium hover:bg-[#043b1f] transition-colors shadow-sm">
//               {t('add_product_title')}
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }


import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from 'react';
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
// import { useProducts } from '@/context/ProductsContext'; // ❌ Not used now (API is the source of truth)
// import { useGroups } from '@/context/GroupsContext';     // ❌ Not used now (categories fetched from API)

type ApiCategory = {
  id: number | string;
  categoryNameAr?: string;
  categoryNameEn?: string;
  categoryNameUr?: string;
  description?: string;
  parentCategoryId?: number | null;
  isActive?: number;
  imageUrl?: string | null;
};

type NormalizedCategory = {
  id: number | string;
  nameAr: string;
  nameEn: string;
  nameUr: string;
};

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://takamulerp.runasp.net";
async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    if (isJson) {
      try {
        const data: any = await res.json();
        msg = data?.message || data?.error || msg;
      } catch {
        // ignore
      }
    } else {
      try {
        const text = await res.text();
        if (text) msg = text;
      } catch {
        // ignore
      }
    }
    throw new Error(msg);
  }

  if (isJson) return (await res.json()) as T;
  return (await res.text()) as unknown as T;
}

function normalizeCategory(item: any): NormalizedCategory {
  // ✅ Handles your real API shape: categoryNameAr / categoryNameEn / categoryNameUr
  // ✅ Also keeps some fallbacks just in case other endpoints differ.
  const id = item?.id ?? item?.Id ?? item?.categoryId ?? item?.CategoryId ?? '';

  const nameAr =
    (item?.categoryNameAr ?? item?.CategoryNameAr ?? item?.nameAr ?? item?.NameAr ?? '').toString();

  const nameEn =
    (item?.categoryNameEn ?? item?.CategoryNameEn ?? item?.nameEn ?? item?.NameEn ?? '').toString();

  const nameUr =
    (item?.categoryNameUr ?? item?.CategoryNameUr ?? item?.nameUr ?? item?.NameUr ?? '').toString();

  // Fallbacks if endpoint returns generic name fields
  const genericName =
    (item?.name ?? item?.Name ?? item?.categoryName ?? item?.CategoryName ?? item?.title ?? item?.Title ?? '').toString();

  return {
    id,
    nameAr: nameAr || genericName,
    nameEn: nameEn || genericName,
    nameUr: nameUr || genericName
  };
}

function getDisplayCategoryName(c: NormalizedCategory, direction: string) {
  // UI display depends on rtl/ltr
  if (direction === 'rtl') return c.nameAr || c.nameEn || c.nameUr || '';
  return c.nameEn || c.nameAr || c.nameUr || '';
}

function getCategoryNameToSend(c: NormalizedCategory | undefined) {
  // Backend wants CategoryName (string). Most likely Arabic in your system.
  return (c?.nameAr || c?.nameEn || c?.nameUr || '').trim();
}

export default function AddProduct() {
  const { t, direction } = useLanguage();
  // const { addProduct } = useProducts(); // ❌ Not used now (API is the source of truth)
  // const { groups } = useGroups();       // ❌ Not used now (categories fetched from API)
  const navigate = useNavigate();
  const [showAdditionalUnit, setShowAdditionalUnit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Categories (from API)
  const [mainCategories, setMainCategories] = useState<NormalizedCategory[]>([]);
  const [subCategories, setSubCategories] = useState<NormalizedCategory[]>([]);
  const [isLoadingMainCategories, setIsLoadingMainCategories] = useState(false);
  const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',               // used as ProductNameAr
    nameAr: '',             // ❌ not used with API (kept as-is)
    nameEn: '',             // ProductNameEn (required)
    nameUr: '',             // ProductNameUr (required)
    code: '',               // Barcode (optional in API)
    brand: '',              // ❌ not used with API (comment UI)
    categoryId: '',         // main category id (used to fetch subcategories)
    subCategoryId: '',      // sub category id (optional selection)
    description: '',
    productType: 'Direct',  // API: producttype (string) => Direct / Prepared / Branched
    cost: '0',
    price: '0',             // SellingPrice (required)
    unit: 'وحدة',           // ❌ not used with API (kept UI)
    alertQuantity: '0'      // MinStockLevel
  });

  const [errors, setErrors] = useState<{
    name?: string;
    nameEn?: string;
    nameUr?: string;
    categoryId?: string;
    cost?: string;
    price?: string;
    productType?: string;
    description?: string;
  }>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Fetch Main Categories on mount
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setIsLoadingMainCategories(true);

        const data = await fetchJson<ApiCategory[]>(`${API_BASE}/ProductCategories/MainCategory`, {
          method: 'GET',
          headers: { accept: '*/*' }
        });

        const normalized = (Array.isArray(data) ? data : [])
          .map(normalizeCategory)
          .filter(c => String(c.id) !== '' && (c.nameAr || c.nameEn || c.nameUr));

        if (mounted) setMainCategories(normalized);
      } catch (e) {
        console.error(e);
        if (mounted) setMainCategories([]);
      } finally {
        if (mounted) setIsLoadingMainCategories(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Fetch Sub Categories when main category changes
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!formData.categoryId) {
        setSubCategories([]);
        setFormData(prev => ({ ...prev, subCategoryId: '' }));
        return;
      }

      try {
        setIsLoadingSubCategories(true);

        const data = await fetchJson<ApiCategory[]>(
          `${API_BASE}/ProductCategories/SubCategory/${encodeURIComponent(formData.categoryId)}`,
          {
            method: 'GET',
            headers: { accept: '*/*' }
          }
        );

        const normalized = (Array.isArray(data) ? data : [])
          .map(normalizeCategory)
          .filter(c => String(c.id) !== '' && (c.nameAr || c.nameEn || c.nameUr));

        if (mounted) setSubCategories(normalized);

        // reset sub category selection when main changes
        if (mounted) setFormData(prev => ({ ...prev, subCategoryId: '' }));
      } catch (e) {
        console.error(e);
        if (mounted) setSubCategories([]);
      } finally {
        if (mounted) setIsLoadingSubCategories(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [formData.categoryId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    // API required fields
    if (!formData.name.trim()) {
      newErrors.name = direction === 'rtl' ? 'اسم الصنف مطلوب' : 'Product name (Arabic) is required';
    }
    if (!formData.nameEn.trim()) {
      newErrors.nameEn = direction === 'rtl' ? 'اسم الصنف بالإنجليزية مطلوب' : 'English name is required';
    }
    if (!formData.nameUr.trim()) {
      newErrors.nameUr = direction === 'rtl' ? 'اسم الصنف بالأوردو مطلوب' : 'Urdu name is required';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = direction === 'rtl' ? 'يرجى اختيار التصنيف الرئيسي' : 'Please select a main category';
    }
    if (!formData.price.trim() || isNaN(Number(formData.price))) {
      newErrors.price = direction === 'rtl' ? 'سعر البيع يجب أن يكون رقمًا' : 'Selling price must be a number';
    }
    if (formData.cost.trim() && isNaN(Number(formData.cost))) {
      newErrors.cost = direction === 'rtl' ? 'التكلفة يجب أن تكون رقمًا' : 'Cost must be a number';
    }
    if (!formData.productType.trim()) {
      newErrors.productType = direction === 'rtl' ? 'نوع الصنف مطلوب' : 'Product type is required';
    }
    if (!formData.description.trim()) {
  newErrors.description = direction === 'rtl' ? 'الوصف مطلوب' : 'Description is required';
}

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // CategoryName is string in API:
    // Prefer sub category name if selected, else main category name
    const main = mainCategories.find(c => String(c.id) === String(formData.categoryId));
    const sub = subCategories.find(c => String(c.id) === String(formData.subCategoryId));
    const categoryNameToSend = getCategoryNameToSend(sub || main);

    try {
      const fd = new FormData();

      // API fields (Swagger)
      if (formData.code?.trim()) fd.append('Barcode', formData.code.trim());
      fd.append('ProductNameAr', formData.name.trim());
      fd.append('ProductNameEn', formData.nameEn.trim());
      fd.append('ProductNameUr', formData.nameUr.trim());

      if (formData.description?.trim()) fd.append('Description', formData.description.trim());

      fd.append('CategoryName', categoryNameToSend);

      if (formData.cost?.trim()) fd.append('CostPrice', String(Number(formData.cost)));
      fd.append('SellingPrice', String(Number(formData.price)));

      // int32
      if (formData.alertQuantity?.trim()) {
        const minStock = parseInt(formData.alertQuantity, 10);
        if (!Number.isNaN(minStock)) fd.append('MinStockLevel', String(minStock));
      }

      // producttype (string): Direct | Prepared | Branched
      fd.append('producttype', formData.productType);

      // Image (binary)
      if (imageFile) fd.append('Image', imageFile);

      await fetchJson<any>(`${API_BASE}/Products/add`, {
        method: 'POST',
        body: fd
        // NOTE: Do NOT set Content-Type manually with FormData; browser sets boundary
      });

      navigate('/products');
    } catch (err: any) {
      console.error(err);
      alert((direction === 'rtl' ? 'فشل إضافة الصنف: ' : 'Failed to add product: ') + (err?.message || ''));
    }
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
              <select
                name="productType"
                value={formData.productType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white"
              >
                {/* API values */}
                <option value="Direct">Direct</option>
                <option value="Prepared">Prepared</option>
                <option value="Branched">Branched</option>
              </select>
              {errors.productType && <p className="mt-1 text-xs text-red-600">{errors.productType}</p>}
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
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_name_second_lang')}</label>
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
              />
              {errors.nameEn && <p className="mt-1 text-xs text-red-600">{errors.nameEn}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_name_third_lang')}</label>
              <input
                type="text"
                name="nameUr"
                value={formData.nameUr}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
              />
              {errors.nameUr && <p className="mt-1 text-xs text-red-600">{errors.nameUr}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
                rows={3}
              />
              {errors.description && (
  <p className="mt-1 text-xs text-red-600">{errors.description}</p>
)}
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
                  onClick={() => setFormData(prev => ({ ...prev, code: Math.floor(Math.random() * 100000000).toString() }))}
                  className="bg-gray-100 border border-gray-300 p-2 rounded-md hover:bg-gray-200 text-gray-600"
                  title={t('generate_code')}
                >
                  <Barcode size={20} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">{t('barcode_reader_hint')}</p>
              {/* NOTE: Barcode is optional in API, so no validation error here */}
            </div>

            {/* ❌ brand dropdown not used with API */}
            {/*
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
            */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('product_cost')}</label>
              <input
                type="text"
                name="cost"
                value={formData.cost}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary"
              />
              {errors.cost && <p className="mt-1 text-xs text-red-600">{errors.cost}</p>}
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
              {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
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
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white text-black"
                disabled={isLoadingMainCategories}
              >
                <option value="" disabled className="text-gray-500">
                  {isLoadingMainCategories ? (direction === 'rtl' ? 'جاري التحميل...' : 'Loading...') : t('select_main_categories')}
                </option>

                {mainCategories.length === 0 ? (
                  <option disabled className="text-gray-500">
                    {direction === 'rtl' ? 'لا يوجد' : 'No data'}
                  </option>
                ) : (
                  mainCategories.map((c) => (
                    <option key={String(c.id)} value={String(c.id)} className="text-black">
                      {getDisplayCategoryName(c, direction)}
                    </option>
                  ))
                )}
              </select>
              {errors.categoryId && <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('sub_category')}</label>
              <select
                name="subCategoryId"
                value={formData.subCategoryId}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white"
                disabled={!formData.categoryId || isLoadingSubCategories || subCategories.length === 0}
              >
                <option value="">
                  {!formData.categoryId
                    ? t('select_category_load')
                    : isLoadingSubCategories
                      ? (direction === 'rtl' ? 'جاري التحميل...' : 'Loading...')
                      : (subCategories.length === 0 ? (direction === 'rtl' ? 'لا توجد تصنيفات فرعية' : 'No sub categories') : (direction === 'rtl' ? 'اختياري' : 'Optional'))}
                </option>

                {subCategories.map((c) => (
                  <option key={String(c.id)} value={String(c.id)} className="text-black">
                    {getDisplayCategoryName(c, direction)}
                  </option>
                ))}
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

            {/* ❌ default sale unit not used with API */}
            {/*
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('default_sale_unit')}</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-primary bg-white">
                <option>{t('select_unit')}</option>
              </select>
            </div>
            */}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdditionalUnit(!showAdditionalUnit)}
                className="bg-[#054C28] text-white px-4 py-2 rounded-md text-sm hover:bg-[#043b1f] transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
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
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setImageFile(file);
                      setFileName(file?.name || '');
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#054C28] text-white px-4 py-2 rounded-md text-sm hover:bg-[#043b1f] transition-colors flex items-center gap-2"
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
            <button type="submit" className="bg-[#054C28] text-white px-8 py-2 rounded-md font-medium hover:bg-[#043b1f] transition-colors shadow-sm">
              {t('add_product_title')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}