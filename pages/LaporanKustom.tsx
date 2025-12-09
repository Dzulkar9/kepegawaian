
import React, { useState, useMemo } from 'react';
import { employees, attendanceRecords, getEmployeeName } from '../data/mockData';
import { Employee, Attendance } from '../types';
import { PrinterIcon, DownloadIcon } from '../constants';

type ReportType = 'pegawai' | 'kehadiran';

const employeeColumns = [
  { key: 'nip', label: 'NIP' },
  { key: 'name', label: 'Nama' },
  { key: 'position', label: 'Jabatan' },
  { key: 'department', label: 'Departemen' },
  { key: 'status', label: 'Status' },
  { key: 'joinDate', label: 'Tanggal Bergabung' },
  { key: 'email', label: 'Email' },
];

const attendanceColumns = [
  { key: 'employeeName', label: 'Nama Pegawai' },
  { key: 'date', label: 'Tanggal' },
  { key: 'checkIn', label: 'Jam Masuk' },
  { key: 'checkOut', label: 'Jam Pulang' },
  { key: 'status', label: 'Status Kehadiran' },
];

const LaporanKustom: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>('pegawai');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(['name', 'position', 'department', 'status']);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filters, setFilters] = useState<{ department?: string; status?: string }>({});
  const [reportData, setReportData] = useState<any[] | null>(null);

  const availableColumns = reportType === 'pegawai' ? employeeColumns : attendanceColumns;
  
  const uniqueDepartments = useMemo(() => [...new Set(employees.map(e => e.department))], []);
  
  const handleColumnChange = (columnKey: string) => {
    setSelectedColumns(prev =>
      prev.includes(columnKey) ? prev.filter(c => c !== columnKey) : [...prev, columnKey]
    );
  };

  const handleGenerateReport = () => {
    let data: any[] = [];
    if (reportType === 'pegawai') {
      data = employees
        .filter(e => {
          const joinDate = new Date(e.joinDate);
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;
          const isDateInRange = (!start || joinDate >= start) && (!end || joinDate <= end);
          const matchesDepartment = !filters.department || e.department === filters.department;
          const matchesStatus = !filters.status || e.status === filters.status;
          return isDateInRange && matchesDepartment && matchesStatus;
        });
    } else {
      data = attendanceRecords
        .map(rec => ({ ...rec, employeeName: getEmployeeName(rec.employeeId) }))
        .filter(rec => {
          const recDate = new Date(rec.date);
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;
          return (!start || recDate >= start) && (!end || recDate <= end);
        });
    }
    setReportData(data);
  };
  
  const handleExportCSV = () => {
    if (!reportData || reportData.length === 0) return;

    const headers = selectedColumns.map(colKey => availableColumns.find(c => c.key === colKey)?.label).join(',');
    const rows = reportData.map(row => {
        return selectedColumns.map(colKey => {
            let value = row[colKey] || '';
            return `"${value}"`;
        }).join(',');
    }).join('\n');

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPdf = () => {
    const printContents = document.getElementById('report-table-container')?.innerHTML;
    if (!printContents) return;

    const reportTitle = `Laporan Kustom - ${reportType === 'pegawai' ? 'Data Pegawai' : 'Kehadiran'}`;
    const printWindow = window.open('', '', 'height=800,width=1000');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${reportTitle}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body {
                -webkit-print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body class="p-8">
          <h1 class="text-2xl font-bold mb-2">${reportTitle}</h1>
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
      <div className="bg-surface p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-on-surface mb-4">Kustomisasi Laporan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-subtle mb-1">Jenis Laporan</label>
            <select
              value={reportType}
              onChange={e => {
                  setReportType(e.target.value as ReportType);
                  setSelectedColumns([]);
                  setReportData(null);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="pegawai">Data Pegawai</option>
              <option value="kehadiran">Kehadiran</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-subtle mb-1">Tanggal Mulai</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-subtle mb-1">Tanggal Selesai</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>

          {/* Filters */}
          {reportType === 'pegawai' && (
            <>
              <div>
                <label className="block text-sm font-medium text-subtle mb-1">Departemen</label>
                <select onChange={e => setFilters({...filters, department: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary">
                  <option value="">Semua</option>
                  {uniqueDepartments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-subtle mb-1">Status Pegawai</label>
                <select onChange={e => setFilters({...filters, status: e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary">
                    <option value="">Semua</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                </select>
              </div>
            </>
          )}
        </div>
        
        {/* Column Selection */}
        <div className="mt-6">
            <label className="block text-sm font-medium text-subtle mb-2">Pilih Kolom</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {availableColumns.map(col => (
                    <label key={col.key} className="flex items-center space-x-2 text-sm">
                        <input
                            type="checkbox"
                            checked={selectedColumns.includes(col.key)}
                            onChange={() => handleColumnChange(col.key)}
                            className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                        <span>{col.label}</span>
                    </label>
                ))}
            </div>
        </div>

        <div className="mt-6 border-t pt-4 flex justify-end">
            <button 
                onClick={handleGenerateReport}
                disabled={selectedColumns.length === 0}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                Buat Laporan
            </button>
        </div>
      </div>

      {reportData && (
        <div className="bg-surface p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-on-surface">Hasil Laporan</h3>
                <div className="flex space-x-2">
                     <button onClick={handlePrintPdf} className="flex items-center text-sm text-subtle hover:text-on-surface bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors">
                        <PrinterIcon className="mr-2" /> Cetak / PDF
                    </button>
                    <button onClick={handleExportCSV} className="flex items-center text-sm text-subtle hover:text-on-surface bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors">
                        <DownloadIcon className="mr-2"/> Ekspor CSV
                    </button>
                </div>
            </div>
          {reportData.length > 0 ? (
            <div id="report-table-container" className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {selectedColumns.map(colKey => (
                      <th key={colKey} scope="col" className="px-6 py-3 text-left text-xs font-medium text-subtle uppercase tracking-wider">
                        {availableColumns.find(c => c.key === colKey)?.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {selectedColumns.map(colKey => (
                        <td key={colKey} className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">{row[colKey] || '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-subtle">
                <p>Tidak ada data yang cocok dengan kriteria yang Anda pilih.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LaporanKustom;
