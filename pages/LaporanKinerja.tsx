import React, { useMemo } from 'react';
import { PerformanceReview, Employee } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getEmployeeName } from '../data/mockData';
import { PrinterIcon } from '../constants';

interface LaporanKinerjaProps {
    reviews: PerformanceReview[];
    employees: Employee[];
}

const LaporanKinerja: React.FC<LaporanKinerjaProps> = ({ reviews, employees }) => {
    const stats = useMemo(() => {
        const totalReviews = reviews.length;
        const avgScore = totalReviews > 0 ? (reviews.reduce((acc, curr) => acc + curr.score, 0) / totalReviews) : 0;

        // Sort logic for top/bottom performers
        const sortedReviews = [...reviews].sort((a, b) => b.score - a.score);
        const topPerformers = sortedReviews.slice(0, 5);
        const lowPerformers = sortedReviews.slice(-5).reverse(); // Worst at the top of this list

        // Score trends (mocking time data as "Review N")
        const trendData = reviews.map((r, i) => ({
            name: `Rev ${i + 1}`,
            score: r.score
        }));

        return { totalReviews, avgScore, topPerformers, lowPerformers, trendData };
    }, [reviews]);

    const handlePrint = () => {
        const printContents = document.getElementById('printable-area')?.innerHTML;
        if (!printContents) return;

        const printWindow = window.open('', '', 'height=800,width=1000');
        if (!printWindow) return;

        printWindow.document.write(`
          <html>
            <head>
              <title>Laporan Kinerja</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                @media print {
                  body { -webkit-print-color-adjust: exact; }
                }
              </style>
            </head>
            <body class="p-8">
              <h1 class="text-2xl font-bold mb-4">Laporan Kinerja</h1>
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
                <h2 className="text-2xl font-bold text-on-surface">Laporan Kinerja</h2>
                <button onClick={handlePrint} className="flex items-center text-sm text-subtle hover:text-on-surface bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors">
                    <PrinterIcon className="mr-2 h-4 w-4" /> Cetak
                </button>
            </div>

            <div id="printable-area" className="space-y-6">

                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-surface p-6 rounded-xl shadow-sm border-t-4 border-indigo-500">
                        <h3 className="text-sm font-medium text-subtle">Rata-rata Skor Kinerja</h3>
                        <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.avgScore.toFixed(2)} <span className="text-sm text-gray-500 font-normal">/ 5.00</span></p>
                    </div>
                    <div className="bg-surface p-6 rounded-xl shadow-sm border-t-4 border-pink-500">
                        <h3 className="text-sm font-medium text-subtle">Total Penilaian</h3>
                        <p className="text-4xl font-bold text-pink-600 mt-2">{stats.totalReviews}</p>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-surface p-6 rounded-xl shadow-sm">
                    <h3 className="text-lg font-semibold text-on-surface mb-4">Tren Skor Penilaian</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.trendData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" hide />
                                <YAxis domain={[0, 5]} />
                                <Tooltip />
                                <Area type="monotone" dataKey="score" stroke="#8884d8" fillOpacity={1} fill="url(#colorScore)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Performers */}
                    <div className="bg-surface p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-green-700 mb-4">Top Performers</h3>
                        <ul className="divide-y divide-gray-100">
                            {stats.topPerformers.map(r => (
                                <li key={r.id} className="py-3 flex justify-between items-center">
                                    <span className="font-medium text-gray-700">{getEmployeeName(r.employeeId)}</span>
                                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">{r.score.toFixed(1)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Low Performers */}
                    <div className="bg-surface p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-red-700 mb-4">Perlu Perhatian</h3>
                        <ul className="divide-y divide-gray-100">
                            {stats.lowPerformers.map(r => (
                                <li key={r.id} className="py-3 flex justify-between items-center">
                                    <span className="font-medium text-gray-700">{getEmployeeName(r.employeeId)}</span>
                                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full">{r.score.toFixed(1)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LaporanKinerja;
