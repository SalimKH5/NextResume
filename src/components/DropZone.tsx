"use client";
import { useCallback, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import DraggableItem from "./DraggableItem";

type DropZoneProps = {
  zoneId: string;
  page?: number;
};

export default function DropZone({ zoneId, page = 1 }: DropZoneProps) {
  const {
    droppedItems,
    handleDrop,
    handleDragOver,
    removeDroppedItem,
    setDroppedItems,
    fontOptions,
  } = useDragDrop();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const zonePages = droppedItems[zoneId] || {};
  const zoneItems = zonePages[page] || [];

  const handleDragStart = (index: number) => (e: React.DragEvent) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDropItem = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedItems = [...zoneItems];
    const [movedItem] = updatedItems.splice(draggedIndex, 1);
    updatedItems.splice(index, 0, movedItem);

    setDroppedItems((prev) => ({
      ...prev,
      [zoneId]: {
        ...prev[zoneId],
        [page]: updatedItems,
      },
    }));

    setDraggedIndex(null);
  };

  const handleDragOverZone = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsHovered(true);
  }, []);

  const handleDragLeaveZone = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleDropZone = (e: React.DragEvent) => {
    handleDrop(e, zoneId, page); // 👈 tu avais oublié `page`
    setIsHovered(false);
  };

  return (
    <div
      onDrop={handleDropZone}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={(e) => {
        handleDragOver(e);
        handleDragOverZone(e);
      }}
      onDragLeave={handleDragLeaveZone}
      style={{
        gap: fontOptions.SpaceContent,
      }}
      className={` min-h-11 relative flex flex-col transition-colors duration-200 ${
        isHovered ? "bg-[#0101010e] shadow-2xl" : ""
      }`}
    >
      {zoneItems.length > 0 ? (
        zoneItems.map((item, index) => (
          <div
            key={item.id + "-" + index}
            draggable
            onDragStart={handleDragStart(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropItem(index)}
            className="relative rounded cursor-move group"
          >
            <DraggableItem key={item.id + "-" + index} component={item.component} id={item.id}   >
                 {item.component}
            </DraggableItem>
           
            {isHovered && (
              <button
                onClick={() => removeDroppedItem(zoneId, page, item.id)} // ✅ page ajouté
                className="absolute top-1 right-1 text-xs bg-red-600 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            )}
          </div>
        ))
      ) : (
        <div className="h-full">
          <p className="text-center text-gray-400"></p>
        </div>
      )}
    </div>
  );
}
