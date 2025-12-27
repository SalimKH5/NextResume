"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MdAccountCircle } from "react-icons/md";
import { useDragDrop } from "./DraggableContext";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";
interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar1 = ({
  logo = {
    url: "/",
    src: "/logo.svg",
    alt: "logo",
    title: "CvGenerator",
  },
  menu = [{ title: "Home", url: "/" }],
  auth = {
    login: { title: "Login", url: "/Auth" },
    signup: { title: "Sign up", url: "#" },
  },
}: Navbar1Props) => {
  const { containerRef } = useDragDrop();

    const generatePdf = useReactToPrint({
      contentRef: containerRef,
      documentTitle: "salim-khadir-resume",
    });

  const { data: session, status } = useSession();
  const pathname = usePathname();

  return (
    <section
      suppressHydrationWarning
      className={`w-full bg-transparent ${
        !pathname.includes("/cv-editions") && "sticky"
      } top-0  z-50 py-1 px-6 `}
    >
      <div className="w-full ">
        {/* Desktop Menu */}
        <nav className="w-full  hidden justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a
              href={logo.url}
              className="flex h-16 w-24 relative items-center gap-2"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                className={`${pathname === "/" ? "text-white" : ""}`}
              />
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status === "loading" ? (
              <div className=" w-16 h-9 bg-white animate-pulse  cursor-pointer p-2 rounded-xl"></div>
            ) : status === "authenticated" ? (
              <>
                {pathname.includes("/cv-editions") && (
                  <Button className="cursor-pointer" onClick={generatePdf}>
                    download pdf
                  </Button>
                )}

                <Link
                  href="/locale/dashboard"
                  className="bg-white text-black border-2 cursor-pointer p-2 rounded-xl"
                >
                  <MdAccountCircle size={25} />
                </Link>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    signIn();
                  }}
                  asChild
                  variant="outline"
                  className="cursor-pointer"
                  size="sm"
                >
                  <span>{auth.login.title}</span>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block  lg:hidden">
          <div className="w-full flex items-center justify-between">
            {/* Logo */}
            <a href={logo.url} className="flex items-center gap-2">
              <img src={logo.src} className="max-h-8" alt={logo.alt} />
            </a>
            <div className="flex items-center gap-2">
              {status === "loading" ? (
                <div className=" w-16 h-9 bg-white animate-pulse  cursor-pointer p-2 rounded-xl"></div>
              ) : status === "authenticated" ? (
                <>
                  {pathname.includes("/cv-editions") && (
                    <Button className="cursor-pointer" onClick={generatePdf}>
                      download pdf
                    </Button>
                  )}

                  <Link
                    href="/locale/dashboard"
                    className="bg-white text-black border-2 cursor-pointer p-2 rounded-xl"
                  >
                    <MdAccountCircle size={25} />
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      signIn();
                    }}
                    asChild
                    variant="outline"
                    className="cursor-pointer"
                    size="sm"
                  >
                    <span>{auth.login.title}</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-1 text-sm font-medium transition-colors hover:bg-muted hover:text-accent-foreground"
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="text-md font-semibold">
      {item.title}
    </a>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <a
      className="flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

export { Navbar1 };
