import React, { useEffect, useRef, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import { Plus } from "lucide-react";
import IntersetDialog from "./IntersetDialog";
import IntersetItem from "./IntersetItem";
import Sortable from "sortablejs";

const IntersetComponent = () => {
  const { information, fontOptions } = useDragDrop();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hoverCreate, setHoverCreate] = useState(false);

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



  

  const listRef = useRef<HTMLUListElement>(null);
  
    useEffect(() => {
      if (listRef.current) {
        Sortable.create(listRef.current, {
          animation: 150,
          dragClass: 'rounded-none!',
        });
      }
    }, []);


  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full relative flex flex-col gap-1 pr-3"
    >
      {hoverCreate && (
        <div className="absolute -top-5 flex items-center gap-3 bg-white text-black cursor-pointer rounded-xl">
          <IntersetDialog open={dialogOpen} setOpen={setDialogOpen}>
            <Plus size={20} />
          </IntersetDialog>
        </div>
      )}
      <h3
            style={{color:fontOptions.secondColor,fontSize:fontOptions.titleSize}} 
        className="outline-none pl-0 font-bold text-xl border-none focus:border-2 focus:border-black focus-visible:ring-0 w-60"
      >
        Interset
      </h3>
      <ul ref={listRef} id="hs-basic-usage-example-sortable"  className="w-full flex flex-col gap-1 px-3 text-xs">
        {information?.Intersets &&
          information.Intersets.map((Interset, index) => <IntersetItem key={Interset.id} Intersets={Interset} />)}
      </ul>
    </div>
  );
};

export default IntersetComponent;
