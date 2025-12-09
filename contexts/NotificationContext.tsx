
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppNotification } from '../types';
import { User } from '../App';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'> & { id?: string }) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
  currentUser: User;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children, currentUser }) => {
  const [allNotifications, setAllNotifications] = useState<AppNotification[]>(() => {
    try {
      const item = window.localStorage.getItem('notifications');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('notifications', JSON.stringify(allNotifications));
    } catch (error) {
      console.error(error);
    }
  }, [allNotifications]);

  const currentUserId = currentUser?.role === 'admin' ? 'admin' : currentUser?.employee.id;

  const userNotifications = allNotifications.filter(n => n.userId === currentUserId);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'> & { id?: string }) => {
    const newNotification: AppNotification = {
      id: notification.id || `notif-${Date.now()}`,
      timestamp: Date.now(),
      read: false,
      ...notification,
    };
    setAllNotifications(prev => [newNotification, ...prev]);
  };

  const markAllAsRead = () => {
    setAllNotifications(prev =>
      prev.map(n => (n.userId === currentUserId ? { ...n, read: true } : n))
    );
  };

  const value = {
    notifications: userNotifications,
    unreadCount,
    addNotification,
    markAllAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
