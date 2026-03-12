import React from 'react';
import BondPage from './BondPage';

export default function DepositBonds() {
  return (
    <BondPage 
      type="deposit"
      titleKey="deposit_bonds"
      addButtonKey="add_deposit_bond_btn"
      modalTitleKey="deposit_bond_title"
      editModalTitleKey="edit_deposit_bond_title"
    />
  );
}
