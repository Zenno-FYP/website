import type { User as FirebaseUser } from "firebase/auth";

/**
 * Returns true when the Firebase user's only sign-in provider is email/password.
 * OAuth providers (google, github, etc.) auto-verify the email server side, so we
 * never block them on `emailVerified`.
 */
export function isPasswordOnlyUser(user: FirebaseUser | null | undefined): boolean {
  if (!user) return false;
  if (user.providerData.length === 0) {
    return user.providerId === "password";
  }
  return user.providerData.every((p) => p.providerId === "password");
}

/**
 * True when this Firebase user is signed in with password and has not yet verified
 * their email. We use this to gate API/socket/FCM activity for the unverified state
 * so the EmailVerificationCard can render without backend side effects.
 */
export function needsEmailVerification(user: FirebaseUser | null | undefined): boolean {
  if (!user) return false;
  if (!isPasswordOnlyUser(user)) return false;
  return user.emailVerified !== true;
}
