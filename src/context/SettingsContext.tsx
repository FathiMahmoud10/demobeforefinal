import React, { createContext, useContext, useState, useEffect } from 'react';

export interface SystemSettings {
  site: {
    companyName: string;
    language: string;
    defaultCurrency: string;
    accountingMethod: string;
    defaultEmail: string;
    defaultCustomerGroup: string;
    generalPriceGroup: string;
    rtlSupport: boolean;
    invoiceEditDays: number;
    rowsPerPage: number;
    timezone: string;
    defaultBranch: string;
    defaultCashier: string;
    pdfLibrary: string;
    defaultPaymentCompany: string;
    expiryAlertDays: number;
    showActualBalance: boolean;
    showCostGreaterMsg: boolean;
    showItemCodeInSales: boolean;
    showItemCodeInQuotes: boolean;
    showItemCodeInPurchases: boolean;
  };
  items: {
    itemTax: boolean;
    shelves: boolean;
    itemVariants: boolean;
    itemExpiry: boolean;
    deleteExpiredItems: boolean;
    imageSize: { width: number; height: number };
    thumbnailSize: { width: number; height: number };
    watermark: boolean;
    showWarehouseItems: string;
    barcodeSeparator: string;
    barcodeStandard: string;
    inventoryTransfer: string;
    enableSecondLangName: boolean;
  };
  sales: {
    sellIfZero: boolean;
    referenceFormat: string;
    itemSerial: boolean;
    addItemMethod: string;
    cursorPosition: string;
    defaultPaymentMethod: string;
    serialNameInInvoices: string;
    defaultPurchasePaymentMethod: string;
    enableQuickSearch: boolean;
    clearSearchFilters: boolean;
    enableMarketers: boolean;
    enableGlasses: boolean;
  };
  prefixes: {
    sales: string;
    salesReturn: string;
    payment: string;
    purchasePayment: string;
    delivery: string;
    quotes: string;
    purchases: string;
    purchasesReturn: string;
    transfer: string;
    expenses: string;
    quantityAdjustment: string;
  };
  money: {
    decimals: number;
    quantityDecimals: number;
    southAsiaFormat: boolean;
    decimalSeparator: string;
    thousandSeparator: string;
    showCurrencySymbol: boolean;
    currencySymbol: string;
    a4InvoiceDecimals: number;
  };
  barcode: {
    type: string;
    totalCharacters: number;
    flagCharacters: string;
    codeStart: number;
    codeLength: number;
    weightStart: number;
    weightLength: number;
    weightDivider: number;
  };
  email: {
    protocol: string;
    smtpHost: string;
    smtpUser: string;
    smtpPassword?: string;
    smtpPort: number;
    smtpEncryption: string;
  };
  points: {
    customerPointsPerSpend: number;
    totalCustomerPoints: number;
    staffPointsPerSale: number;
    totalStaffPoints: number;
  };
  fees: {
    enableFees: boolean;
    feesValue: number;
    minFees: number;
  };
  reports: {
    headerStatus: boolean;
    headerImage: string;
  };
  salesPrint: {
    printHeader: boolean;
    headerImage: string;
    showSellerAndRecipient: boolean;
    enableDotMatrix: boolean;
    purchaseOrderField: string;
    projectNameField: string;
  };
}

export interface POSSettings {
  config: {
    displayItems: number;
    defaultCategory: string;
    defaultCashier: string;
    defaultCustomer: string;
    displayTime: boolean;
    onScreenKeyboard: boolean;
    instructionsTool: boolean;
    rounding: boolean;
    itemOrder: string;
    afterSalePage: string;
    printCustomerDetails: boolean;
    displayTaxDetails: boolean;
    enableBillSuspension: boolean;
    cancelItemFromBill: boolean;
    enableBillCancellation: boolean;
    operationPassword?: string;
    enableOrderNumber: boolean;
    enableDisplayScreen: boolean;
    enableAlertSound: boolean;
    enableAdditions: boolean;
    enableShortSalesReport: boolean;
    enableDailySalesReport: boolean;
    enableReservations: boolean;
  };
  printing: {
    printer: string;
  };
  customFields: {
    field1Value: string;
  };
  receipt: {
    printAddress: boolean;
    printExtraId: boolean;
    printPhone: boolean;
    printTaxNumber: boolean;
    printReference: boolean;
    printCashier: boolean;
    printEmployee: boolean;
    printBarcode: boolean;
    printDiscount: boolean;
  };
  shortcuts: {
    focusSearch: string;
    cancelSale: string;
    suspendSale: string;
    lastInvoice: string;
    finishSale: string;
    todaySales: string;
    openSuspendedSales: string;
    closeShift: string;
  };
}

interface SettingsContextType {
  systemSettings: SystemSettings;
  posSettings: POSSettings;
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  updatePOSSettings: (settings: Partial<POSSettings>) => void;
  saveSettings: () => void;
}

