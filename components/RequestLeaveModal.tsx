
import React, { useState } from 'react';
import { LeaveRequest } from '../types';
import { XMarkIcon } from '../constants';
import { employees } from '../data/mockData';

interface RequestLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leaveData: { leaveType: string; startDate: string; endDate: string; reason: string; employeeId?: string }) => void;
  isAdmin?: boolean;
}

const initialFormData = {
  leaveType: 'Cuti Tahunan',
  startDate: '',
  endDate: '',
  reason: '',
  employeeId: '',
};

const RequestLeaveModal: React.FC<RequestLeaveModalProps> = ({ isOpen, onClose, onSubmit, isAdmin = false }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      setError('Semua kolom wajib diisi.');
      return;
    }
    
    if (isAdmin && !formData.employeeId) {
       setError('Mohon pilih pegawai.');
       return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('Tanggal mulai tidak boleh melebihi tanggal selesai.');
      return;
    }
    
    onSubmit({
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        ...(isAdmin ? { employeeId: formData.employeeId } : {})
    });

    setFormData(initialFormData);
    setError('');
    onClose();
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75" onClick={onClose}>
      <div
        className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative bg-surface rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-4 border-b rounded-t">
            <h3 className="text-lg font-semibold text-on-surface">{isAdmin ? 'Tambah Cuti Pegawai' : 'Formulir Pengajuan Cuti'}</h3>
            <button onClick={onClose} className="text-subtle hover:text-on-surface">
              <XMarkIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
              
              {isAdmin && (
                  <div>
                    <label htmlFor="employeeId" className="block mb-2 text-sm font-medium text-subtle">Pegawai</label>
                    <select name="employeeId" id="employeeId" value={formData.employeeId} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary">
                        <option value="">Pilih Pegawai</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name}</option>
                        ))}
                    </select>
                  </div>
              )}

              <div>
                <label htmlFor="leaveType" className="block mb-2 text-sm font-medium text-subtle">Jenis Cuti</label>
                <select name="leaveType" id="leaveType" value={formData.leaveType} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary">
                    <option>Cuti Tahunan</option>
                    <option>Cuti Sakit</option>
                    <option>Cuti Melahirkan</option>
                    <option>Cuti Penting</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block mb-2 text-sm font-medium text-subtle">Tanggal Mulai</label>
                  <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" required/>
                </div>
                <div>
                  <label htmlFor="endDate" className="block mb-2 text-sm font-medium text-subtle">Tanggal Selesai</label>
                  <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" required/>
                </div>
              </div>
               <div>
                  <label htmlFor="reason" className="block mb-2 text-sm font-medium text-subtle">Alasan</label>
                  <textarea name="reason" id="reason" rows={3} value={formData.reason} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" required/>
                </div>
            </div>
            <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b">
                <button type="button" onClick={onClose} className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">
                    Batal
                </button>
                <button type="submit" className="text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    {isAdmin ? 'Simpan' : 'Ajukan'}
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestLeaveModal;
