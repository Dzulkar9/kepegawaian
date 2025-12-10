import React, { useMemo } from 'react';
import { OvertimeRequest, Employee, OvertimeStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getEmployeeName } from '../data/mockData';
import { PrinterIcon } from '../constants';

interface LaporanLemburProps {
    overtimeRequests: OvertimeRequest[];
    employees: Employee[];
}

const LaporanLembur: React.FC<LaporanLemburProps> = ({ overtimeRequests, employees }) => {
    const stats = useMemo(() => {
        // Basic Counts
        const totalRequests = overtimeRequests.length;
        const totalHours = overtimeRequests.reduce((acc, curr) => acc + curr.duration, 0);
        // Mock Cost Calculation: Assume 50.000 IDR per hour
        const estimatedCost = totalHours * 50000;

        // Hours per Department
        const deptHours: Record<string, number> = {};
        overtimeRequests.forEach(req => {
            const emp = employees.find(e => e.id === req.employeeId);
            if (emp && emp.department) {
                deptHours[emp.department] = (deptHours[emp.department] || 0) + req.duration;
            }
        });

        const chartData = Object.entries(deptHours).map(([name, value]) => ({ name, value }));

        return { totalRequests, totalHours, estimatedCost, chartData };
    }, [overtimeRequests, employees]);

    const handlePrint = () => {
        const printContents = document.getElementById('printable-area')?.innerHTML;
        if (!printContents) return;

        const printWindow = window.open('', '', 'height=800,width=1000');
        if (!printWindow) return;

        printWindow.document.write(`
          <html>
            <head>
              <title>Laporan Lembur</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                @media print {
                  body { -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body class="p-8">
              <h1 class="text-2xl font-bold mb-4">Laporan Lembur</h1>
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
                <h2 className="text-2xl font-bold text-on-surface">Laporan Lembur</h2>
                <button onClick={handlePrint} className="flex items-center text-sm text-subtle hover:text-on-surface bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors">
                    <PrinterIcon className="mr-2 h-4 w-4" /> Cetak
                </button>
            </div>

            <div id="printable-area" className="space-y-6">

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                        <h3 className="text-sm font-medium text-subtle">Total Jam Lembur</h3>
                        <p className="text-2xl font-bold text-on-surface mt-1">{stats.totalHours.toFixed(1)} Jam</p>
                    </div>
                    <div className="bg-surface p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                        <h3 className="text-sm font-medium text-subtle">Estimasi Biaya</h3>
                        <p className="text-2xl font-bold text-on-surface mt-1">Rp {stats.estimatedCost.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="bg-surface p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                        <h3 className="text-sm font-medium text-subtle">Total Pengajuan</h3>
                        <p className="text-2xl font-bold text-on-surface mt-1">{stats.totalRequests}</p>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-surface p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-on-surface mb-4">Total Jam Lembur per Departemen</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.chartData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip formatter={(value) => [`${value} Jam`, 'Total']} cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} name="Jam Lembur" barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Requesters Table */}
                <div className="bg-surface p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-on-surface mb-4">Riwayat Lembur Terakhir</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Nama Pegawai</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Durasi</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {overtimeRequests.slice(0, 10).map(req => (
                                    <tr key={req.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-on-surface">{getEmployeeName(req.employeeId)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-subtle">{new Date(req.date).toLocaleDateString('id-ID')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-subtle">{req.duration} Jam</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${req.status === OvertimeStatus.Disetujui ? 'bg-green-100 text-green-800' :
                                                    req.status === OvertimeStatus.Menunggu ? 'bg-yellow-100 text-yellow-800' :
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

export default LaporanLembur;
