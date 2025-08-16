
import React, { useEffect, useRef } from 'react';
import { IconX } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl';
}

const sizeClasses = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'lg' }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start pt-10 sm:pt-16 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} m-4 transition-all transform-gpu animate-fade-in-down`}
        onClick={e => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 id="modal-title" className="text-lg font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-brand-blue-500">
            <IconX className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto">
            {children}
        </div>

        {footer && (
          <div className="flex items-center justify-end p-4 border-t bg-slate-50 rounded-b-lg space-x-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
