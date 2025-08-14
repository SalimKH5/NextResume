import MainTemplate from "@/components/MainTemplate";
import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";
import { Navbar1 } from "@/components/Navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// In your layout.tsx or root component
import { Poppins } from "next/font/google";
import { Suspense } from "react";
import ClientUrlLogger from "@/components/ClientUrlLogger";

const poppins = Poppins({
  weight: ["400", "600"],
  subsets: ["latin"],
  display: "swap",
});

export default async function Home() {
  return (
    <main className="w-full h-full">
      <Suspense fallback={null}>
        <ClientUrlLogger />
      </Suspense>
      <Navbar1 />

      <section className=" w-full h-screen absolute top-0">
        {/* Background image */}
        <Image
          src="/office.webp"
          alt="office background"
          fill
          className="object-cover opacity-60"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center px-6">
          <div
            className={`text-white text-center max-w-3xl space-y-6 z-20  ${poppins.className}`}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-fade-in">
              Your Dream Resume. Ready in Minutes.
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Drag. Drop. Done. No design skills? No problem. Just add your
              info, and we’ll make it shine.
            </p>

            <Button className=" px-6 py-3 bg-transparent border-white cursor-pointer text-xl font-semibold rounded-xl transition-all">
              Get Started – It’s Free
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
