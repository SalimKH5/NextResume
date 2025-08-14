import { CardSignUp } from "@/components/CardSignUp";
import { getServerSession } from "next-auth";
import React, { Suspense } from "react";

import { redirect } from "next/navigation";
import { Navbar1 } from "@/components/Navbar";
import { authOptions } from "@/lib/AuthOption";
import ClientUrlLogger from "@/components/ClientUrlLogger";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/"); // or redirect to "/login"
  }
  return (
    <>
      <Suspense fallback={null}>
        <ClientUrlLogger />
      </Suspense>
      <Navbar1 />

      <div className="w-full h-full flex min-h-screen items-center justify-center">
        <CardSignUp />
      </div>
    </>
  );
};

export default page;
