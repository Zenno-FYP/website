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

  // Foreground FCM: toast + re-sync from the API for authoritative rows.
  useEffect(() => {
    if (!firebaseUser) return;

    let cancelled = false;

    void messagingPromise.then((messaging) => {
      if (!messaging || cancelled) return;

      const unsub = onMessage(messaging, (payload: MessagePayload) => {
        const { title, body } = payload.notification ?? {};
        if (title) {
          toast(title, { description: body ?? '' });
        }

        // Always re-sync to get the authoritative record from the backend
        // (avoids guessing user_id / _id on the client).
        void refresh();
      });

      unsubRef.current = unsub;
    });

    return () => {
      cancelled = true;
      unsubRef.current?.();
      unsubRef.current = null;
    };
  }, [firebaseUser, refresh]);

  return { items, unreadCount, markRead, markAllRead, refresh, loading };
}
