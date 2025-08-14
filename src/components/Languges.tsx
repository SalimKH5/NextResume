import React, { useEffect, useRef, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import LangugeDialog from "./LangugeDialog";
import { Edit, Plus } from "lucide-react";
import LangugeItem from "./LangugeItem";
import Sortable from 'sortablejs';
import { Input } from "./ui/input";
const Languages = () => {
  const { information,setInformations,fontOptions } = useDragDrop();
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
    const [EditTitle, setEditTitle] = useState<boolean>(false);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (listRef.current) {
      Sortable.create(listRef.current, {
        animation: 150,
        dragClass: 'rounded-none!',
      });
    }
  }, []);
  const inputRef = useRef<HTMLInputElement>(null);





  return (
    <div 
       onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{gap:fontOptions.SpaceInside}} 

    className="w-full relative flex flex-col gap-1 pr-3">
         {hoverCreate && (
        <div  className="absolute -top-5 flex items-center gap-3 bg-white text-black cursor-pointer rounded-xl">
          <LangugeDialog   open={dialogOpen} setOpen={setDialogOpen}>
            <Plus size={20} />
          </LangugeDialog>
        </div>
      )}
    {EditTitle ? (
        <Input
          ref={inputRef}
          type="text"
          style={{ color: fontOptions.secondColor }}
          className="outline-none pl-0 cursor-pointer font-bold text-xl border-none focus:border-2 focus:border-black focus-visible:ring-0 w-60"
          value={information.titleLanguages}
          onChange={(e) => {
            const value = e.target.value;
            setInformations((prev) => ({
              ...prev,
              titleLanguages: value,
            }));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditTitle(false);
            }
          }}
        />
      ) : (
        <h1
          onClick={() => {
            setEditTitle(true);
          }}
          style={{
            color: fontOptions.secondColor,
            fontSize: fontOptions.titleSize,
          }}
          className="outline-none pl-0 font-bold text-xl border-none focus:border-2 focus:border-black focus-visible:ring-0 w-60 cursor-pointer"
        >
          {information.titleLanguages}
        </h1>
      )}

     
      <ul ref={listRef} id="hs-basic-usage-example-sortable" className={`w-full flex flex-col gap-${fontOptions.SpaceInside} px-3 text-xs`}>
        {information?.Languages &&
          information.Languages.map((language, index) => (
            <LangugeItem language={language} key={language.id}/>
          ))}
      </ul>
    </div>
  );
};

export default Languages;
