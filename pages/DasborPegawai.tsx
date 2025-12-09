
import React, { useState, useEffect } from 'react';
import { Employee, Attendance, AttendanceStatus, LeaveRequest, LeaveStatus, PerformanceReview, OvertimeRequest, OvertimeStatus } from '../types';
import { StarSolid, ClockIcon, CalendarDaysIcon } from '../constants';
import RequestLeaveModal from '../components/RequestLeaveModal';
import RequestOvertimeModal from '../components/RequestOvertimeModal';
import Modal from '../components/Modal';
import AddToCalendarModal from '../components/AddToCalendarModal';
import { useNotifications } from '../contexts/NotificationContext';
import { useToast } from '../contexts/ToastContext';

const StarRating: React.FC<{ score: number }> = ({ score }) => {
    const totalStars = 5;
    const fullStars = Math.floor(score);
    const emptyStars = totalStars - fullStars;
  
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => <StarSolid key={`full-${i}`} className="text-yellow-400 h-5 w-5" />)}
        {[...Array(emptyStars)].map((_, i) => <StarSolid key={`empty-${i}`} className="text-gray-300 h-5 w-5" />)}
      </div>
    );
};

interface DasborPegawaiProps {
    employee: Employee;
    leaves: LeaveRequest[];
    overtimes: OvertimeRequest[];
    attendanceRecords: Attendance[];
    reviews: PerformanceReview[];
    onAddLeave: (req: LeaveRequest) => void;
    onAddOvertime: (req: OvertimeRequest) => void;
    onAttendanceUpdate: (record: Attendance) => void;
    remainingLeave: number;
}

