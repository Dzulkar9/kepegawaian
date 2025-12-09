
import React, { useState, useMemo } from 'react';
import { getEmployeeName } from '../data/mockData';
import { Attendance, AttendanceStatus } from '../types';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XCircleIcon } from '../constants';

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string | number; bgColor: string }> = ({ icon, title, value, bgColor }) => (
  <div className={`bg-surface p-4 rounded-xl shadow-sm flex items-center space-x-4`}>
    <div className={`p-3 rounded-full ${bgColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-subtle">{title}</p>
      <p className="text-2xl font-bold text-on-surface">{value}</p>
    </div>
  </div>
);

interface LaporanKehadiranProps {
    attendanceRecords: Attendance[];
}

const LaporanKehadiran: React.FC<LaporanKehadiranProps> = ({ attendanceRecords }) => {
    const today = new Date().toLocaleDateString('en-CA');
    const [filterDate, setFilterDate] = useState(today);
    const [selectedMonth, setSelectedMonth] = useState(today.substring(0, 7)); // YYYY-MM

    const filteredRecords = useMemo(() => {
        return attendanceRecords.filter(rec => rec.date === filterDate);
    }, [filterDate, attendanceRecords]);

    const monthlyStats = useMemo(() => {
        const recordsInMonth = attendanceRecords.filter(rec => rec.date.startsWith(selectedMonth));
        const stats = {
            [AttendanceStatus.Hadir]: 0,
            [AttendanceStatus.Sakit]: 0,
            [AttendanceStatus.Izin]: 0,
            [AttendanceStatus.Alpha]: 0,
        };
        recordsInMonth.forEach(rec => {
            if (rec.status in stats) {
                stats[rec.status]++;
            }
        });
        return stats;
    }, [selectedMonth, attendanceRecords]);
    
    const getStatusClass = (status: AttendanceStatus) => {
        switch (status) {
          case AttendanceStatus.Hadir:
            return 'bg-green-100 text-green-800';
          case AttendanceStatus.Sakit:
            return 'bg-yellow-100 text-yellow-800';
          case AttendanceStatus.Izin:
            return 'bg-blue-100 text-blue-800';
          case AttendanceStatus.Alpha:
            return 'bg-red-100 text-red-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-surface p-6 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h2 className="text-xl font-semibold text-on-surface mb-2 sm:mb-0">Ringkasan Bulanan</h2>
                    <div className="flex items-center">
                        <label htmlFor="month-filter" className="mr-2 text-sm font-medium text-subtle">Bulan:</label>
                        <input
                            type="month"
                            id="month-filter"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard icon={<CheckCircleIcon className="text-white h-6 w-6"/>} title="Total Hadir" value={monthlyStats.Hadir} bgColor="bg-green-500" />
                    <StatCard icon={<ExclamationCircleIcon className="text-white h-6 w-6"/>} title="Total Sakit" value={monthlyStats.Sakit} bgColor="bg-yellow-500" />
                    <StatCard icon={<InformationCircleIcon className="text-white h-6 w-6"/>} title="Total Izin" value={monthlyStats.Izin} bgColor="bg-blue-500" />
                    <StatCard icon={<XCircleIcon className="text-white h-6 w-6"/>} title="Total Alpha" value={monthlyStats.Alpha} bgColor="bg-red-500" />
                </div>
            </div>

            <div className="bg-surface p-6 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h2 className="text-xl font-semibold text-on-surface mb-2 sm:mb-0">Detail Harian</h2>
                    <div className="flex items-center">
                        <label htmlFor="date-filter" className="mr-2 text-sm font-medium text-subtle">Tanggal:</label>
                        <input
                            type="date"
                            id="date-filter"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Nama Pegawai</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Jam Masuk</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Jam Pulang</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRecords.length > 0 ? (
                            filteredRecords.map((record: Attendance) => (
                            <tr key={record.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">{getEmployeeName(record.employeeId)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-subtle">{record.checkIn || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-subtle">{record.checkOut || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(record.status)}`}>
                                    {record.status}
                                </span>
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 whitespace-nowrap text-sm text-center text-subtle">
                                    Tidak ada data kehadiran untuk tanggal ini.
                                </td>
                            </tr>
                        )}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LaporanKehadiran;
