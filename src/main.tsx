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
import { CustomersProvider } from '@/context/CustomersContext';
import { ExpensesProvider } from '@/context/ExpensesContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <GroupsProvider>
            <ProductsProvider>
              <AdjustmentsProvider>
                <SuppliersProvider>
                  <CustomersProvider>
                    <ExpensesProvider>
                      <App />
                    </ExpensesProvider>
                  </CustomersProvider>
                </SuppliersProvider>
              </AdjustmentsProvider>
            </ProductsProvider>
          </GroupsProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