const DasborPegawai: React.FC<DasborPegawaiProps> = ({ 
    employee, 
    leaves, 
    overtimes, 
    attendanceRecords,
    reviews,
    onAddLeave, 
    onAddOvertime, 
    onAttendanceUpdate,
    remainingLeave 
}) => {
  const todayStr = new Date().toLocaleDateString('en-CA');
  
  // Find today's attendance record from the props
  const todayAttendance = attendanceRecords.find(a => a.employeeId === employee.id && a.date === todayStr);

  // Filter global data for this specific employee
  const employeeLeaves = leaves.filter(l => l.employeeId === employee.id);
  const employeeOvertimes = overtimes.filter(o => o.employeeId === employee.id);
  
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isOvertimeModalOpen, setIsOvertimeModalOpen] = useState(false);
  const [attendanceAction, setAttendanceAction] = useState<'in' | 'out' | null>(null);
  
  // State for Calendar Integration Modal
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [selectedLeaveForCalendar, setSelectedLeaveForCalendar] = useState<LeaveRequest | null>(null);

  const { addNotification } = useNotifications();
  const { addToast } = useToast();


  const latestReview = reviews
    .filter(p => p.employeeId === employee.id)
    .sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime())[0];

  const executeAttendanceAction = () => {
    if (attendanceAction === 'in') {
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit'});
        const newRecord: Attendance = {
            id: `att-${employee.id}-${Date.now()}`,
            employeeId: employee.id,
            date: todayStr,
            checkIn: timeString,
            checkOut: null,
            status: AttendanceStatus.Hadir,
        };
        onAttendanceUpdate(newRecord);
        addToast(`Berhasil Clock In pada jam ${timeString}. Selamat bekerja!`, 'success');
    } else if (attendanceAction === 'out' && todayAttendance) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit'});
        const updatedRecord: Attendance = {
            ...todayAttendance,
            checkOut: timeString,
        };
        onAttendanceUpdate(updatedRecord);
        addToast(`Berhasil Clock Out pada jam ${timeString}. Hati-hati di jalan!`, 'success');
    }
    setAttendanceAction(null);
  };
  
  const handleLeaveSubmit = (leaveData: { leaveType: string; startDate: string; endDate: string; reason: string }) => {
    const newLeaveRequest: LeaveRequest = {
        leaveType: leaveData.leaveType,
        startDate: leaveData.startDate,
        endDate: leaveData.endDate,
        reason: leaveData.reason,
        id: `leave-${Date.now()}`,
        employeeId: employee.id,
        status: LeaveStatus.Menunggu,
    };
    
    // Update Global State via Prop
    onAddLeave(newLeaveRequest);

    addNotification({
        id: `new-leave-${newLeaveRequest.id}`,
        userId: 'admin',
        message: `${employee.name} mengajukan cuti baru.`,
        link: 'Manajemen Cuti',
    });
    addToast('Pengajuan cuti berhasil dikirim.', 'success');
    setIsLeaveModalOpen(false);
  };
  
  const handleOvertimeSubmit = (overtimeData: Omit<OvertimeRequest, 'id' | 'employeeId' | 'status' | 'duration'>) => {
    const startTime = new Date(`${overtimeData.date}T${overtimeData.startTime}`);
    const endTime = new Date(`${overtimeData.date}T${overtimeData.endTime}`);
    const duration = Math.abs(endTime.getTime() - startTime.getTime()) / 36e5;

    const newOvertimeRequest: OvertimeRequest = {
        ...overtimeData,
        id: `ovt-${Date.now()}`,
        employeeId: employee.id,
        status: OvertimeStatus.Menunggu,
        duration: parseFloat(duration.toFixed(2)),
    };

    // Update Global State via Prop
    onAddOvertime(newOvertimeRequest);

    addNotification({
        id: `new-overtime-${newOvertimeRequest.id}`,
        userId: 'admin',
        message: `${employee.name} mengajukan lembur baru.`,
        link: 'Data Lembur',
    });
    addToast('Pengajuan lembur berhasil dikirim.', 'success');
    setIsOvertimeModalOpen(false);
  };

  const handleOpenCalendarModal = (request: LeaveRequest) => {
    setSelectedLeaveForCalendar(request);
    setCalendarModalOpen(true);
  };

  const getLeaveStatusClass = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.Disetujui: return 'bg-green-100 text-green-800';
      case LeaveStatus.Menunggu: return 'bg-yellow-100 text-yellow-800';
      case LeaveStatus.Ditolak: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getOvertimeStatusClass = (status: OvertimeStatus) => {
    switch (status) {
      case OvertimeStatus.Disetujui: return 'bg-green-100 text-green-800';
      case OvertimeStatus.Menunggu: return 'bg-yellow-100 text-yellow-800';
      case OvertimeStatus.Ditolak: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-on-surface">Selamat Datang, {employee.name}!</h2>
              <p className="text-subtle">{employee.position}</p>
            </div>
            <div className="flex items-center space-x-2">
              {!todayAttendance?.checkIn && (
                   <button onClick={() => setAttendanceAction('in')} className="flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors font-medium">
                      <ClockIcon className="mr-2 h-5 w-5"/> Clock In
                  </button>
              )}
              {todayAttendance?.checkIn && !todayAttendance?.checkOut && (
                  <button onClick={() => setAttendanceAction('out')} className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors font-medium">
                      <ClockIcon className="mr-2 h-5 w-5"/> Clock Out
                  </button>
              )}
            </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-surface p-6 rounded-xl shadow-sm">
               <h4 className="text-subtle font-medium">Status Kehadiran Hari Ini</h4>
               <p className="text-2xl font-bold text-on-surface mt-1">{todayAttendance?.status || 'Belum Clock In'}</p>
               <p className="text-sm text-subtle mt-1">Masuk: {todayAttendance?.checkIn || '-'} | Pulang: {todayAttendance?.checkOut || '-'}</p>
           </div>
           <div className="bg-surface p-6 rounded-xl shadow-sm">
               <h4 className="text-subtle font-medium">Sisa Cuti Tahunan</h4>
               <p className="text-2xl font-bold text-on-surface mt-1">{remainingLeave} Hari</p>
               <p className="text-xs text-subtle mt-1">Periode {new Date().getFullYear()}</p>
           </div>
           <div className="bg-surface p-6 rounded-xl shadow-sm flex flex-col justify-center items-start gap-2">
              <button onClick={() => setIsLeaveModalOpen(true)} className="w-full text-left text-sm bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors font-medium">Ajukan Cuti</button>
              <button onClick={() => setIsOvertimeModalOpen(true)} className="w-full text-left text-sm bg-gray-200 text-on-surface px-4 py-2 rounded-md hover:bg-gray-300 transition-colors font-medium">Ajukan Lembur</button>
           </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leave Requests */}
          <div className="bg-surface p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-semibold text-on-surface">Riwayat Pengajuan Cuti</h3>
                 <div className="flex text-xs font-medium text-subtle space-x-4 px-2">
                    <span className="w-24">Jenis</span>
                    <span className="w-32">Tanggal</span>
                    <span className="w-20 text-center">Status</span>
                    <span className="w-10 text-right">Aksi</span>
                 </div>
              </div>
              <div className="overflow-x-auto max-h-80">
                <table className="min-w-full">
                  <tbody className="divide-y divide-gray-200">
                    {employeeLeaves.length > 0 ? employeeLeaves.map(leave => (
                      <tr key={leave.id}>
                        <td className="py-3 pl-2 text-sm font-medium text-on-surface w-24">{leave.leaveType}</td>
                        <td className="py-3 text-sm text-subtle w-32">{new Date(leave.startDate).toLocaleDateString('id-ID')} - {new Date(leave.endDate).toLocaleDateString('id-ID')}</td>
                        <td className="py-3 text-center w-20">
                          <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getLeaveStatusClass(leave.status)}`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="py-3 pr-2 text-right w-10">
                          {leave.status === LeaveStatus.Disetujui && (
                              <button
                                onClick={() => handleOpenCalendarModal(leave)}
                                className="text-primary hover:text-primary-dark transition-colors"
                                title="Tambah ke Kalender (Google/Outlook)"
                              >
                                <CalendarDaysIcon className="h-5 w-5" />
                              </button>
                            )}
                        </td>
                      </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="text-center py-10 text-subtle text-sm">Belum ada riwayat pengajuan cuti.</td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
          </div>
          
          {/* Overtime Requests */}
          <div className="bg-surface p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-on-surface">Riwayat Pengajuan Lembur</h3>
                   <div className="flex text-xs font-medium text-subtle space-x-4 px-2">
                    <span className="w-24">Tanggal</span>
                    <span className="w-32">Waktu</span>
                    <span className="w-20 text-right">Status</span>
                 </div>
              </div>
              <div className="overflow-x-auto max-h-80">
                <table className="min-w-full">
                  <tbody className="divide-y divide-gray-200">
                    {employeeOvertimes.length > 0 ? employeeOvertimes.map(overtime => (
                      <tr key={overtime.id}>
                        <td className="py-3 pl-2 text-sm font-medium text-on-surface w-24">{new Date(overtime.date).toLocaleDateString('id-ID')}</td>
                        <td className="py-3 text-sm text-subtle w-32">{overtime.startTime} - {overtime.endTime} ({overtime.duration} jam)</td>
                        <td className="py-3 pr-2 text-right w-20">
                          <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getOvertimeStatusClass(overtime.status)}`}>
                            {overtime.status}
                          </span>
                        </td>
                      </tr>
                    )) : (
                        <tr>
                            <td colSpan={3} className="text-center py-10 text-subtle text-sm">Belum ada riwayat pengajuan lembur.</td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
          </div>
        </div>
          
        {/* Performance Review */}
        {latestReview && (
          <div className="bg-surface p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Penilaian Kinerja Terakhir</h3>
            <div className="space-y-3">
              <p className="text-sm text-subtle">Tanggal: {new Date(latestReview.reviewDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</p>
              <div className="flex items-center space-x-2">
                  <StarRating score={latestReview.score} />
                  <span className="font-bold text-on-surface">{latestReview.score}/5</span>
              </div>
              <div>
                  <p className="text-sm font-medium text-on-surface">Komentar:</p>
                  <blockquote className="text-sm text-subtle border-l-4 border-primary/30 pl-3 italic mt-1">
                      "{latestReview.comments}"
                  </blockquote>
              </div>
            </div>
          </div>
        )}
      </div>
      <RequestLeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={handleLeaveSubmit}
      />
      <RequestOvertimeModal
        isOpen={isOvertimeModalOpen}
        onClose={() => setIsOvertimeModalOpen(false)}
        onSubmit={handleOvertimeSubmit}
      />
      <Modal
        isOpen={!!attendanceAction}
        onClose={() => setAttendanceAction(null)}
        onConfirm={executeAttendanceAction}
        title={`Konfirmasi Clock ${attendanceAction === 'in' ? 'In' : 'Out'}`}
        confirmText={`Ya, Clock ${attendanceAction === 'in' ? 'In' : 'Out'}`}
        cancelText="Batal"
        confirmColor={attendanceAction === 'in' ? 'green' : 'red'}
      >
        <p>
            Apakah Anda yakin ingin melakukan <strong>Clock {attendanceAction === 'in' ? 'In' : 'Out'}</strong> untuk hari ini?
            {attendanceAction === 'in' ? ' Waktu kehadiran Anda akan tercatat mulai sekarang.' : ' Sesi kerja Anda hari ini akan diakhiri.'}
        </p>
      </Modal>

      <AddToCalendarModal 
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        leaveRequest={selectedLeaveForCalendar}
        employeeName={employee.name}
      />
    </>
  );
};

export default DasborPegawai;
