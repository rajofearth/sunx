'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { loginEmail } from '@/app/auth/action';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await loginEmail({}, formData);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.success) {
        toast.success('Successfully signed in!');
        router.push('/dashboard');
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
          className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-border"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-foreground">
            Password
          </Label>
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Forgot your password?
          </Link>
        </div>

        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          required
          className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-border"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
        Sign In
      </Button>
    </form>
  );
}
