"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";

const ERRORS: Record<string, string> = {
  OAuthAccountNotLinked:
    "This email is already linked to another sign-in method. Sign in the way you did the first time.",
  SignInError: "Google sign-in didn't complete. Try again.",
};

export function CardSignUp({ error }: { error?: string }) {
  const [pending, setPending] = useState(false);
  const message = error ? ERRORS[error] ?? "Sign-in didn't complete. Try again." : null;

  return (
    <div className="w-full max-w-sm">
      {message && (
        <p role="alert" className="mb-5 border-l-2 border-destructive pl-3 text-sm text-destructive">
          {message}
        </p>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          setPending(true);
          signIn("google", { callbackUrl: "/locale/dashboard" });
        }}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-md border-2 border-ink bg-background text-base font-medium transition-colors hover:bg-mint-wash disabled:opacity-60"
      >
        {pending ? <Loader2 className="size-5 animate-spin" /> : <FcGoogle size={22} />}
        Continue with Google
      </button>
      <p className="mt-4 text-sm text-muted-foreground">
        We only use your name and email to save your resumes.
      </p>
    </div>
  );
}
