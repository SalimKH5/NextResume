import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SidebarAccount from "@/components/SidebarAccount";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { authOptions } from "@/lib/AuthOption";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/Auth");

  return (
    <SidebarProvider>
      <SidebarAccount />
      <div className="relative isolate min-h-svh w-full">
        {/* quiet echo of the hero: glow in the top-right corner */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_90%_0%,rgba(23,226,165,0.14),transparent_35%)]"
        />
        <div className="flex h-14 items-center px-4 md:hidden">
          <SidebarTrigger />
        </div>
        <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-6 sm:px-8 md:pt-16">{children}</main>
      </div>
    </SidebarProvider>
  );
}
