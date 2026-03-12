import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { GroupsProvider } from '@/context/GroupsContext';
import { ProductsProvider } from '@/context/ProductsContext';
import { AdjustmentsProvider } from '@/context/AdjustmentsContext';
import { SuppliersProvider } from '@/context/SuppliersContext';
import { ExpensesProvider } from '@/context/ExpensesContext';
import { CustomersProvider } from '@/context/CustomersContext';
import { QuotesProvider } from '@/context/QuotesContext';
import { UsersProvider } from '@/context/UsersContext';
import { BanksProvider } from '@/context/BanksContext';
import { TransfersProvider } from '@/context/TransfersContext';
import { PromotionsProvider } from '@/context/PromotionsContext';
import { PaymentCompaniesProvider } from '@/context/PaymentCompaniesContext';
import { PaymentMethodsProvider } from '@/context/PaymentMethodsContext';
import { LogoProvider } from '@/context/LogoContext';
import { CurrenciesProvider } from '@/context/CurrenciesContext';
import { CustomerGroupsProvider } from '@/context/CustomerGroupsContext';
import { PriceGroupsProvider } from '@/context/PriceGroupsContext';
import { CategoriesProvider } from '@/context/CategoriesContext';
import { ExpenseCategoriesProvider } from '@/context/ExpenseCategoriesContext';
import { SettingsProvider } from '@/context/SettingsContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SettingsProvider>
          <LanguageProvider>
          <GroupsProvider>
            <ProductsProvider>
              <AdjustmentsProvider>
                <SuppliersProvider>
                  <CustomersProvider>
                    <ExpensesProvider>
                      <ExpenseCategoriesProvider>
                        <QuotesProvider>
                          <UsersProvider>
                            <BanksProvider>
                              <TransfersProvider>
                                <PromotionsProvider>
                                  <PaymentCompaniesProvider>
                                    <PaymentMethodsProvider>
                                      <LogoProvider>
                                        <CurrenciesProvider>
                                          <CustomerGroupsProvider>
                                            <CategoriesProvider>
                                              <App />
                                            </CategoriesProvider>
                                          </CustomerGroupsProvider>
                                        </CurrenciesProvider>
                                      </LogoProvider>
                                    </PaymentMethodsProvider>
                                  </PaymentCompaniesProvider>
                                </PromotionsProvider>
                              </TransfersProvider>
                            </BanksProvider>
                          </UsersProvider>
                        </QuotesProvider>
                      </ExpenseCategoriesProvider>
                    </ExpensesProvider>
                  </CustomersProvider>
                </SuppliersProvider>
              </AdjustmentsProvider>
            </ProductsProvider>
          </GroupsProvider>
        </LanguageProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
