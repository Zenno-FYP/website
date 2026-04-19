import { useEffect, useRef, useCallback } from 'react';
import { getToken, deleteToken } from 'firebase/messaging';
import { messagingPromise } from '@/lib/firebase';
import { registerFcmDevice, unregisterFcmDevice } from '@/services/api';
import { useFirebaseUser } from '@/stores/useAuthHooks';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

export function useFcmToken(pushEnabled: boolean) {
  const firebaseUser = useFirebaseUser();
  const tokenRef = useRef<string | null>(null);

  const register = useCallback(async () => {
    try {
      const messaging = await messagingPromise;
      if (!messaging || !VAPID_KEY) return;

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: swReg,
      });

      if (token && token !== tokenRef.current) {
        if (tokenRef.current) {
          await unregisterFcmDevice(tokenRef.current).catch(() => {});
        }
        await registerFcmDevice(token, 'web', navigator.userAgent.slice(0, 80));
        tokenRef.current = token;
      }
    } catch (err) {
      console.warn('FCM token registration failed', err);
    }
  }, []);

  const unregister = useCallback(async () => {
    try {
      if (tokenRef.current) {
        await unregisterFcmDevice(tokenRef.current).catch(() => {});
        tokenRef.current = null;
      }
      const messaging = await messagingPromise;
      if (messaging) {
        await deleteToken(messaging).catch(() => {});
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!firebaseUser) return;

    if (pushEnabled) {
      void register();
    } else {
      void unregister();
    }
  }, [firebaseUser, pushEnabled, register, unregister]);

  return { register, unregister };
}
