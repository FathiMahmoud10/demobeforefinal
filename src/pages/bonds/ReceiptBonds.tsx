import React from 'react';
import BondPage from './BondPage';

export default function ReceiptBonds() {
  return (
    <BondPage 
      type="receipt"
      titleKey="receipt_bonds"
      addButtonKey="add_receipt_bond_btn"
      modalTitleKey="receipt_bond_title"
      editModalTitleKey="edit_receipt_bond_title"
    />
  );
}
