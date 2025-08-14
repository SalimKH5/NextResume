"use client";
import React, { useRef, useState, useEffect } from "react";
import { Input } from "./ui/input";
import { useDragDrop } from "./DraggableContext";
import { Delete, Edit, Plus } from "lucide-react";

import ExpriencesItem from "./ExpriencesItem";
import ExprienceForm from "./ExprienceForm";
import Sortable from "sortablejs";

const Expriences = () => {
  const { information, setInformations,fontOptions } = useDragDrop();

  const [EditTitle, setEditTitle] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [hoverCreate, setHoverCreate] = useState(false);

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


  const listRef = useRef<HTMLUListElement>(null);
  
    useEffect(() => {
      if (listRef.current) {
        Sortable.create(listRef.current, {
          animation: 150,
          dragClass: 'rounded-none!',
        });
      }
    }, []);
  


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

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{gap:fontOptions.SpaceInside}}
      className="w-full relative flex flex-col "
    >
      {hoverCreate && (
        <div className="flex z-50 absolute -top-2 shadow-2xs bg-white items-center gap-2">
          <ExprienceForm open={dialogOpen} setOpen={setDialogOpen}>
            <Plus className="cursor-pointer" size={16} />
          </ExprienceForm>
        
        </div>
      )}

      {EditTitle ? (
        <Input
          ref={inputRef}
          type="text"
          className="text-blue-600 outline-none cursor-pointer pl-0 font-bold text-xl border-none focus:border-2 focus:border-black focus-visible:ring-0 w-60"
          
           value={information.titleExprience}
          onChange={(e) => {
            const value = e.target.value;
            setInformations((prev) => ({
              ...prev,
              titleExprience: value,
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
          className=" border-b-2 border-black cursor-pointer pl-0 font-bold   focus:border-black focus-visible:ring-0 w-full"
        >
          {information.titleExprience}
        </h1>
      )}

      <ul ref={listRef} id="hs-basic-usage-example-sortable"  className="flex flex-col gap-4">
        {information?.Expriences &&
          information?.Expriences.map((info) => (
            <ExpriencesItem key={info.id} info={info} />
          ))}
      </ul>
    </div>
  );
};

export default Expriences;
