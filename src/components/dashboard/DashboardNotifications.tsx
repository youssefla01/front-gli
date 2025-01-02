import React from 'react';
import { Card, List, Tag, Button } from 'antd';
import { Bell, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../types/notification';

interface DashboardNotificationsProps {
  notifications: Notification[];
}

const DashboardNotifications: React.FC<DashboardNotificationsProps> = ({ notifications }) => {
  const navigate = useNavigate();

  const getTypeConfig = (type: Notification['type']) => {
    const configs = {
      info: { color: 'blue', bg: 'bg-blue-50' },
      success: { color: 'green', bg: 'bg-green-50' },
      warning: { color: 'orange', bg: 'bg-amber-50' },
      error: { color: 'red', bg: 'bg-red-50' },
    };
    return configs[type];
  };

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-900" />
          <span>Notifications récentes</span>
        </div>
      }
      className="h-full"
    >
      <List
        dataSource={notifications}
        renderItem={(notification) => {
          const typeConfig = getTypeConfig(notification.type);
          return (
            <List.Item
              className={`${typeConfig.bg} rounded-lg p-4 mb-2 animate-fade-in`}
            >
              <div className="w-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{notification.title}</span>
                  <Tag color={typeConfig.color}>
                    {notification.time}
                  </Tag>
                </div>
                <p className="text-gray-600 mb-2">{notification.description}</p>
                {notification.link && (
                  <Button
                    type="link"
                    className="p-0 h-auto flex items-center gap-1 text-blue-900"
                    onClick={() => navigate(notification.link!)}
                  >
                    Voir les détails <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

export default DashboardNotifications;