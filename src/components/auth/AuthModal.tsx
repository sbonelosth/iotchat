import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface AuthModalProps {
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmButtonText: string;
}

export default function AuthModal({
  title,
  message,
  isOpen,
  onClose,
  onConfirm,
  confirmButtonText
}: AuthModalProps) {
  const { isLoading } = useAuth();

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
          role="dialog"
          aria-labelledby="reg-modal-title"
          aria-modal="true"
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 id="reg-modal-title" className="text-xl font-bold text-gray-300">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-gray-300">{message}</p>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-800 flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <Button
                onClick={onConfirm}
                variant="primary"
                isLoading={isLoading}
              >
                {confirmButtonText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}