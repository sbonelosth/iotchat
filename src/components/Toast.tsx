import { LucideIcon } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  icon?: LucideIcon;
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, icon: Icon, isVisible, onClose }: ToastProps) {
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
    <div className="fixed bottom-[50vh] left-0 right-0 mx-auto flex justify-center">
      <div className="flex items-center gap-2 w-fit bg-gradient-to-r from-blue-100 to-white text-sm text-center text-blue-900 px-2 py-1 rounded-full shadow-lg animate-fade-up">
        {Icon &&<Icon className="w-6 h-6 text-blue-900" />}
        <span>{message}</span>
      </div>
    </div>
  );
}