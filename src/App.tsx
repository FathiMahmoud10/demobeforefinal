/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import VerifyOTP from '@/pages/VerifyOTP';
import ResetPassword from '@/pages/ResetPassword';
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
import Deliveries from '@/pages/Deliveries';
import PurchasesList from '@/pages/PurchasesList';
import AddPurchase from '@/pages/AddPurchase';
import EditPurchase from '@/pages/EditPurchase';
import CustomersList from '@/pages/CustomersList';
import SuppliersList from '@/pages/SuppliersList';
import Expenses from '@/pages/Expenses';
import AddTaxInvoice from '@/pages/AddTaxInvoice';
import AddSimplifiedTaxInvoice from '@/pages/AddSimplifiedTaxInvoice';
import ImportSales from '@/pages/ImportSales';
import ImportPurchases from '@/pages/ImportPurchases';
import Products from './lib/Products';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Routes with Layout */}
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/products" element={<Layout><ProductsList /></Layout>} />
      <Route path="/products/create" element={<Layout><AddProduct /></Layout>} />
      <Route path="/products/import" element={<Layout><ImportProducts /></Layout>} />
      <Route path="/products/barcode" element={<Layout><PrintBarcode /></Layout>} />
      <Route path="/sales/a4-invoices" element={<Layout><A4Sales /></Layout>} />
      <Route path="/sales/add-tax-invoice" element={<Layout><AddTaxInvoice /></Layout>} />
      <Route path="/sales/add-simplified-tax-invoice" element={<Layout><AddSimplifiedTaxInvoice /></Layout>} />
      <Route path="/sales/import-csv" element={<Layout><ImportSales /></Layout>} />
      <Route path="/sales/create" element={<Layout><CreateSalesInvoice /></Layout>} />
      
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
      <Route path="/sales/deliveries" element={<Layout><Deliveries /></Layout>} />
      <Route path="/purchases" element={<Layout><PurchasesList /></Layout>} />
      <Route path="/purchases/create" element={<Layout><AddPurchase /></Layout>} />
      <Route path="/purchases/edit/:id" element={<Layout><EditPurchase /></Layout>} />
      <Route path="/purchases/import-csv" element={<Layout><ImportPurchases /></Layout>} />
      <Route path="/customers" element={<Layout><CustomersList /></Layout>} />
      <Route path="/suppliers" element={<Layout><SuppliersList /></Layout>} />
      <Route path="/expenses" element={<Layout><Expenses /></Layout>} />
      <Route path="/products/groups" element={<Layout><Groups /></Layout>} />
      
      <Route path="/products" element={<Products />} />
      <Route path="/products/units" element={<Layout><Units /></Layout>} />
      <Route path="/products/quantity-adjustments" element={<Layout><QuantityAdjustments /></Layout>} />
      <Route path="/products/quantity-adjustments/create" element={<Layout><AddQuantityAdjustment /></Layout>} />
      <Route path="/products/quantity-adjustments/import" element={<Layout><ImportQuantityAdjustment /></Layout>} />
      <Route path="/products/quantity-adjustments/edit/:id" element={<Layout><EditQuantityAdjustment /></Layout>} />
    </Routes>
  );
}
