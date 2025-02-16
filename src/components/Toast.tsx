import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 min-w-3xl z-50">
      <div className="bg-gradient-to-r from-blue-100 to-white text-blue-900 px-6 py-3 rounded-xl shadow-lg animate-fade-up">
        {message}
      </div>
    </div>
  );
}