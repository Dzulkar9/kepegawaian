import React, { useState, useEffect } from 'react';
import { Employee } from '../types';
import { XMarkIcon } from '../constants';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedEmployee: Employee) => void;
  employee: Employee | null;
}

const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ isOpen, onClose, onUpdate, employee }) => {
  const [formData, setFormData] = useState<Employee | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    }
  }, [employee]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.nip || !formData.email || !formData.position || !formData.joinDate) {
      setError('Semua kolom wajib diisi, kecuali status.');
      return;
    }
    onUpdate(formData);
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
            <h3 className="text-lg font-semibold text-on-surface">Edit Data Pegawai</h3>
            <button onClick={onClose} className="text-subtle hover:text-on-surface">
              <XMarkIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-subtle">Nama</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" required/>
                </div>
                <div>
                  <label htmlFor="nip" className="block mb-2 text-sm font-medium text-subtle">NIP</label>
                  <input type="text" name="nip" id="nip" value={formData.nip} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" required/>
                </div>
                 <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-subtle">Email</label>
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" required/>
                </div>
                <div>
                  <label htmlFor="position" className="block mb-2 text-sm font-medium text-subtle">Jabatan</label>
                  <input type="text" name="position" id="position" value={formData.position} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" required/>
                </div>
                <div>
                  <label htmlFor="department" className="block mb-2 text-sm font-medium text-subtle">Departemen</label>
                  <input type="text" name="department" id="department" value={formData.department} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" required/>
                </div>
                 <div>
                  <label htmlFor="joinDate" className="block mb-2 text-sm font-medium text-subtle">Tanggal Bergabung</label>
                  <input type="date" name="joinDate" id="joinDate" value={formData.joinDate} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" required/>
                </div>
                <div>
                    <label htmlFor="status" className="block mb-2 text-sm font-medium text-subtle">Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary">
                        <option value="Aktif">Aktif</option>
                        <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b">
                <button type="button" onClick={onClose} className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">
                    Batal
                </button>
                <button type="submit" className="text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Simpan Perubahan
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeModal;