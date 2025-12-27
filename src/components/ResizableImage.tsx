import React, { useRef, useState, useEffect } from "react";

interface ResizableImageProps {
  isPdfMode?: boolean;
}

export default function ResizableImage({
  isPdfMode = false,
}: ResizableImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 100, height: 100 });
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Size constraints
  const MIN_SIZE = 50;
  const MAX_WIDTH = 150;
  const MAX_HEIGHT = 150;

  const startResizing = (e: React.MouseEvent) => {
    if (isPdfMode) return;
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = () => setIsResizing(false);

  const onMouseMove = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current || isPdfMode) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newWidth = e.clientX - rect.left;
    const newHeight = e.clientY - rect.top;

    setSize({
      width: Math.min(Math.max(newWidth, MIN_SIZE), MAX_WIDTH),
      height: Math.min(Math.max(newHeight, MIN_SIZE), MAX_HEIGHT),
    });
  };

  useEffect(() => {
    if (isPdfMode) return;

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopResizing);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, isPdfMode]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => !isPdfMode && setIsHovered(true)}
      onMouseLeave={() => !isPdfMode && setIsHovered(false)}
      className="relative"
      style={{
        width: size.width,
        height: size.height,
        overflow: isPdfMode ? "visible" : "hidden",
      }}
    >
      <img
        src="/profile.jpg"
        alt="Profile"
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          borderRadius: "50%",
          objectFit: isPdfMode ? "contain" : "cover",
        }}
      />

      {!isPdfMode && isHovered && (
        <div
          onMouseDown={startResizing}
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-nwse-resize rounded-full"
        />
      )}
    </div>
  );
}
