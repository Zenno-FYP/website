import { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';

/**
 * Handle API errors and return user-friendly messages
 */
export const handleApiError = (error: AxiosError): string => {
  if (error.response?.status === 401) {
    return 'Authentication failed. Please login again.';
  }

  if (error.response?.status === 400) {
    const data = error.response.data as any;
    return data?.message || 'Invalid request. Please check your information.';
  }

  if (error.response?.status === 404) {
    return 'User profile not found.';
  }

  if (error.response?.status === 500) {
    return 'Server error. Please try again later.';
  }

  if (error.message === 'Network Error') {
    return 'Network error. Please check your connection.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
};

/**
 * Firebase error code to message mapping
 */
const firebaseErrorMap: Record<string, string> = {
  'auth/user-not-found': 'User not found. Please sign up first.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/email-already-in-use': 'Email already registered. Please sign in instead.',
  'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many login attempts. Please try again later.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/operation-not-allowed': 'This operation is not allowed.',
  'auth/user-disabled': 'This user account has been disabled.',
};

/**
 * Get user-friendly Firebase error message
 */
export const getFirebaseErrorMessage = (error: FirebaseError | Error): string => {
  const firebaseError = error as FirebaseError;
  if (firebaseError.code && firebaseError.code in firebaseErrorMap) {
    return firebaseErrorMap[firebaseError.code];
  }
  return firebaseError.message || 'Authentication failed. Please try again.';
};
