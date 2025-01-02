import React from 'react';
import { List, Typography, Button, Tooltip } from 'antd';
import { Check, Trash2, ArrowRight } from 'lucide-react';
import { Notification } from '../../types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate?: (link: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onNavigate
}) => {
  const getTypeColor = (type: Notification['type']) => {
    const colors = {
      info: 'bg-blue-50 border-blue-200',
      success: 'bg-green-50 border-green-200',
      warning: 'bg-amber-50 border-amber-200',
      error: 'bg-red-50 border-red-200'
    };
    return colors[type];
  };

  return (
    <List.Item
      className={`${!notification.read ? getTypeColor(notification.type) : ''} 
        border rounded-lg p-3 mb-2 transition-all hover:shadow-sm`}
    >
      <div className="w-full">
        <div className="flex justify-between items-start mb-1">
          <Typography.Text strong>{notification.title}</Typography.Text>
          <div className="flex items-center gap-1">
            {!notification.read && (
              <Tooltip title="Marquer comme lu">
                <Button
                  type="text"
                  size="small"
                  icon={<Check className="w-4 h-4" />}
                  onClick={() => onMarkAsRead(notification.id)}
                />
              </Tooltip>
            )}
            <Tooltip title="Supprimer">
              <Button
                type="text"
                size="small"
                danger
                icon={<Trash2 className="w-4 h-4" />}
                onClick={() => onDelete(notification.id)}
              />
            </Tooltip>
          </div>
        </div>
        <Typography.Text className="text-gray-600 block mb-2">
          {notification.description}
        </Typography.Text>
        <div className="flex justify-between items-center">
          <Typography.Text className="text-xs text-gray-500">
            Il y a {notification.time}
          </Typography.Text>
          {notification.link && (
            <Button
              type="link"
              size="small"
              className="flex items-center gap-1 p-0"
              onClick={() => onNavigate?.(notification.link!)}
            >
              Voir <ArrowRight className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </List.Item>
  );
};

export default NotificationItem;