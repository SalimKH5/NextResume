import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Delete, Edit} from "lucide-react";
import { useDragDrop } from "./DraggableContext";
import SkillsForm from "./SkillsForm";

const SkillsItem = ({info}:{info:Skills}) => {
   const [hoverCreate, setHoverCreate] = useState(false);
  const { information, setInformations,fontOptions } = useDragDrop();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const deleteItem = () => {
    const infoexpre = information.skills?.filter((ex) => ex.id !== info.id);
    setInformations((prev) => ({
      ...prev,
      skills: infoexpre,
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
      style={{gap:fontOptions.SpaceInside}}
      className={`flex ${fontOptions.displayOneLine?"justify-between items-center":"flex-col"}  relative `}
    >
      {hoverCreate && (
        <div className="absolute -right-1 flex items-center gap-3">
          <Button onClick={deleteItem}>
            <Delete />
          </Button>
          <SkillsForm id={info.id} open={dialogOpen} setOpen={setDialogOpen}>
            <Edit size={16} />
          </SkillsForm>
        </div>
      )}
      <h1 className="font-bold flex-[0.6] ">{info.skill}</h1>
      <div

        className="ProseMirror   flex flex-col flex-1 list-disc px-4"
        dangerouslySetInnerHTML={{ __html: info.subItems }}
      />
    </li>
  );
};

export default SkillsItem
