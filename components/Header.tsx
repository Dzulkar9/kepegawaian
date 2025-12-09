
import React, { useState } from 'react';
import { BellIcon, UserCircleIcon, ArrowLeftOnRectangleIcon } from '../constants';
import { Employee } from '../types';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationPopover from './NotificationPopover';
import { Page } from '../App';

interface HeaderProps {
  currentPage: string;
  onLogoutClick: () => void;
  user: { role: 'admin' } | { role: 'employee', employee: Employee };
  setActivePage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onLogoutClick, user, setActivePage }) => {
  const userName = user.role === 'admin' ? 'Admin' : user.employee.name;
  const userRole = user.role === 'admin' ? 'Administrator' : user.employee.position;
  const { unreadCount } = useNotifications();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  return (
    <header className="h-16 bg-surface flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-200 flex-shrink-0">
      <h1 className="text-xl font-semibold text-on-surface">{currentPage}</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button 
            onClick={() => setIsPopoverOpen(prev => !prev)}
            className="p-2 rounded-full text-subtle hover:bg-gray-100 hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <BellIcon />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 block h-5 w-5 rounded-full ring-2 ring-white bg-red-500 text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationPopover 
            isOpen={isPopoverOpen} 
            onClose={() => setIsPopoverOpen(false)} 
            setActivePage={setActivePage}
          />
        </div>
        <div className="flex items-center">
            {user.role === 'employee' ? (
                <img className="h-8 w-8 rounded-full object-cover" src={user.employee.avatarUrl} alt="Avatar" />
            ) : (
                <UserCircleIcon className="h-8 w-8 text-subtle" />
            )}
            <div className="ml-2 hidden sm:block">
                <p className="text-sm font-medium text-on-surface">{userName}</p>
                <p className="text-xs text-subtle">{userRole}</p>
            </div>
        </div>
        <button 
            onClick={onLogoutClick}
            className="p-2 rounded-full text-subtle hover:bg-gray-100 hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            aria-label="Logout"
            title="Logout"
        >
          <ArrowLeftOnRectangleIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;
