
import React, { useState } from 'react';
import { PerformanceReview } from '../types';
import { employees } from '../data/mockData';
import { XMarkIcon, StarSolid } from '../constants';

interface AddPerformanceReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (review: PerformanceReview) => void;
}

const AddPerformanceReviewModal: React.FC<AddPerformanceReviewModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [reviewDate, setReviewDate] = useState(new Date().toISOString().split('T')[0]);
  const [score, setScore] = useState(0);
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || score === 0 || !comments) {
      setError('Mohon lengkapi semua kolom.');
      return;
    }

    const newReview: PerformanceReview = {
      id: `perf-${Date.now()}`,
      employeeId,
      reviewDate,
      reviewerId: 'admin', // Hardcoded as admin for now
      score,
      comments,
    };

    onAdd(newReview);
    // Reset form
    setEmployeeId('');
    setScore(0);
    setComments('');
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
            <h3 className="text-lg font-semibold text-on-surface">Tambah Penilaian Kinerja</h3>
            <button onClick={onClose} className="text-subtle hover:text-on-surface">
              <XMarkIcon />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}
              
              <div>
                <label className="block mb-2 text-sm font-medium text-subtle">Pegawai</label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                >
                  <option value="">Pilih Pegawai</option>
                  {employees.filter(e => e.status === 'Aktif').map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-subtle">Tanggal Penilaian</label>
                <input
                  type="date"
                  value={reviewDate}
                  onChange={(e) => setReviewDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-subtle">Skor (1-5)</label>
                <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setScore(star)}
                            className="focus:outline-none"
                        >
                            <StarSolid 
                                className={`h-8 w-8 transition-colors ${star <= score ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`} 
                            />
                        </button>
                    ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-subtle">Komentar</label>
                <textarea
                  rows={4}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b">
                <button type="button" onClick={onClose} className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">
                    Batal
                </button>
                <button type="submit" className="text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-dark font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                    Simpan
                </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPerformanceReviewModal;
