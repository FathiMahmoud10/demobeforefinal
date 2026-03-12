import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LayoutGrid, Save, Settings, Printer, FileText, Receipt, Keyboard } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useSettings, POSSettings as IPOSSettings } from '../context/SettingsContext';

const POSSettings: React.FC = () => {
  const { t, direction } = useLanguage();
  const { posSettings, updatePOSSettings, saveSettings } = useSettings();
  const [activeSection, setActiveSection] = useState('pos_config');

  const handleUpdate = (section: keyof IPOSSettings, field: string, value: any) => {
    updatePOSSettings({
      [section]: {
        ...(posSettings[section] as any),
        [field]: value
      }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings();
  };

  const sections = [
    { id: 'pos_config', label: t('pos_config'), icon: Settings },
    { id: 'pos_printing', label: t('pos_printing'), icon: Printer },
    { id: 'custom_fields_receipt', label: t('custom_fields_receipt'), icon: FileText },
    { id: 'receipt_settings', label: t('receipt_settings'), icon: Receipt },
    { id: 'shortcuts', label: t('shortcuts'), icon: Keyboard },
  ];

  const sectionRefs = {
    pos_config: useRef<HTMLDivElement>(null),
    pos_printing: useRef<HTMLDivElement>(null),
    custom_fields_receipt: useRef<HTMLDivElement>(null),
    receipt_settings: useRef<HTMLDivElement>(null),
    shortcuts: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const ref = sectionRefs[id as keyof typeof sectionRefs];
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const SectionHeader = ({ id, title }: { id: string; title: string }) => (
    <div 
      ref={sectionRefs[id as keyof typeof sectionRefs]}
      className="flex items-center gap-2 mb-6 border-r-4 border-[var(--primary)] pr-3"
    >
      <h2 className="text-xl font-bold text-[var(--text-main)]">{title}</h2>
    </div>
  );

  const SaveButton = () => (
    <div className="flex justify-start mt-6">
      <button 
        onClick={handleSave}
        className="bg-[#004d2c] text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-opacity-90 transition-all text-sm font-bold"
      >
        <Save size={18} />
        {t('save_changes')}
      </button>
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between bg-[var(--card-bg)] p-4 rounded-lg border border-[var(--border)]">
        <div className="flex items-center gap-2">
          <LayoutGrid className="text-[var(--primary)]" size={24} />
          <h1 className="text-xl font-bold text-[var(--text-main)]">{t('pos_settings')}</h1>
        </div>
      </div>

      <div className="text-sm text-[var(--text-muted)] text-right">
        {t('pos_settings_update_msg')}
      </div>

      {/* Navigation Card - Styled like the image */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#004d26] rounded-xl overflow-hidden shadow-xl border border-[#003d1d]"
      >
        <div className="bg-[#003d1d] p-4 flex items-center justify-end gap-3 text-white border-b border-white/10">
          <span className="font-bold text-lg">{t('pos_settings')}</span>
          <Settings size={22} className="text-white/90" />
        </div>
        <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "flex items-center justify-end gap-4 px-6 py-3 rounded-lg transition-all text-right group",
                activeSection === section.id 
                  ? "bg-white/15 text-white font-bold" 
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <span className="text-sm font-medium">
                {section.label}
              </span>
              <section.icon 
                size={20} 
                className={cn(
                  "transition-colors",
                  activeSection === section.id ? "text-white" : "text-white/60 group-hover:text-white"
                )} 
              />
            </button>
          ))}
        </div>
      </motion.div>

      <div className="flex flex-col gap-6 relative items-start">
        {/* Main Content */}
        <div className="flex-1 space-y-8 w-full">
          {/* POS Configuration */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--border)] shadow-sm"
          >
            <SectionHeader id="pos_config" title={t('pos_config')} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('display_items')} *</label>
                <input 
                  type="number" 
                  value={posSettings.config.displayItems} 
                  onChange={(e) => handleUpdate('config', 'displayItems', parseInt(e.target.value))}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('default_category')} *</label>
                <select 
                  value={posSettings.config.defaultCategory}
                  onChange={(e) => handleUpdate('config', 'defaultCategory', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="عام">عام</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('default_cashier')} *</label>
                <select 
                  value={posSettings.config.defaultCashier}
                  onChange={(e) => handleUpdate('config', 'defaultCashier', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="تجريبي">تجريبي</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('default_customer')} *</label>
                <select 
                  value={posSettings.config.defaultCustomer}
                  onChange={(e) => handleUpdate('config', 'defaultCustomer', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="شخص عام(عميل افتراضي)">شخص عام(عميل افتراضي)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('display_time')} *</label>
                <select 
                  value={posSettings.config.displayTime ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('config', 'displayTime', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('on_screen_keyboard')} *</label>
                <select 
                  value={posSettings.config.onScreenKeyboard ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('config', 'onScreenKeyboard', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('instructions_tool')} *</label>
                <select 
                  value={posSettings.config.instructionsTool ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('config', 'instructionsTool', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('rounding')} *</label>
                <select 
                  value={posSettings.config.rounding ? "تمكين" : "تعطيل"}
                  onChange={(e) => handleUpdate('config', 'rounding', e.target.value === "تمكين")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="تعطيل">تعطيل</option>
                  <option value="تمكين">تمكين</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('item_order')} *</label>
                <select 
                  value={posSettings.config.itemOrder}
                  onChange={(e) => handleUpdate('config', 'itemOrder', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="Default">Default</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('after_sale_page')} *</label>
                <select 
                  value={posSettings.config.afterSalePage}
                  onChange={(e) => handleUpdate('config', 'afterSalePage', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="الإيصال">الإيصال</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('print_customer_details')} *</label>
                <select 
                  value={posSettings.config.printCustomerDetails ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('config', 'printCustomerDetails', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('display_tax_details')} *</label>
                <select 
                  value={posSettings.config.displayTaxDetails ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('config', 'displayTaxDetails', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('enable_bill_suspension')} *</label>
                <select 
                  value={posSettings.config.enableBillSuspension ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('config', 'enableBillSuspension', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('cancel_item_from_bill')} *</label>
                <select 
                  value={posSettings.config.cancelItemFromBill ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('config', 'cancelItemFromBill', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('enable_bill_cancellation')} *</label>
                <select 
                  value={posSettings.config.enableBillCancellation ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('config', 'enableBillCancellation', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('operation_password')}</label>
                <input 
                  type="password" 
                  value={posSettings.config.operationPassword}
                  onChange={(e) => handleUpdate('config', 'operationPassword', e.target.value)}
                  placeholder="كلمة المرور للعمليات" 
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('enable_order_number')} *</label>
                <select 
                  value={posSettings.config.enableOrderNumber ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('config', 'enableOrderNumber', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('enable_display_screen')} *</label>
                <select 
                  value={posSettings.config.enableDisplayScreen ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('config', 'enableDisplayScreen', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('enable_alert_sound')} *</label>
                <select 
                  value={posSettings.config.enableAlertSound ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('config', 'enableAlertSound', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('enable_additions')} *</label>
                <select 
                  value={posSettings.config.enableAdditions ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('config', 'enableAdditions', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('enable_short_sales_report')} *</label>
                <select 
                  value={posSettings.config.enableShortSalesReport ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('config', 'enableShortSalesReport', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('enable_daily_sales_report')} *</label>
                <select 
                  value={posSettings.config.enableDailySalesReport ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('config', 'enableDailySalesReport', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('enable_reservations')} *</label>
                <select 
                  value={posSettings.config.enableReservations ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('config', 'enableReservations', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
            </div>
            <SaveButton />
          </motion.div>

          {/* POS Printing */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--border)] shadow-sm"
          >
            <SectionHeader id="pos_printing" title={t('pos_printing')} />
            <div className="space-y-4 text-right">
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('printer')} *</label>
                <select 
                  value={posSettings.printing.printer}
                  onChange={(e) => handleUpdate('printing', 'printer', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="Web Browser">Web Browser</option>
                  <option value="PHP Pos Print Server">PHP Pos Print Server</option>
                </select>
              </div>
              <div className="bg-gray-50 p-4 rounded text-center text-xs text-gray-500 leading-relaxed">
                For local single machine installation: PHP Server will be the best choice and for live server or local server setup (LAN): you can install PHP Pos Print Server locally on each machine (recommended) or use web browser printing feature.<br/>
                تحميل: <span className="text-blue-600 cursor-pointer hover:underline">PHP Pos Print Server</span>
              </div>
            </div>
            <SaveButton />
          </motion.div>

          {/* Custom Fields on Receipt */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--border)] shadow-sm"
          >
            <SectionHeader id="custom_fields_receipt" title={t('custom_fields_receipt')} />
            <div className="text-right">
              <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('custom_field_1_value')}</label>
              <input 
                type="text" 
                value={posSettings.customFields.field1Value}
                onChange={(e) => handleUpdate('customFields', 'field1Value', e.target.value)}
                className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]" 
              />
            </div>
            <SaveButton />
          </motion.div>

          {/* Receipt Settings */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--border)] shadow-sm"
          >
            <SectionHeader id="receipt_settings" title={t('receipt_settings')} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('print_address')}</label>
                <select 
                  value={posSettings.receipt.printAddress ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('receipt', 'printAddress', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('print_extra_id')}</label>
                <select 
                  value={posSettings.receipt.printExtraId ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('receipt', 'printExtraId', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('print_phone_number')}</label>
                <select 
                  value={posSettings.receipt.printPhone ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('receipt', 'printPhone', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('print_tax_number')}</label>
                <select 
                  value={posSettings.receipt.printTaxNumber ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('receipt', 'printTaxNumber', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('print_reference_number')}</label>
                <select 
                  value={posSettings.receipt.printReference ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('receipt', 'printReference', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('print_cashier')}</label>
                <select 
                  value={posSettings.receipt.printCashier ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('receipt', 'printCashier', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('print_employee')}</label>
                <select 
                  value={posSettings.receipt.printEmployee ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('receipt', 'printEmployee', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('print_barcode_receipt')}</label>
                <select 
                  value={posSettings.receipt.printBarcode ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('receipt', 'printBarcode', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('print_discount')}</label>
                <select 
                  value={posSettings.receipt.printDiscount ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('receipt', 'printDiscount', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
            </div>
            <SaveButton />
          </motion.div>

          {/* Shortcuts */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--border)] shadow-sm"
          >
            <SectionHeader id="shortcuts" title={t('shortcuts')} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('focus_search')}</label>
                <input 
                  type="text" 
                  value={posSettings.shortcuts.focusSearch}
                  onChange={(e) => handleUpdate('shortcuts', 'focusSearch', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('cancel_sale')}</label>
                <input 
                  type="text" 
                  value={posSettings.shortcuts.cancelSale}
                  onChange={(e) => handleUpdate('shortcuts', 'cancelSale', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('suspend_sale')}</label>
                <input 
                  type="text" 
                  value={posSettings.shortcuts.suspendSale}
                  onChange={(e) => handleUpdate('shortcuts', 'suspendSale', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('last_invoice')}</label>
                <input 
                  type="text" 
                  value={posSettings.shortcuts.lastInvoice}
                  onChange={(e) => handleUpdate('shortcuts', 'lastInvoice', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('finish_sale')}</label>
                <input 
                  type="text" 
                  value={posSettings.shortcuts.finishSale}
                  onChange={(e) => handleUpdate('shortcuts', 'finishSale', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('today_sales')}</label>
                <input 
                  type="text" 
                  value={posSettings.shortcuts.todaySales}
                  onChange={(e) => handleUpdate('shortcuts', 'todaySales', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('open_suspended_sales')}</label>
                <input 
                  type="text" 
                  value={posSettings.shortcuts.openSuspendedSales}
                  onChange={(e) => handleUpdate('shortcuts', 'openSuspendedSales', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">{t('close_shift')}</label>
                <input 
                  type="text" 
                  value={posSettings.shortcuts.closeShift}
                  onChange={(e) => handleUpdate('shortcuts', 'closeShift', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded bg-[var(--input-bg)] text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--primary)]" 
                />
              </div>
            </div>
            <SaveButton />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default POSSettings;
