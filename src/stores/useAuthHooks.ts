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
 * - Composite hooks (useAuthState, useAuthActions) are for multiple related subscriptions
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
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsCheckingAuth = () => useAuthStore((state) => state.isCheckingAuth);
export const useUser = () => useAuthStore((state) => state.user);
export const useAuthError = () => useAuthStore((state) => state.authError);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useEmailVerificationSent = () => useAuthStore((state) => state.emailVerificationSent);

// Action hooks
export const useSetFirebaseUser = () => useAuthStore((state) => state.setFirebaseUser);
export const useSetUser = () => useAuthStore((state) => state.setUser);
export const useSetLoading = () => useAuthStore((state) => state.setLoading);
export const useSetAuthError = () => useAuthStore((state) => state.setAuthError);
export const useSetAuthenticated = () => useAuthStore((state) => state.setAuthenticated);
export const useSetEmailVerificationSent = () => useAuthStore((state) => state.setEmailVerificationSent);
export const useClearAuth = () => useAuthStore((state) => state.clearAuth);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useSyncUserProfile = () => useAuthStore((state) => state.syncUserProfile);
export const useInitializeAuth = () => useAuthStore((state) => state.initializeAuth);

// Combined hooks for common use cases
export const useAuthState = () => {
  const firebaseUser = useFirebaseUser();
  const isAuthenticated = useIsAuthenticated();
  const isCheckingAuth = useIsCheckingAuth();
  const user = useUser();
  
  return { firebaseUser, isAuthenticated, isCheckingAuth, user };
};

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
