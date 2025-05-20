// ui/DangerButton.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Loader from './Loader';

interface DangerButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

const DangerButton = ({
  onClick,
  isLoading,
  disabled,
  children,
  className = ''
}: DangerButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        relative overflow-hidden px-6 py-3 rounded-lg font-medium
        transition-all duration-200 border border-red-600
        ${disabled || isLoading 
          ? 'bg-red-100 text-red-400 cursor-not-allowed opacity-50' 
          : 'bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 cursor-pointer ' 
        }
        ${className}
      `}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit">
            <Loader size='btn' color="text-red-500" />
          </div>
        )}
        <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {children}
        </span>
      </div>
    </motion.button>
  );
};

export default DangerButton;