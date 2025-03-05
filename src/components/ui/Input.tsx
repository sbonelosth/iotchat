import React, { forwardRef } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: typeof LucideIcon;
  rightIcon?: typeof LucideIcon;
  onRightIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, rightIcon: RightIcon, onRightIconClick, className = '', ...props }, ref) => {
    return (
      <div className="w-full mb-2">
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <input
            ref={ref}
            className={`bg-gray-800 text-white placeholder-gray-400 block w-full 
              ${Icon ? 'pl-10' : 'pl-3'} 
              ${RightIcon ? 'pr-10' : 'pr-3'} 
              py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${error ? 'border border-red-500' : ''}
              ${className}`}
            {...props}
          />
          {RightIcon && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={onRightIconClick}
            >
              <RightIcon className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';