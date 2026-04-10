import { useState } from "react";
import { useSetFirebaseUser, useSetUser, useSetLoading, useSetAuthError, useSetAuthenticated, useAuthUI } from "@/stores/useAuthHooks";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Sparkles, Mail, Lock, User, Eye, EyeOff, X, Camera, Github } from "lucide-react";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { userService } from "@/services/userService";
import { getFirebaseErrorMessage } from "@/services/errorHandler";
import { toast, Toaster } from "sonner";
import { EmailVerificationCard } from "./EmailVerificationCard";

type AuthStep = "signin" | "signup" | "verify-email" | "forgot-password";

interface AuthPageProps {
  theme: 'light' | 'dark';
  onLogin?: () => void;
}

export function AuthPage({ theme, onLogin }: AuthPageProps) {
  const setFirebaseUser = useSetFirebaseUser();
  const setUser = useSetUser();
  const setLoading = useSetLoading();
  const setAuthError = useSetAuthError();
  const setAuthenticated = useSetAuthenticated();
  const { authError, isLoading } = useAuthUI();

  const [step, setStep] = useState<AuthStep>("signin");
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

  // Fetch user profile with backend API after email verification
  const fetchUserProfile = async (firebaseUser: typeof auth.currentUser) => {
    if (!firebaseUser?.email) return;

    try {
      setLoading(true);

      // Call GET /api/v1/user/me to fetch user profile
      const user = await userService.getProfile();

      setUser(user);
      setAuthenticated(true);
      setAuthError(null);

      // Call the onLogin callback if provided
      if (onLogin) {
        onLogin();
      }
    } catch (error: any) {
      const message = error.message || "Failed to fetch user profile";
      setAuthError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile photo
  const removeProfilePhoto = () => {
    setProfilePhoto(null);
    setProfilePhotoPreview(null);
  };

  // Create user profile on signup
  const createUserProfile = async (firebaseUser: typeof auth.currentUser) => {
    if (!firebaseUser?.email) return;

    try {
      // Call PUT /api/v1/user/me to create user profile
      await userService.createProfile({
        email: firebaseUser.email,
        name: firebaseUser.displayName || "User",
        profilePhoto: profilePhoto || undefined,
      });
    } catch (error: any) {
      throw error;
    }
  };

  // Handle OAuth login (Google/GitHub) - creates or syncs user profile
  const handleOAuthLogin = async (firebaseUser: typeof auth.currentUser) => {
    if (!firebaseUser?.email) {
      setAuthError("Email is required. Please ensure your provider has a public email.");
      toast.error("Email is required. Please ensure your provider has a public email.");
      return;
    }

    try {
      setLoading(true);
      setAuthError(null);

      // Set Firebase user in store so API can get the token
      setFirebaseUser(firebaseUser);

      // Call PUT /api/v1/user/me to create or get user profile
      const user = await userService.syncOrCreateProfile({
        email: firebaseUser.email,
        name: firebaseUser.displayName || "User",
      });

      // Update user in store
      setUser(user);
      setAuthenticated(true);
      setAuthError(null);

      toast.success(`Welcome back, ${user.name}! 🎉`);

      // Call the onLogin callback if provided
      if (onLogin) {
        onLogin();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || getFirebaseErrorMessage(error);
      setAuthError(message);
      toast.error(message);
      console.error('OAuth login error:', error.response?.data || error.message);
      setFirebaseUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Sign in with Google
  const handleSigninWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await handleOAuthLogin(userCredential.user);
    } catch (error: any) {
      let message = getFirebaseErrorMessage(error);
      
      // Handle account-exists-with-different-credential error
      if (error.code === 'auth/account-exists-with-different-credential') {
        message = 'This email is already linked to GitHub. Please sign in with GitHub instead.';
      }
      
      setAuthError(message);
      toast.error(message);
    }
  };

  // Sign in with GitHub
  const handleSigninWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      // Request email scope - GitHub doesn't provide public email by default
      provider.addScope('user:email');
      const userCredential = await signInWithPopup(auth, provider);
      await handleOAuthLogin(userCredential.user);
    } catch (error: any) {
      let message = getFirebaseErrorMessage(error);
      
      // Handle account-exists-with-different-credential error
      if (error.code === 'auth/account-exists-with-different-credential') {
        message = 'This email is already linked to Google. Please sign in with Google instead.';
      }
      
      setAuthError(message);
      toast.error(message);
    }
  };

  // Sign Up with Email/Password
  const handleSignupWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.name) {
      setAuthError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setAuthError(null);

      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Set Firebase user in store so API can get the token
      setFirebaseUser(userCredential.user);

      // Update profile name
      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      // Create user profile in backend
      await createUserProfile(userCredential.user);

      // Send verification email
      await sendEmailVerification(userCredential.user);

      // Sign out the user immediately after signup
      await signOut(auth);
      setFirebaseUser(null);

      toast.success("Account created successfully! 🎉", {
        description: `Verification link sent to ${formData.email}. Please check your inbox and verify your email to sign in.`,
        duration: 5000, // Show for 5 seconds
      });

      // Clear form and stay on signin (don't change step)
      setFormData({ name: "", email: "", password: "" });
      setProfilePhoto(null);
      setProfilePhotoPreview(null);
      setIsSignIn(true);
    } catch (error: any) {
      const message = getFirebaseErrorMessage(error);
      setAuthError(message);
      toast.error(message);
      // Clear Firebase user on error
      setFirebaseUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Sign In with Email/Password
  const handleSigninWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setAuthError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setAuthError(null);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        // Email not verified - show verification card
        setFirebaseUser(userCredential.user);
        setStep("verify-email");
        toast.warning("Email not verified", {
          description: "Check your email for the verification link.",
        });
      } else {
        // Email is verified - proceed with fetching user profile
        setFirebaseUser(userCredential.user);
        await fetchUserProfile(userCredential.user);
      }

      // Clear form
      setFormData({ name: "", email: "", password: "" });
    } catch (error: any) {
      const message = getFirebaseErrorMessage(error);
      setAuthError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (isSignIn) {
      handleSigninWithEmail(e);
    } else {
      handleSignupWithEmail(e);
    }
  };

  // Handle forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!forgotPasswordEmail) {
      setAuthError("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      setAuthError(null);

      await sendPasswordResetEmail(auth, forgotPasswordEmail);

      toast.success("Password reset link sent!", {
        description: `Check your email at ${forgotPasswordEmail} for the password reset link.`,
        duration: 5000,
      });

      // Clear form and go back to signin
      setForgotPasswordEmail("");
      setStep("signin");
    } catch (error: any) {
      const message = getFirebaseErrorMessage(error);
      setAuthError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Render different auth steps
  switch (step) {
    case "verify-email":
      return (
        <>
          <EmailVerificationCard onBackToSignIn={() => setStep("signin")} />
          <Toaster position="top-right" richColors />
        </>
      );

    case "forgot-password":
      return (
        <>
          <div
            className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 py-8 ${
              theme === "dark"
                ? "bg-[#0a0a0f]"
                : "bg-gradient-to-br from-[#E8EAFF] via-[#F5F3FF] to-[#FDF4FF]"
            }`}
          >
            <div className="absolute inset-0 pointer-events-none z-0">
              {theme === "dark" && (
                <div
                  className="absolute inset-0 opacity-[0.02]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "50px 50px",
                  }}
                ></div>
              )}
            </div>

            <Card
              className={`w-full max-w-md z-10 rounded-3xl shadow-2xl backdrop-blur-2xl border transition-all p-8 ${
                theme === "dark"
                  ? "bg-gray-900/80 border-white/10"
                  : "bg-white/80 border-white/60"
              }`}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <h2
                    className={`text-2xl font-bold flex items-center gap-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <Mail className="w-6 h-6" />
                    Reset Password
                  </h2>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                {/* Error Message */}
                {authError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-xs text-red-400">{authError}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      className={`text-xs font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        className={`pl-10 py-4 rounded-xl backdrop-blur-xl transition-all ${
                          theme === "dark"
                            ? "border-white/10 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                            : "border-gray-200/50 bg-white/40 hover:bg-white/60 focus:bg-white/60 placeholder:text-gray-500 focus:border-[#5B6FD8]/50 focus:ring-2 focus:ring-[#5B6FD8]/20"
                        }`}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Send Reset Link Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] hover:from-[#4d5fc7] hover:to-[#6b3eef] text-white font-medium shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </form>

                {/* Back to Sign In */}
                <button
                  type="button"
                  onClick={() => {
                    setStep("signin");
                    setForgotPasswordEmail("");
                    setAuthError(null);
                  }}
                  className={`w-full text-sm font-medium transition-colors ${
                    theme === "dark"
                      ? "text-purple-400 hover:text-purple-300"
                      : "text-[#5B6FD8] hover:text-[#7C4DFF]"
                  }`}
                >
                  ← Back to Sign In
                </button>
              </div>
            </Card>
          </div>
          <Toaster position="top-right" richColors />
        </>
      );

    default:
      return (
        <>
        <div
          className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 py-8 ${
            theme === "dark"
              ? "bg-[#0a0a0f]"
              : "bg-gradient-to-br from-[#E8EAFF] via-[#F5F3FF] to-[#FDF4FF]"
          }`}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Subtle grid pattern overlay */}
            {theme === "dark" && (
              <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              ></div>
            )}

            {/* Gradient overlays */}
            <div
              className={`absolute inset-0 ${
                theme === "dark"
                  ? "bg-gradient-to-br from-[#1a1a2e]/30 via-transparent to-transparent"
                  : ""
              }`}
            ></div>

            <div
              className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
                theme === "dark"
                  ? "bg-gradient-to-br from-purple-600/20 to-blue-600/10"
                  : "bg-gradient-to-br from-purple-400/10 to-purple-300/5"
              }`}
            ></div>
            <div
              className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
                theme === "dark"
                  ? "bg-gradient-to-br from-purple-600/20 to-[#7C4DFF]/10"
                  : "bg-gradient-to-br from-purple-400/10 to-purple-300/5"
              }`}
              style={{ animationDelay: "2s" }}
            ></div>

            {/* Diagonal accent */}
            {theme === "dark" && (
              <div className="absolute top-0 right-0 w-full h-full">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-purple-600/5 to-transparent rotate-12 transform translate-x-1/3 -translate-y-1/3 blur-2xl"></div>
              </div>
            )}
          </div>

          {/* Main Auth Card */}
          <div className="relative z-10 w-full max-w-md px-6">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5B6FD8] to-[#7C4DFF] flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/30 group-hover:scale-105 transition-all duration-300">
                  <Sparkles className="w-8 h-8 text-white drop-shadow-md" />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="text-center mb-6">
              <h1
                className={`text-3xl font-bold mb-1 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Welcome to Zenno
              </h1>
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {isSignIn
                  ? "Sign in to access your developer analytics"
                  : "Create your account to get started"}
              </p>
            </div>

            {/* Auth Card */}
            <Card
              className={`p-5 rounded-3xl shadow-2xl backdrop-blur-2xl border transition-all ${
                theme === "dark"
                  ? "bg-gray-900/80 border-white/10"
                  : "bg-white/80 border-white/60"
              }`}
            >
              {/* Toggle Tabs */}
              <div
                className={`flex rounded-2xl p-1 mb-4 ${
                  theme === "dark" ? "bg-white/5" : "bg-gray-100/80"
                }`}
              >
                <button
                  onClick={() => {
                    setIsSignIn(true);
                    setStep("signin");
                  }}
                  className={`flex-1 py-1.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                    isSignIn
                      ? "bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] text-white shadow-lg"
                      : theme === "dark"
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsSignIn(false);
                    setStep("signup");
                  }}
                  className={`flex-1 py-1.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                    !isSignIn
                      ? "bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] text-white shadow-lg"
                      : theme === "dark"
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Error Message */}
              {authError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-xs text-red-400">{authError}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-2.5">
                {/* Profile Photo (Only for Signup) */}
                {!isSignIn && (
                  <div className="flex justify-center mb-2">
                    <div className="relative">
                      {/* Profile Photo Circle */}
                      <div
                        className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 cursor-pointer transition-all hover:opacity-80 ${
                          theme === "dark"
                            ? "bg-white/10 border-white/20 hover:border-white/40"
                            : "bg-gray-100/50 border-gray-200 hover:border-[#5B6FD8]/50"
                        }`}
                        onClick={() => document.getElementById("profilePhotoInput")?.click()}
                      >
                        {profilePhotoPreview ? (
                          <img
                            src={profilePhotoPreview}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1">
                            <Camera className={`w-6 h-6 ${
                              theme === "dark" ? "text-gray-400" : "text-gray-500"
                            }`} />
                            <span className={`text-[10px] font-medium ${
                              theme === "dark" ? "text-gray-400" : "text-gray-600"
                            }`}>
                              Add Photo
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      {profilePhotoPreview && (
                        <button
                          type="button"
                          onClick={removeProfilePhoto}
                          className={`absolute -top-2 -right-2 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all hover:scale-110`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      {/* Hidden File Input */}
                      <input
                        id="profilePhotoInput"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {/* Name Field (Only for Signup) */}
                {!isSignIn && (
                  <div className="space-y-1">
                    <label
                      className={`text-xs font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      />
                      <Input
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className={`pl-10 py-4 rounded-xl backdrop-blur-xl transition-all ${
                          theme === "dark"
                            ? "border-white/10 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                            : "border-gray-200/50 bg-white/40 hover:bg-white/60 focus:bg-white/60 placeholder:text-gray-500 focus:border-[#5B6FD8]/50 focus:ring-2 focus:ring-[#5B6FD8]/20"
                        }`}
                        required={!isSignIn}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-1">
                  <label
                    className={`text-xs font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`pl-10 py-4 rounded-xl backdrop-blur-xl transition-all ${
                        theme === "dark"
                          ? "border-white/10 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                          : "border-gray-200/50 bg-white/40 hover:bg-white/60 focus:bg-white/60 placeholder:text-gray-500 focus:border-[#5B6FD8]/50 focus:ring-2 focus:ring-[#5B6FD8]/20"
                      }`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                  <label
                    className={`text-xs font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={`pl-10 pr-10 py-4 rounded-xl backdrop-blur-xl transition-all ${
                        theme === "dark"
                          ? "border-white/10 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                          : "border-gray-200/50 bg-white/40 hover:bg-white/60 focus:bg-white/60 placeholder:text-gray-500 focus:border-[#5B6FD8]/50 focus:ring-2 focus:ring-[#5B6FD8]/20"
                      }`}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                        theme === "dark"
                          ? "text-gray-400 hover:text-gray-300"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password (Only for Login) */}
                {isSignIn && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep("forgot-password")}
                      className={`text-xs font-medium transition-colors ${
                        theme === "dark"
                          ? "text-purple-400 hover:text-purple-300"
                          : "text-[#5B6FD8] hover:text-[#7C4DFF]"
                      }`}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#5B6FD8] to-[#7C4DFF] hover:from-[#4d5fc7] hover:to-[#6b3eef] text-white font-medium shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "Loading..."
                    : isSignIn
                    ? "Sign In"
                    : "Create Account"}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-2">
                <div
                  className={`absolute inset-0 flex items-center ${
                    theme === "dark" ? "opacity-20" : "opacity-100"
                  }`}
                >
                  <div
                    className={`w-full border-t ${
                      theme === "dark" ? "border-white/10" : "border-gray-200"
                    }`}
                  ></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span
                    className={`px-2 ${
                      theme === "dark"
                        ? "bg-gray-900/80 text-gray-400"
                        : "bg-white/80 text-gray-500"
                    }`}
                  >
                    Or continue with
                  </span>
                </div>
              </div>

              {/* OAuth Buttons */}
              <div className="flex gap-3 mt-2">
                <Button
                  type="button"
                  onClick={handleSigninWithGoogle}
                  disabled={isLoading}
                  variant="outline"
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    theme === "dark"
                      ? "border-white/10 hover:bg-white/5"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button
                  type="button"
                  onClick={handleSigninWithGithub}
                  disabled={isLoading}
                  variant="outline"
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    theme === "dark"
                      ? "border-white/10 hover:bg-white/5"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </div>
            </Card>

            {/* Footer */}
            <div className="mt-5 text-center">
              <p
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {isSignIn ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsSignIn(!isSignIn)}
                  className={`font-medium transition-colors ${
                    theme === "dark"
                      ? "text-purple-400 hover:text-purple-300"
                      : "text-[#5B6FD8] hover:text-[#7C4DFF]"
                  }`}
                >
                  {isSignIn ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>

        <Toaster position="top-right" richColors />
        </>
      );
  }
}