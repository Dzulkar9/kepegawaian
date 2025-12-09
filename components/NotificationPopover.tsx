
import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { Page } from '../App';
import { BellIcon } from '../constants';

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  setActivePage: (page: Page) => void;
}

const NotificationPopover: React.FC<NotificationPopoverProps> = ({ isOpen, onClose, setActivePage }) => {
  const { notifications, markAllAsRead } = useNotifications();

  const handleNotificationClick = (link?: Page) => {
    if (link) {
      setActivePage(link);
    }
    onClose();
  };

  if (!isOpen) return null;

  // Format time since notification
  const timeSince = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " tahun lalu";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " bulan lalu";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " hari lalu";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " jam lalu";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " menit lalu";
    return "Baru saja";
  };

  return (
    <div 
        className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface rounded-lg shadow-xl border border-gray-200 z-50"
        onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <h3 className="font-semibold text-on-surface">Notifikasi</h3>
        {notifications.some(n => !n.read) && (
            <button onClick={markAllAsRead} className="text-sm text-primary hover:underline">
                Tandai semua dibaca
            </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif.link)}
              className={`p-3 border-b border-gray-100 flex items-start space-x-3 transition-colors ${notif.link ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            >
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" aria-label="Unread"></div>
              )}
              <div className={notif.read ? 'ml-5' : ''}>
                <p className="text-sm text-on-surface">{notif.message}</p>
                <p className="text-xs text-subtle mt-1">{timeSince(notif.timestamp)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 px-4 text-subtle">
             <BellIcon />
             <p className="mt-2 text-sm">Tidak ada notifikasi baru.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPopover;
