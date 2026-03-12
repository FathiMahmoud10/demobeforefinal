import React from 'react';
import BondPage from './BondPage';

export default function PaymentBonds() {
  return (
    <BondPage 
      type="payment"
      titleKey="payment_bonds"
      addButtonKey="add_payment_bond_btn"
      modalTitleKey="payment_bond_title"
      editModalTitleKey="edit_payment_bond_title"
    />
  );
}
