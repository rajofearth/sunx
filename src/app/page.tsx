import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default function Home() {
  return (
    <Suspense fallback={<div>Redirecting...</div>}>
      <HomeRedirect />
    </Suspense>
  );
}

async function HomeRedirect() {
  "use cache: private";

  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/auth");
  } else {
    redirect("/dashboard");
  }

  // This will never be reached due to redirects above
  return null;
}
