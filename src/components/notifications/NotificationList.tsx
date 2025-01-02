import React from 'react';
import { List, Button, Empty, Spin } from 'antd';
import { Check } from 'lucide-react';
import { Notification } from '../../types/notification';
import NotificationItem from './NotificationItem';

interface NotificationListProps {
  notifications: Notification[];
  loading?: boolean;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate?: (link: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  onMarkAllAsRead,
  onMarkAsRead,
  onDelete,
  onNavigate
}) => {
  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Spin />
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Aucune notification"
      />
    );
  }

  const hasUnread = notifications.some(n => !n.read);

  return (
    <div className="w-96 max-h-[80vh] overflow-y-auto">
      {hasUnread && (
        <div className="px-4 py-2 border-b">
          <Button
            type="link"
            className="flex items-center gap-1"
            onClick={onMarkAllAsRead}
          >
            <Check className="w-4 h-4" />
            Tout marquer comme lu
          </Button>
        </div>
      )}
      <List
        className="px-4 py-2"
        dataSource={notifications}
        renderItem={(notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
            onDelete={onDelete}
            onNavigate={onNavigate}
          />
        )}
      />
    </div>
  );
};

export default NotificationList;