// src/pages/ProductsList.tsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Search, Edit2, Trash2, ChevronDown, Plus, Box, Package, Layers, X, Link2, FolderPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import MobileDataCard from '@/components/MobileDataCard';
import { useLanguage } from '@/context/LanguageContext';
import { useProducts, type Product } from '@/context/ProductsContext';

export default function ProductsList() {
    const { direction } = useLanguage();
    const { products, deleteProduct, updateProduct, loading } = useProducts();
    const navigate = useNavigate();
    const location = useLocation();

    const [activeTab, setActiveTab] = useState<'basic' | 'sub' | 'prepared' | 'materials'>('basic');
    const [searchTerm, setSearchTerm] = useState('');
    const [extraSearchTerm, setExtraSearchTerm] = useState('');
    const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    useEffect(() => {
        if (location.state?.refreshed) {
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.action-menu-container') && !target.closest('.action-menu-dropdown')) {
                setActiveActionMenu(null);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    // ==========================================
    // 🚀 دوال مساعدة
    // ==========================================

    const getParentChildrenIds = (parent: any) => {
        let ids: string[] = [];
        if (!parent) return ids;

        // القراءة الصريحة من الحقل اللي حفظناه في صفحة الإضافة
        const childrenArray = parent.subProducts || parent.linkedProducts || [];
        if (Array.isArray(childrenArray)) {
            childrenArray.forEach((sub: any) => {
                if (typeof sub === 'string') ids.push(sub);
                else if (sub && sub.id) ids.push(String(sub.id));
            });
        }
        return ids;
    };

    // ✅✅ الدالة السحرية لعرض الأصناف التابعة في الجدول
    const getChildrenNames = (parentItem: any) => {
        // 1. القراءة المباشرة من المصفوفة اللي تم حفظها في صفحة الإضافة
        const childrenArray = parentItem.subProducts || parentItem.linkedProducts || [];

        if (Array.isArray(childrenArray) && childrenArray.length > 0) {
            return (
                <div className="flex flex-wrap gap-1.5">
                    {childrenArray.map((c: any, idx: number) => {
                        // بنسحب الاسم سواء كان محفوظة كـ Object أو كـ String
                        const childName = typeof c === 'object' ? c.name : c;
                        if (!childName) return null;
                        
                        return (
                            <span key={idx} className="px-2 py-1 text-xs bg-orange-50 text-orange-700 border border-orange-100 rounded-md font-medium">
                                {childName}
                            </span>
                        );
                    })}
                </div>
            );
        }

        // 2. كود احتياطي: لو مفيش مصفوفة، ندور في الأصناف المباشرة مين بيشاور على الأب ده
        const parentId = String(parentItem.id).trim();
        const childrenList = (products || []).filter((p: Product) => {
            return String(p.parentProductId) === parentId || p.parentProductName === parentItem.name;
        });

        if (childrenList.length > 0) {
            return (
                <div className="flex flex-wrap gap-1.5">
                    {childrenList.map((c: Product, idx: number) => (
                        <span key={idx} className="px-2 py-1 text-xs bg-orange-50 text-orange-700 border border-orange-100 rounded-md font-medium">
                            {c.name}
                        </span>
                    ))}
                </div>
            );
        }

        return <span className="text-gray-400 text-sm">لا توجد أصناف تابعة</span>;
    };
    // ==========================================

    const directProductsList = (products || []).filter((p: Product) => p.productNature === 'basic' || !p.productNature);
    const subProductsList = (products || []).filter((p: Product) => p.productNature === 'sub');
    const preparedProductsList = (products || []).filter((p: Product) => p.productNature === 'prepared');
    const materialsProductsList = (products || []).filter((p: Product) => p.productNature === 'materials');

    const activeData = activeTab === 'basic' ? directProductsList :
        activeTab === 'sub' ? subProductsList :
            activeTab === 'prepared' ? preparedProductsList : materialsProductsList;

    const currentTableData = activeData.filter((item: Product) => {
        const nameMatch = (item?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const codeMatch = (item?.code || '').toLowerCase().includes(searchTerm.toLowerCase());
        
        // 🚀 تم إزالة شرط الحذف! الأصناف المباشرة هتفضل ظاهرة في جدولها حتى لو كانت مربوطة بمتفرع
        
        return nameMatch || codeMatch;
    });

    const availableDirectProducts = directProductsList.filter((item: Product) =>
        (item?.name || '').toLowerCase().includes(extraSearchTerm.toLowerCase()) ||
        (item?.category || '').toLowerCase().includes(extraSearchTerm.toLowerCase())
    );

    const availableSubAsCategories = subProductsList.filter((item: Product) =>
        (item?.name || '').toLowerCase().includes(extraSearchTerm.toLowerCase())
    );

    // Handlers
    const openDeleteModal = (id: string) => {
        setSelectedProductId(id);
        setShowDeleteModal(true);
        setActiveActionMenu(null);
    };

    const confirmDelete = async () => {
        if (selectedProductId && deleteProduct) {
            await deleteProduct(selectedProductId);
        }
        setShowDeleteModal(false);
    };

    const handleEditProduct = (product: Product) => {
        navigate(`/products/edit/${product.id}`, {
            state: { productNature: activeTab, productData: product }
        });
    };

    const openLinkModal = (id: string) => {
        setSelectedProductId(id);
        setExtraSearchTerm('');
        setShowLinkModal(true);
        setActiveActionMenu(null);
    };

    const handleLinkSubProduct = async (directProduct: Product) => {
        if (!selectedProductId) return;
        const subProduct = products.find((p: Product) => p.id === selectedProductId);
        if (!subProduct) return;

        const updatedProduct = {
            ...subProduct,
            parentProductId: directProduct.id,
            parentProductName: directProduct.name,
            updatedAt: new Date().toISOString()
        };

        if (updateProduct) await updateProduct(updatedProduct);
        setShowLinkModal(false);
    };

    const openAddCategoryModal = (id: string) => {
        setSelectedProductId(id);
        setExtraSearchTerm('');
        setShowAddCategoryModal(true);
        setActiveActionMenu(null);
    };

    const handleAddCategory = async (subProduct: Product) => {
        if (!selectedProductId) return;
        const directProduct = products.find((p: Product) => p.id === selectedProductId);
        if (!directProduct) return;

        const currentCategories = directProduct.category ? directProduct.category.split(',').map((c: string) => c.trim()) : [];
        if (!currentCategories.includes(subProduct.name)) {
            const updatedCategories = [...currentCategories, subProduct.name].join(', ');

            const updatedProduct = {
                ...directProduct,
                category: updatedCategories,
                updatedAt: new Date().toISOString()
            };

            if (updateProduct) await updateProduct(updatedProduct);
        }
        setShowAddCategoryModal(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50" dir={direction || 'rtl'}>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--primary)] border-t-transparent"></div>
            </div>
        );
    }

    const getTabTitle = () => {
        switch (activeTab) {
            case 'basic': return 'الأصناف المباشرة';
            case 'sub': return 'الأصناف المتفرعة';
            case 'prepared': return 'الأصناف المجهزة';
            case 'materials': return 'الخامات';
            default: return '';
        }
    };

    const getTabIcon = () => {
        switch (activeTab) {
            case 'basic': return <Box size={22} className="text-[var(--primary)]" />;
            case 'sub': return <Layers size={22} className="text-[var(--primary)]" />;
            case 'prepared': return <Package size={22} className="text-[var(--primary)]" />;
            case 'materials': return <FolderPlus size={22} className="text-[var(--primary)]" />;
            default: return <Box size={22} />;
        }
    };

    return (
        <div className="space-y-6 pb-12" dir={direction || 'rtl'}>
            {/* الهيدر */}
            <div className="takamol-page-header">
                <div className="flex items-center gap-3">
                    <div className="bg-[#e6f4ea] border border-[#00a651]/20 p-2.5 rounded-xl text-[var(--primary)]">
                        <Box size={24} />
                    </div>
                    <div>
                        <h1 className="takamol-page-title">إدارة الأصناف</h1>
                        <p className="takamol-page-subtitle">إدارة الأصناف المباشرة والمتفرعة والمجهزة والخامات</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/products/create', { state: { productNature: activeTab } })}
                    className="btn-primary"
                >
                    <Plus size={18} /> إضافة صنف
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* السايدبار - 4 أزرار */}
                <div className="w-full md:w-1/4 space-y-3">
                    <button
                        onClick={() => { setActiveTab('basic'); setSearchTerm(''); }}
                        className={cn("w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all border",
                            activeTab === 'basic' ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50")}
                    >
                        <Box size={20} /> الأصناف المباشرة
                    </button>
                    <button
                        onClick={() => { setActiveTab('sub'); setSearchTerm(''); }}
                        className={cn("w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all border",
                            activeTab === 'sub' ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50")}
                    >
                        <Layers size={20} /> الأصناف المتفرعة
                    </button>
                    <button
                        onClick={() => { setActiveTab('prepared'); setSearchTerm(''); }}
                        className={cn("w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all border",
                            activeTab === 'prepared' ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50")}
                    >
                        <Package size={20} /> الأصناف المجهزة
                    </button>
                    <button
                        onClick={() => { setActiveTab('materials'); setSearchTerm(''); }}
                        className={cn("w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all border",
                            activeTab === 'materials' ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50")}
                    >
                        <FolderPlus size={20} /> الخامات
                    </button>
                </div>

                {/* المحتوى الرئيسي */}
                <div className="w-full md:w-3/4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            {getTabIcon()}
                            {getTabTitle()}
                            <span className="mr-2 text-sm text-gray-500">({currentTableData.length})</span>
                        </h2>
                        <div className="relative w-72">
                            <input
                                type="text"
                                placeholder="ابحث بالاسم أو الكود..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="takamol-input pr-10"
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    {/* ✅ الجدول */}
                    <div className="overflow-x-auto">
                        <table className="takamol-table min-w-[900px]">
                            <thead>
                                <tr>
                                    {activeTab === 'basic' && (
                                        <>
                                            <th>الكود</th>
                                            <th>الاسم</th>
                                            <th>القسم</th>
                                            <th>السعر</th>
                                            <th>الكمية</th>
                                            <th className="w-40">إجراءات</th>
                                        </>
                                    )}
                                    {activeTab === 'sub' && (
                                        <>
                                            <th className="w-1/4">الاسم</th>
                                            {/* ✅ الخانة الجديدة للأصناف التابعة */}
                                            <th className="w-2/4">الأصناف التابعة</th>
                                            <th className="w-32">إجراءات</th>
                                        </>
                                    )}
                                    {activeTab === 'prepared' && (
                                        <>
                                            <th>الكود</th>
                                            <th>الاسم</th>
                                            <th>السعر</th>
                                            <th className="w-32">إجراءات</th>
                                        </>
                                    )}
                                    {activeTab === 'materials' && (
                                        <>
                                            <th>الكود</th>
                                            <th>الاسم</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {currentTableData.map((item: Product) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        {activeTab === 'basic' && (
                                            <>
                                                <td className="font-bold">{item.code || '-'}</td>
                                                <td className="font-bold">{item.name || '-'}</td>
                                                <td>
                                                    {item.category ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {item.category.split(',').map((cat: string, i: number) => (
                                                                <span key={i} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded">{cat.trim()}</span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="font-bold text-[var(--primary)]">{Number(item.price || 0).toFixed(2)}</td>
                                                <td dir="ltr">{item.quantity || '0'}</td>
                                                <td className="relative action-menu-container">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setMenuPosition({ top: rect.bottom + 5, left: rect.left + rect.width / 2 });
                                                            setActiveActionMenu(activeActionMenu === item.id ? null : item.id);
                                                            setSelectedProductId(item.id);
                                                        }}
                                                        className="bg-[var(--primary)] text-white px-3 py-1.5 rounded text-sm font-bold"
                                                    >
                                                        خيارات
                                                    </button>
                                                </td>
                                            </>
                                        )}

                                        {activeTab === 'sub' && (
                                            <>
                                                <td className="font-bold text-gray-800">{item.name || '-'}</td>
                                                {/* ✅ استدعاء الدالة السحرية لعرض الباجات */}
                                                <td>
                                                    {getChildrenNames(item)}
                                                </td>
                                                <td className="relative action-menu-container">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setMenuPosition({ top: rect.bottom + 5, left: rect.left + rect.width / 2 });
                                                            setActiveActionMenu(activeActionMenu === item.id ? null : item.id);
                                                            setSelectedProductId(item.id);
                                                        }}
                                                        className="bg-[var(--primary)] text-white px-3 py-1.5 rounded text-sm font-bold"
                                                    >
                                                        خيارات
                                                    </button>
                                                </td>
                                            </>
                                        )}

                                        {activeTab === 'prepared' && (
                                            <>
                                                <td className="font-bold">{item.code || '-'}</td>
                                                <td className="font-bold">{item.name || '-'}</td>
                                                <td className="font-bold text-[var(--primary)]">{Number(item.price || 0).toFixed(2)}</td>
                                                <td className="relative action-menu-container">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setMenuPosition({ top: rect.bottom + 5, left: rect.left + rect.width / 2 });
                                                            setActiveActionMenu(activeActionMenu === item.id ? null : item.id);
                                                            setSelectedProductId(item.id);
                                                        }}
                                                        className="bg-[var(--primary)] text-white px-3 py-1.5 rounded text-sm font-bold"
                                                    >
                                                        خيارات
                                                    </button>
                                                </td>
                                            </>
                                        )}

                                        {activeTab === 'materials' && (
                                            <>
                                                <td className="font-bold">{item.code || '-'}</td>
                                                <td className="font-bold">{item.name || '-'}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                                {currentTableData.length === 0 && (
                                    <tr><td colSpan={activeTab === 'basic' ? 6 : activeTab === 'sub' ? 3 : activeTab === 'prepared' ? 4 : 2} className="p-8 text-center text-gray-500">لا توجد بيانات</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ✅ القائمة المنسدلة */}
            {activeActionMenu && menuPosition && createPortal(
                <div
                    style={{ position: 'absolute', top: menuPosition.top, left: menuPosition.left, transform: 'translateX(-50%)', zIndex: 99999 }}
                    className="w-44 bg-white border border-gray-200 rounded-xl shadow-xl py-1 action-menu-dropdown"
                    dir="rtl"
                >
                    <button
                        onClick={() => {
                            const product = products.find((p: Product) => p.id === selectedProductId);
                            if (product) handleEditProduct(product);
                            setActiveActionMenu(null);
                        }}
                        className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Edit2 size={16} className="text-green-600" /> تعديل
                    </button>

                    <div className="h-px bg-gray-100 my-1" />

                    <button
                        onClick={() => { openDeleteModal(selectedProductId!); setActiveActionMenu(null); }}
                        className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                        <Trash2 size={16} /> حذف
                    </button>
                </div>,
                document.body
            )}

            {/* النوافذ المنبثقة للربط والإضافة */}
            <AnimatePresence>
                {showLinkModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
                        onClick={() => setShowLinkModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-orange-50">
                                <h2 className="text-lg font-bold text-orange-800 flex items-center gap-2">
                                    <Layers size={20} /> اختر الصنف المباشر للربط
                                </h2>
                                <button onClick={() => setShowLinkModal(false)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-100"><X size={20} /></button>
                            </div>
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                <div className="relative flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus-within:border-orange-400 transition-colors shadow-sm">
                                    <Search className="text-gray-400 shrink-0 ml-2" size={16} />
                                    <input type="text" placeholder="ابحث عن صنف مباشر..." value={extraSearchTerm} onChange={(e) => setExtraSearchTerm(e.target.value)} autoFocus className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700" />
                                </div>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-80 space-y-2">
                                {availableDirectProducts.map((directProduct: Product) => (
                                    <div key={directProduct.id} className="flex items-center justify-between p-3 border rounded-xl bg-white hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer" onClick={() => handleLinkSubProduct(directProduct)}>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800">{directProduct.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">كود: {directProduct.code} | قسم: {directProduct.category || 'عام'}</p>
                                        </div>
                                        <button className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm font-bold hover:bg-orange-200 transition-colors flex items-center gap-1"><Link2 size={14} /> ربط</button>
                                    </div>
                                ))}
                                {availableDirectProducts.length === 0 && <p className="text-center text-sm text-gray-500 py-6">لا توجد أصناف مباشرة مطابقة</p>}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showAddCategoryModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
                        onClick={() => setShowAddCategoryModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-purple-50">
                                <h2 className="text-lg font-bold text-purple-800 flex items-center gap-2">
                                    <FolderPlus size={20} /> اختر قسماً لإضافته
                                </h2>
                                <button onClick={() => setShowAddCategoryModal(false)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-100"><X size={20} /></button>
                            </div>
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                <div className="relative flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2.5 focus-within:border-purple-400 transition-colors shadow-sm">
                                    <Search className="text-gray-400 shrink-0 ml-2" size={16} />
                                    <input type="text" placeholder="ابحث عن قسم..." value={extraSearchTerm} onChange={(e) => setExtraSearchTerm(e.target.value)} autoFocus className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700" />
                                </div>
                            </div>
                            <div className="p-4 overflow-y-auto max-h-80 space-y-2">
                                {availableSubAsCategories.map((subProduct: Product) => {
                                    const directProduct = products.find((p: Product) => p.id === selectedProductId);
                                    const isAlreadyAdded = directProduct?.category?.split(',').map((c: string) => c.trim()).includes(subProduct.name);

                                    return (
                                        <div key={subProduct.id} className={cn("flex items-center justify-between p-3 border rounded-xl bg-white transition-all cursor-pointer", isAlreadyAdded ? "border-gray-200 bg-gray-50 opacity-60" : "hover:border-purple-300 hover:shadow-sm")}>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-800">{subProduct.name}</p>
                                                <p className="text-xs text-gray-500 mt-1">الصنف المتفرع</p>
                                            </div>
                                            <button
                                                onClick={() => !isAlreadyAdded && handleAddCategory(subProduct)}
                                                disabled={isAlreadyAdded}
                                                className={cn("px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 transition-colors", isAlreadyAdded ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-purple-100 text-purple-700 hover:bg-purple-200")}
                                            >
                                                <FolderPlus size={14} /> {isAlreadyAdded ? 'مضاف' : 'إضافة'}
                                            </button>
                                        </div>
                                    );
                                })}
                                {availableSubAsCategories.length === 0 && <p className="text-center text-sm text-gray-500 py-6">لا توجد أقسام متاحة</p>}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-sm p-6 text-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={30} /></div>
                            <h2 className="text-xl font-bold mb-2">هل أنت متأكد من الحذف؟</h2>
                            <p className="text-gray-500 mb-6 text-sm">هذا الإجراء لا يمكن التراجع عنه</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 bg-gray-100 rounded-xl font-bold hover:bg-gray-200">إلغاء</button>
                                <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600">حذف</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
