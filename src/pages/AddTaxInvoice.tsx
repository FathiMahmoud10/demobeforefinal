import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

export default function AddTaxInvoice() {
  const { t, direction } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4"
      dir={direction}
    >
      <h1 className="text-xl font-bold mb-4">
        {t('add_tax_invoice')}
      </h1>
      <p>{t('coming_soon') || 'This feature is coming soon.'}</p>
    </motion.div>
  );
}
