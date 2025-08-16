

import React from 'react';
import ReactDOM from 'react-dom';
import ClientDashboard from './ClientDashboard';
import { IconX } from './Icons';

interface Client360ModalProps {
  pan: string;
  onClose: () => void;
}

const Client360Modal: React.FC<Client360ModalProps> = ({ pan, onClose }) => {
  const modalRoot = document.getElementById('modal-root');

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Store original body overflow style
    const originalOverflow = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      // Restore original body overflow style
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center animate-fade-in-down"
      style={{ animationDuration: '0.3s' }}
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-slate-100 rounded-lg shadow-2xl w-[98%] h-[98%] flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 bg-white/70 backdrop-blur-sm rounded-full p-2 hover:bg-white hover:text-slate-800 z-50"
          aria-label="Close client view"
        >
          <IconX className="h-6 w-6" />
        </button>
        <div className="flex-1 overflow-y-auto">
          {/* Passing pan as a prop here is key */}
          <ClientDashboard panProp={pan} isModalMode={true} />
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default Client360Modal;