"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export function CardSignUp({ error }: { error?: string }) {
  const [pending, setPending] = useState(false);
  const { t } = useI18n();
  const errors = t.auth.errors as Record<string, string>;
  const message = error ? errors[error] ?? errors.default : null;

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
        {t.auth.google}
      </button>
      <p className="mt-4 text-sm text-muted-foreground">
        {t.auth.privacy}
      </p>
    </div>
  );
}
