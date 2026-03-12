import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ isOpen, message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (!isOpen) return;
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [isOpen, duration, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`fixed top-4 left-4 right-4 max-w-sm mx-auto z-[999] rounded-lg shadow-lg p-4 flex items-center gap-3 ${type === 'success'
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                        }`}
                >
                    {type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                    <p
                        className={`flex-1 text-sm font-medium ${type === 'success' ? 'text-green-800' : 'text-red-800'
                            }`}
                    >
                        {message}
                    </p>
                    <button
                        onClick={onClose}
                        className={`flex-shrink-0 ${type === 'success'
                                ? 'text-green-400 hover:text-green-600'
                                : 'text-red-400 hover:text-red-600'
                            }`}
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
