import { useAuthStore } from './authStore';

/**
 * Custom hooks for auth store - Eliminates selector repetition
 * 
 * Benefits:
 * - Reduces boilerplate: useFirebaseUser() instead of useAuthStore((state) => state.firebaseUser)
 * - Single source of truth for selectors - easier to refactor
 * - Prevents unnecessary re-renders via fine-grained subscriptions
 * - Improves code readability and maintainability
 * 
 * Performance notes:
 * - Each hook subscribes only to the specific state slice it needs
 * - Zustand's default equality check prevents re-renders on unrelated state changes
 * - Composite hooks like useAuthActions consolidate related actions
 * 
 * Usage:
 * ```tsx
 * const firebaseUser = useFirebaseUser();
 * const { logout, syncUserProfile } = useAuthActions();
 * const { isLoading, authError, isCheckingAuth } = useAuthUI();
 * ```
 */

// User and auth state hooks
export const useFirebaseUser = () => useAuthStore((state) => state.firebaseUser);
export const useIsCheckingAuth = () => useAuthStore((state) => state.isCheckingAuth);
export const useUser = () => useAuthStore((state) => state.user);
export const useAuthError = () => useAuthStore((state) => state.authError);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);

// Action hooks
export const useSetFirebaseUser = () => useAuthStore((state) => state.setFirebaseUser);
export const useSetUser = () => useAuthStore((state) => state.setUser);
export const useSetLoading = () => useAuthStore((state) => state.setLoading);
export const useSetAuthError = () => useAuthStore((state) => state.setAuthError);
export const useSetAuthenticated = () => useAuthStore((state) => state.setAuthenticated);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useSyncUserProfile = () => useAuthStore((state) => state.syncUserProfile);

export const useAuthActions = () => {
  const setFirebaseUser = useSetFirebaseUser();
  const setUser = useSetUser();
  const setLoading = useSetLoading();
  const setAuthError = useSetAuthError();
  const logout = useLogout();
  const syncUserProfile = useSyncUserProfile();
  
  return { setFirebaseUser, setUser, setLoading, setAuthError, logout, syncUserProfile };
};

export const useAuthUI = () => {
  const isLoading = useIsLoading();
  const authError = useAuthError();
  const isCheckingAuth = useIsCheckingAuth();
  
  return { isLoading, authError, isCheckingAuth };
};
