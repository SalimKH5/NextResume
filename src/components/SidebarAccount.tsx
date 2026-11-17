"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FileText, LogOut, UserRound } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "./brand/Logo";

const items = [
  { title: "My resumes", url: "/locale/dashboard", icon: FileText },
  { title: "Profile", url: "/locale/edit-profile", icon: UserRound },
];

export default function SidebarAccount() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const name = [session?.user?.firstName, session?.user?.lastName].filter(Boolean).join(" ");

  return (
    <Sidebar>
      <SidebarHeader className="px-5 pt-6 pb-8">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="px-3">
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const active = pathname === item.url;
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  className="h-11 rounded-none border-l-2 border-transparent pl-3 text-[0.95rem] data-[active=true]:border-mint data-[active=true]:bg-mint-wash data-[active=true]:font-medium"
                >
                  <Link href={item.url} aria-current={active ? "page" : undefined}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-line p-5">
        {name && <p className="truncate text-sm font-medium">{name}</p>}
        {session?.user?.email && (
          <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
        )}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-3 inline-flex items-center gap-2 self-start text-sm text-muted-foreground hover:text-ink"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
