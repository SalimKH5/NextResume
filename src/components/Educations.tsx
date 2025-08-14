"use client";
import { useEffect, useRef, useState } from "react";
import { useDragDrop } from "./DraggableContext";
import EducationItem from "./EducationItem";
import { Input } from "./ui/input";
import { Delete, Plus } from "lucide-react";
import EducationForm from "./EducationForm";
import Sortable from "sortablejs";

const Educations = () => {
  const { information,fontOptions,setInformations } = useDragDrop();
  const [dialogOpen, setDialogOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hoverCreate, setHoverCreate] = useState(false);
   const [EditTitle, setEditTitle] = useState<boolean>(false);
   
   const inputRef = useRef<HTMLInputElement>(null);
  
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
  
    // 🔁 Detect outside click to disable edit mode
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setEditTitle(false);
        }
      };
  
      if (EditTitle) {
        document.addEventListener("mousedown", handleClickOutside);
      }
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [EditTitle]);



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
      style={{gap:fontOptions.SpaceInside}}
      className="w-full flex relative flex-col gap-3"
    >
       {hoverCreate && (
        <div 
        className="flex z-50 absolute -top-2 shadow-2xs bg-white items-center gap-2">
          <EducationForm open={dialogOpen} setOpen={setDialogOpen}>
            <Plus className="cursor-pointer" size={16} />
          </EducationForm>
        </div>
      )}
      {EditTitle ? (
        <Input
          ref={inputRef}
          type="text"
          className="text-blue-600 outline-none pl-0 cursor-pointer font-bold text-xl border-none focus:border-2 focus:border-black focus-visible:ring-0 w-60"
            
           value={information.titleEducations}
          onChange={(e) => {
            const value = e.target.value;
            setInformations((prev) => ({
              ...prev,
              titleEducations: value,
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
           style={{color:fontOptions.secondColor,fontSize:fontOptions.titleSize}} 
           className="w-full border-b-2 border-black pl-0 font-bold cursor-pointer  focus:border-black focus-visible:ring-0 "
        >
          {information.titleEducations}
        </h1>
      )}

      <ul ref={listRef} id="hs-basic-usage-example-sortable" className="flex flex-col gap-4">
        
        {information?.Educations &&
          information?.Educations.map((info) => (
            <EducationItem key={info.id} info={info} />
          ))}
      </ul>
    </div>
  );
};

export default Educations;
