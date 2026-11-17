import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CardSignUp } from "@/components/CardSignUp";
import { Navbar1 } from "@/components/Navbar";
import { Backdrop, DotTitle } from "@/components/brand/Backdrop";
import { authOptions } from "@/lib/AuthOption";
import { getDictionary } from "@/i18n/server";

export const metadata: Metadata = { title: "Sign in" };

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (session) redirect("/locale/dashboard");
  const { error } = await searchParams;
  const { t } = await getDictionary();

  return (
    <>
      <Navbar1 />
      <main id="main" tabIndex={-1} className="relative isolate flex min-h-[calc(100svh-5rem)] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center">
        <Backdrop />
        <DotTitle className="text-[clamp(3.5rem,11vw,8rem)]">{t.auth.title}</DotTitle>
        <p className="mt-6 mb-10 max-w-md text-lg text-ink/85">
          {t.auth.lead}
        </p>
        <CardSignUp error={error} />
      </main>
    </>
  );
}
