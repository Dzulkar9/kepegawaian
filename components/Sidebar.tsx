
import React from 'react';
import { Page, AdminPage, EmployeePage } from '../App';
import { ChartBarIcon, UsersIcon, ClockIcon, CalendarIcon, StarIcon, CurrencyDollarIcon, BuildingOfficeIcon, DocumentTextIcon, FingerPrintIcon } from '../constants';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  userRole: 'admin' | 'employee';
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, userRole }) => {
  const adminNavItems: { name: AdminPage; icon: React.ReactNode }[] = [
    { name: 'Dashboard', icon: <ChartBarIcon /> },
    { name: 'Data Pegawai', icon: <UsersIcon /> },
    { name: 'Laporan Kehadiran', icon: <ClockIcon /> },
    { name: 'Manajemen Cuti', icon: <CalendarIcon /> },
    { name: 'Penilaian Kinerja', icon: <StarIcon /> },
    { name: 'Data Lembur', icon: <CurrencyDollarIcon /> },
    { name: 'Laporan Kustom', icon: <DocumentTextIcon /> },
  ];

  const employeeNavItems: { name: EmployeePage; icon: React.ReactNode }[] = [
    { name: 'Dasbor Pegawai', icon: <FingerPrintIcon className="h-6 w-6"/> },
  ];
  
  const navItems = userRole === 'admin' ? adminNavItems : employeeNavItems;

  return (
    <aside className="w-64 flex-shrink-0 bg-surface hidden md:flex flex-col border-r border-gray-200">
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200">
        <BuildingOfficeIcon />
        <h1 className="text-xl font-bold text-primary ml-2">HRIS</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActivePage(item.name);
            }}
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
              activePage === item.name
                ? 'bg-primary text-white shadow-md'
                : 'text-subtle hover:bg-gray-100 hover:text-on-surface'
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
