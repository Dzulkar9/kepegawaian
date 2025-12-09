
import React, { useState } from 'react';
import { getEmployeeName } from '../data/mockData';
import { LeaveRequest, LeaveStatus } from '../types';
import { PlusIcon, CalendarDaysIcon, ListBulletIcon } from '../constants';
import Modal from '../components/Modal';
import LeaveCalendar from '../components/LeaveCalendar';
import { useNotifications } from '../contexts/NotificationContext';
import RequestLeaveModal from '../components/RequestLeaveModal';

interface ManajemenCutiProps {
  requests: LeaveRequest[];
  onUpdateStatus: (id: string, status: LeaveStatus) => void;
  onAddLeave: (request: LeaveRequest) => void;
}

const ManajemenCuti: React.FC<ManajemenCutiProps> = ({ requests, onUpdateStatus, onAddLeave }) => {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    request: LeaveRequest | null;
    action: LeaveStatus.Disetujui | LeaveStatus.Ditolak | null;
  }>({ isOpen: false, request: null, action: null });
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { addNotification } = useNotifications();

  const getStatusClass = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.Disetujui:
        return 'bg-green-100 text-green-800';
      case LeaveStatus.Menunggu:
        return 'bg-yellow-100 text-yellow-800';
      case LeaveStatus.Ditolak:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const approvedLeaves = requests.filter(req => req.status === LeaveStatus.Disetujui);

  const handleOpenModal = (request: LeaveRequest, action: LeaveStatus.Disetujui | LeaveStatus.Ditolak) => {
    setModalState({ isOpen: true, request, action });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, request: null, action: null });
  };

  const handleConfirmAction = () => {
    if (!modalState.request || !modalState.action) return;
    
    const { request, action } = modalState;

    // Call the prop handler to update state in App.tsx
    onUpdateStatus(request.id, action);
    
    // Send notification to employee
    addNotification({
      id: `leave-status-${request.id}-${Date.now()}`,
      userId: request.employeeId,
      message: `Pengajuan cuti Anda (${request.leaveType}) telah ${action}.`,
      link: 'Dasbor Pegawai',
    });

    handleCloseModal();
  };

  const handleAddLeave = (leaveData: { leaveType: string; startDate: string; endDate: string; reason: string; employeeId?: string }) => {
    if (!leaveData.employeeId) return;

    const newLeave: LeaveRequest = {
        id: `leave-${Date.now()}`,
        employeeId: leaveData.employeeId,
        leaveType: leaveData.leaveType,
        startDate: leaveData.startDate,
        endDate: leaveData.endDate,
        reason: leaveData.reason,
        status: LeaveStatus.Disetujui, // Admin added leaves are auto-approved
    };
    
    onAddLeave(newLeave);

    addNotification({
        id: `admin-add-leave-${newLeave.id}`,
        userId: newLeave.employeeId,
        message: `Admin menambahkan cuti baru untuk Anda: ${newLeave.leaveType}.`,
        link: 'Dasbor Pegawai',
    });
    
    setIsAddModalOpen(false);
  };

  const handleAddToCalendar = (request: LeaveRequest) => {
    const employeeName = getEmployeeName(request.employeeId);
    const summary = `Cuti: ${employeeName}`;
    const description = `Jenis Cuti: ${request.leaveType}\\nAlasan: ${request.reason}`;
    
    const startDate = new Date(request.startDate);
    const endDate = new Date(request.endDate);
    endDate.setDate(endDate.getDate() + 1);

    const formatDate = (date: Date) => date.toISOString().split('T')[0].replace(/-/g, '');
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '') + 'Z';
    const uid = `${request.id}-${startDateStr}@hris.com`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HRIS App//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${timestamp}`,
      `DTSTART;VALUE=DATE:${startDateStr}`,
      `DTEND;VALUE=DATE:${endDateStr}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Cuti-${employeeName.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="bg-surface p-6 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button 
                    onClick={() => setView('list')}
                    className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'list' ? 'bg-white text-primary shadow-sm' : 'text-subtle hover:bg-gray-200'}`}
                >
                    <ListBulletIcon className="h-5 w-5 mr-2" />
                    Daftar Cuti
                </button>
                <button 
                    onClick={() => setView('calendar')}
                    className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'calendar' ? 'bg-white text-primary shadow-sm' : 'text-subtle hover:bg-gray-200'}`}
                >
                   <CalendarDaysIcon className="h-5 w-5 mr-2" />
                    Kalender Cuti
                </button>
            </div>
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors text-sm font-medium"
            >
                <PlusIcon className="mr-2 h-5 w-5"/>
                Ajukan Cuti (Admin)
            </button>
          </div>
          
          {view === 'list' ? (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Nama Pegawai</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Jenis Cuti</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Tanggal</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((request: LeaveRequest) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">{getEmployeeName(request.employeeId)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-subtle">{request.leaveType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-subtle">
                            {new Date(request.startDate).toLocaleDateString('id-ID')} - {new Date(request.endDate).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(request.status)}`}>
                                {request.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {request.status === 'Menunggu' && (
                                <div className="flex space-x-2">
                                    <button onClick={() => handleOpenModal(request, LeaveStatus.Disetujui)} className="text-green-600 hover:text-green-900">Setujui</button>
                                    <button onClick={() => handleOpenModal(request, LeaveStatus.Ditolak)} className="text-red-600 hover:text-red-900">Tolak</button>
                                </div>
                            )}
                            {request.status === 'Disetujui' && (
                                <button
                                  onClick={() => handleAddToCalendar(request)}
                                  className="text-primary hover:text-primary-dark transition-colors flex items-center"
                                  title="Tambahkan ke Kalender"
                                >
                                    <CalendarDaysIcon className="h-4 w-4 mr-1"/> Tambah ke Kalender
                                </button>
                            )}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
          ) : (
            <LeaveCalendar leaves={approvedLeaves} />
          )}
      </div>
      <Modal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        title={`Konfirmasi Aksi Cuti`}
        confirmText={modalState.action === LeaveStatus.Disetujui ? 'Ya, Setujui' : 'Ya, Tolak'}
        cancelText="Batal"
        confirmColor={modalState.action === LeaveStatus.Disetujui ? 'green' : 'red'}
      >
        <p>
            Apakah Anda yakin ingin{' '}
            <strong className={modalState.action === LeaveStatus.Disetujui ? 'text-green-700' : 'text-red-700'}>
                {modalState.action === LeaveStatus.Disetujui ? 'menyetujui' : 'menolak'}
            </strong>{' '}
            permintaan cuti dari{' '}
            <strong>{modalState.request ? getEmployeeName(modalState.request.employeeId) : ''}</strong>?
        </p>
      </Modal>

      <RequestLeaveModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddLeave}
        isAdmin={true}
      />
    </>
  );
};

export default ManajemenCuti;
