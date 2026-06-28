import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({ isOpen, onClose, title, children, size = 'md', showClose = true }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={`
          relative bg-white rounded-2xl shadow-xl w-full max-h-[90vh] overflow-hidden
          animate-scale-in
          ${sizeClasses[size]}
        `}
      >
        {title && (
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>
            {showClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div className="overflow-auto max-h-[calc(90vh-5rem)]">{children}</div>
      </div>
    </div>
  );
}

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalBody({ children, className = '' }: ModalBodyProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
  return (
    <div className={`px-6 py-4 border-t border-gray-100 flex justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
}
