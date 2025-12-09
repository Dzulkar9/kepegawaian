
import React, { useState } from 'react';
import { OvertimeRequest } from '../types';
import { XMarkIcon } from '../constants';

interface RequestOvertimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (overtimeData: Omit<OvertimeRequest, 'id' | 'employeeId' | 'status' | 'duration'>) => void;
}

const initialFormData = {
  date: '',
  startTime: '',
  endTime: '',
  reason: '',
};

const RequestOvertimeModal: React.FC<RequestOvertimeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.startTime || !formData.endTime || !formData.reason) {
      setError('Semua kolom wajib diisi.');
      return;
    }
    if (formData.startTime >= formData.endTime) {
        setError('Waktu mulai harus sebelum waktu selesai.');
        return;
    }
    onSubmit(formData);
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
            <h3 className="text-lg font-semibold text-on-surface">Formulir Pengajuan Lembur</h3>
            <button onClick={onClose} className="text-subtle hover:text-on-surface">
              <XMarkIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
              <div>
                  <label htmlFor="date" className="block mb-2 text-sm font-medium text-subtle">Tanggal Lembur</label>
                  <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" required/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block mb-2 text-sm font-medium text-subtle">Waktu Mulai</label>
                  <input type="time" name="startTime" id="startTime" value={formData.startTime} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" required/>
                </div>
                <div>
                  <label htmlFor="endTime" className="block mb-2 text-sm font-medium text-subtle">Waktu Selesai</label>
                  <input type="time" name="endTime" id="endTime" value={formData.endTime} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" required/>
                </div>
              </div>
               <div>
                  <label htmlFor="reason" className="block mb-2 text-sm font-medium text-subtle">Alasan Lembur</label>
                  <textarea name="reason" id="reason" rows={3} value={formData.reason} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" required/>
                </div>
            </div>
            <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b">
                <button type="button" onClick={onClose} className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">
                    Batal
                </button>
                <button type="submit" className="text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Ajukan
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestOvertimeModal;
