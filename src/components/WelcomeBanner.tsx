import { useState } from 'react';
import { Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export default function WelcomeBanner() {
  const { t, direction } = useLanguage();
  const [showToast, setShowToast] = useState(false);

  const handleRenew = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="mb-6 space-y-4" dir={direction}>
      {/* Toast Notification */}
      <AnimatePresence>
          {showToast && (
              <motion.div 
                  initial={{ opacity: 0, y: -20, x: '-50%' }}
                  animate={{ opacity: 1, y: 0, x: '-50%' }}
                  exit={{ opacity: 0, y: -20, x: '-50%' }}
                  className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-3"
              >
                  <CheckCircle2 className="text-green-400" size={20} />
                  <span>{t('renewal_request_sent')}</span>
              </motion.div>
          )}
      </AnimatePresence>

      {/* Welcome & Date Card */}
      <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border)] shadow-sm"
      >
          <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--bg-main)] rounded-lg text-[var(--primary)]">
                  <Calendar size={24} />
              </div>
              <div>
                  <h2 className="font-bold text-[var(--primary)]">{t('welcome_admin')}</h2>
                  <p className="text-sm text-[var(--text-muted)] dark:text-gray-400">{t('total_operations_date')} (2026-02-20)</p>
              </div>
          </div>
          <button 
              onClick={handleRenew}
              className="flex items-center gap-2 bg-[var(--bg-main)] text-[var(--primary)] px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:opacity-80 transition-all border border-[var(--border)] active:scale-95 transform duration-100"
          >
              <ArrowUpRight size={16} />
              {t('renew_subscription_days')}
          </button>
      </motion.div>
    </div>
  );
}
