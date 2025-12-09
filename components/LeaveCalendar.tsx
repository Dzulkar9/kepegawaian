
import React, { useState } from 'react';
import { LeaveRequest } from '../types';
import { employees, getEmployeeName } from '../data/mockData';
import { ChevronLeftIcon, ChevronRightIcon } from '../constants';

interface LeaveCalendarProps {
  leaves: LeaveRequest[];
}

const getLeaveTypeColor = (leaveType: string) => {
    switch (leaveType) {
        case 'Cuti Tahunan': return 'bg-blue-500 text-white';
        case 'Cuti Sakit': return 'bg-yellow-500 text-white';
        case 'Cuti Melahirkan': return 'bg-pink-500 text-white';
        case 'Cuti Penting': return 'bg-purple-500 text-white';
        default: return 'bg-gray-500 text-white';
    }
};

const LeaveCalendar: React.FC<LeaveCalendarProps> = ({ leaves }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  
  const calendarCells = [];
  // Add empty cells for days before the start of the month
  for (let i = 0; i < startingDay; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="border-r border-b border-gray-200"></div>);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayLeaves = leaves.filter(leave => {
        const startDate = new Date(leave.startDate);
        const endDate = new Date(leave.endDate);
        // Normalize dates to ignore time component
        startDate.setHours(0,0,0,0);
        endDate.setHours(0,0,0,0);
        currentDay.setHours(0,0,0,0);
        return currentDay >= startDate && currentDay <= endDate;
    });

    calendarCells.push(
      <div key={day} className="border-r border-b border-gray-200 p-2 min-h-[120px] flex flex-col relative">
        <span className="font-medium text-sm text-gray-800">{day}</span>
        <div className="mt-1 space-y-1 overflow-y-auto">
            {dayLeaves.map(leave => (
                <div key={leave.id} title={`${getEmployeeName(leave.employeeId)} - ${leave.leaveType}`} className={`p-1 rounded text-xs truncate ${getLeaveTypeColor(leave.leaveType)}`}>
                    {getEmployeeName(leave.employeeId)}
                </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-on-surface">
                {currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center space-x-2">
                <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ChevronLeftIcon className="h-5 w-5 text-subtle" />
                </button>
                <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ChevronRightIcon className="h-5 w-5 text-subtle" />
                </button>
            </div>
        </div>
        <div className="grid grid-cols-7 border-t border-l border-gray-200 bg-white">
            {daysOfWeek.map(day => (
                <div key={day} className="text-center font-semibold text-xs text-subtle py-2 border-r border-b bg-gray-50 uppercase">{day}</div>
            ))}
            {calendarCells}
        </div>
    </div>
  );
};

export default LeaveCalendar;
