import React, { useRef, useState, useEffect } from "react";

export default function ResizableImage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 100, height: 100 });
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Define min/max sizes
  const MIN_SIZE = 50;
  const MAX_WIDTH = 150;
  const MAX_HEIGHT = 150;

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = () => setIsResizing(false);

  const onMouseMove = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newWidth = e.clientX - rect.left;
    const newHeight = e.clientY - rect.top;

    setSize({
      width: Math.min(Math.max(newWidth, MIN_SIZE), MAX_WIDTH),
      height: Math.min(Math.max(newHeight, MIN_SIZE), MAX_HEIGHT),
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative  overflow-hidden"
      style={{ width: size.width, height: size.height }}
    >
      <img
        src="profile.jpg"
        alt="Profile"
        className="rounded-full"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        draggable={false}
      />

      {isHovered && (
        <div
          onMouseDown={startResizing}
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-nwse-resize rounded-full"
        />
      )}
    </div>
  );
}
