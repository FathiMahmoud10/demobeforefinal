import React, { useState, useEffect } from 'react';
import { 
  Gift, 
  Menu, 
  Plus, 
  FileSpreadsheet, 
  Trash2, 
  Search, 
  ChevronRight, 
  ChevronLeft,
  X,
  Settings,
  Edit2,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import MobileDataCard from '@/components/MobileDataCard';

interface GiftCard {
  id: string;
  cardNumber: string;
  value: number;
  balance: number;
  dataEntry: string;
  notes: string;
  customer: string;
  expiryDate: string;
}

export default function GiftCards() {
  const { direction, t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCount, setShowCount] = useState(10);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    value: '',
    useEmployeePoints: false,
    customer: '',
    expiryDate: '24/02/2028',
    notes: ''
  });

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.menu-container')) {
        setShowMenu(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleAddCard = () => {
    if (!newCard.cardNumber || !newCard.value) return;

    const card: GiftCard = {
      id: Math.random().toString(36).substr(2, 9),
      cardNumber: newCard.cardNumber,
      value: Number(newCard.value),
      balance: Number(newCard.value),
      dataEntry: 'Admin',
      notes: newCard.notes,
      customer: newCard.customer || 'عميل افتراضي',
      expiryDate: newCard.expiryDate
    };

    setGiftCards([card, ...giftCards]);
    setShowAddModal(false);
    setNewCard({
      cardNumber: '',
      value: '',
      useEmployeePoints: false,
      customer: '',
      expiryDate: '24/02/2028',
      notes: ''
    });
  };

  const handleDelete = (id: string) => {
    setCardToDelete(id);
    setIsBulkDelete(false);
  };

  const handleBulkDelete = () => {
    setIsBulkDelete(true);
    setCardToDelete('bulk'); // Just to trigger the modal
  };

  const confirmDelete = () => {
    if (isBulkDelete) {
      // In a real app, we'd delete selected cards
      setGiftCards([]);
    } else if (cardToDelete) {
      setGiftCards(prev => prev.filter(c => c.id !== cardToDelete));
    }
    setCardToDelete(null);
    setIsBulkDelete(false);
    setShowMenu(false);
  };

  const generateCardNumber = () => {
    const num = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setNewCard({ ...newCard, cardNumber: num });
  };

  return (
    <div className="space-y-4" dir={direction}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm px-2 text-gray-500">
        <span>{t('home')}</span>
        <span>/</span>
        <span>{t('sales')}</span>
        <span>/</span>
        <span className="text-gray-800 font-medium">{t('gift_cards')}</span>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2 text-primary">
             <h1 className="text-lg font-bold">{t('gift_cards_list')}</h1>
             <Gift size={20} />
          </div>

          <div className="relative menu-container">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 bg-white border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Menu size={20} />
            </button>
            
            <AnimatePresence>
              {showMenu && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={cn(
                    "absolute z-50 top-full mt-2 bg-white rounded-md shadow-xl border border-gray-100 min-w-[200px] overflow-hidden",
                    direction === 'rtl' ? "left-0" : "right-0"
                  )}
                >
                  <button 
                    onClick={() => { setShowAddModal(true); setShowMenu(false); }}
                    className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 border-b border-gray-50 transition-colors"
                  >
                    <span className="text-gray-700 text-sm font-bold">{t('add_gift_card')}</span>
                    <Plus size={16} className="text-gray-600" />
                  </button>
                  <button className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 border-b border-gray-50 transition-colors">
                    <span className="text-gray-700 text-sm font-bold">{t('export_excel')}</span>
                    <FileSpreadsheet size={16} className="text-green-600" />
                  </button>
                  <button 
                    onClick={handleBulkDelete}
                    className="w-full text-right p-3 hover:bg-gray-50 flex items-center justify-end gap-3 transition-colors"
                  >
                    <span className="text-gray-700 text-sm font-bold">{t('delete_gift_cards')}</span>
                    <Trash2 size={16} className="text-primary" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-primary mb-6 text-right font-medium">
            {t('gift_cards_table_desc')}
          </p>

          {/* Table Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{t('show')}</span>
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
                        placeholder={t('search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:border-primary text-right" 
                    />
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap">{t('search')}</span>
              </div>
          </div>

          {/* Table - Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[1000px] text-sm text-right border-collapse">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="p-3 border border-primary-hover w-10 text-center">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="p-3 border border-primary-hover whitespace-nowrap">{t('card_no')}</th>
                  <th className="p-3 border border-primary-hover whitespace-nowrap">{t('value')}</th>
                  <th className="p-3 border border-primary-hover whitespace-nowrap">{t('balance')}</th>
                  <th className="p-3 border border-primary-hover whitespace-nowrap">{t('data_entry')}</th>
                  <th className="p-3 border border-primary-hover whitespace-nowrap">{t('notes')}</th>
                  <th className="p-3 border border-primary-hover whitespace-nowrap">{t('customer')}</th>
                  <th className="p-3 border border-primary-hover whitespace-nowrap">{t('expiry_date')}</th>
                  <th className="p-3 border border-primary-hover whitespace-nowrap w-24 text-center">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-green-50/20">
                {giftCards.length > 0 ? (
                  giftCards.map((card) => (
                    <tr key={`desktop-${card.id}`} className="bg-green-50/30 hover:bg-green-100/50 transition-colors border-b border-gray-200">
                      <td className="p-3 text-center border-x border-gray-200">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="p-3 border-x border-gray-200 font-medium">{card.cardNumber}</td>
                      <td className="p-3 border-x border-gray-200">{(card.value || 0).toFixed(2)}</td>
                      <td className="p-3 border-x border-gray-200">{(card.balance || 0).toFixed(2)}</td>
                      <td className="p-3 border-x border-gray-200">{card.dataEntry}</td>
                      <td className="p-3 border-x border-gray-200">{card.notes || '-'}</td>
                      <td className="p-3 border-x border-gray-200">{card.customer}</td>
                      <td className="p-3 border-x border-gray-200">{card.expiryDate}</td>
                      <td className="p-3 border-x border-gray-200 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 size={14} /></button>
                          <button className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"><Eye size={14} /></button>
                          <button 
                            onClick={() => handleDelete(card.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-gray-500 font-medium border border-gray-200">
                      {t('no_data_in_table')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {giftCards.map((card) => (
              <MobileDataCard
                key={`mobile-${card.id}`}
                title={`${t('card_no')}: ${card.cardNumber}`}
                subtitle={card.expiryDate}
                fields={[
                  { label: t('value'), value: (card.value || 0).toFixed(2), isBold: true },
                  { label: t('balance'), value: (card.balance || 0).toFixed(2) },
                  { label: t('customer'), value: card.customer },
                  { label: t('data_entry'), value: card.dataEntry },
                ]}
                actions={
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleDelete(card.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-red-100 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-100 transition-colors">
                      <Eye size={18} />
                    </button>
                  </div>
                }
              />
            ))}
            {giftCards.length === 0 && (
              <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                {t('no_data_in_table')}
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
              <div className="text-sm text-gray-600">
                {t('showing_records')} {giftCards.length > 0 ? 1 : 0} {t('to')} {giftCards.length} {t('of')} {giftCards.length} {t('records')}
              </div>
              <div className="flex items-center gap-1">
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-400 text-sm flex items-center gap-1">
                    <ChevronRight size={14} /> {t('previous')}
                  </button>
                  <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600 text-sm flex items-center gap-1">
                    {t('next')} <ChevronLeft size={14} />
                  </button>
              </div>
          </div>
        </div>
      </div>

      {/* Add Gift Card Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden my-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
                <h2 className="text-lg font-bold text-primary">{t('add_gift_card')}</h2>
              </div>

              <div className="p-6 space-y-6" dir={direction}>
                <p className="text-sm text-primary font-medium text-right">{t('add_product_desc')}</p>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary text-right">{t('card_no')} *</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={generateCardNumber}
                        className="bg-gray-100 p-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Settings size={18} />
                      </button>
                      <input 
                        type="text" 
                        value={newCard.cardNumber}
                        onChange={e => setNewCard({...newCard, cardNumber: e.target.value})}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary text-right" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary text-right">{t('value')} *</label>
                    <input 
                      type="number" 
                      value={newCard.value}
                      onChange={e => setNewCard({...newCard, value: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary text-right" 
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <label className="text-sm font-bold text-primary">{t('use_employee_points_program')}</label>
                    <input 
                      type="checkbox" 
                      checked={newCard.useEmployeePoints}
                      onChange={e => setNewCard({...newCard, useEmployeePoints: e.target.checked})}
                      className="rounded border-gray-300 text-primary focus:ring-primary" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary text-right">{t('customer')}</label>
                    <select 
                      value={newCard.customer}
                      onChange={e => setNewCard({...newCard, customer: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary bg-white text-right"
                    >
                      <option value="">{t('select_customer')}</option>
                      <option value="Walk-in Customer">{t('walk_in_customer')}</option>
                      <option value="شخص عام">{t('general_person')}</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary text-right">{t('expiry_date')}</label>
                    <input 
                      type="text" 
                      value={newCard.expiryDate}
                      onChange={e => setNewCard({...newCard, expiryDate: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary text-right" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-bold text-primary text-right">{t('notes')}</label>
                    <textarea 
                      value={newCard.notes}
                      onChange={e => setNewCard({...newCard, notes: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-primary h-24 text-right"
                    ></textarea>
                  </div>
                </div>

                <button 
                  onClick={handleAddCard}
                  className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors"
                >
                  {t('add_gift_card')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DeleteConfirmationModal
        isOpen={cardToDelete !== null}
        onClose={() => {
          setCardToDelete(null);
          setIsBulkDelete(false);
        }}
        onConfirm={confirmDelete}
        title={
          isBulkDelete
            ? (direction === 'rtl' ? 'هل أنت متأكد من حذف جميع بطاقات الهدايا المختارة؟' : 'Are you sure you want to delete all selected gift cards?')
            : undefined
        }
        itemName={!isBulkDelete && cardToDelete ? giftCards.find(c => c.id === cardToDelete)?.cardNumber : undefined}
      />
    </div>
  );
}
