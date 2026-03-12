/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import Dashboard from '@/pages/Dashboard';
import ProductsList from '@/pages/ProductsList';
import AddProduct from '@/pages/AddProduct';
import ImportProducts from '@/pages/ImportProducts';
import PrintBarcode from '@/pages/PrintBarcode';
import A4Sales from '@/pages/A4Sales';

import AllSales from '@/pages/AllSales';
import QuotesList from '@/pages/QuotesList';
import AddQuote from '@/pages/AddQuote';
import ViewQuote from '@/pages/ViewQuote';
import CreateSalesInvoice from '@/pages/CreateSalesInvoice';
import Groups from '@/pages/Groups';

import Units from '@/pages/Units';
import QuantityAdjustments from '@/pages/QuantityAdjustments';
import EditQuantityAdjustment from '@/pages/EditQuantityAdjustment';
import AddQuantityAdjustment from '@/pages/AddQuantityAdjustment';
import ImportQuantityAdjustment from '@/pages/ImportQuantityAdjustment';
import Layout from '@/components/Layout';
import ReturnSale from '@/pages/ReturnSale';
import POS from '@/pages/POS';
import POSInvoices from '@/pages/POSInvoices';
import POSInvoiceDetails from '@/pages/POSInvoiceDetails';
import ReturnPOSSale from '@/pages/ReturnPOSSale';
import GiftCards from '@/pages/GiftCards';
import PurchasesList from '@/pages/PurchasesList';
import AddPurchase from '@/pages/AddPurchase';
import AddPurchaseCSV from '@/pages/AddPurchaseCSV';
import SuppliersList from '@/pages/SuppliersList';
import Expenses from '@/pages/Expenses';
import EditPurchase from '@/pages/EditPurchase';
import CustomersList from '@/pages/CustomersList';
import InvoiceDevices from '@/pages/InvoiceDevices';
import AddUser from '@/pages/AddUser';
import EditUser from '@/pages/EditUser';
import UsersList from '@/pages/UsersList';
import BanksList from '@/pages/BanksList';
import ExternalTransfersList from '@/pages/ExternalTransfersList';
import InternalTransfersList from '@/pages/InternalTransfersList';
import SystemSettings from '@/pages/SystemSettings';
import Promotions from '@/pages/Promotions';
import PaymentCompanies from '@/pages/PaymentCompanies';
import PaymentMethods from '@/pages/PaymentMethods';
import POSSettings from '@/pages/POSSettings';
import Currencies from '@/pages/Currencies';
import CustomerGroups from '@/pages/CustomerGroups';
import PriceGroups from '@/pages/PriceGroups';
import Categories from '@/pages/Categories';
import ExpenseCategories from '@/pages/ExpenseCategories';
import ReceiptBonds from '@/pages/bonds/ReceiptBonds';
import PaymentBonds from '@/pages/bonds/PaymentBonds';
import DepositBonds from '@/pages/bonds/DepositBonds';
import WithdrawalBonds from '@/pages/bonds/WithdrawalBonds';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Protected Routes with Layout */}
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/products" element={<Layout><ProductsList /></Layout>} />
      <Route path="/products/create" element={<Layout><AddProduct /></Layout>} />
      <Route path="/products/import" element={<Layout><ImportProducts /></Layout>} />
      <Route path="/products/barcode" element={<Layout><PrintBarcode /></Layout>} />
      <Route path="/sales/a4-invoices" element={<Layout><A4Sales /></Layout>} />
      
      <Route path="/sales/all" element={<Layout><AllSales /></Layout>} />
      <Route path="/sales/pos-invoices" element={<Layout><POSInvoices /></Layout>} />
      <Route path="/sales/pos-invoices/:id" element={<Layout><POSInvoiceDetails /></Layout>} />
      <Route path="/sales/pos-invoices/return/:id" element={<Layout><ReturnPOSSale /></Layout>} />
      <Route path="/sales/gift-cards" element={<Layout><GiftCards /></Layout>} />
      <Route path="/quotes" element={<Layout><QuotesList /></Layout>} />
      <Route path="/quotes/create" element={<Layout><AddQuote /></Layout>} />
      <Route path="/quotes/view/:id" element={<Layout><ViewQuote /></Layout>} />
      <Route path="/sales/create-from-quote" element={<Layout><CreateSalesInvoice /></Layout>} />
      <Route path="/sales/return/:id" element={<Layout><ReturnSale /></Layout>} />
      <Route path="/sales/pos" element={<Layout><POS /></Layout>} />
      <Route path="/purchases" element={<Layout><PurchasesList /></Layout>} />
      <Route path="/purchases/create" element={<Layout><AddPurchase /></Layout>} />
      <Route path="/purchases/import-csv" element={<Layout><AddPurchaseCSV /></Layout>} />
      <Route path="/purchases/edit/:id" element={<Layout><EditPurchase /></Layout>} />
      <Route path="/purchases/expenses" element={<Layout><Expenses /></Layout>} />
      <Route path="/suppliers" element={<Layout><SuppliersList /></Layout>} />
      <Route path="/customers" element={<Layout><CustomersList /></Layout>} />
      <Route path="/users" element={<Layout><UsersList /></Layout>} />
      <Route path="/users/create" element={<Layout><AddUser /></Layout>} />
      <Route path="/users/edit/:id" element={<Layout><EditUser /></Layout>} />
      <Route path="/users/pos-devices" element={<Layout><InvoiceDevices /></Layout>} />
      <Route path="/products/groups" element={<Layout><Groups /></Layout>} />
      
      <Route path="/products/units" element={<Layout><Units /></Layout>} />
      <Route path="/products/quantity-adjustments" element={<Layout><QuantityAdjustments /></Layout>} />
      <Route path="/products/quantity-adjustments/create" element={<Layout><AddQuantityAdjustment /></Layout>} />
      <Route path="/products/quantity-adjustments/import" element={<Layout><ImportQuantityAdjustment /></Layout>} />
      <Route path="/products/quantity-adjustments/edit/:id" element={<Layout><EditQuantityAdjustment /></Layout>} />
      <Route path="/banks" element={<Layout><BanksList /></Layout>} />
      <Route path="/banks/external-transfers" element={<Layout><ExternalTransfersList /></Layout>} />
      <Route path="/banks/internal-transfers" element={<Layout><InternalTransfersList /></Layout>} />
      <Route path="/settings/system" element={<Layout><SystemSettings /></Layout>} />
      <Route path="/promotions" element={<Layout><Promotions /></Layout>} />
      <Route path="/settings/payment-companies" element={<Layout><PaymentCompanies /></Layout>} />
      <Route path="/settings/payment-methods" element={<Layout><PaymentMethods /></Layout>} />
      <Route path="/settings/pos" element={<Layout><POSSettings /></Layout>} />
      <Route path="/settings/currencies" element={<Layout><Currencies /></Layout>} />
      <Route path="/settings/customer-groups" element={<Layout><CustomerGroups /></Layout>} />
      <Route path="/settings/price-groups" element={<Layout><PriceGroups /></Layout>} />
      <Route path="/settings/basic-categories" element={<Layout><Categories /></Layout>} />
      <Route path="/settings/expense-categories" element={<Layout><ExpenseCategories /></Layout>} />
      <Route path="/bonds/receipt" element={<Layout><ReceiptBonds /></Layout>} />
      <Route path="/bonds/payment" element={<Layout><PaymentBonds /></Layout>} />
      <Route path="/bonds/deposit" element={<Layout><DepositBonds /></Layout>} />
      <Route path="/bonds/withdrawal" element={<Layout><WithdrawalBonds /></Layout>} />
    </Routes>
  );
}
