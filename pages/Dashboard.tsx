
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { employees, performanceReviews, getEmployeeName } from '../data/mockData';
import { UsersIcon, ClockIcon, CalendarIcon, StarIcon } from '../constants';
import { Page } from '../App';
import { Attendance, LeaveRequest } from '../types';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; color: string }> = ({ icon, title, value, color }) => (
  <div className="bg-surface p-6 rounded-xl shadow-sm flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-subtle">{title}</p>
      <p className="text-2xl font-bold text-on-surface">{value}</p>
    </div>
  </div>
);

interface DashboardProps {
  setActivePage: (page: Page) => void;
  attendanceRecords: Attendance[];
  leaveRequests: LeaveRequest[];
}

const Dashboard: React.FC<DashboardProps> = ({ setActivePage, attendanceRecords, leaveRequests }) => {
    const todayStr = new Date().toLocaleDateString('en-CA');
    
    // Real-time calculation for "Present Today"
    const presentToday = attendanceRecords.filter(r => r.date === todayStr && r.status === 'Hadir').length;
    
    const pendingLeaves = leaveRequests.filter(r => r.status === 'Menunggu').length;
    const avgPerformance = (performanceReviews.reduce((acc, r) => acc + r.score, 0) / performanceReviews.length).toFixed(1);

    const attendanceChartData = [
        { name: 'Sen', Hadir: 4, Alpha: 1 },
        { name: 'Sel', Hadir: 5, Alpha: 0 },
        { name: 'Rab', Hadir: 3, Alpha: 2 },
        { name: 'Kam', Hadir: 4, Alpha: 1 },
        { name: 'Jum', Hadir: 5, Alpha: 0 },
    ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<UsersIcon className="text-white"/>} title="Total Pegawai" value={employees.length.toString()} color="bg-blue-500" />
        <StatCard icon={<ClockIcon className="text-white"/>} title="Hadir Hari Ini" value={presentToday.toString()} color="bg-green-500" />
        <StatCard icon={<CalendarIcon className="text-white"/>} title="Permintaan Cuti" value={pendingLeaves.toString()} color="bg-yellow-500" />
        <StatCard icon={<StarIcon className="text-white"/>} title="Kinerja Rata-rata" value={avgPerformance} color="bg-red-500" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Statistik Kehadiran Mingguan</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={attendanceChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'rgba(243, 244, 246, 0.5)'}}/>
                <Legend iconType="circle" />
                <Bar dataKey="Hadir" fill="#3B82F6" name="Hadir" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Alpha" fill="#EF4444" name="Tidak Hadir" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="bg-surface p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-on-surface mb-4">Aktivitas Terbaru</h3>
            <ul className="space-y-4">
                {leaveRequests.filter(r => r.status === 'Menunggu').slice(0, 4).map(req => (
                    <li key={req.id} className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 rounded-full">
                            <CalendarIcon className="h-5 w-5 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-on-surface">Permintaan Cuti</p>
                            <p className="text-xs text-subtle">{employees.find(e => e.id === req.employeeId)?.name}</p>
                        </div>
                    </li>
                ))}
                 {performanceReviews.slice(0, 1).map(review => (
                    <li key={review.id} className="flex items-center space-x-3">
                         <div className="p-2 bg-blue-100 rounded-full">
                            <StarIcon className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-on-surface">Penilaian Kinerja Baru</p>
                            <p className="text-xs text-subtle">{employees.find(e => e.id === review.employeeId)?.name}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
