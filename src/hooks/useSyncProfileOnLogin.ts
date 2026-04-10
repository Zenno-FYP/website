import { useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useFirebaseUser } from "@/stores/useAuthHooks";

/**
 * Syncs the backend user profile once when a Firebase user becomes available.
 * Place inside a route guard so it runs after auth is confirmed.
 */
export function useSyncProfileOnLogin() {
  const firebaseUser = useFirebaseUser();
  const syncedUidRef = useRef<string | null>(null);

  useEffect(() => {
    if (!firebaseUser) {
      syncedUidRef.current = null;
      return;
    }
    if (syncedUidRef.current === firebaseUser.uid) return;
    syncedUidRef.current = firebaseUser.uid;
    void useAuthStore.getState().syncUserProfile();
  }, [firebaseUser]);
}
