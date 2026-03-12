import React from 'react';
import BondPage from './BondPage';

export default function WithdrawalBonds() {
  return (
    <BondPage 
      type="withdrawal"
      titleKey="withdrawal_bonds"
      addButtonKey="add_withdrawal_bond_btn"
      modalTitleKey="withdrawal_bond_title"
      editModalTitleKey="edit_withdrawal_bond_title"
    />
  );
}
