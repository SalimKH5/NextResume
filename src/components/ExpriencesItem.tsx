import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Delete, Edit, Plus } from "lucide-react";
import { useDragDrop } from "./DraggableContext";
import ExprienceForm from "./ExprienceForm";
import { format } from "date-fns";
import { fr } from "date-fns/locale"; // Optional: for French month names

const ExpriencesItem = ({ info }: { info: Experience }) => {
  const [hoverCreate, setHoverCreate] = useState(false);
  const { information, setInformations, fontOptions } = useDragDrop();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const deleteItem = () => {
    const infoexpre = information.Expriences?.filter((ex) => ex.id !== info.id);
    setInformations((prev) => ({
      ...prev,
      Expriences: infoexpre,
    }));
  };
  const handleMouseEnter = () => {
    if (!dialogOpen) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setHoverCreate(true);
    }
  };

  const handleMouseLeave = () => {
    if (!dialogOpen) {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoverCreate(false);
      }, 300);
    }
  };
  return (
    <li
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      key={info.id}
      style={{ gap: fontOptions.SpaceInside }}
      className="flex flex-col  px-2 relative "
    >
      {hoverCreate && (
        <div className="absolute -right-6 flex items-center gap-3">
          <Button onClick={deleteItem}>
            <Delete />
          </Button>
          <ExprienceForm id={info.id} open={dialogOpen} setOpen={setDialogOpen}>
            <Edit size={16} />
          </ExprienceForm>
        </div>
      )}
      <div className={`w-full flex ${fontOptions?.diplayDateLine?"items-center justify-between":"flex-col"} `}>
        <h1
          style={{ fontSize: fontOptions.textSize }}
          className="outline-none pl-0 font-bold text-xl border-none focus:border-2 focus:border-black focus-visible:ring-0 w-60"
        >
          {info.title}
        </h1>
        <div className="flex items-center gap-2 px-2 text-xs font-bold ">
          <span>From </span>
          <span>{format(info.date_started, "MMMM yyyy", { locale: fr })}</span>
          <span> to </span>
          <span>
            {info.date_ending === "currently"
              ? info.date_ending
              : format(info.date_ending, "MMMM yyyy", { locale: fr })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 px-2 text-xs text-gray-600">
        <span>{info.entrepriseName}</span>|<span>{info.location}</span>
      </div>

      <div
        className="ProseMirror flex flex-col gap-2 list-disc px-4"
        dangerouslySetInnerHTML={{ __html: info.subItems }}
      />
    </li>
  );
};

export default ExpriencesItem;
