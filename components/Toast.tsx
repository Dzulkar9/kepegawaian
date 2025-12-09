
import React, { useEffect } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XCircleIcon } from '../constants';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'error': return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'warning': return <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" />;
      case 'info': return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
      switch (type) {
          case 'success': return 'border-l-4 border-green-500';
          case 'error': return 'border-l-4 border-red-500';
          case 'warning': return 'border-l-4 border-yellow-500';
          case 'info': return 'border-l-4 border-blue-500';
      }
  }

  return (
    <div className={`flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 ${getBorderColor()}`} role="alert">
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8">
        {getIcon()}
      </div>
      <div className="ml-3 text-sm font-normal text-on-surface">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        onClick={() => onClose(id)}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <XMarkIcon />
      </button>
    </div>
  );
};

export default Toast;
