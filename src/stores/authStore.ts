import { create } from 'zustand';
import { User as FirebaseUser, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { userService, User } from '@/services/userService';
import { handleApiError } from '@/services/errorHandler';
import { AxiosError } from 'axios';

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
  clearAuth: () => void;

  // Async actions
  syncUserProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  firebaseUser: null,
  isLoading: false,
  isAuthenticated: false,
  authError: null,
  emailVerificationSent: false,
  isCheckingAuth: false,

  // Simple actions
  setUser: (user) => set({ user }),
  setFirebaseUser: (firebaseUser) => set({ firebaseUser }),
  setLoading: (isLoading) => set({ isLoading }),
  setAuthError: (error) => set({ authError: error }),
  setEmailVerificationSent: (sent) => set({ emailVerificationSent: sent }),
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),

  clearAuth: () =>
    set({
      user: null,
      firebaseUser: null,
      isAuthenticated: false,
      authError: null,
      emailVerificationSent: false,
    }),

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
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
