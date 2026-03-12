import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../lib/utils';
import { useProducts, Product } from '../context/ProductsContext';
import { Plus, Eye, Pencil, Trash2, Minus, Asterisk, X, Printer } from 'lucide-react';

interface CartItem extends Product {
  cartQuantity: number;
}

export default function POS() {
  const { t, direction } = useLanguage();
  const { products } = useProducts();
  
  // States
  const [isCustomerSelectDisabled, setIsCustomerSelectDisabled] = useState(true);
  const [showCustomerDetailsModal, setShowCustomerDetailsModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [customer, setCustomer] = useState({
    company: 'شخص عام',
    name: 'عميل افتراضي',
    group: 'عام',
    pricingGroup: 'عام',
    taxId: '',
    email: 'info@posit.sa',
    phone: '00',
    address: 'KSA',
    commercialRecord: '',
    openingBalance: '0',
    creditLimit: '0',
    stopSelling: false,
    taxStatus: 'unregistered'
  });

  const [editCustomerData, setEditCustomerData] = useState({ ...customer });

  // Handlers
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    const results = products.filter(p => 
      p.name.includes(query) || p.code.includes(query)
    );
    setSearchResults(results);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
        );
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, cartQuantity: newQuantity } : item
    ));
  };

  const totalInvoice = useMemo(() => {
    return cart.reduce((sum, item) => {
      // Parse price, removing any non-numeric characters except dot
      const priceStr = item.price.replace(/[^0-9.]/g, '');
      const price = parseFloat(priceStr) || 0;
      return sum + (price * item.cartQuantity);
    }, 0);
  }, [cart]);

  const handleEditCustomerSave = () => {
    setCustomer(editCustomerData);
    setShowEditCustomerModal(false);
  };

  const openEditModal = () => {
    setEditCustomerData({ ...customer });
    setShowCustomerDetailsModal(false);
    setShowEditCustomerModal(true);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] gap-4 p-4 bg-gray-100 relative" dir={direction}>
      {/* Right Side (Table and Inputs) */}
      <div className="flex-1 flex flex-col gap-2 bg-gray-50 p-2 rounded border border-gray-200 shadow-sm">
        {/* Customer Select */}
        <div className="flex gap-1">
          <select 
            className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary bg-white disabled:bg-gray-100 disabled:text-gray-500"
            disabled={isCustomerSelectDisabled}
          >
            <option>{t('walk_in_customer')}({t('default_customer')})</option>
          </select>
          <div className="flex items-center gap-1 border border-gray-300 rounded px-1 bg-white">
            <button 
              onClick={() => setShowAddCustomerModal(true)}
              className="text-primary hover:bg-red-50 p-1 rounded transition-colors"
              title={t('add_customer')}
            >
              <Plus size={16} />
            </button>
            <button 
              onClick={() => setShowCustomerDetailsModal(true)}
              className="text-primary hover:bg-red-50 p-1 rounded transition-colors"
              title={t('view_customer_details')}
            >
              <Eye size={16} />
            </button>
            <button 
              onClick={() => setIsCustomerSelectDisabled(!isCustomerSelectDisabled)}
              className="text-primary hover:bg-red-50 p-1 rounded transition-colors"
              title={isCustomerSelectDisabled ? t('enable_field') : t('disable_field')}
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>

        {/* Branch Select */}
        <select className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-primary bg-white">
          <option>{t('takamul_company')}</option>
        </select>

        {/* Barcode Search */}
        <div className="relative">
          <div className="flex gap-1">
            <div className="flex items-center gap-1 border border-gray-300 rounded px-1 bg-white">
              <button className="text-primary hover:bg-red-50 p-1 rounded transition-colors"><Asterisk size={16} /></button>
              <button className="text-primary hover:bg-red-50 p-1 rounded transition-colors"><Minus size={16} /></button>
              <button className="text-primary hover:bg-red-50 p-1 rounded transition-colors"><Plus size={16} /></button>
            </div>
            <input 
              type="text" 
              placeholder={t('barcode_search_placeholder')}
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary bg-white"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div className={cn(
                "absolute z-10 top-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto",
                direction === 'rtl' ? "right-0 left-0" : "left-0 right-0"
            )}>
              {searchResults.map(product => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="w-full text-right px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0 flex justify-between items-center"
                >
                  <span className="font-medium">{product.name}</span>
                  <span className="text-gray-500 text-sm">{product.price} SR</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="flex-1 bg-white border border-gray-200 rounded overflow-hidden mt-2 flex flex-col">
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-sm text-right">
              <thead className="bg-primary text-white sticky top-0">
                <tr>
                  <th className="p-3 font-bold border-l border-primary-hover">{t('item')}</th>
                  <th className="p-3 font-bold border-l border-primary-hover w-24 text-center">{t('price')}</th>
                  <th className="p-3 font-bold border-l border-primary-hover w-32 text-center">{t('quantity')}</th>
                  <th className="p-3 font-bold border-l border-primary-hover w-32 text-center">{t('item_total')}</th>
                  <th className="p-3 w-12 text-center"><Trash2 size={16} className="mx-auto" /></th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">
                      {t('no_items')}
                    </td>
                  </tr>
                ) : (
                  cart.map(item => {
                    const priceStr = item.price.replace(/[^0-9.]/g, '');
                    const price = parseFloat(priceStr) || 0;
                    return (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 border-l border-gray-100">{item.name}</td>
                        <td className="p-3 border-l border-gray-100 text-center">{price.toFixed(2)}</td>
                        <td className="p-3 border-l border-gray-100 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                              className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >-</button>
                            <span className="w-8 text-center">{item.cartQuantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                              className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >+</button>
                          </div>
                        </td>
                        <td className="p-3 border-l border-gray-100 text-center font-bold">
                          {(price * item.cartQuantity).toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 size={16} className="mx-auto" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Left Side (Total) */}
      <div className="w-[35%] flex flex-col gap-4">
        <div className="bg-primary rounded shadow-sm flex items-center justify-center p-8 h-40">
          <h2 className="text-white text-3xl xl:text-4xl font-bold flex items-center gap-4">
            <span>{t('invoice_total')} :</span>
            <span>{totalInvoice.toFixed(2)}</span>
          </h2>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showCustomerDetailsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-bold">{customer.company}</span>
                <button className="flex items-center gap-1 text-xs border border-gray-300 rounded px-2 py-1 hover:bg-gray-50">
                  <Printer size={12} />
                  {t('print')}
                </button>
              </div>
              <button onClick={() => setShowCustomerDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-0">
              <table className="w-full text-right text-sm">
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-bold bg-gray-50 w-1/3">{t('company')}</td>
                    <td className="p-3">{customer.company}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-bold bg-gray-50">{t('name')}</td>
                    <td className="p-3">{customer.name}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-bold bg-gray-50">{t('customer_group')}</td>
                    <td className="p-3">{customer.group}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-bold bg-gray-50">{t('tax_no')}</td>
                    <td className="p-3">{customer.taxId}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-bold bg-gray-50">{t('email')}</td>
                    <td className="p-3">{customer.email}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-bold bg-gray-50">{t('phone')}</td>
                    <td className="p-3">{customer.phone}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-3 font-bold bg-gray-50">{t('address')}</td>
                    <td className="p-3">{customer.address}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-200 flex gap-2 justify-end bg-gray-50">
              <button 
                onClick={() => setShowCustomerDetailsModal(false)}
                className="bg-primary text-white px-4 py-2 rounded text-sm font-bold hover:bg-primary-hover"
              >
                {t('close')}
              </button>
              <button 
                onClick={openEditModal}
                className="bg-primary text-white px-4 py-2 rounded text-sm font-bold hover:bg-primary-hover"
              >
                {t('edit_customer')}
              </button>
              <button className="bg-primary text-white px-4 py-2 rounded text-sm font-bold hover:bg-primary-hover">
                {t('customer_report')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditCustomerModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-bold text-lg">{t('edit_customer')}</h2>
              <button onClick={() => setShowEditCustomerModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-sm text-gray-700">
                {t('enter_info_below')}
              </p>

              {/* Customer Type */}
              <div className="border border-[#faebcc] rounded">
                <div className="bg-[#fcf8e3] p-3 border-b border-[#faebcc] text-[#8a6d3b] font-bold text-sm">
                  {t('select_customer_type')}
                </div>
                <div className="p-4 flex gap-8 bg-white">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="editTaxStatus" 
                      value="unregistered" 
                      checked={editCustomerData.taxStatus === 'unregistered'}
                      onChange={(e) => setEditCustomerData({...editCustomerData, taxStatus: e.target.value})}
                      className="text-primary focus:ring-primary" 
                    />
                    <span>{t('individual_company_unregistered')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="editTaxStatus" 
                      value="registered" 
                      checked={editCustomerData.taxStatus === 'registered'}
                      onChange={(e) => setEditCustomerData({...editCustomerData, taxStatus: e.target.value})}
                      className="text-primary focus:ring-primary" 
                    />
                    <span>{t('company_registered')}</span>
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="border border-gray-200 rounded p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('customer_group')} *</label>
                    <select 
                      value={editCustomerData.group}
                      onChange={(e) => setEditCustomerData({...editCustomerData, group: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary bg-white"
                    >
                      <option value="عام">{t('general')}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('pricing_group')}</label>
                    <select 
                      value={editCustomerData.pricingGroup}
                      onChange={(e) => setEditCustomerData({...editCustomerData, pricingGroup: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary bg-white"
                    >
                      <option value="عام">{t('general')}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('customer_name')} *</label>
                    <input 
                      type="text" 
                      value={editCustomerData.name}
                      onChange={(e) => setEditCustomerData({...editCustomerData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('phone')}</label>
                    <input 
                      type="text" 
                      value={editCustomerData.phone}
                      onChange={(e) => setEditCustomerData({...editCustomerData, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('email')}</label>
                    <input 
                      type="email" 
                      value={editCustomerData.email}
                      onChange={(e) => setEditCustomerData({...editCustomerData, email: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('commercial_record')}</label>
                    <input 
                      type="text" 
                      value={editCustomerData.commercialRecord}
                      onChange={(e) => setEditCustomerData({...editCustomerData, commercialRecord: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('opening_balance')} *</label>
                    <input 
                      type="text" 
                      value={editCustomerData.openingBalance}
                      onChange={(e) => setEditCustomerData({...editCustomerData, openingBalance: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('credit_limit')} *</label>
                    <input 
                      type="text" 
                      value={editCustomerData.creditLimit}
                      onChange={(e) => setEditCustomerData({...editCustomerData, creditLimit: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary" 
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="editStopSelling" 
                    checked={editCustomerData.stopSelling}
                    onChange={(e) => setEditCustomerData({...editCustomerData, stopSelling: e.target.checked})}
                    className="rounded border-gray-300 text-primary focus:ring-primary" 
                  />
                  <label htmlFor="editStopSelling" className="text-sm font-bold">{t('stop_selling_if_due')}</label>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button 
                onClick={handleEditCustomerSave}
                className="bg-primary text-white px-6 py-2 rounded font-bold hover:bg-primary-hover transition-colors"
              >
                {t('edit_customer')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-bold text-lg">{t('add_customer')}</h2>
              <button onClick={() => setShowAddCustomerModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-sm text-gray-700">
                {t('enter_info_below')}
              </p>

              {/* Customer Type */}
              <div className="border border-[#faebcc] rounded">
                <div className="bg-[#fcf8e3] p-3 border-b border-[#faebcc] text-[#8a6d3b] font-bold text-sm">
                  {t('select_customer_type')}
                </div>
                <div className="p-4 flex gap-8 bg-white">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="taxStatus" value="unregistered" defaultChecked className="text-primary focus:ring-primary" />
                    <span>{t('unregistered_tax')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="taxStatus" value="registered" className="text-primary focus:ring-primary" />
                    <span>{t('registered_tax')}</span>
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="border border-gray-200 rounded p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('customer_group')} *</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary bg-white">
                      <option>{t('general')}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('pricing_group')}</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary bg-white">
                      <option>{t('general')}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('customer_name')} *</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('phone')}</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('email')}</label>
                    <input type="email" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('commercial_record')}</label>
                    <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('opening_balance')} *</label>
                    <input type="text" defaultValue="0" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">{t('credit_limit')} *</label>
                    <input type="text" defaultValue="0" className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-primary" />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <input type="checkbox" id="stopSelling" className="rounded border-gray-300 text-primary focus:ring-primary" />
                  <label htmlFor="stopSelling" className="text-sm font-bold">{t('stop_selling_if_due')}</label>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button 
                onClick={() => setShowAddCustomerModal(false)}
                className="bg-primary text-white px-6 py-2 rounded font-bold hover:bg-primary-hover transition-colors"
              >
                {t('add_customer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
