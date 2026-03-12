import { SystemSettings } from "@/context/SettingsContext";

export function formatCurrency(amount: number, settings: SystemSettings): string {
  const { decimalSeparator, thousandSeparator, decimals } = settings.money;
  
  // Fix to the specified number of decimals
  let fixedAmount = amount.toFixed(decimals);
  
  // Split into integer and decimal parts
  let [integerPart, decimalPart] = fixedAmount.split('.');
  
  // Add thousand separators to integer part
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  
  // Combine with decimal separator
  return decimalPart ? `${integerPart}${decimalSeparator}${decimalPart}` : integerPart;
}
