"use client"
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "./ui/button";
import { signOut } from "next-auth/react";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];
const SidebarAccount = () => {
  return (
    <Sidebar className="py-2 h-full flex flex-col">
      <SidebarContent>
        <SidebarGroup  className="py-2 h-full flex flex-col">
          <SidebarGroupLabel className="flex-[0.1]">
            <a
              href="/"
              className="flex h-16 w-24 relative items-center gap-2"
            >
              <Image src="/logo.svg" alt="logo" fill />
            </a>
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex-1">
            <SidebarMenu className="flex flex-col gap-3">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarFooter>
                  <Button className="cursor-pointer" onClick={()=>{
                    signOut()
                  }}>
                      Signout
                  </Button>
          </SidebarFooter>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarAccount;
