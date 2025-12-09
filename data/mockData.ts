
import { Employee, Attendance, AttendanceStatus, LeaveRequest, LeaveStatus, PerformanceReview, OvertimeRequest, OvertimeStatus } from '../types';

export const employees: Employee[] = [
  { id: '1', nip: '199001012020011001', name: 'Budi Santoso', position: 'Frontend Developer', department: 'Teknologi Informasi', status: 'Aktif', avatarUrl: 'https://picsum.photos/id/1005/200/200', joinDate: '2020-01-15', email: 'budi.s@example.com' },
  { id: '2', nip: '199205102020012002', name: 'Citra Lestari', position: 'UI/UX Designer', department: 'Produk', status: 'Aktif', avatarUrl: 'https://picsum.photos/id/1011/200/200', joinDate: '2020-01-20', email: 'citra.l@example.com' },
  { id: '3', nip: '198811202019031003', name: 'Agus Wijaya', position: 'Backend Developer', department: 'Teknologi Informasi', status: 'Aktif', avatarUrl: 'https://picsum.photos/id/1025/200/200', joinDate: '2019-03-10', email: 'agus.w@example.com' },
  { id: '4', nip: '199508152021071004', name: 'Dewi Anggraini', position: 'HR Manager', department: 'Sumber Daya Manusia', status: 'Aktif', avatarUrl: 'https://picsum.photos/id/1027/200/200', joinDate: '2021-07-01', email: 'dewi.a@example.com' },
  { id: '5', nip: '199303252021072005', name: 'Eko Prasetyo', position: 'QA Engineer', department: 'Teknologi Informasi', status: 'Aktif', avatarUrl: 'https://picsum.photos/id/10/200/200', joinDate: '2021-07-15', email: 'eko.p@example.com' },
  { id: '6', nip: '199809052022011006', name: 'Fitriani', position: 'Marketing Specialist', department: 'Pemasaran', status: 'Tidak Aktif', avatarUrl: 'https://picsum.photos/id/11/200/200', joinDate: '2022-01-10', email: 'fitriani@example.com' },
];

export const attendanceRecords: Attendance[] = [
  { id: 'att1', employeeId: '1', date: '2023-10-26', checkIn: '08:55', checkOut: '17:05', status: AttendanceStatus.Hadir },
  { id: 'att2', employeeId: '2', date: '2023-10-26', checkIn: '09:02', checkOut: '17:00', status: AttendanceStatus.Hadir },
  { id: 'att3', employeeId: '3', date: '2023-10-26', checkIn: null, checkOut: null, status: AttendanceStatus.Sakit },
  { id: 'att4', employeeId: '4', date: '2023-10-26', checkIn: '08:45', checkOut: '17:15', status: AttendanceStatus.Hadir },
  { id: 'att5', employeeId: '1', date: '2023-10-25', checkIn: '08:50', checkOut: '17:01', status: AttendanceStatus.Hadir },
  { id: 'att6', employeeId: '2', date: '2023-10-25', checkIn: '09:10', checkOut: '17:05', status: AttendanceStatus.Hadir },
  { id: 'att7', employeeId: '5', date: '2023-10-26', checkIn: '09:00', checkOut: '17:00', status: AttendanceStatus.Hadir },
  { id: 'att8', employeeId: '6', date: '2023-10-26', checkIn: null, checkOut: null, status: AttendanceStatus.Alpha },
];

export const leaveRequests: LeaveRequest[] = [
  { id: 'leave1', employeeId: '3', leaveType: 'Cuti Sakit', startDate: '2023-10-26', endDate: '2023-10-27', reason: 'Flu dan demam', status: LeaveStatus.Disetujui },
  { id: 'leave2', employeeId: '1', leaveType: 'Cuti Tahunan', startDate: '2023-11-10', endDate: '2023-11-15', reason: 'Liburan keluarga', status: LeaveStatus.Menunggu },
  { id: 'leave3', employeeId: '2', leaveType: 'Cuti Melahirkan', startDate: '2023-09-01', endDate: '2023-12-01', reason: 'Persiapan melahirkan', status: LeaveStatus.Disetujui },
  { id: 'leave4', employeeId: '5', leaveType: 'Cuti Tahunan', startDate: '2023-10-30', endDate: '2023-10-30', reason: 'Acara keluarga', status: LeaveStatus.Ditolak },
];

export const performanceReviews: PerformanceReview[] = [
    { id: 'perf1', employeeId: '1', reviewDate: '2023-06-30', reviewerId: '4', score: 4.5, comments: 'Kinerja sangat baik, konsisten dalam mencapai target sprint.' },
    { id: 'perf2', employeeId: '2', reviewDate: '2023-06-30', reviewerId: '4', score: 4.8, comments: 'Desain yang dihasilkan sangat kreatif dan user-friendly. Inisiatif tinggi.' },
    { id: 'perf3', employeeId: '3', reviewDate: '2023-06-30', reviewerId: '4', score: 4.2, comments: 'Kemampuan problem-solving yang kuat, namun perlu meningkatkan kecepatan development.' },
    { id: 'perf4', employeeId: '5', reviewDate: '2023-06-30', reviewerId: '4', score: 4.0, comments: 'Teliti dalam pengujian, berhasil menemukan beberapa bug kritikal.' },
];

export const overtimeRequests: OvertimeRequest[] = [
    { id: 'ovt1', employeeId: '1', date: '2023-10-20', startTime: '17:00', endTime: '19:00', duration: 2, reason: 'Menyelesaikan hotfix untuk production.', status: OvertimeStatus.Disetujui },
    { id: 'ovt2', employeeId: '3', date: '2023-10-21', startTime: '17:00', endTime: '20:00', duration: 3, reason: 'Deployment server baru.', status: OvertimeStatus.Disetujui },
    { id: 'ovt3', employeeId: '5', date: '2023-10-25', startTime: '17:30', endTime: '18:30', duration: 1, reason: 'Testing fitur mendesak.', status: OvertimeStatus.Menunggu },
    { id: 'ovt4', employeeId: '1', date: '2023-10-25', startTime: '18:00', endTime: '19:00', duration: 1, reason: 'Meeting dengan tim US.', status: OvertimeStatus.Ditolak },
];

export const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : 'Tidak Diketahui';
};
