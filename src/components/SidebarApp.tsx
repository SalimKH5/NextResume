"use client";

import { useEffect, useRef, useState } from "react";
import {
  Inbox,
  Plus,
  ChevronLeft,
  LanguagesIcon,
  Briefcase,
  GraduationCap,
  Lightbulb,
  Option,
  Gamepad,
  BookAIcon
} from "lucide-react";
import PersonalInformation from "./PersonalInformation";
import { useDragDrop } from "./DraggableContext";
import DraggableItem from "./DraggableItem";
import Languges from "./Languges";
import Expriences from "./Expriences";
import Educations from "./Educations";
import Skills from "./Skills";
import Options from "./Options";
import IntersetComponent from "./IntersetComponent";
import TemplateSelector from "./pages/TemplateSelector";

type SubItemType = {
  label: string;
  items: React.ReactNode;
  canBedrop?: boolean;
  icon?: React.ElementType;
};

type SidebarItem = {
  key: string;
  icon: React.ElementType;
  label: string;
  subItems: SubItemType[];
  take_allwith?: boolean;
};

const sidebarItems: SidebarItem[] = [
  {
    key: "inbox",
    icon: Inbox,
    label: "Inbox",
    take_allwith: false,
    subItems: [
      {
        label: "Personal Information",
        items: <PersonalInformation />,
        canBedrop: false
      }
    ]
  },
  {
    key: "templates",
    icon: BookAIcon,
    label: "Templates",
    take_allwith: false,
    subItems: [
      {
        label: "Template Selector",
        items: <TemplateSelector />,
        canBedrop: false
      }
    ]
  },
  {
    key: "option",
    icon: Option,
    label: "Option",
    take_allwith: false,
    subItems: [
      {
        label: "Option",
        items: <Options />,
        canBedrop: false
      }
    ]
  },
  {
    key: "add-block",
    icon: Plus,
    label: "Add a block",
    take_allwith: true,
    subItems: [
      {
        label: "Languages",
        canBedrop: true,
        icon: LanguagesIcon,
        items: <Languges />
      },
      {
        label: "Experiences",
        canBedrop: true,
        icon: Briefcase,
        items: <Expriences />
      },
      {
        label: "Educations",
        canBedrop: true,
        icon: GraduationCap,
        items: <Educations />
      },
      {
        label: "Skills",
        canBedrop: true,
        icon: Lightbulb,
        items: <Skills />
      },
      {
        label: "Interests",
        canBedrop: true,
        icon: Gamepad,
        items: <IntersetComponent />
      }
    ]
  }
];
export default function AppSidebar() {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const { isItemDropped } = useDragDrop();
  const refNavbar = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleSubSidebar = (key: string) => {
    setActiveKey((prev) => (prev === key ? null : key));
  };

  const activeItem = sidebarItems.find((i) => i.key === activeKey) || null;

  useEffect(() => {
    const element = refNavbar.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        console.log("Navbar resized:", entry.contentRect);
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Track scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div
       
        className={`flex fixed min-h-screen z-[9999]  ${isScrolled ? "top-0" : ""}`}
      >
        {/* Main icons column */}
        <div  ref={refNavbar} className="w-16 bg-white flex flex-col items-center py-4 space-y-4 border-r border-2">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => toggleSubSidebar(item.key)}
              className={`p-2 rounded cursor-pointer ${
                activeKey === item.key ? "text-pink-600" : ""
              }`}
            >
              <item.icon size={20} />
            </button>
          ))}
        </div>

        {/* Sub sidebar */}
        {activeItem && (
          <div className="w-60 xl:w-72 bg-white border-r border-zinc-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold uppercase">
                {activeItem.label}
              </span>
              <button
                onClick={() => setActiveKey(null)}
                className="text-zinc-400 hover:text-white"
              >
                <ChevronLeft size={16} />
              </button>
            </div>

            <ul
              className={`space-y-6 ${
                activeItem.take_allwith ? "grid grid-cols-1 xl:grid-cols-2" : ""
              }`}
            >
              {activeItem.subItems.map((sub, index) => {
                const id = `${activeItem.key}-${index}`;
                const alreadyDropped = isItemDropped(id);

                return (
                  <li key={id}>
                    <div className="p-2 rounded">
                      {sub.canBedrop ? (
                        !alreadyDropped ? (
                          <DraggableItem id={id} component={sub.items}>
                            <span className="flex justify-center items-center flex-col gap-2">
                              {sub.icon ? <sub.icon size={20} /> : null}
                              {sub.label}
                            </span>
                          </DraggableItem>
                        ) : (
                          <span className="text-zinc-400 opacity-50">
                            {sub.label} (used)
                          </span>
                        )
                      ) : (
                        sub.items
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
