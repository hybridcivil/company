import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Compass,
  DollarSign,
  FileBox,
  Trash2,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    clearAllNotifications,
    setActiveTab,
  } = useApp();

  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filterMode === 'unread') return !n.read;
    return true;
  });

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'payment_overdue':
        return <AlertCircle className="h-4 w-4 text-rose-500" />;
      case 'payment_due':
        return <DollarSign className="h-4 w-4 text-amber-500" />;
      case 'visit_due':
        return <Compass className="h-4 w-4 text-orange-500" />;
      case 'salary_due':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'correction_pending':
        return <FileBox className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl dark:text-white">
              Engineering Notification Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Section 42: Automated reminders for overdue bills, today&apos;s commitments, site visits, and drawing revisions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearAllNotifications}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <Check className="h-4 w-4 text-emerald-500" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
        <button
          onClick={() => setFilterMode('all')}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
            filterMode === 'all'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilterMode('unread')}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
            filterMode === 'unread'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Unread Alerts ({notifications.filter((n) => !n.read).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 py-12 text-center text-slate-400 dark:border-slate-800">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">All caught up!</p>
            <p className="text-xs text-slate-400 mt-0.5">No pending alerts requiring engineering or billing attention.</p>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (!notif.read) markNotificationRead(notif.id);
                if (notif.linkTab) setActiveTab(notif.linkTab);
              }}
              className={`flex cursor-pointer items-start justify-between rounded-2xl border p-4 transition ${
                notif.read
                  ? 'border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-900/60'
                  : 'border-orange-200 bg-orange-50/50 shadow-xs dark:border-orange-950 dark:bg-orange-950/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl border border-slate-200 bg-white p-2 shrink-0 dark:border-slate-700 dark:bg-slate-800">
                  {getNotifIcon(notif.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs sm:text-sm font-bold ${notif.read ? 'text-slate-800 dark:text-slate-200' : 'text-slate-900 dark:text-white'}`}>
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="flex h-2 w-2 rounded-full bg-orange-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2">
                    Target Date: {notif.date} • {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {!notif.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationRead(notif.id);
                  }}
                  className="rounded-lg p-1 text-slate-400 hover:text-orange-500"
                  title="Mark as Read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
