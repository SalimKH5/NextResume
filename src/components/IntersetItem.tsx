import React, { useRef, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import LangugeDialog from "./LangugeDialog";
import { Delete, Edit, Plus } from "lucide-react";
import { Button } from "./ui/button";
import IntersetDialog from "./IntersetDialog";
const IntersetItem = ({ Intersets }: { Intersets: IntersetType }) => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hoverCreate, setHoverCreate] = useState(false);
  const { information, setInformations, fontOptions } = useDragDrop();

  const deleteItem = () => {
  
    const infoexpre = information.Intersets?.filter(
      (ex) => ex.id !== Intersets.id
    );
 
    setInformations((prev) => ({
      ...prev,
      Intersets: infoexpre,
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
      }, 200);
    }
  };

  return (
    <li
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      key={Intersets.id}
      className="w-full hover:bg-[#0303034c] flex flex-col relative gap-2"
    >
      {hoverCreate && (
        <div className="absolute -right-2 flex items-center   bg-white text-black cursor-pointer rounded-xl">
          <Button className="bg-white text-black " onClick={deleteItem}>
            <Delete size={12} />
          </Button>
          <IntersetDialog
            id={Intersets.id}
            open={dialogOpen}
            setOpen={setDialogOpen}
          >
            <Edit size={12} />
          </IntersetDialog>
        </div>
      )}
      <span className="font-bold">{Intersets.label}</span>
      <div className="w-full pl-3">
        {
            Intersets.value && <div dangerouslySetInnerHTML={{ __html: Intersets.value }} />
        }
        
      </div>
    </li>
  );
};

export default IntersetItem;
