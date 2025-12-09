import React from 'react';
import { ExclamationTriangleIcon } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'red' | 'green';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'primary'
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    primary: {
      bg: 'bg-primary',
      hoverBg: 'bg-primary-dark',
      focusRing: 'focus:ring-primary-dark',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600'
    },
    red: {
      bg: 'bg-red-600',
      hoverBg: 'bg-red-700',
      focusRing: 'focus:ring-red-500',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600'
    },
    green: {
      bg: 'bg-green-600',
      hoverBg: 'bg-green-700',
      focusRing: 'focus:ring-green-500',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600'
    }
  };
  
  const selectedColor = colorClasses[confirmColor];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        <div
          className="relative inline-block transform overflow-hidden rounded-lg bg-surface text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-surface px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${selectedColor.iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
                <ExclamationTriangleIcon className={`h-6 w-6 ${selectedColor.iconText}`} />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-lg font-semibold leading-6 text-on-surface" id="modal-title">
                  {title}
                </h3>
                <div className="mt-2">
                  <div className="text-sm text-subtle">{children}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm ${selectedColor.bg} hover:${selectedColor.hoverBg} focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedColor.focusRing} sm:ml-3 sm:w-auto sm:text-sm`}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
