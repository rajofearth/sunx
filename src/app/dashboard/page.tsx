import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { headers } from 'next/headers';

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/auth');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card/50 backdrop-blur-sm border-border/50 rounded-lg p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome, {session.user.name}!
              </h1>
              <p className="text-muted-foreground">
                You are successfully signed in to Sunx
              </p>
            </div>
            <form
              action={async () => {
                'use server';
                await auth.api.signOut({
                  headers: await headers(),
                });
                redirect('/auth');
              }}
            >
              <Button
                type="submit"
                variant="outline"
                className="border-border/50 text-foreground hover:bg-muted"
              >
                Sign Out
              </Button>
            </form>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                User Information
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong>Name:</strong> {session.user.name}
                </p>
                <p>
                  <strong>Email:</strong> {session.user.email}
                </p>
                <p>
                  <strong>User ID:</strong> {session.user.id}
                </p>
                <p>
                  <strong>Email Verified:</strong>{' '}
                  {session.user.emailVerified ? 'Yes' : 'No'}
                </p>
                <p>
                  <strong>Created:</strong>{' '}
                  {new Date(session.user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Session Information
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  <strong>Session ID:</strong> {session.session.id}
                </p>
                <p>
                  <strong>Expires:</strong>{' '}
                  {new Date(session.session.expiresAt).toLocaleString()}
                </p>
                <p>
                  <strong>IP Address:</strong>{' '}
                  {session.session.ipAddress || 'Not available'}
                </p>
                <p>
                  <strong>User Agent:</strong>{' '}
                  {session.session.userAgent || 'Not available'}
                </p>
              </div>
            </div>
          </div>

          {session.user.image && (
            <div className="mt-6 bg-muted/50 rounded-lg p-4 border border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Profile Image
              </h3>
              <img
                src={session.user.image}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-border/50"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
