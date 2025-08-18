"use client";

import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";

import {
  Accordion,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDragDrop } from "./DraggableContext";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

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
  menu = [
    { title: "Home", url: "/" },

  ],
  auth = {
    login: { title: "Login", url: "/Auth" },
    signup: { title: "Sign up", url: "#" },
  },
}: Navbar1Props) => {
  const { containerRef } = useDragDrop();


const generatePdf = async () => {
  if (!containerRef.current) return;

  // 1️⃣ Ensure all images are CORS-safe
  const images = containerRef.current.querySelectorAll("img");
  images.forEach((img) => {
    img.setAttribute("crossorigin", "anonymous");
  });

  // Wait until all images are loaded
  await Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalHeight !== 0) return resolve();
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );

  // 2️⃣ Hide non-print elements
  const elementsToHide = containerRef.current.querySelectorAll(".no-print, #page-header");
  elementsToHide.forEach((el) => {
    (el as HTMLElement).style.display = "none";
  });

  // 3️⃣ Remove gap in template
  const templateEl = containerRef.current.querySelector("#template") as HTMLElement | null;
  const originalGap = templateEl?.style.gap || "";
  if (templateEl) templateEl.style.gap = "0";

  // 🔥 3.5️⃣ Sanitize unsupported CSS color functions (oklch, lab)
  const sanitizeColors = (element: HTMLElement) => {
    element.querySelectorAll("*").forEach((el) => {
      const style = window.getComputedStyle(el);
      const target = el as HTMLElement;

      if (style.color.includes("oklch") || style.color.includes("lab")) {
        target.style.color = "#000"; // fallback to black
      }
      if (style.backgroundColor.includes("oklch") || style.backgroundColor.includes("lab")) {
        target.style.backgroundColor = "#fff"; // fallback to white
      }
      if (style.borderColor.includes("oklch") || style.borderColor.includes("lab")) {
        target.style.borderColor = "#000"; // fallback to black
      }
    });
  };

  

  // 4️⃣ HTML2PDF options
  const opt = {
    margin: 0,
    filename: "salim-khadir-resume.pdf",
    image: { type: "png", quality: 0.98 },
     html2canvas: {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: "#ffffff",
    onclone: (clonedDoc: Document) => {
      sanitizeColors(clonedDoc.body as HTMLElement);
    },
  },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  const html2pdf = (await import("html2pdf.js")).default;

  try {
    await html2pdf().from(containerRef.current).set(opt).save();
  } finally {
    // Restore hidden elements & styles
    if (templateEl) templateEl.style.gap = originalGap;
    elementsToHide.forEach((el) => {
      (el as HTMLElement).style.display = "";
    });
  }
};






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
             <div
                  className=" w-16 h-9 bg-white animate-pulse  cursor-pointer p-2 rounded-xl" 
                >
                </div>
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
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <a href={logo.url} className="flex items-center gap-2">
                      <img src={logo.src} className="max-h-8" alt={logo.alt} />
                    </a>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) => renderMobileMenuItem(item))}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    <Button className="cursor-pointer" onClick={generatePdf}>
                      download pdf
                    </Button>
                    <Button asChild variant="outline">
                      <a href={auth.login.url}>{auth.login.title}</a>
                    </Button>
                    <Button asChild>
                      <a href={auth.signup.url}>{auth.signup.title}</a>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
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
