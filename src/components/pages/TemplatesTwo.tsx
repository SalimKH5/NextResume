"use client";
import React, { RefObject, useEffect, useRef, useState, useMemo } from "react";
import { useDragDrop } from "../DraggableContext";
import DropZone from "../DropZone";
import { GripHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import ResizableImage from "../ResizableImage";
import PersonalInfoDetail from "../PersonalInfoDetail";

const TemplatesTwo = ({
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
    checkItemsInPage
  } = useDragDrop();

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

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDragging.current = true;
    setIsResizing(true);
    if (resizeRef.current) {
      const rect = resizeRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      setIconX(relativeX);
    }
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

  return (
    <div ref={containerRef} id="template" className="w-[790px] h-auto bg-white">
      <div className="w-[790px] flex flex-col gap-[0.5px] justify-center items-center">
        {pagesToRender.map((page) => (
          <div key={page}>
            {page > 1 && (
              <div
                id="page-header"
                className="w-full flex items-center justify-between py-3"
              >
                <h1>Page °{page}</h1>
                <button
                  hidden={checkItemsInPage(page)} 
                  style={{backgroundColor: "rgba(219, 54, 21, 1)"}}

                  className="bg-transparent  hover:none cursor-pointer"
                >
                  Masquer cette page
                </button>
              </div>
            )}
            <div
              ref={setContainerRef(page)}
              className={`w-[790px] px-0 shadow-2xl bg-white relative flex select-none transition-transform duration-300 scale-100`}
              style={{
                height: "296.85mm", // A4
                fontSize: fontOptions.textSize,
                fontFamily: fontOptions.font,
              }}
            >
              {overflow && (
                <div className="w-full absolute bottom-0 flex flex-col items-center gap-5">
                  <div style={{backgroundColor: "rgba(220, 38, 38, 1)"}} className="w-full no-print  text-white text-xs px-2 py-1 text-center">
                    ⚠ Le contenu dépasse la hauteur d’une page A4
                  </div>
                </div>
              )}

              {/* Colonne gauche */}
              <div
                style={{
                  flexBasis: `${width * 100}%`,
                  color: fontOptions.primaryColor,
                  gap: fontOptions.SpaceContent,
                }}
                className="h-full flex flex-col items-center border-r-2"
              >
                {page === 1 && (
                  <div className="relative w-full h-36 p-8 bg-[#F8DEEE] flex items-center justify-center">
                    <div
                      style={{
                        width: `calc(100% - ${fontOptions.paddingHorizontal}px)`,
                      }}
                      className="flex items-center justify-center"
                    >
                      <h1
                        style={{ fontSize: fontOptions.titleSize }}
                        className="text-center font-bold capitalize"
                      >
                        {session?.user?.firstName} {session?.user?.lastName}
                      </h1>
                    </div>

                    <div className="absolute -bottom-2 text-white w-full flex items-center justify-center px-6">
                      <div className="bg-[#3A3538] text-center max-w-64 px-4 py-2">
                        <h1>{information.title}</h1>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className="flex flex-col justify-center items-center px-2 py-2"
                  style={{
                    width: `calc(100% - ${fontOptions.paddingHorizontal}px)`,
                    gap: fontOptions.SpaceContent,
                  }}
                >
                  {page === 1 && (
                    <div className="flex items-center justify-center">
                      {information?.picture?.display && <ResizableImage />}
                    </div>
                  )}

                  <div className="w-full flex flex-col gap-6 px-2">
                    {page === 1 && (
                      <>
                        <div className="w-full p-2">
                          <p>{information.CatchPhrase}</p>
                        </div>
                        <PersonalInfoDetail />
                      </>
                    )}
                    <DropZone zoneId="zone-A" page={page} />
                  </div>
                </div>
              </div>

              {/* Séparateur redimensionnable */}
              <div
                ref={resizeRef}
                onMouseDown={onMouseDown}
                data-resize-div
                style={{
                  width: "1px",
                  cursor: "col-resize",
                  backgroundColor: "#e3e3e3",
                  position: "relative",
                }}
              >
                {isResizing && iconX !== null && (
                  <GripHorizontal
                    size={24}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: iconX,
                      transform: "translate(-50%, -50%)",
                      pointerEvents: "none",
                      color: "#666",
                    }}
                  />
                )}
              </div>

              {/* Colonne droite */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    width: `calc(100% - ${fontOptions.paddingHorizontal}px)`,
                    gap: fontOptions.SpaceContent,
                  }}
                  className="h-full flex flex-col px-6 py-2"
                >
                  <DropZone zoneId="zone-B" page={page} />
                </div>
              </div>
            </div>

            {overflow && (
              <div className="w-[790px] no-print relative flex flex-col gap-3">
                <div
                  style={{ height: height }}
                  className="w-full items-start no-print bg-[#f309092b] text-white text-xs px-2 py-1 text-center"
                >
                  ⚠ Le contenu dépasse la hauteur d’une page A4
                </div>
                <div className="z-50 text-white flex items-center justify-center gap-3 text-xs px-2 py-1 w-full text-center">
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
                    Auto Réduction
                  </Button>

                  <Button
                    onClick={() => {
                      const newPage = maxPages + 1;
                      const updated = { ...droppedItems };

                      Object.entries(droppedItems).forEach(
                        ([zoneId, pages]) => {
                          const lastPageItems = pages[maxPages] || [];
                          if (lastPageItems.length > 0) {
                            const moved = lastPageItems.splice(-1, 1);

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
                    Ajouter une page
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

export default TemplatesTwo;
