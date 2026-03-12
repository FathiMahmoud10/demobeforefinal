import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Wallet, 
  Loader2, 
  TrendingUp, 
  CreditCard,
  LayoutGrid,
  ShoppingCart,
  List,
  Package
} from 'lucide-react';
import Layout from '@/components/Layout';

import RecentTransactions from '@/components/RecentTransactions';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, delay }: any) => {
  const { t, direction } = useLanguage();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-xl p-6 text-white shadow-lg relative overflow-hidden ${bgClass}`}
    >
      <div className="relative z-10">
        <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold flex items-baseline gap-1">
          {value} <span className="text-sm font-normal opacity-70">{t('currency_sar')}</span>
        </h3>
      </div>
      <div className={`absolute ${direction === 'rtl' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/20 backdrop-blur-sm`}>
        <Icon size={24} className="text-white" />
      </div>
      <div className={`absolute ${direction === 'rtl' ? '-left-6' : '-right-6'} -bottom-6 opacity-10`}>
          <Icon size={120} />
      </div>
    </motion.div>
  );
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const { t, direction } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir={direction}>
        <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="text-primary animate-spin" />
            <p className="text-gray-500 font-medium">{t('loading_data')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative dashboard-page">
      

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t('total_sales')} 
          value="110,894.50" 
          icon={DollarSign} 
          bgClass="bg-gradient-to-br from-blue-600 to-blue-800"
          delay={0.1}
        />
        <StatCard 
          title={t('total_purchases')} 
          value="32,506.50" 
          icon={ShoppingBag} 
          bgClass="bg-gradient-to-br from-emerald-600 to-emerald-800"
          delay={0.2}
        />
        <StatCard 
          title={t('net_profit')} 
          value="78,388.00" 
          icon={TrendingUp} 
          bgClass="bg-gradient-to-br from-purple-600 to-purple-800"
          delay={0.3}
        />
        <StatCard 
          title={t('total_receivables')} 
          value="12,450.00" 
          icon={CreditCard} 
          bgClass="bg-gradient-to-br from-orange-600 to-orange-800"
          delay={0.4}
        />
      </div>

      {/* Charts Section */}
      

      {/* Recent Transactions */}
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
      >
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
                  <span className="w-1 h-6 bg-[var(--secondary)] rounded-full"></span>
                  {t('recent_transactions')}
              </h3>
          </div>
          <RecentTransactions />
      </motion.div>
    </div>
  );
}
