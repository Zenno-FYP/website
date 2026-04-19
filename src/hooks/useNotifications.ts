import { useState, useEffect, useCallback, useRef } from 'react';
import { onMessage, type MessagePayload } from 'firebase/messaging';
import { toast } from 'sonner';
import { messagingPromise } from '@/lib/firebase';
import { useFirebaseUser } from '@/stores/useAuthHooks';
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationRead,
  markAllNotificationsRead,
  type NotificationItem,
} from '@/services/api';

export function useNotifications() {
  const firebaseUser = useFirebaseUser();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const unsubRef = useRef<(() => void) | null>(null);

  const refresh = useCallback(async () => {
    if (!firebaseUser) return;
    setLoading(true);
    try {
      const [data, count] = await Promise.all([
        fetchNotifications(1),
        fetchUnreadCount(),
      ]);
      setItems(data.items);
      setUnreadCount(count);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [firebaseUser]);

  const markRead = useCallback(
    async (id: string) => {
      await markNotificationRead(id);
      setItems((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read_at: new Date().toISOString() } : n,
        ),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    },
    [],
  );

  const markAllRead = useCallback(async () => {
    await markAllNotificationsRead();
    setItems((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })),
    );
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Foreground FCM messages
  useEffect(() => {
    if (!firebaseUser) return;

    let cancelled = false;

    messagingPromise.then((messaging) => {
      if (!messaging || cancelled) return;

      const unsub = onMessage(messaging, (payload: MessagePayload) => {
        const { title, body } = payload.notification ?? {};
        if (title) {
          toast(title, { description: body ?? '' });
        }

        const data = payload.data ?? {};
        const item: NotificationItem = {
          _id: data.notificationId ?? '',
          user_id: '',
          type: (data.type as NotificationItem['type']) ?? 'chat_message',
          title: title ?? '',
          body: body ?? '',
          data: data as Record<string, string>,
          read_at: null,
          push_sent_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };

        setItems((prev) => [item, ...prev]);
        setUnreadCount((c) => c + 1);
      });

      unsubRef.current = unsub;
    });

    return () => {
      cancelled = true;
      unsubRef.current?.();
      unsubRef.current = null;
    };
  }, [firebaseUser]);

  return { items, unreadCount, markRead, markAllRead, refresh, loading };
}
