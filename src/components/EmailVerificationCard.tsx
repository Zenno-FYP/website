import { useState } from 'react';
import { useFirebaseUser, useLogout, useSetLoading } from '@/stores/useAuthHooks';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { sendEmailVerification } from 'firebase/auth';
import { toast } from 'sonner';
import { Mail, LogOut } from 'lucide-react';

interface EmailVerificationCardProps {
  onBackToSignIn?: () => void;
}

export const EmailVerificationCard = ({ onBackToSignIn }: EmailVerificationCardProps) => {
  const firebaseUser = useFirebaseUser();
  const logout = useLogout();
  const setLoading = useSetLoading();
  const [isResending, setIsResending] = useState(false);

  const handleResendVerification = async () => {
    if (!firebaseUser) return;

    try {
      setIsResending(true);
      await sendEmailVerification(firebaseUser);
      toast.success('Verification email sent!', {
        description: `Check ${firebaseUser.email} for the verification link.`,
      });
    } catch (error: any) {
      toast.error('Failed to resend verification email', {
        description: error.message,
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignIn = async () => {
    setLoading(true);
    await logout();
    toast.success('Signed out', {
      description: 'Please verify your email and sign in again.',
    });
    if (onBackToSignIn) {
      onBackToSignIn();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-y-auto p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Card className="w-full max-w-md p-6 sm:p-8 border-slate-700">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-center">Verify Your Email</h2>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-slate-400 text-center">
            A verification link has been sent to:
          </p>
          <p className="text-center font-semibold text-slate-200 break-all">
            {firebaseUser?.email}
          </p>
          <p className="text-slate-400 text-center text-sm leading-relaxed">
            Click the link in the email to verify your email address, then sign in again.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleResendVerification}
            disabled={isResending}
            variant="outline"
            className="w-full"
            size="lg"
          >
            {isResending ? 'Sending...' : 'Resend Verification Link'}
          </Button>

          <Button
            onClick={handleBackToSignIn}
            variant="default"
            className="w-full"
            size="lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Back to Sign In
          </Button>
        </div>
      </Card>
    </div>
  );
};

