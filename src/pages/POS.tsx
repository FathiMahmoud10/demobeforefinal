// src/pages/POS.tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';
import { useWarehouses } from '../context/WarehousesContext';
import { cn } from '../lib/utils';
import { useProducts, type Product } from '../context/ProductsContext';
import { useAdditions } from '../context/AdditionsContext';
import { useCustomers } from '../context/CustomersContext';
import { useTables } from '../context/TablesContext';
import AddCustomerModal from '../components/AddCustomerModal';

import {
    Plus, Eye, Pencil, Trash2, X, Printer, Search,
    Clock, Calendar, Building, User, ShoppingCart, Layers, ChevronDown, 
    Save, Tag, Check, Power, Home, Banknote, CreditCard, Landmark, Wallet, Smartphone, Gift, PlusCircle, LayoutGrid
} from 'lucide-react';

// ==========================================
// 🚀 أيقونة الطاولة والكراسي
// ==========================================
const TableChairsIcon = ({ size = 24, className, strokeWidth = 2 }: { size?: number, className?: string, strokeWidth?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 19l1.5-7-1.5-6" />
        <path d="M4.5 12h3" />
        <path d="M7.5 12v7" />
        <path d="M21 19l-1.5-7 1.5-6" />
        <path d="M19.5 12h-3" />
        <path d="M16.5 12v7" />
        <path d="M8.5 9h7" />
        <path d="M10 9v10" />
        <path d="M14 9v10" />
        <path d="M9 11.5h6" />
    </svg>
);

interface CartItem extends Product {
    cartQuantity: number;
    selectedAdditions?: string[];
    notes?: string;
    discountValue?: number;
    discountType?: 'fixed' | 'percent';
}

interface Addition {
    id: string;
    name: string;
    code?: string;
}

const translations = {
    ar: {
        all: 'الكل',
        cashier: 'الكاشير',
        profile: 'الملف الشخصي',
        endShift: 'إنهاء الوردية',
        mainBranch: 'الفرع الرئيسي',
        searchPlaceholder: 'ابحث بالاسم أو الباركود...',
        cashCustomer: 'عميل نقدي',
        item: 'الصنف',
        price: 'السعر',
        qty: 'العدد',
        discountCol: 'الخصم',
        total: 'الإجمالي',
        delete: 'حذف',
        emptyCart: 'السلة فارغة',
        additions: 'إضافات',
        notesPlaceholder: 'ملاحظات عامة على الفاتورة...',
        subtotal: 'المجموع الأساسي:',
        discount: 'الخصم:',
        tax: 'الضريبة (15%):',
        requiredToPay: 'المطلوب سداده',
        currency: 'ر.س',
        invoice: 'الفاتورة',
        cancelAll: 'إلغاء الكل',
        checkoutTitle: 'إنهاء المبيع',
        salesRep: 'المندوب / الموظف (كاشير)',
        currentCashier: 'الكاشير الحالي',
        paidAmountLabel: 'المدفوع',
        addMorePayments: 'إضافة المزيد من المدفوعات',
        itemsCount: 'عدد الأصناف',
        totalDue: 'إجمالي مستحق',
        paid: 'المبلغ المدفوع',
        remaining: 'المبلغ المتبقي',
        saveInvoice: 'حفظ الفاتورة',
        print: 'طباعة',
        hasOptions: 'له خيارات',
        noItemsInCategory: 'لا توجد أصناف متاحة في هذا التصنيف',
        customerData: 'بيانات العميل',
        currentBalance: 'الرصيد الحالي',
        searchItem: 'البحث عن صنف (F10)',
        noSubItems: 'لا توجد أصناف تابعة لعرضها',
        cancel: 'إلغاء',
        selectSubProduct: 'اختر النوع المطلوب',
        availableAdditions: 'الإضافات المتاحة',
        done: 'تم',
        receiptPreview: 'معاينة الإيصال',
        storeName: 'اسم المتجر',
        thanks: 'شكراً لزيارتكم!',
        newInvoice: 'فاتورة جديدة',
        tables: 'الطاولات', 
        noTables: 'لا توجد طاولات', 
        table: 'طاولة', 
        methodCard: 'شبكة', methodCash: 'نقدي', methodBank: 'تحويل بنكي', 
        methodWallet: 'رصيد العميل', methodPoints: 'نقاطي', methodTabby: 'تابي', methodTamara: 'تمارا',
        editCustomerTitle: 'تعديل بيانات العميل',
        customerNameLabel: 'الاسم',
        customerPhoneLabel: 'الهاتف',
        customerGroupLabel: 'المجموعة',
        saveChanges: 'حفظ التعديلات',
        editBtn: 'تعديل',
        selectTable: 'اختر الطاولة المطلوبة',
        fixedDiscount: 'مبلغ',
        percentDiscount: 'نسبة',
    },
    en: {
        all: 'All',
        cashier: 'Cashier',
        profile: 'Profile',
        endShift: 'End Shift',
        mainBranch: 'Main Branch',
        searchPlaceholder: 'Search by name or barcode...',
        cashCustomer: 'Cash Customer',
        item: 'Item',
        price: 'Price',
        qty: 'Qty',
        discountCol: 'Discount',
        total: 'Total',
        delete: 'Delete',
        emptyCart: 'Cart is empty',
        additions: 'Additions',
        notesPlaceholder: 'General invoice notes...',
        subtotal: 'Subtotal:',
        discount: 'Discount:',
        tax: 'Tax (15%):',
        requiredToPay: 'Total Due',
        currency: 'SAR',
        invoice: 'Invoice',
        cancelAll: 'Clear All',
        checkoutTitle: 'Checkout',
        salesRep: 'Sales Rep / Cashier',
        currentCashier: 'Current Cashier',
        paidAmountLabel: 'Paid',
        addMorePayments: 'Add More Payments',
        itemsCount: 'Items Count',
        totalDue: 'Total Due',
        paid: 'Paid Amount',
        remaining: 'Remaining',
        saveInvoice: 'Save Invoice',
        print: 'Print',
        hasOptions: 'Options',
        noItemsInCategory: 'No items in this category',
        customerData: 'Customer Info',
        currentBalance: 'Current Balance',
        searchItem: 'Search Item (F10)',
        noSubItems: 'No sub-items to display',
        cancel: 'Cancel',
        selectSubProduct: 'Select Option',
        availableAdditions: 'Available Additions',
        done: 'Done',
        receiptPreview: 'Receipt Preview',
        storeName: 'Store Name',
        thanks: 'Thank you for your visit!',
        newInvoice: 'New Invoice',
        tables: 'Tables', 
        noTables: 'No tables available', 
        table: 'Table', 
        methodCard: 'Card', methodCash: 'Cash', methodBank: 'Bank Trf', 
        methodWallet: 'Wallet', methodPoints: 'Points', methodTabby: 'Tabby', methodTamara: 'Tamara',
        editCustomerTitle: 'Edit Customer Data',
        customerNameLabel: 'Name',
        customerPhoneLabel: 'Phone',
        customerGroupLabel: 'Group',
        saveChanges: 'Save Changes',
        editBtn: 'Edit',
        selectTable: 'Select a table',
        fixedDiscount: 'Fixed',
        percentDiscount: 'Percent',
    }
};

const isExcludedFromMain = (p: any) => {
    const nature = p.productNature ? String(p.productNature).toLowerCase().trim() : '';
    return ['raw', 'material', 'materials', 'خامة', 'prepared', 'مجهز'].includes(nature);
};

const getAllLinkedChildIds = (allProds: any[]) => {
    const linkedIds = new Set<string>();
    allProds.forEach(prod => {
        const childrenArray = prod.subProducts || prod.linkedProducts || [];
        if (Array.isArray(childrenArray)) {
            childrenArray.forEach((sub: any) => {
                if (sub && sub.id) linkedIds.add(String(sub.id));
                else if (typeof sub === 'string') linkedIds.add(sub);
            });
        }
    });
    return Array.from(linkedIds);
};

const getChildrenOfParent = (parent: any, allProds: any[]) => {
    let childIds: string[] = [];
    const childrenArray = parent.subProducts || parent.linkedProducts || [];
    if (Array.isArray(childrenArray)) {
        childrenArray.forEach((sub: any) => {
            if (sub && sub.id) childIds.push(String(sub.id));
            else if (typeof sub === 'string') childIds.push(sub);
        });
    }
    return allProds.filter(p => childIds.includes(String(p.id)) && !isExcludedFromMain(p));
};

// ==========================================
// 🎨 Unified Discount Input Component
// ==========================================
const DiscountInput = ({ 
    value, 
    type, 
    onChange, 
    currency 
}: { 
    value: number; 
    type: 'fixed' | 'percent'; 
    onChange: (value: number, type: 'fixed' | 'percent') => void;
    currency: string;
}) => {
    return (
        <div className="flex items-center rounded-lg overflow-hidden border-2 border-blue-100 bg-white mx-auto max-w-[130px] focus-within:border-blue-400 transition-colors">
            <input 
                type="number" 
                min="0"
                value={value || ''} 
                onChange={(e) => onChange(parseFloat(e.target.value) || 0, type)}
                className="w-14 text-center text-sm font-bold outline-none py-1.5 px-1 text-blue-900 bg-transparent"
                placeholder="0"
            />
            <div className="flex border-s border-blue-100 h-full">
                <button 
                    onClick={() => onChange(value, 'fixed')}
                    className={cn(
                        "px-1.5 py-1 text-[10px] font-black transition-all",
                        type === 'fixed' 
                            ? "bg-blue-600 text-white" 
                            : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    )}
                    title="خصم مبلغ ثابت"
                >
                    {currency}
                </button>
                <button 
                    onClick={() => onChange(value, 'percent')}
                    className={cn(
                        "px-1.5 py-1 text-[10px] font-black transition-all border-s border-blue-100",
                        type === 'percent' 
                            ? "bg-blue-600 text-white" 
                            : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                    )}
                    title="خصم نسبة مئوية"
                >
                    %
                </button>
            </div>
        </div>
    );
};

export default function POS() {
    const navigate = useNavigate(); 
    const { direction = 'rtl', language = 'ar' } = useLanguage() as { direction: 'rtl'|'ltr', language: 'ar'|'en' };
    const { products, loading: productsLoading } = useProducts();
    const { additions } = useAdditions();
    const { posSettings } = useSettings();
    const { warehouses } = useWarehouses();
    const { customers, addCustomer } = useCustomers() as any; 
    const { tables } = useTables(); 

    const t = (key: keyof typeof translations.ar) => translations[language]?.[key] || translations.ar[key];

    const searchRef = useRef<HTMLDivElement>(null);
    const searchRefBlue = useRef<HTMLDivElement>(null);

    const [selectedBranchId, setSelectedBranchId] = useState<string>(warehouses[0]?.id || '');
    const selectedBranch = warehouses.find(w => w.id === selectedBranchId);
    const isBlueScreen = selectedBranch?.showScreen2 && !selectedBranch?.showTouchScreen;

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
    const [showCustomerDetailsModal, setShowCustomerDetailsModal] = useState(false);
    const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showSubProductsModal, setShowSubProductsModal] = useState(false);
    const [currentParentProduct, setCurrentParentProduct] = useState<Product | null>(null);
    const [showAdditionsModal, setShowAdditionsModal] = useState(false);
    const [showTablesModal, setShowTablesModal] = useState(false); 
    const [currentCartItemForAdditions, setCurrentCartItemForAdditions] = useState<string | null>(null);

    const [selectedTable, setSelectedTable] = useState<any>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [invoiceDiscount, setInvoiceDiscount] = useState(0);
    const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
    const [orderNote, setOrderNote] = useState('');

    const defaultCustomer = {
        company: 'شخص عام', name: t('cashCustomer'), group: 'عام', phone: '0000000000',
        address: '', taxId: '', email: '', commercialRecord: '', openingBalance: '0',
        actualBalance: 0, creditLimit: '0', stopSelling: false, taxStatus: 'unregistered',
        pricingGroup: 'عام'
    };

    const [customer, setCustomer] = useState<any>(defaultCustomer);
    const [editCustomerData, setEditCustomerData] = useState({ ...customer });

    const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === t('cashCustomer')) {
            setCustomer(defaultCustomer);
        } else {
            const foundCustomer = customers.find((c: any) => c.name === val);
            if (foundCustomer) setCustomer(foundCustomer);
        }
    };

    const subtotalAmount = useMemo(() => {
        return cart.reduce((sum, item) => {
            const price = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
            const itemDiscount = item.discountType === 'percent' 
                ? price * ((item.discountValue || 0) / 100) 
                : (item.discountValue || 0);
            const finalPrice = Math.max(0, price - itemDiscount);
            return sum + (finalPrice * item.cartQuantity);
        }, 0);
    }, [cart]);

    const discountValue = useMemo(() => {
        return discountType === 'percent' ? subtotalAmount * (invoiceDiscount / 100) : invoiceDiscount;
    }, [subtotalAmount, invoiceDiscount, discountType]);

    const taxAmount = (subtotalAmount - discountValue) * 0.15;
    const totalInvoice = (subtotalAmount - discountValue) + taxAmount;

    const [payments, setPayments] = useState([{ id: 1, method: 'card', amount: totalInvoice }]);

    useEffect(() => {
        if (payments.length === 1) {
            setPayments([{ ...payments[0], amount: Number(totalInvoice.toFixed(2)) }]);
        }
    }, [totalInvoice]);

    const handleAddPayment = () => {
        const currentPaid = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
        const remaining = totalInvoice - currentPaid;
        setPayments([...payments, { id: Date.now(), method: 'cash', amount: remaining > 0 ? Number(remaining.toFixed(2)) : 0 }]);
    };

    const handleUpdatePayment = (id: number, field: string, value: any) => {
        setPayments(payments.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const handleRemovePayment = (id: number) => {
        setPayments(payments.filter(p => p.id !== id));
    };

    const totalPaidAmount = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const remainingAmount = totalInvoice - totalPaidAmount;
    const totalItemsCount = cart.reduce((sum, item) => sum + item.cartQuantity, 0);

    const paymentMethodsList = [
        { id: 'card', name: t('methodCard'), icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
        { id: 'cash', name: t('methodCash'), icon: Banknote, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
        { id: 'bank', name: t('methodBank'), icon: Landmark, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
        { id: 'wallet', name: t('methodWallet'), icon: Wallet, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
        { id: 'points', name: t('methodPoints'), icon: Gift, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
        { id: 'tabby', name: t('methodTabby'), icon: Smartphone, color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-200' },
        { id: 'tamara', name: t('methodTamara'), icon: Smartphone, color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-200' },
    ];

    const linkedChildIds = useMemo(() => getAllLinkedChildIds(products || []), [products]);
    const mainScreenProducts = useMemo(() => {
        if (!products) return [];
        const uniqueProducts = Array.from(new Map(products.map(p => [p.id, p])).values());
        return uniqueProducts.filter(p => !isExcludedFromMain(p) && !linkedChildIds.includes(String(p.id)));
    }, [products, linkedChildIds]);

    const visibleProducts = useMemo(() => {
        if (!selectedCategory) return mainScreenProducts;
        return mainScreenProducts.filter(p => p.category === selectedCategory);
    }, [mainScreenProducts, selectedCategory]);

    const categories = useMemo(() => {
        const cats = mainScreenProducts.map(p => p.category).filter(Boolean);
        return Array.from(new Set(cats));
    }, [mainScreenProducts]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setSearchResults([]);
            setShowSearchDropdown(false);
            return;
        }
        setShowSearchDropdown(true);
        const results = mainScreenProducts.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            (p.code && p.code.toLowerCase().includes(query.toLowerCase()))
        );
        setSearchResults(results);
    };

    const handleAddProduct = (product: Product) => {
        const children = getChildrenOfParent(product, products || []);
        const nature = product.productNature ? String(product.productNature).toLowerCase().trim() : '';
        const isParent = children.length > 0 || ['parent', 'متفرع', 'sub'].includes(nature);

        if (isParent) {
            setCurrentParentProduct(product);
            setShowSubProductsModal(true);
            return;
        }
        addToCart(product);
    };

    const addToCart = (product: Product, qty: number = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + qty } : item);
            }
            return [...prev, { ...product, cartQuantity: qty, selectedAdditions: [], notes: '', discountValue: 0, discountType: 'fixed' }];
        });
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchDropdown(false);
    };

    const handleSelectSubProduct = (subProduct: Product) => {
        addToCart(subProduct);
        setShowSubProductsModal(false);
        setCurrentParentProduct(null);
    };

    const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.cartQuantity + delta);
                return { ...item, cartQuantity: newQty };
            }
            return item;
        }));
    };

    const updateItemDiscount = (id: string, value: number, type: 'fixed' | 'percent') => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, discountValue: value, discountType: type };
            }
            return item;
        }));
    };

    const openAdditionsModal = (cartItemId: string) => {
        setCurrentCartItemForAdditions(cartItemId);
        setShowAdditionsModal(true);
    };

    const toggleAdditionForItem = (additionId: string) => {
        if (!currentCartItemForAdditions) return;
        setCart(prev => prev.map(item => {
            if (item.id === currentCartItemForAdditions) {
                const currentAdditions = item.selectedAdditions || [];
                const isAlreadySelected = currentAdditions.includes(additionId);
                return {
                    ...item,
                    selectedAdditions: isAlreadySelected 
                        ? currentAdditions.filter(id => id !== additionId)
                        : [...currentAdditions, additionId]
                };
            }
            return item;
        }));
    };

    const getAdditionName = (additionId: string) => {
        const addition = additions?.find((a: Addition) => a.id === additionId);
        return addition?.name || t('additions');
    };

    const isAdditionSelectedForItem = (additionId: string) => {
        if (!currentCartItemForAdditions) return false;
        const cartItem = cart.find(item => item.id === currentCartItemForAdditions);
        return cartItem?.selectedAdditions?.includes(additionId) || false;
    };

    const handleEditCustomerSave = () => {
        setCustomer(editCustomerData);
        setShowEditCustomerModal(false);
    };

    const handleAddCustomerSave = async (newCustomerData: any) => {
        if (newCustomerData.name && newCustomerData.name.trim() !== '') {
            const newCustomerObj = {
                id: Date.now().toString(),
                name: newCustomerData.name,
                phone: newCustomerData.phone || '0000000000',
                group: newCustomerData.customerGroup || 'عام',
                pricingGroup: newCustomerData.pricingGroup || 'عام',
                email: newCustomerData.email || '',
                taxId: newCustomerData.taxId || '',
                commercialRecord: newCustomerData.commercialRecord || '',
                accountCode: newCustomerData.accountCode || '',
                openingBalance: newCustomerData.openingBalance || 0,
                actualBalance: newCustomerData.openingBalance || 0, 
                creditLimit: newCustomerData.creditLimit || 0,
                stopSelling: newCustomerData.stopSelling || false,
                taxStatus: newCustomerData.isTaxRegistered ? 'registered' : 'unregistered',
                address: newCustomerData.isTaxRegistered 
                    ? `${newCustomerData.city || ''} - ${newCustomerData.district || ''} - ${newCustomerData.street || ''}` 
                    : '',
                city: newCustomerData.city || '',
                district: newCustomerData.district || '',
                street: newCustomerData.street || '',
                postalCode: newCustomerData.postalCode || '',
                buildingNo: newCustomerData.buildingNo || '',
                additionalNo: newCustomerData.additionalNo || ''
            };

            try {
                if (addCustomer) await addCustomer(newCustomerObj);
                setCustomer({ ...customer, ...newCustomerObj });
                setShowAddCustomerModal(false);
            } catch (error) {
                console.error("Error saving customer:", error);
                setCustomer({ ...customer, ...newCustomerObj });
                setShowAddCustomerModal(false);
            }
        }
    };

    const resetCart = () => {
        setCart([]); 
        setInvoiceDiscount(0); 
        setOrderNote('');
        setPayments([{ id: 1, method: 'card', amount: 0 }]); 
        setSelectedTable(null);
    };

    // ==========================================
    // 🎨 IMPROVED Product Card for Touch Screen
    // ==========================================
    const ProductCard = ({ product }: { product: Product }) => {
        const price = parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0;
        const nature = product.productNature ? String(product.productNature).toLowerCase().trim() : '';
        const isParentBadge = getChildrenOfParent(product, products || []).length > 0 || ['parent', 'متفرع', 'sub'].includes(nature);
        const inCart = cart.find(item => item.id === product.id);

        return (
            <button
                onClick={() => handleAddProduct(product)}
                className="relative group flex flex-col bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.97]"
                style={{
                    borderRadius: '20px',
                    boxShadow: inCart 
                        ? '0 0 0 2.5px #00a651, 0 8px 24px -8px rgba(0,166,81,0.25)' 
                        : '0 2px 12px -4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)',
                }}
            >
                {/* Options badge */}
                {isParentBadge && (
                    <div className="absolute top-2.5 start-2.5 z-20">
                        <div className="bg-amber-400 text-amber-900 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <LayoutGrid size={8} strokeWidth={3} />
                            {t('hasOptions')}
                        </div>
                    </div>
                )}

                {/* Cart indicator */}
                {inCart && (
                    <div className="absolute top-2.5 end-2.5 z-20 w-6 h-6 bg-[#00a651] rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white text-[10px] font-black">{inCart.cartQuantity}</span>
                    </div>
                )}

                {/* Image area */}
                <div className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden" style={{ height: '130px' }}>
                    <img 
                        src={product.image || `https://api.dicebear.com/7.x/icons/svg?seed=${product.id}`} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/300x300/f1f5f9/94a3b8?text=' + encodeURIComponent(product.name[0] || '?') }} 
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#0c4a3b]/0 group-hover:bg-[#0c4a3b]/10 transition-all duration-300 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                            <Plus size={20} className="text-[#0c4a3b]" strokeWidth={3} />
                        </div>
                    </div>
                </div>

                {/* Info area */}
                <div className="flex flex-col flex-1 p-3 gap-1">
                    {product.category && (
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide truncate">
                            {product.category}
                        </span>
                    )}
                    <span className="text-[13px] font-bold text-gray-800 leading-tight line-clamp-2 flex-1">
                        {product.name}
                    </span>
                    <div className="flex items-center justify-between mt-1 pt-2 border-t border-gray-100">
                        <div className="flex items-baseline gap-1">
                            <span className="text-[15px] font-black text-[#0c4a3b]">{price.toFixed(2)}</span>
                            <span className="text-[9px] font-bold text-gray-400">{t('currency')}</span>
                        </div>
                        <div className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200",
                            inCart ? "bg-[#00a651]" : "bg-gray-100 group-hover:bg-[#0c4a3b]"
                        )}>
                            <Plus size={14} className={cn("transition-colors", inCart ? "text-white" : "text-gray-500 group-hover:text-white")} strokeWidth={3} />
                        </div>
                    </div>
                </div>
            </button>
        );
    };

    const renderTouchScreen = () => (
        <main className="flex-1 flex overflow-hidden relative">
            <section className="flex-1 flex flex-col min-w-0 bg-[#f4f6f8]">
                <div className="flex-none bg-white px-4 pt-3 pb-0 flex gap-2 overflow-x-auto border-b border-gray-200">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={cn("flex flex-col items-center justify-center py-2.5 px-4 min-w-[100px] rounded-t-xl transition-all border-b-4", !selectedCategory ? "bg-[#0c4a3b] text-white border-[#083d2f]" : "bg-[#106b56] text-white/90 border-transparent hover:bg-[#0c4a3b]")}
                    >
                        <span className="font-bold text-sm">{t('all')}</span>
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn("flex flex-col items-center justify-center py-2.5 px-4 min-w-[100px] rounded-t-xl transition-all border-b-4", selectedCategory === cat ? "bg-[#0c4a3b] text-white border-[#083d2f]" : "bg-[#106b56] text-white/90 border-transparent hover:bg-[#0c4a3b]")}
                        >
                            <span className="font-bold text-sm truncate max-w-full">{cat}</span>
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                        {visibleProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                        {visibleProducts.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center py-32 text-gray-400 font-bold">
                                <ShoppingCart size={56} className="mb-4 opacity-30 mx-auto" />
                                {t('noItemsInCategory')}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <aside className="bg-white border-s border-gray-200 shadow-[-5px_0_15px_rgba(0,0,0,0.05)] flex flex-col z-30 flex-shrink-0 w-[340px]">
                <div className="flex flex-col h-full">
                    <div className="flex-none p-4 border-b border-gray-200 flex flex-col gap-3">
                        <div className="flex gap-2">
                            <select
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-[#0c4a3b] bg-gray-50 text-start"
                                value={customer.name}
                                onChange={handleCustomerChange}
                            >
                                <option value={t('cashCustomer')}>{t('cashCustomer')}</option>
                                {customers?.map((c: any) => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                            <div className="flex items-center gap-1 border border-gray-300 rounded-lg px-1 bg-white">
                                <button onClick={() => setShowAddCustomerModal(true)} className="text-[#0c4a3b] hover:bg-green-50 p-1.5 rounded-md"><Plus size={16} /></button>
                                <button onClick={() => {
                                    setEditCustomerData({ ...customer });
                                    setShowCustomerDetailsModal(true);
                                }} className="text-[#0c4a3b] hover:bg-green-50 p-1.5 rounded-md"><Eye size={16} /></button>
                            </div>
                        </div>
                        <div className="relative flex items-center" ref={searchRef}>
                            <div className="absolute start-3 text-gray-400 z-10 pointer-events-none flex items-center justify-center"><Search size={16} /></div>
                            <input type="text" placeholder={t('searchPlaceholder')} className="w-full border-2 border-gray-300 rounded-lg py-2 text-sm font-bold outline-none focus:border-[#0c4a3b] bg-white ps-9 pe-3" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)} />
                            {showSearchDropdown && searchResults.length > 0 && (
                                <div className="absolute z-[100] top-full mt-2 end-0 start-0 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-y-auto">
                                    {searchResults.map(product => (
                                        <button key={product.id} onClick={() => { handleAddProduct(product); setShowSearchDropdown(false); }} className="w-full text-start px-4 py-3 hover:bg-green-50 border-b border-gray-100 last:border-0 flex justify-between items-center transition-colors">
                                            <span className="font-bold text-gray-800 text-sm">{product.name}</span>
                                            <span className="text-[#0c4a3b] font-black text-sm bg-green-50 px-2 py-1 rounded-md">{product.price} {t('currency')}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto bg-white">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10 border-b-2 border-gray-200 text-xs text-start">
                                <tr>
                                    <th className="p-2 font-bold w-[30%] text-start">{t('item')}</th>
                                    <th className="p-2 font-bold text-center w-[13%]">{t('price')}</th>
                                    <th className="p-2 font-bold text-center w-[24%]">{t('discountCol')}</th>
                                    <th className="p-2 font-bold text-center w-[15%]">{t('qty')}</th>
                                    <th className="p-2 font-bold text-center w-[13%]">{t('total')}</th>
                                    <th className="p-2 font-bold text-center w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-xs">
                                {cart.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center gap-3">
                                                <ShoppingCart size={32} className="opacity-30" />
                                                <span className="font-bold text-sm">{t('emptyCart')}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    cart.map(item => {
                                        const price = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
                                        const itemDiscountAmt = item.discountType === 'percent'
                                            ? price * ((item.discountValue || 0) / 100)
                                            : (item.discountValue || 0);
                                        const itemFinalPrice = Math.max(0, price - itemDiscountAmt);
                                        return (
                                            <tr key={item.id} className="hover:bg-green-50/50 transition-colors">
                                                <td className="p-2 font-bold text-gray-800 text-start">
                                                    <div className="flex items-center gap-1.5">
                                                        {item.productNature === 'sub' && <Layers size={12} className="text-[#0c4a3b] shrink-0" />}
                                                        <span className="truncate max-w-[80px]">{item.name}</span>
                                                        <button onClick={() => openAdditionsModal(item.id)} className="text-blue-600 hover:bg-blue-50 p-1 rounded" title={t('additions')}><Tag size={12} /></button>
                                                    </div>
                                                    {item.selectedAdditions?.length ? (
                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                            {item.selectedAdditions.map(aid => (
                                                                <span key={aid} className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[9px]">{getAdditionName(aid)}</span>
                                                            ))}
                                                        </div>
                                                    ) : null}
                                                </td>
                                                <td className="p-2 text-center text-gray-600 font-bold">{price.toFixed(2)}</td>
                                                {/* ✅ خصم: حقلين (قيمة + نسبة) في نفس الخلية */}
                                                <td className="p-1 text-center">
                                                    <div className="flex items-center justify-center gap-0.5">
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            <span className="text-[8px] text-gray-400 font-bold leading-none">{t('currency')}</span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={item.discountType === 'fixed' ? (item.discountValue || '') : ''}
                                                                onChange={(e) => updateItemDiscount(item.id, parseFloat(e.target.value) || 0, 'fixed')}
                                                                onFocus={() => updateItemDiscount(item.id, item.discountType === 'percent' ? 0 : (item.discountValue || 0), 'fixed')}
                                                                placeholder="0"
                                                                className={cn(
                                                                    "w-10 text-center text-[10px] font-bold outline-none py-1 rounded border transition-colors",
                                                                    item.discountType === 'fixed' && (item.discountValue || 0) > 0
                                                                        ? "border-[#0c4a3b] bg-green-50 text-[#0c4a3b]"
                                                                        : "border-gray-200 bg-gray-50 text-gray-500"
                                                                )}
                                                            />
                                                        </div>
                                                        <span className="text-gray-300 text-xs font-bold">|</span>
                                                        <div className="flex flex-col items-center gap-0.5">
                                                            <span className="text-[8px] text-gray-400 font-bold leading-none">%</span>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="100"
                                                                value={item.discountType === 'percent' ? (item.discountValue || '') : ''}
                                                                onChange={(e) => updateItemDiscount(item.id, parseFloat(e.target.value) || 0, 'percent')}
                                                                onFocus={() => updateItemDiscount(item.id, item.discountType === 'fixed' ? 0 : (item.discountValue || 0), 'percent')}
                                                                placeholder="0"
                                                                className={cn(
                                                                    "w-10 text-center text-[10px] font-bold outline-none py-1 rounded border transition-colors",
                                                                    item.discountType === 'percent' && (item.discountValue || 0) > 0
                                                                        ? "border-orange-400 bg-orange-50 text-orange-600"
                                                                        : "border-gray-200 bg-gray-50 text-gray-500"
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-2 text-center">
                                                    <div className="flex items-center justify-center gap-1 bg-gray-100 rounded-md p-0.5">
                                                        <button onClick={() => updateQuantity(item.id, -1)} className="w-5 h-5 bg-white rounded shadow text-xs">-</button>
                                                        <span className="w-6 text-center text-xs">{item.cartQuantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, 1)} className="w-5 h-5 bg-white rounded shadow text-xs">+</button>
                                                    </div>
                                                </td>
                                                <td className="p-2 text-center font-black text-[#0c4a3b]">{(itemFinalPrice * item.cartQuantity).toFixed(2)}</td>
                                                <td className="p-2 text-center">
                                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={14} /></button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex-none bg-gray-50 border-t-2 border-gray-200 p-4">
                        <div className="mb-3">
                            <textarea 
                                value={orderNote} 
                                onChange={(e) => setOrderNote(e.target.value)} 
                                placeholder={t('notesPlaceholder')} 
                                className="w-full text-xs border border-gray-300 rounded-lg p-2 resize-none focus:border-[#0c4a3b] focus:outline-none bg-white shadow-sm text-start" 
                                rows={2} 
                            />
                        </div>
                        
                        <div className="space-y-2 mb-3 text-sm">
                            <div className="flex justify-between font-bold text-gray-600">
                                <span>{t('subtotal')}</span>
                                <span>{subtotalAmount.toFixed(2)} {t('currency')}</span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-800 items-center">
                                <span>{t('discount')}</span>
                                <div className="flex items-center gap-1">
                                    <input type="number" value={invoiceDiscount} onChange={(e) => setInvoiceDiscount(parseFloat(e.target.value) || 0)} className="w-14 border rounded px-1 text-center text-sm" />
                                    <button onClick={() => setDiscountType(discountType === 'fixed' ? 'percent' : 'fixed')} className="bg-gray-200 px-2 rounded text-xs py-0.5">{discountType === 'percent' ? '%' : t('currency')}</button>
                                </div>
                            </div>
                            <div className="flex justify-between font-bold text-gray-600 border-t pt-2">
                                <span>{t('tax')}</span>
                                <span className="text-red-500">{taxAmount.toFixed(2)} {t('currency')}</span>
                            </div>
                        </div>
                        <div className="bg-[#0c4a3b] text-white p-3 rounded-xl flex items-center justify-between shadow-lg mb-3">
                            <span className="text-sm font-bold">{t('requiredToPay')}</span>
                            <span className="text-2xl font-black">{totalInvoice.toFixed(2)} <span className="text-xs">{t('currency')}</span></span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowCheckoutModal(true)} disabled={cart.length === 0} className="flex-1 bg-[#00a651] text-white py-2.5 rounded-xl font-black text-lg hover:bg-[#008f45] transition-all disabled:opacity-50">{t('invoice')}</button>
                            <button onClick={resetCart} className="bg-red-500 text-white px-3 rounded-xl hover:bg-red-600"><Trash2 size={18} /></button>
                        </div>
                    </div>
                </div>
            </aside>
        </main>
    );

    // ==========================================
    // 🔵 Traditional/Blue Screen with improved discount input
    // ==========================================
    const renderTraditionalScreen = () => (
        <main className="flex-1 flex flex-col overflow-hidden p-4 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-4 grid grid-cols-1 md:grid-cols-3 gap-4 flex-none">
                <div className="space-y-2 relative" ref={searchRefBlue}>
                    <label className="text-sm font-bold text-blue-800 block text-start">{t('searchItem')}</label>
                    <div className="relative flex items-center">
                        <div className="absolute start-3 text-blue-400 z-10 pointer-events-none"><Search size={18} /></div>
                        <input type="text" placeholder={t('searchPlaceholder')} className="w-full border-2 border-blue-200 rounded-xl py-2.5 ps-10 pe-4 text-sm font-bold outline-none focus:border-blue-500 text-start" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)} />
                        {showSearchDropdown && searchResults.length > 0 && (
                            <div className="absolute z-[100] top-full mt-2 end-0 start-0 bg-white border-2 border-blue-200 rounded-xl shadow-2xl max-h-72 overflow-y-auto">
                                {searchResults.map(product => (
                                    <button key={product.id} onClick={() => { handleAddProduct(product); setShowSearchDropdown(false); }} className="w-full text-start px-4 py-3 hover:bg-blue-50 border-b flex justify-between items-center">
                                        <span className="font-bold">{product.name}</span>
                                        <span className="text-blue-700 font-black">{product.price} {t('currency')}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-2 relative">
                    <label className="text-sm font-bold text-blue-800 block text-start">{t('customerData')}</label>
                    <div className="flex">
                        <select className="flex-1 border-2 border-blue-200 rounded-s-xl py-2.5 px-3 text-sm font-bold outline-none text-start" value={customer.name} onChange={handleCustomerChange}>
                            <option value={t('cashCustomer')}>{t('cashCustomer')}</option>
                            {customers?.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                        <button onClick={() => setShowAddCustomerModal(true)} className="bg-blue-600 text-white px-4 hover:bg-blue-700"><Plus size={18} /></button>
                        <button onClick={() => {
                            setEditCustomerData({ ...customer });
                            setShowCustomerDetailsModal(true);
                        }} className="bg-blue-500 text-white px-4 rounded-e-xl hover:bg-blue-600"><Eye size={18} /></button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-blue-800 block text-start">{t('currentBalance')}</label>
                    <input type="text" readOnly value={customer.actualBalance || "0"} className="w-full border-2 border-blue-200 rounded-xl px-4 py-2.5 text-center bg-gray-50 font-bold text-gray-700 outline-none" />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 flex-1 flex flex-col min-h-[300px] overflow-hidden">
                <div className="overflow-y-auto flex-1">
                    <table className="w-full text-sm text-start">
                        <thead className="bg-blue-600 text-white sticky top-0 z-10 text-start">
                            <tr>
                                <th className="p-3 font-bold text-start">{t('item')}</th>
                                <th className="p-3 text-center w-28">{t('price')}</th>
                                <th className="p-3 text-center w-40">{t('discountCol')}</th>
                                <th className="p-3 text-center w-32">{t('qty')}</th>
                                <th className="p-3 text-center w-28">{t('total')}</th>
                                <th className="p-3 w-16 text-center">{t('delete')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                            {cart.length === 0 ? (
                                <tr><td colSpan={6} className="p-16 text-center text-blue-300 font-bold">{t('emptyCart')}</td></tr>
                            ) : (
                                cart.map(item => {
                                    const price = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
                                    const itemDiscountAmount = item.discountType === 'percent' 
                                        ? price * ((item.discountValue || 0) / 100) 
                                        : (item.discountValue || 0);
                                    const itemFinalPrice = Math.max(0, price - itemDiscountAmount);
                                    const itemTotal = itemFinalPrice * item.cartQuantity;

                                    return (
                                        <tr key={item.id} className="hover:bg-blue-50">
                                            <td className="p-3 text-start font-bold">
                                                <div className="flex items-center gap-2 justify-start">
                                                    {item.name}
                                                    <button onClick={() => openAdditionsModal(item.id)} className="ms-2 text-blue-600"><Tag size={14} /></button>
                                                </div>
                                            </td>
                                            <td className="p-3 text-center font-bold text-gray-600">{price.toFixed(2)}</td>
                                            {/* ✅ IMPROVED: Unified discount input with both fixed & percent */}
                                            <td className="p-3 text-center">
                                                <DiscountInput
                                                    value={item.discountValue || 0}
                                                    type={item.discountType || 'fixed'}
                                                    onChange={(value, type) => updateItemDiscount(item.id, value, type)}
                                                    currency={t('currency')}
                                                />
                                            </td>
                                            <td className="p-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 bg-blue-100 rounded">-</button>
                                                    <span className="w-10 text-center font-bold">{item.cartQuantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 bg-blue-100 rounded">+</button>
                                                </div>
                                            </td>
                                            <td className="p-3 text-center font-black text-blue-900">{itemTotal.toFixed(2)}</td>
                                            <td className="p-3 text-center"><button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18} /></button></td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-4 flex-none">
                <div className="mb-4">
                    <textarea 
                        value={orderNote} 
                        onChange={(e) => setOrderNote(e.target.value)} 
                        placeholder={t('notesPlaceholder')} 
                        className="w-full text-sm border-2 border-blue-100 rounded-xl p-3 resize-none focus:border-blue-500 focus:outline-none bg-blue-50/30 text-start" 
                        rows={2} 
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                        <span className="text-sm text-blue-600 font-bold">{t('subtotal')}</span>
                        <div className="text-xl font-black text-blue-900">{subtotalAmount.toFixed(2)}</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                        <span className="text-sm text-blue-600 font-bold">{t('discount')}</span>
                        <div className="text-xl font-black text-red-600">{discountValue.toFixed(2)}</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                        <span className="text-sm text-blue-600 font-bold">{t('tax')}</span>
                        <div className="text-xl font-black text-blue-900">{taxAmount.toFixed(2)}</div>
                    </div>
                    <div className="bg-blue-600 p-4 rounded-xl shadow-lg text-center text-white">
                        <span className="text-sm font-bold opacity-90">{t('requiredToPay')}</span>
                        <div className="text-3xl font-black">{totalInvoice.toFixed(2)}</div>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <button onClick={() => setShowCheckoutModal(true)} disabled={cart.length === 0} className="bg-blue-600 text-white px-10 py-3.5 rounded-xl font-black hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"><Save size={22} /> {t('invoice')}</button>
                    <button onClick={resetCart} className="text-red-600 font-bold hover:underline flex items-center gap-1"><Trash2 size={20} /> {t('cancelAll')}</button>
                </div>
            </div>
        </main>
    );

    if (productsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50" dir={direction}>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0c4a3b] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[9999] w-screen h-screen flex flex-col bg-[#eef1f5] overflow-hidden" dir={direction}>
            <header className={cn("flex-none border-b px-4 py-2 flex items-center justify-between shadow-sm z-50 transition-colors", isBlueScreen ? "bg-blue-700 border-blue-800" : "bg-white border-gray-200")}>
                <div className="flex items-center gap-6">
                    <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border", isBlueScreen ? "bg-blue-600/50 text-white border-blue-500/50" : "bg-[#0c4a3b]/10 text-[#0c4a3b] border-[#0c4a3b]/20")}>
                        <Building size={16} />
                        <span className="text-sm font-bold">{selectedBranch?.name || t('mainBranch')}</span>
                    </div>
                    <div className={cn("flex items-center gap-2 font-bold text-sm px-3 py-1.5 rounded-lg border", isBlueScreen ? "bg-blue-800/50 text-white" : "text-gray-600 bg-gray-50")}>
                        <Clock size={16} /> <span>{currentTime.toLocaleTimeString('en-GB')}</span>
                        <span className="mx-1 opacity-50">|</span>
                        <Calendar size={16} /> <span>{currentTime.toLocaleDateString(language === 'en' ? 'en-US' : 'ar-EG')}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {!isBlueScreen && (
                        <button 
                            onClick={() => setShowTablesModal(true)} 
                            className={cn("flex items-center gap-2 px-4 py-2 rounded-lg border font-bold text-sm transition-all shadow-sm", 
                                selectedTable ? "bg-[#00a651] border-[#008f45] text-white" : "bg-green-50 border-green-100 text-[#0c4a3b] hover:bg-[#00a651] hover:text-white")} 
                            title={t('tables')}
                        >
                            <TableChairsIcon size={20} strokeWidth={2.5} />
                            <span className="hidden sm:inline">
                                {selectedTable ? `${t('table')}: ${selectedTable.name}` : t('tables')}
                            </span>
                        </button>
                    )}

                    <button onClick={() => navigate('/dashboard')} className={cn("w-10 h-10 rounded-lg border flex items-center justify-center transition-all shadow-sm", isBlueScreen ? "bg-blue-600 border-blue-500 text-white hover:bg-blue-800" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-[#0c4a3b]")} title="Dashboard"><Home size={20} /></button>
                    <button onClick={() => navigate('/')} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg border font-bold text-sm transition-all shadow-sm", isBlueScreen ? "bg-red-500 border-red-600 text-white hover:bg-red-600" : "bg-red-50 border-red-100 text-red-600 hover:bg-red-500 hover:text-white")} title={t('endShift')}><Power size={18} /><span className="hidden sm:inline">{t('endShift')}</span></button>
                    <div className={cn("flex items-center gap-2 px-3 py-1 rounded-lg border cursor-pointer transition-colors shadow-sm", isBlueScreen ? "bg-white/10 border-blue-500 hover:bg-white/20" : "bg-gray-50 border-gray-200 hover:bg-gray-100")}>
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0", isBlueScreen ? "bg-blue-600" : "bg-[#0c4a3b]")}>
                            <User size={16} />
                        </div>
                        <div className="text-start">
                            <div className={cn("text-xs font-bold", isBlueScreen ? "text-white" : "text-gray-800")}>{t('cashier')}</div>
                            <div className={cn("text-[9px] font-bold", isBlueScreen ? "text-blue-200" : "text-[#00a651]")}>{t('profile')}</div>
                        </div>
                    </div>
                </div>
            </header>

            {isBlueScreen ? renderTraditionalScreen() : renderTouchScreen()}

            <AddCustomerModal 
                isOpen={showAddCustomerModal} 
                onClose={() => setShowAddCustomerModal(false)} 
                onAdd={handleAddCustomerSave} 
            />

            {/* مودال إنهاء المبيع */}
            {showCheckoutModal && (
                <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowCheckoutModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh]" onClick={e => e.stopPropagation()}>
                        
                        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="font-bold text-xl text-gray-800">{t('checkoutTitle')}</h2>
                            <button onClick={() => setShowCheckoutModal(false)} className="text-gray-400 hover:bg-gray-200 p-1.5 rounded-full transition-colors"><X size={22} /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="space-y-1.5 text-start">
                                    <label className="text-sm font-bold text-gray-600">{t('salesRep')}</label>
                                    <select className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#0c4a3b] bg-white text-start font-bold text-gray-800">
                                        <option>{t('currentCashier')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {payments.map((payment) => (
                                    <div key={payment.id} className="relative bg-white border-2 border-gray-100 rounded-xl p-4 shadow-sm">
                                        {payments.length > 1 && (
                                            <button 
                                                onClick={() => handleRemovePayment(payment.id)} 
                                                className="absolute -top-3 -start-3 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors border border-red-200 shadow-sm z-10"
                                                title={t('delete')}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                            <div className="w-full md:w-32 shrink-0">
                                                <label className="block text-xs font-bold text-gray-500 mb-1 text-center md:text-start">{t('paidAmountLabel')}</label>
                                                <input 
                                                    type="number" 
                                                    value={payment.amount}
                                                    onChange={(e) => handleUpdatePayment(payment.id, 'amount', e.target.value)}
                                                    className="w-full border-2 border-[#0c4a3b]/20 rounded-lg p-3 text-center font-black text-xl text-[#0c4a3b] focus:border-[#0c4a3b] outline-none shadow-inner bg-green-50/30"
                                                />
                                            </div>

                                            <div className="flex-1 flex flex-wrap gap-2 justify-end w-full">
                                                {paymentMethodsList.map(method => {
                                                    const Icon = method.icon;
                                                    const isSelected = payment.method === method.id;
                                                    return (
                                                        <button 
                                                            key={method.id}
                                                            onClick={() => handleUpdatePayment(payment.id, 'method', method.id)}
                                                            className={cn(
                                                                "flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all w-[70px] h-[70px]",
                                                                isSelected 
                                                                    ? `border-[#0c4a3b] bg-[#0c4a3b]/5 shadow-md` 
                                                                    : `border-gray-100 hover:border-gray-300 bg-white hover:bg-gray-50`
                                                            )}
                                                        >
                                                            <Icon size={24} className={cn("mb-1", isSelected ? 'text-[#0c4a3b]' : method.color)} />
                                                            <span className={cn("text-[10px] font-bold text-center leading-tight", isSelected ? 'text-[#0c4a3b]' : 'text-gray-600')}>{method.name}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button 
                                    onClick={handleAddPayment} 
                                    className="w-full bg-[#0c4a3b]/10 hover:bg-[#0c4a3b]/20 text-[#0c4a3b] border-2 border-dashed border-[#0c4a3b]/30 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    <PlusCircle size={20} />
                                    {t('addMorePayments')}
                                </button>
                            </div>

                            <div className="bg-gray-100 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 border border-gray-200">
                                <div className="text-center space-y-1">
                                    <div className="text-gray-500 text-xs font-bold">{t('itemsCount')}</div>
                                    <div className="text-lg font-black text-gray-800">{totalItemsCount}</div>
                                </div>
                                <div className="text-center space-y-1 border-s border-gray-300">
                                    <div className="text-gray-500 text-xs font-bold">{t('totalDue')}</div>
                                    <div className="text-lg font-black text-gray-800">{totalInvoice.toFixed(2)}</div>
                                </div>
                                <div className="text-center space-y-1 border-s border-gray-300">
                                    <div className="text-gray-500 text-xs font-bold">{t('paid')}</div>
                                    <div className="text-lg font-black text-green-600">{totalPaidAmount.toFixed(2)}</div>
                                </div>
                                <div className="text-center space-y-1 border-s border-gray-300">
                                    <div className="text-gray-500 text-xs font-bold">{t('remaining')}</div>
                                    <div className={cn("text-lg font-black", remainingAmount > 0 ? "text-red-500" : "text-gray-800")}>
                                        {remainingAmount.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-3">
                            <button 
                                onClick={() => {
                                    resetCart();
                                    setShowCheckoutModal(false);
                                }}
                                className="flex-1 bg-[#00a651] hover:bg-[#008f45] text-white py-3.5 rounded-xl font-black text-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                            >
                                <Save size={24} /> {t('saveInvoice')}
                            </button>
                            <button 
                                onClick={() => {
                                    setShowCheckoutModal(false);
                                    setShowReceiptModal(true);
                                }}
                                className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3.5 rounded-xl font-black text-lg transition-colors flex items-center justify-center gap-2 shadow-md"
                            >
                                <Printer size={24} /> {t('print')}
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* عرض بيانات العميل */}
            {showCustomerDetailsModal && (
                <div className="fixed inset-0 bg-black/40 z-[10000] flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-sm transition-all" onClick={() => setShowCustomerDetailsModal(false)}>
                    <div className="bg-[#f4f6f8] rounded-t-[32px] sm:rounded-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] w-full max-w-md overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="w-full flex justify-center pt-4 pb-2 bg-white rounded-t-[32px]">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="px-6 pb-6 pt-2 bg-white flex flex-col items-center relative rounded-b-[32px] shadow-sm z-10">
                            <button onClick={() => setShowCustomerDetailsModal(false)} className="absolute top-2 start-6 bg-gray-50 text-gray-400 p-2.5 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors">
                                <X size={20} strokeWidth={3} />
                            </button>
                            <div className="w-16 h-16 bg-gradient-to-tr from-green-100 to-green-50 rounded-[20px] flex items-center justify-center mb-4 shadow-inner border border-green-100">
                                <User size={32} className="text-[#0c4a3b]" strokeWidth={2.5} />
                            </div>
                            <h2 className="font-black text-2xl text-gray-800 text-center">{t('customerData')}</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-white p-4 rounded-[20px] shadow-sm flex justify-between items-center border border-gray-100">
                                <span className="font-bold text-gray-500">{t('customerNameLabel')}</span>
                                <span className="font-black text-[#0c4a3b]">{customer.name}</span>
                            </div>
                            <div className="bg-white p-4 rounded-[20px] shadow-sm flex justify-between items-center border border-gray-100">
                                <span className="font-bold text-gray-500">{t('customerPhoneLabel')}</span>
                                <span className="font-black text-[#0c4a3b]">{customer.phone}</span>
                            </div>
                            <div className="bg-white p-4 rounded-[20px] shadow-sm flex justify-between items-center border border-gray-100">
                                <span className="font-bold text-gray-500">{t('customerGroupLabel')}</span>
                                <span className="font-black text-[#0c4a3b]">{customer.group}</span>
                            </div>
                        </div>
                        <div className="p-4 bg-white flex gap-3 rounded-b-[32px] sm:rounded-none">
                            <button onClick={() => setShowCustomerDetailsModal(false)} className="flex-1 px-6 py-3.5 bg-gray-100 rounded-xl font-bold text-gray-700 hover:bg-gray-200 transition-colors text-lg">{t('cancel')}</button>
                            <button onClick={() => { setShowCustomerDetailsModal(false); setShowEditCustomerModal(true); }} className="flex-1 px-6 py-3.5 bg-[#00a651] text-white rounded-xl font-black shadow-md hover:bg-[#008f45] transition-colors text-lg">{t('editBtn')}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* تعديل بيانات العميل */}
            {showEditCustomerModal && (
                <div className="fixed inset-0 bg-black/40 z-[10000] flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-sm transition-all" onClick={() => setShowEditCustomerModal(false)}>
                    <div className="bg-[#f4f6f8] rounded-t-[32px] sm:rounded-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] w-full max-w-md overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="w-full flex justify-center pt-4 pb-2 bg-white rounded-t-[32px]">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="px-6 pb-6 pt-2 bg-white flex flex-col items-center relative rounded-b-[32px] shadow-sm z-10">
                            <button onClick={() => setShowEditCustomerModal(false)} className="absolute top-2 start-6 bg-gray-50 text-gray-400 p-2.5 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors">
                                <X size={20} strokeWidth={3} />
                            </button>
                            <div className="w-16 h-16 bg-gradient-to-tr from-green-100 to-green-50 rounded-[20px] flex items-center justify-center mb-4 shadow-inner border border-green-100">
                                <Pencil size={32} className="text-[#0c4a3b]" strokeWidth={2.5} />
                            </div>
                            <h2 className="font-black text-2xl text-gray-800 text-center">{t('editCustomerTitle')}</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-[#0c4a3b]">{t('customerNameLabel')}</label>
                                <input type="text" value={editCustomerData.name} onChange={(e) => setEditCustomerData({ ...editCustomerData, name: e.target.value })} className="w-full border-2 rounded-[16px] px-4 py-3 outline-none font-bold border-gray-200 focus:border-[#0c4a3b] bg-white shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-[#0c4a3b]">{t('customerPhoneLabel')}</label>
                                <input type="text" value={editCustomerData.phone} onChange={(e) => setEditCustomerData({ ...editCustomerData, phone: e.target.value })} className="w-full border-2 rounded-[16px] px-4 py-3 outline-none font-bold border-gray-200 focus:border-[#0c4a3b] bg-white shadow-sm" />
                            </div>
                        </div>
                        <div className="p-4 bg-white flex gap-3 rounded-b-[32px] sm:rounded-none">
                            <button onClick={() => setShowEditCustomerModal(false)} className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors text-lg">{t('cancel')}</button>
                            <button onClick={handleEditCustomerSave} className="flex-1 px-8 py-3.5 text-white bg-[#00a651] hover:bg-[#008f45] shadow-md rounded-xl font-black transition-colors text-lg">{t('saveChanges')}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال اختيار الإضافات */}
            {showAdditionsModal && (
                <div className="fixed inset-0 bg-black/40 z-[10000] flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-sm transition-all" onClick={() => setShowAdditionsModal(false)}>
                    <div className="bg-[#f4f6f8] rounded-t-[32px] sm:rounded-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] w-full max-w-md overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="w-full flex justify-center pt-4 pb-2 bg-white rounded-t-[32px]">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="px-6 pb-6 pt-2 bg-white flex flex-col items-center relative rounded-b-[32px] shadow-sm z-10">
                            <button onClick={() => setShowAdditionsModal(false)} className="absolute top-2 start-6 bg-gray-50 text-gray-400 p-2.5 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors">
                                <X size={20} strokeWidth={3} />
                            </button>
                            <div className="w-16 h-16 bg-gradient-to-tr from-green-100 to-green-50 rounded-[20px] flex items-center justify-center mb-4 shadow-inner border border-green-100">
                                <Tag size={32} className="text-[#0c4a3b]" strokeWidth={2.5} />
                            </div>
                            <h2 className="font-black text-2xl text-gray-800 text-center">{t('availableAdditions')}</h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 gap-3 max-h-[55vh] overflow-y-auto">
                            {additions?.map(addition => {
                                const isSelected = isAdditionSelectedForItem(addition.id);
                                return (
                                    <button 
                                        key={addition.id} 
                                        onClick={() => toggleAdditionForItem(addition.id)} 
                                        className={cn("group relative w-full bg-white border-2 rounded-[20px] p-4 flex items-center justify-between transition-all duration-300 shadow-sm active:scale-[0.98]",
                                            isSelected ? "border-[#00a651] bg-green-50/50" : "border-transparent hover:border-[#00a651]"
                                        )}
                                    >
                                        <span className={cn("font-bold text-lg", isSelected ? "text-[#0c4a3b]" : "text-gray-800")}>{addition.name}</span>
                                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", isSelected ? "bg-[#00a651] text-white" : "bg-gray-100 text-gray-400 group-hover:text-[#00a651]")}>
                                            {isSelected ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="p-4 bg-white flex justify-center rounded-b-[32px] sm:rounded-none">
                            <button onClick={() => setShowAdditionsModal(false)} className="w-full bg-[#00a651] text-white py-3.5 rounded-xl font-black text-lg shadow-md hover:bg-[#008f45]">{t('done')}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال الخيارات (Sub-Products) */}
            {showSubProductsModal && currentParentProduct && (
                <div className="fixed inset-0 bg-black/40 z-[10000] flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-sm transition-all" onClick={() => setShowSubProductsModal(false)}>
                    <div className="bg-[#f4f6f8] rounded-t-[32px] sm:rounded-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] w-full max-w-md overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="w-full flex justify-center pt-4 pb-2 bg-white rounded-t-[32px]">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="px-6 pb-6 pt-2 bg-white flex flex-col items-center relative rounded-b-[32px] shadow-sm z-10">
                            <button onClick={() => setShowSubProductsModal(false)} className="absolute top-2 start-6 bg-gray-50 text-gray-400 p-2.5 rounded-full hover:bg-gray-100 hover:text-gray-600 transition-colors">
                                <X size={20} strokeWidth={3} />
                            </button>
                            <div className="w-16 h-16 bg-gradient-to-tr from-green-100 to-green-50 rounded-[20px] flex items-center justify-center mb-4 shadow-inner border border-green-100">
                                <Layers size={32} className="text-[#0c4a3b]" strokeWidth={2.5} />
                            </div>
                            <h2 className="font-black text-2xl text-gray-800 text-center">{currentParentProduct.name}</h2>
                            <p className="text-gray-400 text-sm font-bold mt-1 text-center">{t('selectSubProduct')}</p>
                        </div>
                        <div className="p-6 grid grid-cols-1 gap-4 max-h-[55vh] overflow-y-auto">
                            {getChildrenOfParent(currentParentProduct, products || []).length > 0 ? (
                                getChildrenOfParent(currentParentProduct, products || []).map(sub => {
                                    const price = parseFloat(String(sub.price)).toFixed(2);
                                    return (
                                        <button 
                                            key={sub.id} 
                                            onClick={() => handleSelectSubProduct(sub)} 
                                            className="group relative w-full bg-white border-2 border-transparent hover:border-[#00a651] rounded-[24px] p-4 flex items-center justify-between transition-all duration-300 shadow-sm hover:shadow-md active:scale-[0.98]"
                                        >
                                            <div className="flex flex-col items-start gap-1">
                                                <span className="font-bold text-gray-800 text-lg">{sub.name}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-black text-[#0c4a3b] text-xl">{price}</span>
                                                    <span className="text-xs text-gray-400 font-bold">{t('currency')}</span>
                                                </div>
                                            </div>
                                            <div className="w-12 h-12 bg-green-50 rounded-[16px] flex items-center justify-center text-[#00a651] group-hover:bg-[#00a651] group-hover:text-white transition-all duration-300">
                                                <Plus size={24} strokeWidth={3} />
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                        <LayoutGrid size={32} className="text-gray-400" />
                                    </div>
                                    <span className="text-gray-500 font-bold">{t('noSubItems')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================
                🍽️ Tables Modal — Luxury Dark Design
            ========================================== */}
            {showTablesModal && (
                <div
                    className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
                    style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(0,0,0,0.75)' }}
                    onClick={() => setShowTablesModal(false)}
                >
                    <div
                        className="w-full overflow-hidden flex flex-col"
                        style={{
                            maxWidth: 560,
                            maxHeight: '88vh',
                            borderRadius: 24,
                            background: 'linear-gradient(160deg, #0f1f1a 0%, #122b22 60%, #0c4a3b 100%)',
                            boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,166,81,0.15)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* ── Header ── */}
                        <div className="relative px-6 pt-6 pb-4">
                            {/* close */}
                            <button
                                onClick={() => setShowTablesModal(false)}
                                className="absolute top-5 end-5 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                                style={{ color: 'rgba(255,255,255,0.4)' }}
                            >
                                <X size={18} strokeWidth={2.5} />
                            </button>

                            <div className="flex items-center gap-3 mb-1">
                                <div
                                    className="flex items-center justify-center"
                                    style={{
                                        width: 42, height: 42, borderRadius: 12,
                                        background: 'rgba(0,166,81,0.2)',
                                        border: '1px solid rgba(0,166,81,0.3)',
                                    }}
                                >
                                    <TableChairsIcon size={22} className="text-[#00a651]" strokeWidth={2} />
                                </div>
                                <div>
                                    <h2 className="font-black text-lg text-white leading-tight">{t('tables')}</h2>
                                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{t('selectTable')}</p>
                                </div>
                            </div>

                            {/* count pill */}
                            {tables && tables.length > 0 && (
                                <div className="mt-3 flex items-center gap-2">
                                    <span
                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                                        style={{ background: 'rgba(0,166,81,0.15)', color: '#4ade80', border: '1px solid rgba(0,166,81,0.2)' }}
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00a651] inline-block" />
                                        {tables.length} {language === 'ar' ? 'طاولة' : 'tables'}
                                    </span>
                                    {selectedTable && (
                                        <span
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                                            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
                                        >
                                            <Check size={10} strokeWidth={3} />
                                            {selectedTable.name}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* ── Divider ── */}
                        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 24px' }} />

                        {/* ── Grid ── */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {tables && tables.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {tables.map((table: any) => {
                                        const isSelected = selectedTable?.id === table.id;
                                        return (
                                            <button
                                                key={table.id}
                                                onClick={() => { setSelectedTable(table); setShowTablesModal(false); }}
                                                className="relative flex flex-col items-center justify-center gap-2 transition-all duration-200 active:scale-[0.93]"
                                                style={{
                                                    aspectRatio: '1',
                                                    borderRadius: 16,
                                                    background: isSelected
                                                        ? 'linear-gradient(135deg, #00a651 0%, #009244 100%)'
                                                        : 'rgba(255,255,255,0.06)',
                                                    border: isSelected
                                                        ? '1.5px solid rgba(0,200,100,0.5)'
                                                        : '1.5px solid rgba(255,255,255,0.08)',
                                                    boxShadow: isSelected
                                                        ? '0 8px 20px rgba(0,166,81,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                                                        : 'none',
                                                }}
                                            >
                                                {/* selected check */}
                                                {isSelected && (
                                                    <div
                                                        className="absolute top-2 end-2 flex items-center justify-center"
                                                        style={{ width: 16, height: 16, borderRadius: 9999, background: 'rgba(255,255,255,0.3)' }}
                                                    >
                                                        <Check size={9} strokeWidth={3.5} className="text-white" />
                                                    </div>
                                                )}

                                                <TableChairsIcon
                                                    size={24}
                                                    className={isSelected ? 'text-white' : 'text-[#00a651]'}
                                                    strokeWidth={isSelected ? 2.5 : 1.8}
                                                />

                                                <span
                                                    className="text-[11px] font-bold text-center leading-tight px-1 truncate w-full"
                                                    style={{ color: isSelected ? '#fff' : 'rgba(255,255,255,0.65)' }}
                                                >
                                                    {table.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 gap-3">
                                    <TableChairsIcon size={48} className="text-white/10" strokeWidth={1.5} />
                                    <p className="font-bold text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>{t('noTables')}</p>
                                </div>
                            )}
                        </div>

                        {/* ── Footer ── */}
                        <div className="px-5 pb-5 pt-3 flex gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            {selectedTable && (
                                <button
                                    onClick={() => { setSelectedTable(null); setShowTablesModal(false); }}
                                    className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all hover:bg-white/10"
                                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,100,100,0.9)', border: '1px solid rgba(255,100,100,0.2)' }}
                                >
                                    {language === 'ar' ? 'إلغاء الاختيار' : 'Clear selection'}
                                </button>
                            )}
                            <button
                                onClick={() => setShowTablesModal(false)}
                                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                {t('cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showReceiptModal && (
                <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowReceiptModal(false)}>
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b flex justify-between items-center bg-gray-100">
                            <h2 className="font-bold text-lg flex items-center gap-2"><Printer size={20} /> {t('receiptPreview')}</h2>
                            <button onClick={() => setShowReceiptModal(false)}><X size={24} /></button>
                        </div>
                        <div className="p-8 overflow-y-auto flex-1 font-mono text-sm bg-white">
                            <div className="text-center mb-6 font-bold text-xl border-b-2 pb-2 uppercase">{posSettings?.receipt?.header || t('storeName')}</div>
                            
                            {selectedTable && (
                                <div className="text-center font-bold text-base mb-4 bg-gray-100 py-1.5 rounded border border-gray-300">
                                    {t('table')}: {selectedTable.name}
                                </div>
                            )}

                            <table className="w-full text-start mb-4">
                                <thead className="border-b-2 border-gray-800 text-start">
                                    <tr><th className="pb-2 text-start">{t('item')}</th><th className="pb-2 text-center">{t('qty')}</th><th className="pb-2 text-end">{t('total')}</th></tr>
                                </thead>
                                <tbody>
                                    {cart.map(item => {
                                        const price = parseFloat(String(item.price)) || 0;
                                        const itemDiscount = item.discountType === 'percent' 
                                            ? price * ((item.discountValue || 0) / 100) 
                                            : (item.discountValue || 0);
                                        const finalPrice = Math.max(0, price - itemDiscount);

                                        return (
                                            <tr key={item.id} className="border-b border-dashed border-gray-200">
                                                <td className="py-2 text-xs text-start">{item.name}</td>
                                                <td className="py-2 text-center">{item.cartQuantity}</td>
                                                <td className="py-2 text-end">{(finalPrice * item.cartQuantity).toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between"><span>{t('subtotal')}</span><span>{subtotalAmount.toFixed(2)} {t('currency')}</span></div>
                                <div className="flex justify-between"><span>{t('tax')}</span><span>{taxAmount.toFixed(2)} {t('currency')}</span></div>
                                <div className="flex justify-between font-black text-lg mt-2 pt-2 border-t-2 border-gray-800"><span>{t('total')}</span><span>{totalInvoice.toFixed(2)} {t('currency')}</span></div>
                            </div>
                            {orderNote && orderNote.trim() !== '' && (
                                <>
                                    <div className="border-t border-dashed border-gray-300 my-3" />
                                    <div className="text-start text-xs text-gray-700 bg-gray-50 p-2 rounded">
                                        <span className="font-bold">ملاحظات الفاتورة:</span><br/>
                                        {orderNote}
                                    </div>
                                </>
                            )}
                            <div className="text-center mt-8 pt-4 border-t border-dashed text-gray-500 text-xs">{t('thanks')}</div>
                        </div>
                        <div className="p-4 bg-gray-100 border-t flex gap-3">
                            <button onClick={resetCart} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-700">{t('newInvoice')}</button>
                            <button onClick={() => window.print()} className="bg-white px-6 py-3 rounded-xl font-bold border flex items-center gap-2 hover:bg-gray-50"><Printer size={20} /> {t('print')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}