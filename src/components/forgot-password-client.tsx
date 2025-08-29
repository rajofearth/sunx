'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      setSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    } catch (error) {
      toast.error('Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-foreground">
              Check Your Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground/80 text-center">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-muted-foreground text-sm text-center">
              Click the link in the email to reset your password. The link will
              expire in 1 hour.
            </p>
            <div className="flex flex-col gap-2">
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-2xl max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-foreground">
            Forgot Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-border"
              />
            </div>

            <p className="text-muted-foreground text-sm">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : null}
              Send Reset Link
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
