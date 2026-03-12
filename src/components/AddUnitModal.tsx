import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshUnits: () => void;
}

const AddUnitModal: React.FC<AddUnitModalProps> = ({ isOpen, onClose, refreshUnits }) => {

  const { t, direction } = useLanguage();
  const [unitName, setUnitName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!unitName.trim()) {
      alert("Enter unit name");
      return;
    }

    try {

      await fetch("http://takamulerp.runasp.net/UnitOfMeasure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: unitName,
          description: unitName
        })
      });

      setUnitName('');
      onClose();
      refreshUnits();

    } catch (error) {

      console.error(error);
      alert("Error adding unit");

    }
  };

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md"
        dir={direction}
      >

        <div className="p-4 flex justify-between border-b">

          <h1 className="text-lg font-bold flex items-center gap-2">
            <PlusCircle size={18} />
            {t('add_new_unit')}
          </h1>

          <button onClick={onClose}>
            <X size={20} />
          </button>

        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <input
            type="text"
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
            placeholder={t('unit_name')}
            className="w-full border rounded-md px-3 py-2"
            required
          />

          <div className="flex justify-end">

            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-md"
            >
              {t('add_new_unit')}
            </button>

          </div>

        </form>

      </motion.div>

    </div>

  );
};

export default AddUnitModal;