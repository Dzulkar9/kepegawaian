
import React, { useState } from 'react';
import { getEmployeeName } from '../data/mockData';
import { OvertimeRequest, OvertimeStatus } from '../types';
import { PlusIcon } from '../constants';
import Modal from '../components/Modal';
import { useNotifications } from '../contexts/NotificationContext';

interface DataLemburProps {
  requests: OvertimeRequest[];
  onUpdateStatus: (id: string, status: OvertimeStatus) => void;
}

const DataLembur: React.FC<DataLemburProps> = ({ requests, onUpdateStatus }) => {
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        request: OvertimeRequest | null;
        action: OvertimeStatus.Disetujui | OvertimeStatus.Ditolak | null;
    }>({ isOpen: false, request: null, action: null });
    const { addNotification } = useNotifications();

    const getStatusClass = (status: OvertimeStatus) => {
        switch (status) {
          case OvertimeStatus.Disetujui:
            return 'bg-green-100 text-green-800';
          case OvertimeStatus.Menunggu:
            return 'bg-yellow-100 text-yellow-800';
          case OvertimeStatus.Ditolak:
            return 'bg-red-100 text-red-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
    };

    const handleOpenModal = (request: OvertimeRequest, action: OvertimeStatus.Disetujui | OvertimeStatus.Ditolak) => {
        setModalState({ isOpen: true, request, action });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, request: null, action: null });
    };

    const handleConfirmAction = () => {
        if (!modalState.request || !modalState.action) return;

        const { request, action } = modalState;

        // Call prop handler to update state in App.tsx
        onUpdateStatus(request.id, action);

        // Send notification to employee
        addNotification({
            id: `overtime-status-${request.id}-${Date.now()}`,
            userId: request.employeeId,
            message: `Pengajuan lembur Anda pada tanggal ${new Date(request.date).toLocaleDateString('id-ID')} telah ${action}.`,
            link: 'Dasbor Pegawai',
        });
        
        handleCloseModal();
    };
    
  return (
    <>
        <div className="bg-surface p-6 rounded-xl shadow-sm">
            <div className="flex justify-end mb-6">
                <button className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors">
                    <PlusIcon className="mr-2"/>
                    Ajukan Lembur (Admin)
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Nama Pegawai</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Tanggal</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Waktu</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Durasi</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request: OvertimeRequest) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">{getEmployeeName(request.employeeId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-subtle">{new Date(request.date).toLocaleDateString('id-ID')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-subtle">{request.startTime} - {request.endTime}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-subtle">{request.duration} jam</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(request.status)}`}>
                                {request.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {request.status === 'Menunggu' && (
                                <div className="flex space-x-2">
                                    <button onClick={() => handleOpenModal(request, OvertimeStatus.Disetujui)} className="text-green-600 hover:text-green-900">Setujui</button>
                                    <button onClick={() => handleOpenModal(request, OvertimeStatus.Ditolak)} className="text-red-600 hover:text-red-900">Tolak</button>
                                </div>
                            )}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
        <Modal
            isOpen={modalState.isOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmAction}
            title={`Konfirmasi Aksi Lembur`}
            confirmText={modalState.action === OvertimeStatus.Disetujui ? 'Ya, Setujui' : 'Ya, Tolak'}
            cancelText="Batal"
            confirmColor={modalState.action === OvertimeStatus.Disetujui ? 'green' : 'red'}
        >
            <p>
                Apakah Anda yakin ingin{' '}
                <strong className={modalState.action === OvertimeStatus.Disetujui ? 'text-green-700' : 'text-red-700'}>
                    {modalState.action === OvertimeStatus.Disetujui ? 'menyetujui' : 'menolak'}
                </strong>{' '}
                permintaan lembur dari{' '}
                <strong>{modalState.request ? getEmployeeName(modalState.request.employeeId) : ''}</strong>?
            </p>
        </Modal>
    </>
  );
};

export default DataLembur;
