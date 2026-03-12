// import { SystemSettings } from "@/context/SettingsContext";

// export function formatCurrency(amount: number, settings: SystemSettings): string {
//   const { decimalSeparator, thousandSeparator, decimals } = settings.money;
  
//   // Fix to the specified number of decimals
//   let fixedAmount = amount.toFixed(decimals);
  
//   // Split into integer and decimal parts
//   let [integerPart, decimalPart] = fixedAmount.split('.');
  
//   // Add thousand separators to integer part
//   integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  
//   // Combine with decimal separator
//   return decimalPart ? `${integerPart}${decimalSeparator}${decimalPart}` : integerPart;
// }
import { SystemSettings } from "@/context/SettingsContext";

export function formatCurrency(amount: number, settings: SystemSettings): string {
  let { decimalSeparator, thousandSeparator, decimals } = settings.money;
  
  // Map descriptive separators to actual characters
  if (decimalSeparator.includes('Dot')) decimalSeparator = '.';
  if (thousandSeparator === 'فاصلة' || thousandSeparator === 'Comma') thousandSeparator = ',';
  
  // Fix to the specified number of decimals
  let fixedAmount = amount.toFixed(decimals);
  
  // Split into integer and decimal parts
  let [integerPart, decimalPart] = fixedAmount.split('.');
  
  // Add thousand separators to integer part
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  
  // Combine with decimal separator
  const formatted = decimalPart ? `${integerPart}${decimalSeparator}${decimalPart}` : integerPart;
  
  return settings.money.showCurrencySymbol 
    ? `${formatted} ${settings.money.currencySymbol}`
    : formatted;
}
