import React, { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  description?: string;
  maxWidth?: string;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
}

export const ResponsiveModal: React.FC<ResponsiveModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  description,
  maxWidth = 'max-w-2xl',
  headerActions,
  footer
}) => {
  const { direction } = useLanguage();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[101] outline-none flex flex-col max-h-[96vh] bg-white rounded-t-[24px] shadow-2xl">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3 shrink-0 cursor-grab active:cursor-grabbing" />
            <div className="flex-1 overflow-y-auto" dir={direction}>
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <div className="flex items-center gap-2">
                  {headerActions}
                  <Drawer.Title className="text-lg font-bold text-primary">
                    {title}
                  </Drawer.Title>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                  <X size={24} />
                </button>
              </div>
              <Drawer.Description className="hidden">{description || title}</Drawer.Description>
              {children}
              {footer && (
                <div className="p-4 bg-gray-50 border-t flex justify-end gap-3 shrink-0">
                  {footer}
                </div>
              )}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" dir={direction}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} overflow-hidden flex flex-col max-h-[90vh]`}
          >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-2">
                {headerActions}
                <h2 className="text-lg font-bold text-primary">
                  {title}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
            {footer && (
              <div className="p-4 bg-gray-50 border-t flex justify-end gap-3 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveModal;
