import MainTemplate from "@/components/MainTemplate";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Navbar1 } from "@/components/Navbar";
import { authOptions } from "@/lib/AuthOption";
import { Suspense } from "react";
import ClientUrlLogger from "@/components/ClientUrlLogger";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/Auth"); // or redirect to "/login"
  }

  return (
    <>
      <Suspense fallback={null}>
        <ClientUrlLogger />
      </Suspense>
      
        <Navbar1 />

      <main className="w-full h-full">
        <MainTemplate />
      </main>
    </>
  );
};

export default page;
