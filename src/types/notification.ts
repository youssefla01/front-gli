export interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    link?: string;
  }
  
  export interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
  }