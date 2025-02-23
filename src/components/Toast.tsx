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
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-gradient-to-r from-blue-100 to-white text-sm text-center text-blue-900 px-6 py-1 rounded-full shadow-lg animate-fade-up">
        {message}
      </div>
    </div>
  );
}