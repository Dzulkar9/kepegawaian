import React, { useState } from 'react';
import { getEmployeeName, employees } from '../data/mockData';
import { OvertimeRequest, OvertimeStatus } from '../types';
import { PlusIcon } from '../constants';
import Modal from '../components/Modal';
import { useNotifications } from '../contexts/NotificationContext';

interface DataLemburProps {
    requests: OvertimeRequest[];
    onUpdateStatus: (id: string, status: OvertimeStatus) => void;
    onAddRequest: (request: OvertimeRequest) => void;
}

const DataLembur: React.FC<DataLemburProps> = ({ requests, onUpdateStatus, onAddRequest }) => {
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        request: OvertimeRequest | null;
        action: OvertimeStatus.Disetujui | OvertimeStatus.Ditolak | null;
    }>({ isOpen: false, request: null, action: null });

    // Add Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        employeeId: '',
        date: '',
        startTime: '',
        endTime: '',
        reason: ''
    });

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

    // Add Modal Handlers
    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setFormData({ employeeId: '', date: '', startTime: '', endTime: '', reason: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitOvertime = (e: React.FormEvent) => {
        e.preventDefault();

        // Calculate duration safely
        let duration = 0;
        if (formData.startTime && formData.endTime) {
            const start = parseInt(formData.startTime.split(':')[0]) + parseInt(formData.startTime.split(':')[1]) / 60;
            const end = parseInt(formData.endTime.split(':')[0]) + parseInt(formData.endTime.split(':')[1]) / 60;
            duration = Math.max(0, end - start);
        }

        const newRequest: OvertimeRequest = {
            id: `ovt-admin-${Date.now()}`,
            employeeId: formData.employeeId,
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            duration: Number(duration.toFixed(1)),
            reason: formData.reason,
            status: OvertimeStatus.Disetujui // Admin submissions are auto-approved
        };

        onAddRequest(newRequest);

        // Notify employee
        addNotification({
            id: `overtime-assigned-${newRequest.id}`,
            userId: formData.employeeId,
            message: `Admin telah menambahkan lembur untuk Anda pada tanggal ${new Date(formData.date).toLocaleDateString('id-ID')}.`,
            link: 'Dasbor Pegawai',
        });

        handleCloseAddModal();
    };

    return (
        <>
            <div className="bg-surface p-6 rounded-xl shadow-sm">
                <div className="flex justify-end mb-6">
                    <button
                        onClick={handleOpenAddModal}
                        className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors"
                    >
                        <PlusIcon className="mr-2" />
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

            {/* Confirmation Modal */}
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

            {/* Add Overtime Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={handleCloseAddModal}>
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmitOvertime}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Ajukan Lembur (Admin)</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">Pegawai</label>
                                            <select
                                                name="employeeId"
                                                id="employeeId"
                                                required
                                                value={formData.employeeId}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                                            >
                                                <option value="">Pilih Pegawai</option>
                                                {employees.map(emp => (
                                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                                            <input
                                                type="date"
                                                name="date"
                                                id="date"
                                                required
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Jam Mulai</label>
                                                <input
                                                    type="time"
                                                    name="startTime"
                                                    id="startTime"
                                                    required
                                                    value={formData.startTime}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">Jam Selesai</label>
                                                <input
                                                    type="time"
                                                    name="endTime"
                                                    id="endTime"
                                                    required
                                                    value={formData.endTime}
                                                    onChange={handleInputChange}
                                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Alasan</label>
                                            <textarea
                                                name="reason"
                                                id="reason"
                                                required
                                                value={formData.reason}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Simpan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCloseAddModal}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DataLembur;
