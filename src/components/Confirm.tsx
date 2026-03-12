import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmProps {
    isOpen: boolean;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onClose: () => void;
}

export default function Confirm({ isOpen, title = '', message = '', confirmLabel = 'OK', cancelLabel = 'Cancel', onConfirm, onClose }: ConfirmProps) {
    if (!isOpen) return null;
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/40" onClick={onClose} />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 text-right"
                >
                    {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
                    {message && <p className="text-sm text-gray-600 mb-4">{message}</p>}
                    <div className="flex justify-between gap-2">
                        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100">{cancelLabel}</button>
                        <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white">{confirmLabel}</button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
