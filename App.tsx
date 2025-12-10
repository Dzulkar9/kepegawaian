
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import DataPegawai from './pages/DataPegawai';
import LaporanKehadiran from './pages/LaporanKehadiran';
import ManajemenCuti from './pages/ManajemenCuti';
import PenilaianKinerja from './pages/PenilaianKinerja';
import DataLembur from './pages/DataLembur';

import LaporanKustom from './pages/LaporanKustom';
import LaporanCuti from './pages/LaporanCuti';
import LaporanLembur from './pages/LaporanLembur';
import LaporanKinerja from './pages/LaporanKinerja';
import LoginPage from './pages/LoginPage';
import DasborPegawai from './pages/DasborPegawai';
import { Employee, LeaveRequest, OvertimeRequest, LeaveStatus, OvertimeStatus, Attendance, PerformanceReview } from './types';
import Modal from './components/Modal';
import { NotificationProvider } from './contexts/NotificationContext';
import { employees, leaveRequests as initialLeaveRequests, overtimeRequests as initialOvertimeRequests, attendanceRecords as initialAttendanceRecords, performanceReviews as initialPerformanceReviews } from './data/mockData';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/ToastContainer';

// Page types for Admin
export type AdminPage = 'Dashboard' | 'Data Pegawai' | 'Laporan Kehadiran' | 'Manajemen Cuti' | 'Penilaian Kinerja' | 'Data Lembur' | 'Laporan Kustom' | 'Laporan Cuti' | 'Laporan Lembur' | 'Laporan Kinerja';

// Page types for Employee
export type EmployeePage = 'Dasbor Pegawai';

// Union type for any page
export type Page = AdminPage | EmployeePage;

