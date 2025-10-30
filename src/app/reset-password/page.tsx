import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import ResetPasswordClient from "../../components/reset-password-client";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordCheck />
    </Suspense>
  );
}

async function ResetPasswordCheck() {
  "use cache: private";

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session) {
    redirect("/dashboard");
  }

  return <ResetPasswordClient />;
}
