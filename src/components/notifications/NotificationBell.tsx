import React from 'react';
import { Badge, Popover } from 'antd';
import { Bell } from 'lucide-react';
import NotificationList from './NotificationList';
import { Notification } from '../../types/notification';

interface NotificationBellProps {
  notifications: Notification[];
  loading?: boolean;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate?: (link: string) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  loading,
  onMarkAllAsRead,
  onMarkAsRead,
  onDelete,
  onNavigate
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover
      content={
        <NotificationList
          notifications={notifications}
          loading={loading}
          onMarkAllAsRead={onMarkAllAsRead}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
          onNavigate={onNavigate}
        />
      }
      title="Notifications"
      trigger="click"
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
    >
      <Badge count={unreadCount} offset={[-2, 2]}>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
      </Badge>
    </Popover>
  );
};

export default NotificationBell;