// User session type
export type User = { role: 'admin' } | { role: 'employee', employee: Employee } | null;


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(null);
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Centralized State for Data Sharing
  const [masterLeaveRequests, setMasterLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [masterOvertimeRequests, setMasterOvertimeRequests] = useState<OvertimeRequest[]>(initialOvertimeRequests);
  const [masterAttendance, setMasterAttendance] = useState<Attendance[]>(initialAttendanceRecords);
  const [masterPerformanceReviews, setMasterPerformanceReviews] = useState<PerformanceReview[]>(initialPerformanceReviews);

  // Global state for calculated leave balances
  const [leaveBalances, setLeaveBalances] = useState<Record<string, number>>({});

  // Calculate leave balances whenever requests or employees change
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const newBalances: Record<string, number> = {};

    employees.forEach(emp => {
      // 1. Calculate Entitlement (Jatah Cuti)
      // Default 12 days. If joined this year, prorata: 12 - joinMonth.
      const joinDate = new Date(emp.joinDate);
      let entitlement = 12;

      if (joinDate.getFullYear() === currentYear) {
        const joinMonth = joinDate.getMonth(); // 0 = Jan, 11 = Dec
        entitlement = Math.max(0, 12 - joinMonth);
      }

      // 2. Calculate Used Leave (Cuti Terpakai)
      // Count 'Disetujui' AND 'Menunggu'.
      // EXCLUDE 'Ditolak' so balance returns if rejected.
      const usedDays = masterLeaveRequests
        .filter(req =>
          req.employeeId === emp.id &&
          req.status !== LeaveStatus.Ditolak &&
          req.leaveType === 'Cuti Tahunan' &&
          new Date(req.startDate).getFullYear() === currentYear
        )
        .reduce((total, req) => {
          const start = new Date(req.startDate);
          const end = new Date(req.endDate);
          // Calculate difference in days (inclusive)
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          return total + diffDays;
        }, 0);

      // 3. Set Balance
      newBalances[emp.id] = Math.max(0, entitlement - usedDays);
    });

    setLeaveBalances(newBalances);
  }, [masterLeaveRequests]);


  const handleLoginSuccess = (user: Exclude<User, null>) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActivePage('Dashboard');
    } else {
      setActivePage('Dasbor Pegawai');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLogoutModalOpen(false);
  };

  // Handlers for Data Updates
  const handleAddLeaveRequest = (newRequest: LeaveRequest) => {
    setMasterLeaveRequests(prev => [newRequest, ...prev]);
  };

  const handleUpdateLeaveStatus = (id: string, status: LeaveStatus) => {
    setMasterLeaveRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status } : req)
    );
  };

  const handleAddOvertimeRequest = (newRequest: OvertimeRequest) => {
    setMasterOvertimeRequests(prev => [newRequest, ...prev]);
  };

  const handleUpdateOvertimeStatus = (id: string, status: OvertimeStatus) => {
    setMasterOvertimeRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status } : req)
    );
  };

  const handleAttendanceUpdate = (record: Attendance) => {
    setMasterAttendance(prev => {
      const index = prev.findIndex(r => r.id === record.id);
      if (index !== -1) {
        // Update existing record (e.g. Clock Out)
        const newRecords = [...prev];
        newRecords[index] = record;
        return newRecords;
      } else {
        // Add new record (Clock In)
        return [record, ...prev];
      }
    });
  };

  const handleAddPerformanceReview = (newReview: PerformanceReview) => {
    setMasterPerformanceReviews(prev => [newReview, ...prev]);
  };

  const renderAdminContent = () => {
    switch (activePage as AdminPage) {
      case 'Dashboard':
        return <Dashboard setActivePage={setActivePage} attendanceRecords={masterAttendance} leaveRequests={masterLeaveRequests} />;
      case 'Data Pegawai':
        return <DataPegawai />;
      case 'Laporan Kehadiran':
        return <LaporanKehadiran attendanceRecords={masterAttendance} />;
      case 'Manajemen Cuti':
        return (
          <ManajemenCuti
            requests={masterLeaveRequests}
            onUpdateStatus={handleUpdateLeaveStatus}
            onAddLeave={handleAddLeaveRequest} // Passed to allow admin to add leave
          />
        );
      case 'Penilaian Kinerja':
        return (
          <PenilaianKinerja
            reviews={masterPerformanceReviews}
            onAddReview={handleAddPerformanceReview}
          />
        );
      case 'Data Lembur':
        return (
          <DataLembur
            requests={masterOvertimeRequests}
            onUpdateStatus={handleUpdateOvertimeStatus}
            onAddRequest={handleAddOvertimeRequest}
          />
        );
      case 'Laporan Kustom':
        return <LaporanKustom />;
      case 'Laporan Cuti':
        return <LaporanCuti leaveRequests={masterLeaveRequests} employees={employees} />;
      case 'Laporan Lembur':
        return <LaporanLembur overtimeRequests={masterOvertimeRequests} employees={employees} />;
      case 'Laporan Kinerja':
        return <LaporanKinerja reviews={masterPerformanceReviews} employees={employees} />;
      default:
        return <Dashboard setActivePage={setActivePage} attendanceRecords={masterAttendance} leaveRequests={masterLeaveRequests} />;
    }
  };

  const renderEmployeeContent = () => {
    if (currentUser?.role === 'employee') {
      switch (activePage as EmployeePage) {
        case 'Dasbor Pegawai':
          return (
            <DasborPegawai
              employee={currentUser.employee}
              leaves={masterLeaveRequests}
              overtimes={masterOvertimeRequests}
              attendanceRecords={masterAttendance}
              reviews={masterPerformanceReviews}
              onAddLeave={handleAddLeaveRequest}
              onAddOvertime={handleAddOvertimeRequest}
              onAttendanceUpdate={handleAttendanceUpdate}
              remainingLeave={leaveBalances[currentUser.employee.id] || 0}
            />
          );
        default:
          return (
            <DasborPegawai
              employee={currentUser.employee}
              leaves={masterLeaveRequests}
              overtimes={masterOvertimeRequests}
              attendanceRecords={masterAttendance}
              reviews={masterPerformanceReviews}
              onAddLeave={handleAddLeaveRequest}
              onAddOvertime={handleAddOvertimeRequest}
              onAttendanceUpdate={handleAttendanceUpdate}
              remainingLeave={leaveBalances[currentUser.employee.id] || 0}
            />
          );
      }
    }
    return null;
  }

  if (!currentUser) {
    return (
      <ToastProvider>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
        <ToastContainer />
      </ToastProvider>
    );
  }

  return (
    <NotificationProvider currentUser={currentUser}>
      <ToastProvider>
        <div className="flex h-screen bg-background">
          <Sidebar
            activePage={activePage}
            setActivePage={setActivePage}
            userRole={currentUser.role}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header
              currentPage={activePage}
              onLogoutClick={() => setIsLogoutModalOpen(true)}
              user={currentUser}
              setActivePage={setActivePage}
            />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
              {currentUser.role === 'admin' ? renderAdminContent() : renderEmployeeContent()}
            </main>
          </div>
        </div>
        <Modal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
          title="Konfirmasi Logout"
          confirmText="Ya, Logout"
          cancelText="Batal"
          confirmColor="red"
        >
          <p>Apakah Anda yakin ingin keluar dari sesi ini?</p>
        </Modal>
        <ToastContainer />
      </ToastProvider>
    </NotificationProvider>
  );
};

export default App;
