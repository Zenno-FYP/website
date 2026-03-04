import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User as FirebaseUser, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { userService, User } from '@/services/userService';
import { handleApiError } from '@/services/errorHandler';
import { invalidateCacheOnAuthChange } from '@/utils/requestCache';
import { AxiosError } from 'axios';

/**
 * Auth Store - Manages Firebase authentication and user profile state
 * 
 * Performance Optimizations:
 * 1. Actions are inherently memoized - created once and never recreated
 * 2. Selectors in components subscribe only to needed state slices
 * 3. Custom hooks eliminate selector repetition across components
 * 4. Persistence middleware saves state to localStorage for offline support
 * 5. Firebase session restoration via onAuthStateChanged on app init
 * 
 * Usage:
 * - Use custom hooks from useAuthHooks.ts instead of direct selectors
 * - Example: const user = useFirebaseUser() instead of useAuthStore((state) => state.firebaseUser)
 */

export interface AuthState {
  // State
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  emailVerificationSent: boolean;
  isCheckingAuth: boolean;

  // Simple actions
  setUser: (user: User | null) => void;
  setFirebaseUser: (firebaseUser: FirebaseUser | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthError: (error: string | null) => void;
  setEmailVerificationSent: (sent: boolean) => void;
  setAuthenticated: (auth: boolean) => void;
  setCheckingAuth: (checking: boolean) => void;
  clearAuth: () => void;

  // Async actions
  initializeAuth: () => Promise<void>;
  syncUserProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      firebaseUser: null,
      isLoading: false,
      isAuthenticated: false,
      authError: null,
      emailVerificationSent: false,
      isCheckingAuth: true, // Start as true to prevent data fetching before auth is initialized

      // Simple actions
      setUser: (user) => set({ user }),
      setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
      setLoading: (isLoading) => set({ isLoading }),
      setAuthError: (error) => set({ authError: error }),
      setEmailVerificationSent: (sent) => set({ emailVerificationSent: sent }),
      setAuthenticated: (auth) => set({ isAuthenticated: auth }),
      setCheckingAuth: (checking) => set({ isCheckingAuth: checking }),

      clearAuth: () =>
        set({
          user: null,
          firebaseUser: null,
          isAuthenticated: false,
          authError: null,
          emailVerificationSent: false,
        }),

      // Initialize Firebase auth - restores session from browser
      initializeAuth: async () => {
        return new Promise<void>((resolve) => {
          set({ isCheckingAuth: true });
          let timeout: NodeJS.Timeout;
          
          const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            // Clear timeout when auth state changes
            if (timeout) clearTimeout(timeout);
            
            if (firebaseUser) {
              console.log('Firebase user restored from session:', firebaseUser.email);
              set({ 
                firebaseUser, 
                isAuthenticated: true,
                isCheckingAuth: false 
              });
            } else {
              console.log('No Firebase user found in session');
              set({ 
                firebaseUser: null, 
                isAuthenticated: false,
                isCheckingAuth: false 
              });
            }
            
            // Unsubscribe after first check
            unsubscribe();
            resolve();
          });

          // Timeout after 3 seconds to prevent infinite waiting
          timeout = setTimeout(() => {
            console.log('Auth initialization timeout');
            unsubscribe();
            set({ isCheckingAuth: false });
            resolve();
          }, 3000);
        });
      },

      // Sync user profile from backend
      syncUserProfile: async () => {
        try {
          set({ isLoading: true });
          set({ authError: null });

          const user = await userService.getProfile();
          set({
            user,
            isAuthenticated: true,
            authError: null,
          });
        } catch (error) {
          const message =
            error instanceof AxiosError
              ? handleApiError(error)
              : 'Failed to sync user profile';

          set({
            authError: message,
            isAuthenticated: false,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout
      logout: async () => {
        try {
          set({ isLoading: true });

          // Sign out from Firebase
          await signOut(auth);

          // Clear all auth state
          get().clearAuth();

          // Invalidate cached requests that depend on user context
          invalidateCacheOnAuthChange();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-store', // localStorage key
      partialize: (state) => ({
        // Only persist user profile, not firebaseUser (Firebase handles its own session)
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        emailVerificationSent: state.emailVerificationSent,
      }),
    }
  )
);
