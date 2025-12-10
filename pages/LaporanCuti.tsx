import React, { useMemo } from 'react';
import { LeaveRequest, Employee, LeaveStatus } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getEmployeeName } from '../data/mockData';
import { PrinterIcon } from '../constants';

interface LaporanCutiProps {
    leaveRequests: LeaveRequest[];
    employees: Employee[];
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Green, Yellow, Red

const StatCard: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
    <div className="bg-surface p-6 rounded-xl shadow-sm border-l-4" style={{ borderColor: color }}>
        <h3 className="text-sm font-medium text-subtle">{title}</h3>
        <p className="text-2xl font-bold text-on-surface mt-1">{value}</p>
    </div>
);

const LaporanCuti: React.FC<LaporanCutiProps> = ({ leaveRequests, employees }) => {
    // Stats Calculation
    const stats = useMemo(() => {
        const total = leaveRequests.length;
        const approved = leaveRequests.filter(r => r.status === LeaveStatus.Disetujui).length;
        const pending = leaveRequests.filter(r => r.status === LeaveStatus.Menunggu).length;
        const rejected = leaveRequests.filter(r => r.status === LeaveStatus.Ditolak).length;

        // Type distribution
        const typeDist = leaveRequests.reduce((acc, req) => {
            acc[req.leaveType] = (acc[req.leaveType] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const pieData = [
            { name: 'Disetujui', value: approved },
            { name: 'Menunggu', value: pending },
            { name: 'Ditolak', value: rejected },
        ];

        const barData = Object.entries(typeDist).map(([name, value]) => ({ name, value }));

        return { total, approved, pending, rejected, pieData, barData };
    }, [leaveRequests]);

    const handlePrint = () => {
        const printContents = document.getElementById('printable-area')?.innerHTML;
        if (!printContents) return;

        const printWindow = window.open('', '', 'height=800,width=1000');
        if (!printWindow) return;

        printWindow.document.write(`
          <html>
            <head>
              <title>Laporan Cuti</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                @media print {
                  body { -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body class="p-8">
              <h1 class="text-2xl font-bold mb-4">Laporan Cuti</h1>
              <p class="text-sm text-gray-600 mb-6">Dicetak pada: ${new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'long' })}</p>
              ${printContents}
            </body>
          </html>
        `);

        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-on-surface">Laporan Cuti</h2>
                <button onClick={handlePrint} className="flex items-center text-sm text-subtle hover:text-on-surface bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors">
                    <PrinterIcon className="mr-2 h-4 w-4" /> Cetak
                </button>
            </div>

            <div id="printable-area" className="space-y-6">

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Total Pengajuan" value={stats.total} color="#3B82F6" />
                    <StatCard title="Disetujui" value={stats.approved} color="#10B981" />
                    <StatCard title="Menunggu" value={stats.pending} color="#F59E0B" />
                    <StatCard title="Ditolak" value={stats.rejected} color="#EF4444" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Status Chart */}
                    <div className="bg-surface p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-on-surface mb-4">Status Pengajuan</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Type Chart */}
                    <div className="bg-surface p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-on-surface mb-4">Jenis Cuti</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.barData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} interval={0} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Detail Table */}
                <div className="bg-surface p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-on-surface mb-4">Detail Pengajuan Terakhir</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Nama</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Jenis</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {leaveRequests.slice(0, 10).map(req => (
                                    <tr key={req.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">{getEmployeeName(req.employeeId)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-subtle">{req.leaveType}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-subtle">
                                            {new Date(req.startDate).toLocaleDateString('id-ID')} - {new Date(req.endDate).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${req.status === LeaveStatus.Disetujui ? 'bg-green-100 text-green-800' :
                                                    req.status === LeaveStatus.Menunggu ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LaporanCuti;
