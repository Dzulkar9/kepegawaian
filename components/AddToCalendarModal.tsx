
import React from 'react';
import { LeaveRequest } from '../types';
import { XMarkIcon, CalendarDaysIcon, ArrowTopRightOnSquareIcon, ArrowUpTrayIcon } from '../constants';

interface AddToCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveRequest: LeaveRequest | null;
  employeeName: string;
}

const AddToCalendarModal: React.FC<AddToCalendarModalProps> = ({ isOpen, onClose, leaveRequest, employeeName }) => {
  if (!isOpen || !leaveRequest) return null;

  const title = `Cuti: ${employeeName} - ${leaveRequest.leaveType}`;
  const details = `Jenis Cuti: ${leaveRequest.leaveType}\nAlasan: ${leaveRequest.reason}\nStatus: Disetujui`;
  
  // Helper for dates
  const startDate = new Date(leaveRequest.startDate);
  const endDate = new Date(leaveRequest.endDate);
  
  // Google Calendar format (YYYYMMDD) - End date must be +1 day for all-day events
  const googleEndDate = new Date(endDate);
  googleEndDate.setDate(googleEndDate.getDate() + 1);
  
  const formatDateGoogle = (date: Date) => date.toISOString().split('T')[0].replace(/-/g, '');
  const googleDates = `${formatDateGoogle(startDate)}/${formatDateGoogle(googleEndDate)}`;
  
  // Outlook format (YYYY-MM-DD)
  const formatDateOutlook = (date: Date) => date.toISOString().split('T')[0];

  const handleGoogleClick = () => {
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&dates=${googleDates}`;
    window.open(url, '_blank');
    onClose();
  };

  const handleOutlookClick = () => {
    const url = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&startdt=${formatDateOutlook(startDate)}&enddt=${formatDateOutlook(endDate)}&subject=${encodeURIComponent(title)}&body=${encodeURIComponent(details)}&allday=true`;
    window.open(url, '_blank');
    onClose();
  };

  const handleIcsDownload = () => {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '') + 'Z';
    const uid = `${leaveRequest.id}-${formatDateGoogle(startDate)}@hris.com`;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HRIS App//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${timestamp}`,
      `DTSTART;VALUE=DATE:${formatDateGoogle(startDate)}`,
      `DTEND;VALUE=DATE:${formatDateGoogle(googleEndDate)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details.replace(/\n/g, '\\n')}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Cuti-${leaveRequest.startDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div 
            className="relative bg-surface rounded-lg shadow-xl w-full max-w-md p-6 text-left transform transition-all"
            onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-semibold text-on-surface flex items-center">
                <CalendarDaysIcon className="mr-2 h-6 w-6 text-primary"/>
                Simpan ke Kalender
            </h3>
            <button onClick={onClose} className="text-subtle hover:text-on-surface">
              <XMarkIcon />
            </button>
          </div>
          
          <p className="text-sm text-subtle mb-6">
            Pilih layanan kalender yang Anda gunakan untuk menyimpan jadwal cuti ini secara otomatis.
          </p>

          <div className="space-y-3">
            <button 
                onClick={handleGoogleClick}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
                <div className="flex items-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Google" className="h-6 w-6 mr-3"/>
                    <span className="font-medium text-on-surface">Google Calendar</span>
                </div>
                <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-400 group-hover:text-primary"/>
            </button>

            <button 
                onClick={handleOutlookClick}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
                <div className="flex items-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" alt="Outlook" className="h-6 w-6 mr-3"/>
                    <span className="font-medium text-on-surface">Outlook / Office 365</span>
                </div>
                <ArrowTopRightOnSquareIcon className="h-5 w-5 text-gray-400 group-hover:text-primary"/>
            </button>

            <button 
                onClick={handleIcsDownload}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
                <div className="flex items-center">
                    <CalendarDaysIcon className="h-6 w-6 mr-3 text-gray-600"/>
                    <span className="font-medium text-on-surface">Download File (.ics)</span>
                </div>
                <ArrowUpTrayIcon className="h-5 w-5 text-gray-400 group-hover:text-primary"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCalendarModal;
