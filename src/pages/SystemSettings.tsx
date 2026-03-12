import React, { useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings, SystemSettings as ISystemSettings } from '@/context/SettingsContext';
import { 
  Settings, 
  Package, 
  ShoppingCart, 
  Hash, 
  DollarSign, 
  Barcode, 
  Mail, 
  Star, 
  Percent, 
  FileText, 
  Printer,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
}

const SettingSection: React.FC<SettingSectionProps> = ({ id, title, children, onSave }) => {
  const { t } = useLanguage();
  return (
    <section id={id} className="bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden mb-8 scroll-mt-24">
      <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-main)]/50 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
          <div className="w-1 h-6 bg-[var(--primary)] rounded-full"></div>
          {title}
        </h2>
      </div>
      <div className="p-6">
        {children}
        <div className="mt-8 pt-6 border-t border-[var(--border)] flex justify-start">
          <button 
            onClick={onSave}
            className="bg-[#006437] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#006437]/90 transition-colors shadow-sm"
          >
            <Save size={18} />
            {t('save_settings')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default function SystemSettings() {
  const { t, direction } = useLanguage();
  const { systemSettings, updateSystemSettings, saveSettings } = useSettings();

  const handleUpdate = (section: keyof ISystemSettings, field: string, value: any) => {
    updateSystemSettings({
      [section]: {
        ...(systemSettings[section] as any),
        [field]: value
      }
    });
  };

  const handleNestedUpdate = (section: keyof ISystemSettings, field: string, nestedField: string, value: any) => {
    const sectionData = systemSettings[section] as any;
    updateSystemSettings({
      [section]: {
        ...sectionData,
        [field]: {
          ...sectionData[field],
          [nestedField]: value
        }
      }
    });
  };

  const sections = [
    { id: 'site', title: t('site_settings'), icon: Settings },
    { id: 'items', title: t('items_settings'), icon: Package },
    { id: 'sales', title: t('sales_settings'), icon: ShoppingCart },
    { id: 'prefixes', title: t('prefixes_settings'), icon: Hash },
    { id: 'money', title: t('money_formatting'), icon: DollarSign },
    { id: 'barcode', title: t('barcode_scale'), icon: Barcode },
    { id: 'email', title: t('email_settings'), icon: Mail },
    { id: 'points', title: t('earned_points'), icon: Star },
    { id: 'fees', title: t('sales_fees'), icon: Percent },
    { id: 'reports', title: t('report_print_settings'), icon: FileText },
    { id: 'sales_print', title: t('sales_print_settings'), icon: Printer },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSave = () => {
    saveSettings();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto" dir={direction}>
      <div className="flex flex-col md:flex-row gap-8 relative">
        {/* Main Content */}
        <div className="flex-1 order-2 md:order-1">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[var(--text-main)] flex items-center gap-2">
              <Settings className="w-6 h-6" />
              {t('system_settings')}
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              يرجى تحديث المعلومات الواردة أدناه. تسميات الحقول التي تحمل علامة * هي حقول اجبارية .
            </p>
          </div>

          <SettingSection id="site" title={t('site_settings')} onSave={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('company_name')} *</label>
                <input 
                  type="text" 
                  value={systemSettings.site.companyName} 
                  onChange={(e) => handleUpdate('site', 'companyName', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('language')} *</label>
                <select 
                  value={systemSettings.site.language}
                  onChange={(e) => handleUpdate('site', 'language', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="Arabic">Arabic</option>
                  <option value="English">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">العملة الافتراضية *</label>
                <select 
                  value={systemSettings.site.defaultCurrency}
                  onChange={(e) => handleUpdate('site', 'defaultCurrency', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="Saudi Riyal">Saudi Riyal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('accounting_method')} *</label>
                <select 
                  value={systemSettings.site.accountingMethod}
                  onChange={(e) => handleUpdate('site', 'accountingMethod', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="FIFO (First In First Out)">FIFO (First In First Out)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('default_email')} *</label>
                <input 
                  type="email" 
                  value={systemSettings.site.defaultEmail} 
                  onChange={(e) => handleUpdate('site', 'defaultEmail', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">{t('default_customer_group')} *</label>
                <select 
                  value={systemSettings.site.defaultCustomerGroup}
                  onChange={(e) => handleUpdate('site', 'defaultCustomerGroup', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="عام">عام</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">مجموعة الأسعار العامة *</label>
                <select 
                  value={systemSettings.site.generalPriceGroup}
                  onChange={(e) => handleUpdate('site', 'generalPriceGroup', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="عام">عام</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">دعم RTL *</label>
                <select 
                  value={systemSettings.site.rtlSupport ? "تمكين" : "تعطيل"}
                  onChange={(e) => handleUpdate('site', 'rtlSupport', e.target.value === "تمكين")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="تمكين">تمكين</option>
                  <option value="تعطيل">تعطيل</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">عدد الأيام التى لا يمكن تعديل فواتير المبيعات بعدها *</label>
                <input 
                  type="number" 
                  value={systemSettings.site.invoiceEditDays} 
                  onChange={(e) => handleUpdate('site', 'invoiceEditDays', parseInt(e.target.value))}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">الصفوف لكل صفحة *</label>
                <select 
                  value={systemSettings.site.rowsPerPage}
                  onChange={(e) => handleUpdate('site', 'rowsPerPage', parseInt(e.target.value))}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">المنطقة الزمنية *</label>
                <select 
                  value={systemSettings.site.timezone}
                  onChange={(e) => handleUpdate('site', 'timezone', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="Asia/Kuwait">Asia/Kuwait</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">الفرع الافتراضي *</label>
                <select 
                  value={systemSettings.site.defaultBranch}
                  onChange={(e) => handleUpdate('site', 'defaultBranch', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="تجريبي (WHI)">تجريبي (WHI)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">الكاشير الافتراضي *</label>
                <select 
                  value={systemSettings.site.defaultCashier}
                  onChange={(e) => handleUpdate('site', 'defaultCashier', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="تجريبي">تجريبي</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">PDF Library *</label>
                <select 
                  value={systemSettings.site.pdfLibrary}
                  onChange={(e) => handleUpdate('site', 'pdfLibrary', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="mPDF">mPDF</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">شركة الدفع الافتراضية *</label>
                <select 
                  value={systemSettings.site.defaultPaymentCompany}
                  onChange={(e) => handleUpdate('site', 'defaultPaymentCompany', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="بدون">بدون</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">عدد أيام تنبيه الصلاحية *</label>
                <input 
                  type="number" 
                  value={systemSettings.site.expiryAlertDays} 
                  onChange={(e) => handleUpdate('site', 'expiryAlertDays', parseInt(e.target.value))}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">إظهار الرصيد الفعلي في قائمة العملاء *</label>
                <select 
                  value={systemSettings.site.showActualBalance ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('site', 'showActualBalance', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">إظهار رسالة التكلفة أكبر من سعر البيع *</label>
                <select 
                  value={systemSettings.site.showCostGreaterMsg ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('site', 'showCostGreaterMsg', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">إظهار كود الصنف في المبيعات *</label>
                <select 
                  value={systemSettings.site.showItemCodeInSales ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('site', 'showItemCodeInSales', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">إظهار كود الصنف في عروض الأسعار *</label>
                <select 
                  value={systemSettings.site.showItemCodeInQuotes ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('site', 'showItemCodeInQuotes', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">إظهار كود الصنف في المشتريات *</label>
                <select 
                  value={systemSettings.site.showItemCodeInPurchases ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('site', 'showItemCodeInPurchases', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
            </div>
          </SettingSection>

          <SettingSection id="items" title={t('items_settings')} onSave={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">ضريبة الأصناف *</label>
                <select 
                  value={systemSettings.items.itemTax ? "تمكين" : "تعطيل"}
                  onChange={(e) => handleUpdate('items', 'itemTax', e.target.value === "تمكين")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="تمكين">تمكين</option>
                  <option value="تعطيل">تعطيل</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">رفوف *</label>
                <select 
                  value={systemSettings.items.shelves ? "تمكين" : "تعطيل"}
                  onChange={(e) => handleUpdate('items', 'shelves', e.target.value === "تمكين")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="تمكين">تمكين</option>
                  <option value="تعطيل">تعطيل</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">متغيرات الأصناف *</label>
                <select 
                  value={systemSettings.items.itemVariants ? "تمكين" : "تعطيل"}
                  onChange={(e) => handleUpdate('items', 'itemVariants', e.target.value === "تمكين")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="تمكين">تمكين</option>
                  <option value="تعطيل">تعطيل</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">انتهاء صلاحية الصنف *</label>
                <select 
                  value={systemSettings.items.itemExpiry ? "تمكين" : "تعطيل"}
                  onChange={(e) => handleUpdate('items', 'itemExpiry', e.target.value === "تمكين")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="تمكين">تمكين</option>
                  <option value="تعطيل">تعطيل</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">حذف الأصناف منتهية الصلاحية من المخزون *</label>
                <select 
                  value={systemSettings.items.deleteExpiredItems ? "نعم" : "لا، أنا سأقوم بالحذف يدوياً"}
                  onChange={(e) => handleUpdate('items', 'deleteExpiredItems', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="لا، أنا سأقوم بالحذف يدوياً">لا، أنا سأقوم بالحذف يدوياً</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">حجم الصورة (Width : Height) *</label>
                  <input 
                    type="number" 
                    value={systemSettings.items.imageSize.width} 
                    onChange={(e) => handleNestedUpdate('items', 'imageSize', 'width', parseInt(e.target.value))}
                    className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                  />
                </div>
                <div className="pt-6">
                  <input 
                    type="number" 
                    value={systemSettings.items.imageSize.height} 
                    onChange={(e) => handleNestedUpdate('items', 'imageSize', 'height', parseInt(e.target.value))}
                    className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">حجم الصورة المصغرة (Width : Height) *</label>
                  <input 
                    type="number" 
                    value={systemSettings.items.thumbnailSize.width} 
                    onChange={(e) => handleNestedUpdate('items', 'thumbnailSize', 'width', parseInt(e.target.value))}
                    className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                  />
                </div>
                <div className="pt-6">
                  <input 
                    type="number" 
                    value={systemSettings.items.thumbnailSize.height} 
                    onChange={(e) => handleNestedUpdate('items', 'thumbnailSize', 'height', parseInt(e.target.value))}
                    className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">العلامة المائية *</label>
                <select 
                  value={systemSettings.items.watermark ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('items', 'watermark', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">إظهار أصناف المخزن *</label>
                <select 
                  value={systemSettings.items.showWarehouseItems}
                  onChange={(e) => handleUpdate('items', 'showWarehouseItems', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="اظهار جميع الاصناف حتى لو رصيدها صفر">اظهار جميع الاصناف حتى لو رصيدها صفر</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">فاصل الباركود *</label>
                <select 
                  value={systemSettings.items.barcodeSeparator}
                  onChange={(e) => handleUpdate('items', 'barcodeSeparator', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="( _ ) Underscore">( _ ) Underscore</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">معيار الباركود *</label>
                <select 
                  value={systemSettings.items.barcodeStandard}
                  onChange={(e) => handleUpdate('items', 'barcodeStandard', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="صورة">صورة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">تحويل المخزون *</label>
                <select 
                  value={systemSettings.items.inventoryTransfer}
                  onChange={(e) => handleUpdate('items', 'inventoryTransfer', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="تكلفة">تكلفة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">تفعيل اسم الصنف باللغة الثانية *</label>
                <select 
                  value={systemSettings.items.enableSecondLangName ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('items', 'enableSecondLangName', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
            </div>
          </SettingSection>

          <SettingSection id="sales" title={t('sales_settings')} onSave={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البيع حتى لو كان الرصيد صفر *</label>
                <select 
                  value={systemSettings.sales.sellIfZero ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('sales', 'sellIfZero', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">تنسيق الرقم المرجعي *</label>
                <select 
                  value={systemSettings.sales.referenceFormat}
                  onChange={(e) => handleUpdate('sales', 'referenceFormat', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="الشهر / السنة / تسلسل رقم (م / 08/001 / 4..)">الشهر / السنة / تسلسل رقم (م / 08/001 / 4..)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">سيريال الصنف *</label>
                <select 
                  value={systemSettings.sales.itemSerial ? "تمكين" : "تعطيل"}
                  onChange={(e) => handleUpdate('sales', 'itemSerial', e.target.value === "تمكين")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="تمكين">تمكين</option>
                  <option value="تعطيل">تعطيل</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">طريقة اضافة بند الصنف فى فاتورة المبيعات *</label>
                <select 
                  value={systemSettings.sales.addItemMethod}
                  onChange={(e) => handleUpdate('sales', 'addItemMethod', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="زيادة كمية البند، إذا كان موجوداً بالفعل في ..">زيادة كمية البند، إذا كان موجوداً بالفعل في ..</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">مكان وقوف المؤشر بعد اضافة الصنف *</label>
                <select 
                  value={systemSettings.sales.cursorPosition}
                  onChange={(e) => handleUpdate('sales', 'cursorPosition', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="اضافة منتج جديد">اضافة منتج جديد</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">طريقة الدفع الافتراضية *</label>
                <select 
                  value={systemSettings.sales.defaultPaymentMethod}
                  onChange={(e) => handleUpdate('sales', 'defaultPaymentMethod', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="شبكة">شبكة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">اسم الرقم التسلسلي في الفواتير</label>
                <input 
                  type="text" 
                  value={systemSettings.sales.serialNameInInvoices}
                  onChange={(e) => handleUpdate('sales', 'serialNameInInvoices', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">طريقة الدفع الافتراضية للمشتريات</label>
                <select 
                  value={systemSettings.sales.defaultPurchasePaymentMethod}
                  onChange={(e) => handleUpdate('sales', 'defaultPurchasePaymentMethod', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="آجل">آجل</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">تفعيل البحث السريع</label>
                <select 
                  value={systemSettings.sales.enableQuickSearch ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('sales', 'enableQuickSearch', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">حذف محددات البحث</label>
                <select 
                  value={systemSettings.sales.clearSearchFilters ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('sales', 'clearSearchFilters', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">تفعيل المسوقين</label>
                <select 
                  value={systemSettings.sales.enableMarketers ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('sales', 'enableMarketers', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">تفعيل النظارات *</label>
                <select 
                  value={systemSettings.sales.enableGlasses ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('sales', 'enableGlasses', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
            </div>
          </SettingSection>

          <SettingSection id="prefixes" title={t('prefixes_settings')} onSave={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية للمبيعات</label>
                <input 
                  type="text" 
                  value={systemSettings.prefixes.sales} 
                  onChange={(e) => handleUpdate('prefixes', 'sales', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية لرجيع المبيعات</label>
                <input 
                  type="text" 
                  value={systemSettings.prefixes.salesReturn} 
                  onChange={(e) => handleUpdate('prefixes', 'salesReturn', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية للدفع</label>
                <input 
                  type="text" 
                  value={systemSettings.prefixes.payment} 
                  onChange={(e) => handleUpdate('prefixes', 'payment', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Purchase Payment Prefix</label>
                <input 
                  type="text" 
                  value={systemSettings.prefixes.purchasePayment} 
                  onChange={(e) => handleUpdate('prefixes', 'purchasePayment', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية للتسليم</label>
                <input 
                  type="text" 
                  value={systemSettings.prefixes.delivery} 
                  onChange={(e) => handleUpdate('prefixes', 'delivery', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية لعروض الأسعار</label>
                <input 
                  type="text" 
                  value={systemSettings.prefixes.quotes} 
                  onChange={(e) => handleUpdate('prefixes', 'quotes', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية للمشتريات</label>
                <input 
                  type="text" 
                  value={systemSettings.prefixes.purchases} 
                  onChange={(e) => handleUpdate('prefixes', 'purchases', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية لرجيع المشتريات</label>
                <input 
                  type="text" 
                  value={systemSettings.prefixes.purchasesReturn} 
                  onChange={(e) => handleUpdate('prefixes', 'purchasesReturn', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">نقل وتحويل</label>
                <input 
                  type="text" 
                  value={systemSettings.prefixes.transfer} 
                  onChange={(e) => handleUpdate('prefixes', 'transfer', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية للمصروفات</label>
                <input 
                  type="text" 
                  value={systemSettings.prefixes.expenses} 
                  onChange={(e) => handleUpdate('prefixes', 'expenses', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">البادئة المرجعية لتعديل الكميات</label>
                <input 
                  type="text" 
                  value={systemSettings.prefixes.quantityAdjustment} 
                  onChange={(e) => handleUpdate('prefixes', 'quantityAdjustment', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
            </div>
          </SettingSection>

          <SettingSection id="money" title={t('money_formatting')} onSave={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">الكسور العشرية *</label>
                <select 
                  value={systemSettings.money.decimals}
                  onChange={(e) => handleUpdate('money', 'decimals', parseInt(e.target.value))}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">العلامات العشرية للكمية *</label>
                <select 
                  value={systemSettings.money.quantityDecimals}
                  onChange={(e) => handleUpdate('money', 'quantityDecimals', parseInt(e.target.value))}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value={2}>2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">تنسيق جنوب اسيا لبلدان العملات *</label>
                <select 
                  value={systemSettings.money.southAsiaFormat ? "تمكين" : "تعطيل"}
                  onChange={(e) => handleUpdate('money', 'southAsiaFormat', e.target.value === "تمكين")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="تعطيل">تعطيل</option>
                  <option value="تمكين">تمكين</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">فاصل درجة عشرية *</label>
                <select 
                  value={systemSettings.money.decimalSeparator}
                  onChange={(e) => handleUpdate('money', 'decimalSeparator', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="( . ) Dot">( . ) Dot</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">فاصل درجة الفيه *</label>
                <select 
                  value={systemSettings.money.thousandSeparator}
                  onChange={(e) => handleUpdate('money', 'thousandSeparator', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="فاصلة">فاصلة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">اظهار رمز العملة *</label>
                <select 
                  value={systemSettings.money.showCurrencySymbol ? "تمكين" : "تعطيل"}
                  onChange={(e) => handleUpdate('money', 'showCurrencySymbol', e.target.value === "تمكين")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="تعطيل">تعطيل</option>
                  <option value="تمكين">تمكين</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">رمز العملة</label>
                <input 
                  type="text" 
                  value={systemSettings.money.currencySymbol} 
                  onChange={(e) => handleUpdate('money', 'currencySymbol', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">العلامات العشرية لفاتورة الـ A4 *</label>
                <select 
                  value={systemSettings.money.a4InvoiceDecimals}
                  onChange={(e) => handleUpdate('money', 'a4InvoiceDecimals', parseInt(e.target.value))}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value={4}>4</option>
                </select>
              </div>
            </div>
          </SettingSection>

          <SettingSection id="barcode" title={t('barcode_scale')} onSave={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">نوع الباركود</label>
                <select 
                  value={systemSettings.barcode.type}
                  onChange={(e) => handleUpdate('barcode', 'type', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="الوزن/الكمية">الوزن/الكمية</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">الحروف الكلية للباركود</label>
                <input 
                  type="number" 
                  value={systemSettings.barcode.totalCharacters} 
                  onChange={(e) => handleUpdate('barcode', 'totalCharacters', parseInt(e.target.value))}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Flag Characters</label>
                <input 
                  type="text" 
                  value={systemSettings.barcode.flagCharacters} 
                  onChange={(e) => handleUpdate('barcode', 'flagCharacters', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">مكان بدء الباركود</label>
                <input 
                  type="number" 
                  value={systemSettings.barcode.codeStart} 
                  onChange={(e) => handleUpdate('barcode', 'codeStart', parseInt(e.target.value))}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">عدد الحروف فى الكود</label>
                <input 
                  type="number" 
                  value={systemSettings.barcode.codeLength} 
                  onChange={(e) => handleUpdate('barcode', 'codeLength', parseInt(e.target.value))}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">مكان بداية الوزن</label>
                <input 
                  type="number" 
                  value={systemSettings.barcode.weightStart} 
                  onChange={(e) => handleUpdate('barcode', 'weightStart', parseInt(e.target.value))}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">عدد الحروف فى الوزن</label>
                <input 
                  type="number" 
                  value={systemSettings.barcode.weightLength} 
                  onChange={(e) => handleUpdate('barcode', 'weightLength', parseInt(e.target.value))}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">الوزن مقسوم على</label>
                <input 
                  type="number" 
                  value={systemSettings.barcode.weightDivider} 
                  onChange={(e) => handleUpdate('barcode', 'weightDivider', parseInt(e.target.value))}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
            </div>
          </SettingSection>

          <SettingSection id="email" title={t('email_settings')} onSave={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">بروتوكول البريد الإلكتروني *</label>
                <select 
                  value={systemSettings.email.protocol}
                  onChange={(e) => handleUpdate('email', 'protocol', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="SMTP">SMTP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">المضيف SMTP</label>
                <input 
                  type="text" 
                  value={systemSettings.email.smtpHost} 
                  onChange={(e) => handleUpdate('email', 'smtpHost', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">SMTP مستخدم</label>
                <input 
                  type="text" 
                  value={systemSettings.email.smtpUser} 
                  onChange={(e) => handleUpdate('email', 'smtpUser', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">SMTP كلمة المرور</label>
                <input 
                  type="password" 
                  value={systemSettings.email.smtpPassword} 
                  onChange={(e) => handleUpdate('email', 'smtpPassword', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">SMTP PORT</label>
                <input 
                  type="number" 
                  value={systemSettings.email.smtpPort} 
                  onChange={(e) => handleUpdate('email', 'smtpPort', parseInt(e.target.value))}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">SMTP تشفير</label>
                <select 
                  value={systemSettings.email.smtpEncryption}
                  onChange={(e) => handleUpdate('email', 'smtpEncryption', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="SSL">SSL</option>
                  <option value="TLS">TLS</option>
                </select>
              </div>
            </div>
          </SettingSection>

          <SettingSection id="points" title={t('earned_points')} onSave={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-bold text-[var(--text-main)]">جائزة العملاء نقاط</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-[var(--text-muted)] mb-1">كل مصروف يساوي</label>
                    <input 
                      type="number" 
                      value={systemSettings.points.customerPointsPerSpend} 
                      onChange={(e) => handleUpdate('points', 'customerPointsPerSpend', parseFloat(e.target.value))}
                      className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                    />
                  </div>
                  <div className="pt-6">
                    <Save size={20} className="text-[var(--primary)]" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-[var(--text-muted)] mb-1">اجمالي النقاط المكتسبة</label>
                    <input 
                      type="number" 
                      value={systemSettings.points.totalCustomerPoints} 
                      onChange={(e) => handleUpdate('points', 'totalCustomerPoints', parseFloat(e.target.value))}
                      className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-[var(--text-main)]">جائزة الموظفين نقاط</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-[var(--text-muted)] mb-1">كل في بيع ما يعادل</label>
                    <input 
                      type="number" 
                      value={systemSettings.points.staffPointsPerSale} 
                      onChange={(e) => handleUpdate('points', 'staffPointsPerSale', parseFloat(e.target.value))}
                      className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                    />
                  </div>
                  <div className="pt-6">
                    <Save size={20} className="text-[var(--primary)]" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-[var(--text-muted)] mb-1">اجمالي النقاط المكتسبة</label>
                    <input 
                      type="number" 
                      value={systemSettings.points.totalStaffPoints} 
                      onChange={(e) => handleUpdate('points', 'totalStaffPoints', parseFloat(e.target.value))}
                      className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </SettingSection>

          <SettingSection id="fees" title={t('sales_fees')} onSave={handleSave}>
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="enable_fees" 
                  checked={systemSettings.fees.enableFees}
                  onChange={(e) => handleUpdate('fees', 'enableFees', e.target.checked)}
                  className="w-4 h-4 text-[var(--primary)] border-[var(--border)] rounded" 
                />
                <label htmlFor="enable_fees" className="text-sm font-medium text-[var(--text-main)]">تفعيل رسوم البيع</label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">قيمة رسوم البيع % *</label>
                  <input 
                    type="number" 
                    value={systemSettings.fees.feesValue} 
                    onChange={(e) => handleUpdate('fees', 'feesValue', parseFloat(e.target.value))}
                    className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-1">الحد الأدنى لرسوم البيع *</label>
                  <input 
                    type="number" 
                    value={systemSettings.fees.minFees} 
                    onChange={(e) => handleUpdate('fees', 'minFees', parseFloat(e.target.value))}
                    className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                  />
                </div>
              </div>
            </div>
          </SettingSection>

          <SettingSection id="reports" title={t('report_print_settings')} onSave={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">حالة الترويسة العلوية</label>
                <select 
                  value={systemSettings.reports.headerStatus ? "إظهار" : "إخفاء"}
                  onChange={(e) => handleUpdate('reports', 'headerStatus', e.target.value === "إظهار")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="إظهار">إظهار</option>
                  <option value="إخفاء">إخفاء</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">صورة الترويسة العلوية Max( 2500px w * 600px h)</label>
                <div className="flex gap-2">
                  <button className="bg-[#006437] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <FileText size={16} />
                    استعراض ...
                  </button>
                  <input 
                    type="text" 
                    value={systemSettings.reports.headerImage}
                    onChange={(e) => handleUpdate('reports', 'headerImage', e.target.value)}
                    className="flex-1 p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                  />
                </div>
              </div>
            </div>
          </SettingSection>

          <SettingSection id="sales_print" title={t('sales_print_settings')} onSave={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">طباعة الترويسة العلوية *</label>
                <select 
                  value={systemSettings.salesPrint.printHeader ? "إظهار" : "إخفاء"}
                  onChange={(e) => handleUpdate('salesPrint', 'printHeader', e.target.value === "إظهار")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="إخفاء">إخفاء</option>
                  <option value="إظهار">إظهار</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">صورة الترويسة العلوية Max( 2500px w * 600px h)</label>
                <div className="flex gap-2">
                  <button className="bg-[#006437] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <FileText size={16} />
                    استعراض ...
                  </button>
                  <input 
                    type="text" 
                    value={systemSettings.salesPrint.headerImage}
                    onChange={(e) => handleUpdate('salesPrint', 'headerImage', e.target.value)}
                    className="flex-1 p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">خيار البائع والمستلم</label>
                <select 
                  value={systemSettings.salesPrint.showSellerAndRecipient ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('salesPrint', 'showSellerAndRecipient', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="نعم">نعم</option>
                  <option value="لا">لا</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">تفعيل طباعة dot matrix *</label>
                <select 
                  value={systemSettings.salesPrint.enableDotMatrix ? "نعم" : "لا"}
                  onChange={(e) => handleUpdate('salesPrint', 'enableDotMatrix', e.target.value === "نعم")}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]"
                >
                  <option value="لا">لا</option>
                  <option value="نعم">نعم</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">حقل رقم أمر الشراء *</label>
                <input 
                  type="text" 
                  value={systemSettings.salesPrint.purchaseOrderField} 
                  onChange={(e) => handleUpdate('salesPrint', 'purchaseOrderField', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-main)] mb-1">حقل اسم المشروع *</label>
                <input 
                  type="text" 
                  value={systemSettings.salesPrint.projectNameField} 
                  onChange={(e) => handleUpdate('salesPrint', 'projectNameField', e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--input-bg)] text-[var(--text-main)]" 
                />
              </div>
            </div>
          </SettingSection>
        </div>

        {/* Sticky Sidebar Navigation */}
        <div className="w-full md:w-64 order-1 md:order-2">
          <div className="sticky top-24 bg-[#004d2c] rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 bg-[#003d23] text-white font-bold flex items-center gap-2">
              <Settings size={20} />
              {t('system_settings')}
            </div>
            <nav className="p-2 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all text-sm text-right"
                >
                  <section.icon size={18} />
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
