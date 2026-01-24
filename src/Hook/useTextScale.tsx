import { useEffect, useState } from "react";

export function useTextScale() {
  const [scale, setScale] = useState(1);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (locked) return;

    const updateScale = () => {
      setScale(window.innerWidth <= 768 ? 0.6 : 1);
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, [locked]);

  return {
    scale,
    setScale,
    lockScale: () => setLocked(true),
    unlockScale: () => setLocked(false),
  };
}
