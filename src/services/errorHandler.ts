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
    const data = error.response.data as { message?: string | string[] };
    const msg = data?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    if (typeof msg === 'string') return msg;
    return 'Invalid request. Please check your information.';
  }

  if (error.response?.status === 403) {
    const data = error.response.data as { message?: string };
    return typeof data?.message === 'string' ? data.message : 'You do not have access to this resource.';
  }

  if (error.response?.status === 404) {
    return 'User profile not found.';
  }

  if (error.response?.status === 409) {
    const data = error.response.data as { message?: string };
    return typeof data?.message === 'string' ? data.message : 'This action conflicts with the current state.';
  }

  if (error.response?.status === 429) {
    return 'Too many requests. Please wait and try again.';
  }

  if (error.response?.status === 500) {
    return 'Server error. Please try again later.';
  }

  if (error.message === 'Network Error') {
    return 'Network error. Check that the API is running and VITE_API_BASE_URL points to the backend (e.g. http://localhost:3000).';
  }

  if (error.code === 'ERR_NO_FIREBASE_USER' || error.code === 'ERR_NETWORK') {
    return error.message;
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
  'auth/account-exists-with-different-credential': 'This email is already linked to a different provider. Please sign in with your original provider instead.',
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
