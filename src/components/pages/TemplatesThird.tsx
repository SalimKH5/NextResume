"use client";
import React, { RefObject, useEffect, useRef, useState, useMemo } from "react";
import { useDragDrop } from "../DraggableContext";
import { useI18n } from "@/i18n/I18nProvider";
import DropZone from "../DropZone";
import { GripHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import ResizableImage from "../ResizableImage";
import PersonalInfoDetail from "../PersonalInfoDetail";
import Expriences from "../Expriences";
import { useTextScale } from "@/Hook/useTextScale";

const TemplatesThird = ({
  containerRef,
}: {
  containerRef?: RefObject<HTMLDivElement | null>;
}) => {
  const {
    fontOptions,
    information,
    droppedItems,
    maxPages,
    setMaxPages,
    setDroppedItems,
    setFontOptions,
    checkItemsInPage,
    scale
  } = useDragDrop();
  const { t } = useI18n();

  const containerRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const setContainerRef = (page: number) => (el: HTMLDivElement | null) => {
    containerRefs.current[page] = el;
  };

  const isDragging = useRef(false);
  const [width, setWidth] = useState(0.3);
  const [overflow, setOverflow] = useState(false);
  const [iconX, setIconX] = useState<number | null>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [height, setHeight] = useState(0);
  const { data: session } = useSession();

  const checkOverflow = () => {
    let hasOverflow = false;
    let maxOverflowHeight = 0;

    Object.values(containerRefs.current).forEach((container) => {
      if (!container) return;

      const overflowHeight = container.scrollHeight - container.clientHeight;
      const positiveOverflow = Math.max(overflowHeight, 0);
      if (positiveOverflow > 0) {
        hasOverflow = true;
        maxOverflowHeight = Math.max(maxOverflowHeight, positiveOverflow);
      }
    });

    setOverflow(hasOverflow);
    setHeight(maxOverflowHeight);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;

    // Get any available container div
    const validContainer = Object.values(containerRefs.current).find(
      (ref): ref is HTMLDivElement => !!ref
    );
    if (!validContainer) return;

    const containerRect = validContainer.getBoundingClientRect();

    // Compute new sidebar width as a percentage
    let newWidth = (e.clientX - containerRect.left) / containerRect.width;
    newWidth = Math.max(0.1, Math.min(newWidth, 0.6)); // Clamp between 10% and 60%
    setWidth(newWidth);

    // If resizeRef is defined, update the icon position
    if (resizeRef.current) {
      const resizeRect = resizeRef.current.getBoundingClientRect();
      let relativeX = e.clientX - resizeRect.left;
      relativeX = Math.max(0, Math.min(relativeX, resizeRect.width));
      setIconX(relativeX);
    }

    // Check overflow with slight delay to wait for layout changes
    setTimeout(checkOverflow, 50);
  };

  const onMouseUp = () => {
    isDragging.current = false;
    setIsResizing(false);
    setIconX(null);
  };

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  useEffect(() => {
    const observers: ResizeObserver[] = [];

    Object.values(containerRefs.current).forEach((container) => {
      if (!container) return;
      const observer = new ResizeObserver(() => checkOverflow());
      observer.observe(container);
      observers.push(observer);
    });

    checkOverflow();

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [width, droppedItems, fontOptions, maxPages]);

  const pagesToRender = useMemo(
    () => Array.from({ length: maxPages }, (_, i) => i + 1),
    [maxPages]
  );

  useEffect(() => {
    // 1. Supprime les refs au-delà du nombre de pages actuel
    Object.keys(containerRefs.current).forEach((key) => {
      const page = parseInt(key, 10);
      if (page > maxPages) {
        delete containerRefs.current[page];
      }
    });

    // 2. Met à jour resizeRef pour qu’il pointe vers la dernière page
    const lastPage = pagesToRender[pagesToRender.length - 1];
    const lastContainer = containerRefs.current[lastPage];

    if (lastContainer) {
      const resizeDiv = lastContainer.querySelector("[data-resize-div]");
      if (resizeDiv) {
        resizeRef.current = resizeDiv as HTMLDivElement;
      }
    }
  }, [maxPages, pagesToRender]);

  useEffect(() => {
    const pages = new Set<number>();
    Object.values(droppedItems).forEach((zoneMap) => {
      if (zoneMap && typeof zoneMap === "object") {
        Object.entries(zoneMap).forEach(([pageStr, items]) => {
          const page = parseInt(pageStr, 10);
          if (Array.isArray(items) && items.length > 0) {
            pages.add(page);
          }
        });
      }
    });
    setMaxPages(pages.size > 0 ? Math.max(...pages) : 1);
  }, [droppedItems, width, setMaxPages]);


 

const computedTextSize = (fontOptions?.textSize ?? 14) 

const computedTitleSize = (fontOptions?.titleSize?? 14) 
useEffect(()=>{
console.log({scale});

},[scale])



  return (
    <div   ref={containerRef} id="template" className={`w-[790px] h-auto 
    
       ${scale===0.43? "transform origin-top-left scale-[0.395466] mb-[-678.892px] mr-[-480px]":""}
                    md:transform-none md:scale-100 md:mb-0 md:mr-0
                  
    `}>
      <div  className=" w-full  flex flex-col gap-[0.5px] justify-center items-center">
        {pagesToRender.map((page) => (
          <div
            key={page}
            className="w-full "
          >
            <div
            
              ref={setContainerRef(page)}
              className={`w-[790px] px-0 shadow-2xl bg-white relative flex select-none transition-transform duration-300`}
              style={{
                height: "296.85mm", // A4
                fontSize: computedTextSize,
                fontFamily: fontOptions.font,
                padding: `${fontOptions.paddingVertical}px ${fontOptions.paddingHorizontal}px`,
              }}
            >
              {overflow && (
                <div className="w-full absolute bottom-0 flex flex-col items-center gap-5">
                  <div style={{backgroundColor: "rgba(219, 54, 21, 1)",color:"#ffff"}} className="w-full no-print   text-xs px-2 py-1 text-center">
                    {t.editor.overflow}
                  </div>
                </div>
              )}
              <div className="w-full h-full flex flex-col gap-3">
                 {page === 1 && (
                <div className="flex items-center justify-between gap-1  ">
                  <div className="flex-1 flex flex-col gap-1">
                    <h2 style={{fontSize:computedTitleSize}}>{information.title}</h2>
                    <h2 style={{fontSize:(fontOptions?.titleSize&& computedTitleSize-3)}}>
                      {session?.user?.firstName} {session?.user?.lastName}
                    </h2>
                    <PersonalInfoDetail />
                  </div>
                  <div className="flex  justify-center items-center">
                    {information?.picture?.display && <ResizableImage />}
                  </div>
                </div>)}
                <div className="w-full">
                 <DropZone zoneId="zone-A" page={page} />
                </div>
                
              </div>
            </div>

            {overflow && (
              <div className="w-full md:w-[790px]   no-print relative flex flex-col gap-3">
                <div
                  style={{ height: height }}
                  className="w-full items-start no-print bg-[#f309092b] text-[#FFFF] text-xs px-2 py-1 text-center"
                >
                  {t.editor.overflow}
                </div>
                <div className="z-50 text-[#FFFF] flex items-center justify-center gap-3 text-xs px-2 py-1 w-full text-center">
                  <Button
                    onClick={() =>
                      setFontOptions((prev) => ({
                        ...prev,
                        titleSize: Math.max((prev?.titleSize || 16) - 3, 13),
                        textSize: Math.max((prev?.textSize || 14) - 3, 13),
                        SpaceContent: Math.max(
                          (prev?.SpaceContent || 12) - 3,
                          8
                        ),
                      }))
                    }
                  >
                    {t.editor.shrink}
                  </Button>

                  <Button
                    onClick={() => {
                      const newPage = maxPages + 1;
                      const updated = { ...droppedItems };

                      Object.entries(droppedItems).forEach(
                        ([zoneId, pages]) => {
                          const lastPageItems = pages[maxPages] || [];
                          if (lastPageItems.length > 0) {
                            const moved = lastPageItems.splice(-2, 2);

                            if (!updated[zoneId]) updated[zoneId] = {};
                            if (!updated[zoneId][newPage])
                              updated[zoneId][newPage] = [];

                            updated[zoneId][maxPages] = lastPageItems;
                            updated[zoneId][newPage] = [
                              ...(updated[zoneId][newPage] || []),
                              ...moved,
                            ];
                          }
                        }
                      );

                      setDroppedItems(updated);
                      setMaxPages(newPage);
                      setOverflow(false);
                    }}
                  >
                    {t.editor.addPage}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesThird;
