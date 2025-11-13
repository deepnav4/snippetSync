import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import notificationService from '../lib/notifications';
import type { Notification } from '../lib/notifications';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'upvote': return '👍';
      case 'comment': return '💬';
      case 'follow': return '👤';
      case 'share': return '⚡';
      default: return '🔔';
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-[#B9FF66] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#B9FF66] to-[#a3e655] border-2 border-gray-900 rounded-2xl p-8 mb-8 shadow-[8px_8px_0_#191A23]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2">
                🔔 Notifications
              </h1>
              <p className="text-xl text-gray-800">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You\'re all caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-6 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors border-2 border-gray-900"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-4 mb-6 shadow-[4px_4px_0_#191A23]">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-lg font-bold border-2 border-gray-900 transition-all ${
                filter === 'all'
                  ? 'bg-[#B9FF66] text-gray-900'
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-6 py-3 rounded-lg font-bold border-2 border-gray-900 transition-all ${
                filter === 'unread'
                  ? 'bg-[#B9FF66] text-gray-900'
                  : 'bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-12 text-center shadow-[6px_6px_0_#191A23]">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {filter === 'unread' 
                ? 'You\'ve read all your notifications!' 
                : 'Start creating and sharing snippets to get notifications'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-[4px_4px_0_#191A23] hover:shadow-[6px_6px_0_#191A23] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all ${
                  !notification.read ? 'bg-gradient-to-r from-[#B9FF66] to-white' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className={`w-14 h-14 rounded-full border-2 border-gray-900 flex items-center justify-center text-3xl ${
                      !notification.read ? 'bg-[#B9FF66]' : 'bg-gray-100'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                    <p className="text-lg font-semibold text-gray-900">
                      <Link 
                        to={`/user/${notification.actorUsername}`}
                        className="hover:text-[#B9FF66] transition-colors font-bold"
                      >
                        @{notification.actorUsername}
                      </Link>
                      {' '}{notification.message}
                    </p>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>

                    {notification.snippetId && notification.snippetTitle && (
                      <Link 
                        to={`/snippet/${notification.snippetId}`}
                        className="inline-block mb-3"
                      >
                        <div className="px-4 py-2 bg-gray-50 border-2 border-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                          <span className="text-sm font-semibold text-gray-900">
                            📝 {notification.snippetTitle}
                          </span>
                        </div>
                      </Link>
                    )}

                    <div className="flex gap-3">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="px-4 py-2 bg-[#B9FF66] text-gray-900 font-semibold rounded-lg hover:bg-[#a3e655] transition-colors border-2 border-gray-900 text-sm"
                        >
                          ✓ Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="px-4 py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-900 text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
