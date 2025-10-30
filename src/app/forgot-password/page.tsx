import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import ForgotPasswordClient from "../../components/forgot-password-client";

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordCheck />
    </Suspense>
  );
}

async function ForgotPasswordCheck() {
  "use cache: private";

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session) {
    redirect("/dashboard");
  }

  return <ForgotPasswordClient />;
}
