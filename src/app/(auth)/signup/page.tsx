import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";
import { PageTransition } from "@/components/motion/page-transition";

export default function SignupPage() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center px-4 py-12">
      <PageTransition className="w-full max-w-sm space-y-8">
        <div className="space-y-2 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Upcoming
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
          <p className="text-sm text-muted-foreground">
            Start tracking what&apos;s due ahead
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <AuthForm mode="signup" />
        </div>
      </PageTransition>
    </main>
  );
}
