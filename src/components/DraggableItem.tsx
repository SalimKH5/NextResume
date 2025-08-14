"use client";
import React, { useEffect } from "react";
import { useDragDrop } from "./DraggableContext";

type Props = {
  id: string;
  component: React.ReactNode;
  children: React.ReactNode;
  DisplayComponent?: boolean;
};

export default function DraggableItem({
  id,
  component,
  children,
  DisplayComponent = false,
}: Props) {
  const { registerComponent, handleDragStart } = useDragDrop();

  useEffect(() => {
    // Enregistre le composant dans le contexte avec l'id
    registerComponent(id, component);
  }, [id, component, registerComponent]);

  const onDragStart = (e: React.DragEvent) => {
    handleDragStart(e, id);
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      style={
        DisplayComponent
          ? {
              padding: 10,
              margin: 10,
              backgroundColor: "transparent",
              color: "#005eb6",
              cursor: "grab",
              userSelect: "none",
              width: 150,
              textAlign: "center",
            }
          : undefined
      }
      className={ `${DisplayComponent?"text-[#005eb6]": ""}`}
    >
      {DisplayComponent ? component : children}
    </div>
  );
}
