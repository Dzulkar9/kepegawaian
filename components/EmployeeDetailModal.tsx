import React from 'react';
import { Employee } from '../types';
import { XMarkIcon } from '../constants';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({ isOpen, onClose, employee }) => {
  if (!isOpen || !employee) return null;

  const getStatusClass = (status: 'Aktif' | 'Tidak Aktif') => {
    return status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75 transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        <div
          className="relative inline-block transform overflow-hidden rounded-lg bg-surface text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-surface px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
                 <h3 className="text-lg font-semibold leading-6 text-on-surface" id="modal-title">
                  Detail Pegawai
                </h3>
                <button onClick={onClose} className="text-subtle hover:text-on-surface transition-colors">
                    <XMarkIcon />
                </button>
            </div>
            <div className="mt-5 sm:mt-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6">
                    <img className="h-24 w-24 rounded-full sm:h-28 sm:w-28 flex-shrink-0 object-cover" src={employee.avatarUrl} alt={`Avatar of ${employee.name}`} />
                    <div className="mt-4 sm:mt-0 text-center sm:text-left">
                        <h4 className="text-xl font-bold text-on-surface">{employee.name}</h4>
                        <p className="text-md text-primary">{employee.position}</p>
                        <p className="text-sm text-subtle">{employee.department}</p>
                    </div>
                </div>
                 <div className="mt-6 border-t border-gray-200 pt-5">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                         <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-subtle">NIP</dt>
                            <dd className="mt-1 text-sm text-on-surface font-mono">{employee.nip}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-subtle">Email</dt>
                            <dd className="mt-1 text-sm text-on-surface break-words">{employee.email}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-subtle">Tanggal Bergabung</dt>
                            <dd className="mt-1 text-sm text-on-surface">{new Date(employee.joinDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</dd>
                        </div>
                         <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-subtle">Status</dt>
                            <dd className="mt-1 text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(employee.status)}`}>
                                    {employee.status}
                                </span>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
          </div>
           <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;
