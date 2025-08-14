
import NavigationMenuAccount from "@/components/NavigationMenuAccount";
import SidebarAccount from "@/components/SidebarAccount";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { authOptions } from "@/lib/AuthOption";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async  function Layout({ children }: { children: React.ReactNode }) {
   const session = await getServerSession(authOptions);
    if (!session) {
      redirect("/Auth"); // or redirect to "/login"
    }
  return (
    <SidebarProvider>
      <SidebarAccount />
      <main className="w-full h-full px-4 ">
        <SidebarTrigger />
        <main className="w-full flex flex-col  gap-5 justify-center">
          {/* <NavigationMenuAccount /> */}
          {children}
        </main>
      </main>
    </SidebarProvider>
  );
}