const defaultSystemSettings: SystemSettings = {
  site: {
    companyName: 'تجريبي',
    language: 'Arabic',
    defaultCurrency: 'Saudi Riyal',
    accountingMethod: 'FIFO (First In First Out)',
    defaultEmail: 'info@posit2030.com',
    defaultCustomerGroup: 'عام',
    generalPriceGroup: 'عام',
    rtlSupport: true,
    invoiceEditDays: 1000,
    rowsPerPage: 10,
    timezone: 'Asia/Kuwait',
    defaultBranch: 'تجريبي (WHI)',
    defaultCashier: 'تجريبي',
    pdfLibrary: 'mPDF',
    defaultPaymentCompany: 'بدون',
    expiryAlertDays: 100,
    showActualBalance: true,
    showCostGreaterMsg: true,
    showItemCodeInSales: true,
    showItemCodeInQuotes: true,
    showItemCodeInPurchases: true,
  },
  items: {
    itemTax: true,
    shelves: true,
    itemVariants: true,
    itemExpiry: true,
    deleteExpiredItems: false,
    imageSize: { width: 800, height: 800 },
    thumbnailSize: { width: 150, height: 150 },
    watermark: false,
    showWarehouseItems: 'اظهار جميع الاصناف حتى لو رصيدها صفر',
    barcodeSeparator: '( _ ) Underscore',
    barcodeStandard: 'صورة',
    inventoryTransfer: 'تكلفة',
    enableSecondLangName: false,
  },
  sales: {
    sellIfZero: false,
    referenceFormat: 'الشهر / السنة / تسلسل رقم (م / 08/001 / 4..)',
    itemSerial: true,
    addItemMethod: 'زيادة كمية البند، إذا كان موجوداً بالفعل في ..',
    cursorPosition: 'اضافة منتج جديد',
    defaultPaymentMethod: 'شبكة',
    serialNameInInvoices: '',
    defaultPurchasePaymentMethod: 'آجل',
    enableQuickSearch: true,
    clearSearchFilters: true,
    enableMarketers: false,
    enableGlasses: false,
  },
  prefixes: {
    sales: 'SALE',
    salesReturn: 'SR',
    payment: 'IPAY',
    purchasePayment: 'POP',
    delivery: 'DO',
    quotes: 'QUOTE',
    purchases: 'PO',
    purchasesReturn: 'PR',
    transfer: 'TR',
    expenses: 'Dep',
    quantityAdjustment: 'Up',
  },
  money: {
    decimals: 2,
    quantityDecimals: 2,
    southAsiaFormat: false,
    decimalSeparator: '( . ) Dot',
    thousandSeparator: 'فاصلة',
    showCurrencySymbol: false,
    currencySymbol: 'ر.س',
    a4InvoiceDecimals: 4,
  },
  barcode: {
    type: 'الوزن/الكمية',
    totalCharacters: 0,
    flagCharacters: '0',
    codeStart: 0,
    codeLength: 0,
    weightStart: 0,
    weightLength: 0,
    weightDivider: 0,
  },
  email: {
    protocol: 'SMTP',
    smtpHost: 'posit.sa',
    smtpUser: 'info@posit.sa',
    smtpPassword: '',
    smtpPort: 465,
    smtpEncryption: 'SSL',
  },
  points: {
    customerPointsPerSpend: 100.00,
    totalCustomerPoints: 0,
    staffPointsPerSale: 1.00,
    totalStaffPoints: 0,
  },
  fees: {
    enableFees: false,
    feesValue: 0,
    minFees: 0,
  },
  reports: {
    headerStatus: true,
    headerImage: '',
  },
  salesPrint: {
    printHeader: false,
    headerImage: '',
    showSellerAndRecipient: true,
    enableDotMatrix: false,
    purchaseOrderField: 'رقم أمر الشراء',
    projectNameField: 'اسم المشروع',
  },
};

const defaultPOSSettings: POSSettings = {
  config: {
    displayItems: 60,
    defaultCategory: 'عام',
    defaultCashier: 'تجريبي',
    defaultCustomer: 'شخص عام(عميل افتراضي)',
    displayTime: true,
    onScreenKeyboard: false,
    instructionsTool: false,
    rounding: false,
    itemOrder: 'Default',
    afterSalePage: 'الإيصال',
    printCustomerDetails: false,
    displayTaxDetails: false,
    enableBillSuspension: true,
    cancelItemFromBill: true,
    enableBillCancellation: true,
    operationPassword: '',
    enableOrderNumber: false,
    enableDisplayScreen: false,
    enableAlertSound: true,
    enableAdditions: false,
    enableShortSalesReport: false,
    enableDailySalesReport: false,
    enableReservations: false,
  },
  printing: {
    printer: 'Web Browser',
  },
  customFields: {
    field1Value: '',
  },
  receipt: {
    printAddress: true,
    printExtraId: true,
    printPhone: true,
    printTaxNumber: true,
    printReference: true,
    printCashier: true,
    printEmployee: true,
    printBarcode: true,
    printDiscount: false,
  },
  shortcuts: {
    focusSearch: 'f3',
    cancelSale: 'f11',
    suspendSale: 'f7',
    lastInvoice: 'f4',
    finishSale: 'f9',
    todaySales: 'Ctrl+f1',
    openSuspendedSales: 'Ctrl+f2',
    closeShift: 'Ctrl+f10',
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(defaultSystemSettings);
  const [posSettings, setPOSSettings] = useState<POSSettings>(defaultPOSSettings);

  useEffect(() => {
    const savedSystem = localStorage.getItem('systemSettings');
    const savedPOS = localStorage.getItem('posSettings');
    if (savedSystem) setSystemSettings(JSON.parse(savedSystem));
    if (savedPOS) setPOSSettings(JSON.parse(savedPOS));
  }, []);

  const updateSystemSettings = (settings: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...settings }));
  };

  const updatePOSSettings = (settings: Partial<POSSettings>) => {
    setPOSSettings(prev => ({ ...prev, ...settings }));
  };

  const saveSettings = () => {
    localStorage.setItem('systemSettings', JSON.stringify(systemSettings));
    localStorage.setItem('posSettings', JSON.stringify(posSettings));
    alert('Settings saved successfully!');
  };

  return (
    <SettingsContext.Provider value={{ 
      systemSettings, 
      posSettings, 
      updateSystemSettings, 
      updatePOSSettings, 
      saveSettings 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
