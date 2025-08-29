'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordClient() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const errorParam = searchParams.get('error');

    if (errorParam === 'INVALID_TOKEN') {
      setError(
        'Invalid or expired reset token. Please request a new password reset.'
      );
    } else if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('No reset token found. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('No reset token found');
      return;
    }

    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await authClient.resetPassword({
        newPassword: password,
        token,
      });

      setSuccess(true);
      toast.success('Password reset successfully!');
    } catch (error: any) {
      toast.error(
        error.message || 'Failed to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-foreground">
              Reset Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground/80 text-center">{error}</p>
            <div className="flex flex-col gap-2">
              <Link href="/forgot-password">
                <Button className="w-full">Request New Reset</Button>
              </Link>
              <Link href="/auth">
                <Button
                  variant="outline"
                  className="w-full border-border/50 text-foreground hover:bg-muted"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <CheckCircle className="text-green-500" size={24} />
              Password Reset
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground/80 text-center">
              Your password has been successfully reset!
            </p>
            <p className="text-muted-foreground text-sm text-center">
              You can now sign in with your new password.
            </p>
            <Link href="/auth">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-foreground">
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                New Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your new password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-border"
              />
            </div>

            <p className="text-muted-foreground text-sm">
              Your new password must be at least 8 characters long.
            </p>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : null}
              Reset Password
            </Button>

            <div className="text-center">
              <Link
                href="/auth"
                className="text-muted-foreground hover:text-foreground text-sm underline"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
