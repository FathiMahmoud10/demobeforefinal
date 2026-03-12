import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  FileText, 
  Users, 
  Settings, 
  ChevronDown, 
  ChevronLeft,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Globe,
  Palette,
  List,
  LayoutGrid,
  PlusCircle,
  FileDown,
  Tag,
  SlidersHorizontal,
  PlusSquare,
  Trash2,
  ClipboardList,
  CheckSquare,
  Factory,
  Hammer,
  RefreshCcw,
  Gift,
  Share2,
  CornerUpLeft,
  FileUp,
  Plus,
  DollarSign,
  RefreshCw,
  UserPlus,
  Monitor,
  User,
  Truck,
  Landmark,
  ArrowRightLeft,
  Banknote,
  Briefcase,
  FileMinus,
  Minus,
  Building,
  CreditCard,
  Store,
  Percent,
  Upload,
  Coins,
  Link,
  Folder,
  Wrench,
  Layers,
  Tags,
  Map,
  Grid3x3,
  Key,
  BarChart,
  Moon,
  Sun,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';
import Logo from '@/components/Logo';
import WelcomeBanner from '@/components/WelcomeBanner';
import LogoModal from '@/components/LogoModal';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  hasSubmenu?: boolean;
  isOpen?: boolean;
  isSidebarOpen?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon: Icon, label, active, hasSubmenu, isOpen, isSidebarOpen = true, onClick }: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between p-3 rounded-lg transition-colors duration-200",
        active 
          ? "bg-[var(--primary)] text-white shadow-md" 
          : "text-[var(--text-main)] hover:bg-[var(--bg-main)] hover:text-[var(--primary)]",
        !isSidebarOpen && "justify-center"
      )}
      title={!isSidebarOpen ? label : undefined}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} />
        {isSidebarOpen && <span className="font-medium">{label}</span>}
      </div>
      {hasSubmenu && isSidebarOpen && (
        <ChevronLeft size={16} className={cn("transition-transform", isOpen && "-rotate-90")} />
      )}
    </button>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, direction, setLanguage, t } = useLanguage();
  const { systemSettings } = useSettings();

  const SubmenuItem = ({ label, icon: Icon, path, state, onClick }: { label: string, icon: React.ElementType, path?: string, state?: any, onClick?: () => void }) => {
    return (
      <button 
        onClick={() => {
          if (onClick) onClick();
          else if (path) navigate(path, { state });
        }}
        className={`w-full p-2 text-sm text-[var(--text-main)] hover:text-[var(--primary)] rounded-md hover:bg-[var(--bg-main)] flex items-center gap-2 transition-colors group ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
        <Icon size={16} className="text-[var(--text-main)] group-hover:text-[var(--primary)]" />
        <span>{label}</span>
      </button>
    );
  };

  const NestedSubmenu = ({ label, icon: Icon, children, isOpen, onToggle }: any) => {
    return (
      <div className="w-full">
        <button 
          onClick={onToggle}
          className={`w-full p-2 text-sm text-[var(--text-main)] hover:text-[var(--primary)] rounded-md hover:bg-[var(--bg-main)] flex items-center justify-between transition-colors group ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-2">
              <Icon size={16} className="text-[var(--text-main)] group-hover:text-[var(--primary)]" />
              <span>{label}</span>
          </div>
          <ChevronLeft size={14} className={cn("transition-transform text-[var(--text-main)] group-hover:text-[var(--primary)]", isOpen && "-rotate-90")} />
        </button>
        <AnimatePresence>
          {isOpen && (
              <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mr-4 space-y-1 border-r border-[var(--border)] pr-2 mt-1"
              >
                  {children}
              </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock navigation state
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (menu: string) => {
    if (!isSidebarOpen && !isMobile) {
      setIsSidebarOpen(true);
      setTimeout(() => setOpenSubmenu(menu), 150); // Small delay for smooth transition
    } else {
      setOpenSubmenu(openSubmenu === menu ? null : menu);
    }
  };

  const toggleNestedSubmenu = (menu: string) => {
      setOpenNestedSubmenu(openNestedSubmenu === menu ? null : menu);
  }

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  // Determine if sidebar content should be fully visible (labels shown)
  const showSidebarContent = isMobile ? true : isSidebarOpen;

  return (
    <div className="min-h-screen flex transition-colors duration-300" dir={direction}>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        data-theme={theme}
        className={cn(
          "fixed lg:sticky top-0 h-screen bg-[var(--bg-card)] border-l border-[var(--border)] z-50 overflow-y-auto transition-colors duration-300",
          direction === 'rtl' ? 'right-0 border-l' : 'left-0 border-r'
        )}
        initial={false}
        animate={{
          x: isMobile ? (isMobileMenuOpen ? 0 : (direction === 'rtl' ? '100%' : '-100%')) : 0,
          width: isMobile ? 280 : (isSidebarOpen ? 256 : 80)
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="p-4 flex items-center justify-between h-16 border-b border-[var(--border)]">
          <div className={cn("flex items-center gap-2 overflow-hidden", !showSidebarContent && "justify-center w-full")}>
             {showSidebarContent ? (
                <div className="flex items-center gap-2">
                  <Logo />
                  <span className="font-bold text-lg text-[var(--primary)] truncate">{systemSettings.site.companyName}</span>
                </div>
             ) : (
                 <Logo />
             )}
          </div>
          {isMobile && (
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-[var(--text-muted)] hover:text-red-500 transition-colors">
                <X size={24} />
            </button>
          )}
        </div>

        <div className="p-3 space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label={t('dashboard')} 
            isSidebarOpen={showSidebarContent}
            active={location.pathname === '/dashboard'}
            onClick={() => navigate('/dashboard')}
          />
          
          <SidebarItem 
            icon={Package} 
            label={t('products')} 
            hasSubmenu 
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === 'products'}
            onClick={() => toggleSubmenu('products')}
          />
          <AnimatePresence>
            {openSubmenu === 'products' && showSidebarContent && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn("overflow-hidden space-y-1 pr-2", direction === 'rtl' ? "mr-4 border-r border-gray-100" : "ml-4 border-l border-gray-100 pl-2 pr-0")}
              >
                <SubmenuItem label={t('products_list')} icon={List} path="/products" />
                <SubmenuItem label={t('add_product')} icon={PlusCircle} path="/products/create" />
                <SubmenuItem label={t('import_products')} icon={FileDown} path="/products/import" />
                <SubmenuItem label={t('print_barcode')} icon={Tag} path="/products/barcode" />
                <SubmenuItem label={t('quantity_adjustments')} icon={SlidersHorizontal} path="/products/quantity-adjustments" />
                <SubmenuItem label={t('groups')} icon={Folder} path="/products/groups" />
                
                <SubmenuItem label={t('units')} icon={Wrench} path="/products/units" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem 
            icon={ShoppingCart} 
            label={t('sales')} 
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === 'sales'}
            onClick={() => toggleSubmenu('sales')}
          />
           <AnimatePresence>
            {openSubmenu === 'sales' && showSidebarContent && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn("overflow-hidden space-y-1 pr-2", direction === 'rtl' ? "mr-4 border-r border-gray-100" : "ml-4 border-l border-gray-100 pl-2 pr-0")}
              >
                <SubmenuItem label={t('all_sales')} icon={List} path="/sales/all" />
                <SubmenuItem label={t('invoices_a4')} icon={FileText} path="/sales/a4-invoices" />
                <SubmenuItem label={t('invoices_pos')} icon={RefreshCcw} path="/sales/pos-invoices" />
                
                <SubmenuItem label={t('gift_cards')} icon={Gift} path="/sales/gift-cards" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem 
            icon={Share2} 
            label={t('quotes')} 
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === 'quotes'}
            onClick={() => toggleSubmenu('quotes')}
          />
          <AnimatePresence>
            {openSubmenu === 'quotes' && showSidebarContent && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn("overflow-hidden space-y-1 pr-2", direction === 'rtl' ? "mr-4 border-r border-gray-100" : "ml-4 border-l border-gray-100 pl-2 pr-0")}
              >
                <SubmenuItem label={t('quotes_list')} icon={List} path="/quotes" />
                <SubmenuItem label={t('add_quote')} icon={PlusCircle} path="/quotes/create" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem 
            icon={CornerUpLeft} 
            label={t('purchases')} 
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === 'purchases'}
            onClick={() => toggleSubmenu('purchases')}
          />
          <AnimatePresence>
            {openSubmenu === 'purchases' && showSidebarContent && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn("overflow-hidden space-y-1 pr-2", direction === 'rtl' ? "mr-4 border-r border-gray-100" : "ml-4 border-l border-gray-100 pl-2 pr-0")}
              >
                <SubmenuItem label={t('purchases_list')} icon={List} path="/purchases" />
                <SubmenuItem label={t('add_purchase')} icon={Plus} path="/purchases/create" />
                <SubmenuItem label={t('add_purchase_csv')} icon={FileUp} path="/purchases/import-csv" />
                <SubmenuItem label={t('expenses_list')} icon={DollarSign} path="/purchases/expenses" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem 
            icon={Users} 
            label={t('users')} 
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === 'users'}
            onClick={() => toggleSubmenu('users')}
          />
          <AnimatePresence>
            {openSubmenu === 'users' && showSidebarContent && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn("overflow-hidden space-y-1 pr-2", direction === 'rtl' ? "mr-4 border-r border-gray-100" : "ml-4 border-l border-gray-100 pl-2 pr-0")}
              >
                <SubmenuItem label={t('users_list')} icon={List} path="/users" />
                <SubmenuItem label={t('add_user')} icon={UserPlus} path="/users/create" />
                <SubmenuItem label={t('pos_devices')} icon={Monitor} path="/users/pos-devices" />
                <SubmenuItem label={t('add_device')} icon={PlusCircle} />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem 
            icon={User} 
            label={t('customers')} 
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === 'customers'}
            onClick={() => toggleSubmenu('customers')}
          />
          <AnimatePresence>
            {openSubmenu === 'customers' && showSidebarContent && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn("overflow-hidden space-y-1 pr-2", direction === 'rtl' ? "mr-4 border-r border-gray-100" : "ml-4 border-l border-gray-100 pl-2 pr-0")}
              >
                <SubmenuItem label={t('customers_list')} icon={List} path="/customers" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem 
            icon={Users} 
            label={t('suppliers')} 
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === 'suppliers'}
            onClick={() => toggleSubmenu('suppliers')}
          />
          <AnimatePresence>
            {openSubmenu === 'suppliers' && showSidebarContent && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn("overflow-hidden space-y-1 pr-2", direction === 'rtl' ? "mr-4 border-r border-gray-100" : "ml-4 border-l border-gray-100 pl-2 pr-0")}
              >
                <SubmenuItem label={t('suppliers_list')} icon={LayoutGrid} path="/suppliers" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem 
            icon={Landmark} 
            label={t('banks')} 
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === 'banks'}
            onClick={() => toggleSubmenu('banks')}
          />
          <AnimatePresence>
            {openSubmenu === 'banks' && showSidebarContent && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn("overflow-hidden space-y-1 pr-2", direction === 'rtl' ? "mr-4 border-r border-gray-100" : "ml-4 border-l border-gray-100 pl-2 pr-0")}
              >
                <SubmenuItem label={t('banks_list')} icon={List} path="/banks" />
                <SubmenuItem label={t('external_transfers')} icon={List} path="/banks/external-transfers" />
                <SubmenuItem label={t('internal_transfers')} icon={List} path="/banks/internal-transfers" />
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem 
            icon={Banknote} 
            label={t('bonds')} 
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === 'bonds'}
            onClick={() => toggleSubmenu('bonds')}
          />
          <AnimatePresence>
            {openSubmenu === 'bonds' && showSidebarContent && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn("overflow-hidden space-y-1 pr-2", direction === 'rtl' ? "mr-4 border-r border-gray-100" : "ml-4 border-l border-gray-100 pl-2 pr-0")}
              >
                <NestedSubmenu 
                  label={t('receipt_bonds')} 
                  icon={Briefcase} 
                  isOpen={openNestedSubmenu === 'receipt_bonds'}
                  onToggle={() => toggleNestedSubmenu('receipt_bonds')}
                >
                  <SubmenuItem label={t('view')} icon={List} path="/bonds/receipt" />
                  <SubmenuItem label={t('add_receipt_bond')} icon={Plus} path="/bonds/receipt" state={{ openAddModal: true }} />
                </NestedSubmenu>

                <NestedSubmenu 
                  label={t('payment_bonds')} 
                  icon={FileMinus} 
                  isOpen={openNestedSubmenu === 'payment_bonds'}
                  onToggle={() => toggleNestedSubmenu('payment_bonds')}
                >
                  <SubmenuItem label={t('view')} icon={List} path="/bonds/payment" />
                  <SubmenuItem label={t('add_payment_bond')} icon={Plus} path="/bonds/payment" state={{ openAddModal: true }} />
                </NestedSubmenu>

                <NestedSubmenu 
                  label={t('deposit_bonds')} 
                  icon={Building} 
                  isOpen={openNestedSubmenu === 'deposit_bonds'}
                  onToggle={() => toggleNestedSubmenu('deposit_bonds')}
                >
                  <SubmenuItem label={t('view')} icon={List} path="/bonds/deposit" />
                  <SubmenuItem label={t('add_deposit_bond')} icon={Plus} path="/bonds/deposit" state={{ openAddModal: true }} />
                </NestedSubmenu>

                <NestedSubmenu 
                  label={t('withdrawal_bonds')} 
                  icon={Building} 
                  isOpen={openNestedSubmenu === 'withdrawal_bonds'}
                  onToggle={() => toggleNestedSubmenu('withdrawal_bonds')}
                >
                  <SubmenuItem label={t('view')} icon={List} path="/bonds/withdrawal" />
                  <SubmenuItem label={t('add_withdrawal_bond')} icon={Plus} path="/bonds/withdrawal" state={{ openAddModal: true }} />
                </NestedSubmenu>
              </motion.div>
            )}
          </AnimatePresence>

          <SidebarItem 
            icon={Settings} 
            label={t('settings')} 
            hasSubmenu
            isSidebarOpen={showSidebarContent}
            isOpen={openSubmenu === 'settings'}
            onClick={() => toggleSubmenu('settings')}
          />
          <AnimatePresence>
            {openSubmenu === 'settings' && showSidebarContent && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={cn("overflow-hidden space-y-1 pr-2", direction === 'rtl' ? "mr-4 border-r border-gray-100" : "ml-4 border-l border-gray-100 pl-2 pr-0")}
              >
                <SubmenuItem label={t('system_settings')} icon={Settings} path="/settings/system" />
                <SubmenuItem label={t('payment_companies')} icon={CreditCard} path="/settings/payment-companies" />
                <SubmenuItem label={t('payment_methods')} icon={CreditCard} path="/settings/payment-methods" />
                <SubmenuItem label={t('pos_settings')} icon={Store} path="/settings/pos" />
                <SubmenuItem label={t('delivery_companies')} icon={Package} />
                <SubmenuItem label={t('promotions')} icon={Percent} path="/promotions" />
                <SubmenuItem 
                  label={t('change_logo')} 
                  icon={Upload} 
                  onClick={() => {
                    setIsLogoModalOpen(true);
                    if (isMobile) setIsMobileMenuOpen(false);
                  }}
                />
                <SubmenuItem label={t('currencies')} icon={Coins} path="/settings/currencies" />
                <SubmenuItem label={t('customer_groups')} icon={Link} path="/settings/customer-groups" />
                <SubmenuItem label={t('pricing_groups')} icon={DollarSign} path="/settings/price-groups" />
                <SubmenuItem label={t('basic_categories')} icon={Briefcase} path="/settings/basic-categories" />
                <SubmenuItem label={t('expense_categories')} icon={Folder} path="/settings/expense-categories" />
                <SubmenuItem label={t('units')} icon={Wrench} />
                <SubmenuItem label={t('brands')} icon={Layers} />
                <SubmenuItem label={t('variants')} icon={Tags} />
                <SubmenuItem label={t('tax_rates')} icon={DollarSign} />
                <SubmenuItem label={t('regions')} icon={Map} />
                <SubmenuItem label={t('delegates')} icon={Users} />
                <SubmenuItem label={t('tables')} icon={Grid3x3} />
                <SubmenuItem label={t('branches')} icon={Building} />
                <SubmenuItem label={t('production_machines')} icon={Factory} />
                <SubmenuItem label={t('group_permissions')} icon={Key} />
                <SubmenuItem label={t('site_logins')} icon={FileText} />
                <SubmenuItem label={t('reports')} icon={BarChart} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header data-theme={theme} className="bg-[var(--bg-card)] h-16 border-b border-[var(--border)] flex items-center justify-between px-4 lg:px-8 shadow-sm z-10 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[var(--text-muted)] hover:bg-[var(--bg-main)] rounded-lg"
            >
              <Menu size={24} />
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:block p-2 text-[var(--text-muted)] hover:bg-[var(--bg-main)] rounded-lg"
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden md:flex items-center bg-white dark:bg-gray-100 rounded-lg px-3 py-2 w-64 border border-[var(--border)]">
                <Search size={18} className="text-gray-400 ml-2" />
                <input 
                    type="text" 
                    placeholder={t('search')}
                    className={`bg-transparent border-none outline-none text-sm w-full text-black placeholder-gray-400 ${direction === 'rtl' ? 'placeholder:text-right' : 'placeholder:text-left'}`}
                    dir={direction}
                />
            </div>

            
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center gap-1">
                <button 
                    onClick={() => navigate('/sales/create-from-quote')}
                    className="flex items-center gap-0.5 px-1.5 py-0.5 text-white bg-red-700 hover:bg-red-800 rounded-md transition-colors text-[9px] font-medium shadow-sm"
                >
                    <span>{t('sales_a4_quick')}</span>
                    <LayoutGrid size={10} />
                </button>
                <button 
                    onClick={() => navigate('/sales/pos')}
                    className="flex items-center gap-0.5 px-1.5 py-0.5 text-white bg-red-700 hover:bg-red-800 rounded-md transition-colors text-[9px] font-medium shadow-sm"
                >
                    <span>{t('pos_quick')}</span>
                    <ShoppingCart size={10} />
                </button>
                <button 
                    onClick={() => navigate('/sales/all')}
                    className="flex items-center gap-0.5 px-1.5 py-0.5 text-white bg-red-700 hover:bg-red-800 rounded-md transition-colors text-[9px] font-medium shadow-sm"
                >
                    <span>{t('all_sales')}</span>
                    <List size={10} />
                </button>
                <button 
                    onClick={() => navigate('/products/create')}
                    className="flex items-center gap-0.5 px-1.5 py-0.5 text-white bg-red-700 hover:bg-red-800 rounded-md transition-colors text-[9px] font-medium shadow-sm"
                >
                    <span>{t('add_product')}</span>
                    <Package size={10} />
                </button>
            </div>

             {/* Notification Panel */}
             <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--bg-main)] rounded-full relative"
                >
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={cn(
                        "absolute mt-2 w-80 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border)] py-2 z-50",
                        "fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:mt-2 sm:w-80",
                        direction === 'rtl' ? "sm:left-0" : "sm:right-0"
                      )}
                    >
                      <div className="px-4 py-2 border-b border-[var(--border)] flex justify-between items-center">
                        <h3 className="font-bold text-[var(--text-main)]">{t('notifications')}</h3>
                        <span className="text-xs text-[var(--text-muted)] cursor-pointer hover:text-[var(--primary)]">{t('view_all')}</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="px-4 py-3 hover:bg-[var(--bg-main)] cursor-pointer border-b border-[var(--border)] last:border-0">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">
                              <ShoppingCart size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[var(--text-main)]">{t('new_order')}</p>
                              <p className="text-xs text-[var(--text-muted)] mt-1">{t('order_desc')}</p>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3 hover:bg-[var(--bg-main)] cursor-pointer border-b border-[var(--border)] last:border-0">
                          <div className="flex items-start gap-3">
                            <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">
                              <RefreshCw size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[var(--text-main)]">{t('system_update')}</p>
                              <p className="text-xs text-[var(--text-muted)] mt-1">{t('update_desc')}</p>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 py-3 hover:bg-[var(--bg-main)] cursor-pointer border-b border-[var(--border)] last:border-0">
                          <div className="flex items-start gap-3">
                            <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 mt-1">
                              <Package size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-[var(--text-main)]">{t('low_stock')}</p>
                              <p className="text-xs text-[var(--text-muted)] mt-1">{t('stock_desc')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
             
             {/* Theme Panel */}
             <div className="relative">
                <button 
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--bg-main)] rounded-full"
                >
                    {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <AnimatePresence>
                  {isThemeMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={cn(
                        "absolute mt-2 w-40 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border)] py-1 z-50",
                        "fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:mt-2 sm:w-40",
                        direction === 'rtl' ? "sm:left-0" : "sm:right-0"
                      )}
                    >
                      <button 
                        onClick={() => { if(theme !== 'light') toggleTheme(); setIsThemeMenuOpen(false); }}
                        className={`w-full px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center justify-between ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                      >
                        <div className="flex items-center gap-2">
                            <Sun size={16} />
                            <span>{t('light_mode')}</span>
                        </div>
                        {theme === 'light' && <Check size={16} className="text-[var(--primary)]" />}
                      </button>
                      <button 
                        onClick={() => { if(theme !== 'dark') toggleTheme(); setIsThemeMenuOpen(false); }}
                        className={`w-full px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center justify-between ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                      >
                        <div className="flex items-center gap-2">
                            <Moon size={16} />
                            <span>{t('dark_mode')}</span>
                        </div>
                        {theme === 'dark' && <Check size={16} className="text-[var(--primary)]" />}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             {/* Language Panel */}
             <div className="relative">
                <button 
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="p-2 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--bg-main)] rounded-full"
                >
                    <Globe size={20} />
                </button>
                <AnimatePresence>
                  {isLanguageMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={cn(
                        "absolute mt-2 w-40 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border)] py-1 z-50",
                        "fixed inset-x-4 top-20 sm:absolute sm:inset-auto sm:mt-2 sm:w-40",
                        direction === 'rtl' ? "sm:left-0" : "sm:right-0"
                      )}
                    >
                      <button 
                        onClick={() => { setLanguage('ar'); setIsLanguageMenuOpen(false); }}
                        className={`w-full px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center justify-between ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                      >
                        <span>{t('arabic')}</span>
                        {language === 'ar' && <Check size={16} className="text-[var(--primary)]" />}
                      </button>
                      <button 
                        onClick={() => { setLanguage('en'); setIsLanguageMenuOpen(false); }}
                        className={`w-full px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center justify-between ${direction === 'rtl' ? 'text-right' : 'text-left'}`}
                      >
                        <span>{t('english')}</span>
                        {language === 'en' && <Check size={16} className="text-[var(--primary)]" />}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             <div className="h-8 w-px bg-[var(--border)] mx-1"></div>

             <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 hover:bg-[var(--bg-main)] rounded-lg"
                >
                    <img 
                        src="https://picsum.photos/seed/avatar/100/100" 
                        alt="User" 
                        className="w-8 h-8 rounded-full border border-[var(--border)]"
                    />
                    <div className={`hidden md:block ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <p className="text-sm font-medium text-[var(--text-main)]">{t('admin')}</p>
                        <p className="text-xs text-[var(--text-muted)]">Admin</p>
                    </div>
                    <ChevronDown size={16} className="text-[var(--text-muted)]" />
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={cn("absolute mt-2 w-48 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border)] py-1 z-50", direction === 'rtl' ? "left-0" : "right-0")}
                    >
                      <button className={`w-full px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center gap-2 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <Users size={16} />
                        {t('profile')}
                      </button>
                      <button className={`w-full px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-main)] flex items-center gap-2 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <Settings size={16} />
                        {t('settings')}
                      </button>
                      <div className="h-px bg-[var(--border)] my-1"></div>
                      <button className={`w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 ${direction === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <LogOut size={16} />
                        {t('logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {location.pathname === '/dashboard' && <WelcomeBanner />}
          {children}
        </main>
      </div>

      <LogoModal 
        isOpen={isLogoModalOpen} 
        onClose={() => setIsLogoModalOpen(false)} 
      />
    </div>
  );
}
